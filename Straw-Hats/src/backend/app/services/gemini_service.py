"""
Animend Backend — Gemini AI Diagnosis Service

Core AI engine that takes an image + symptoms text and returns a
structured JSON diagnosis. The prompt is carefully engineered to
always return valid JSON — no hallucinated free text.
"""

import asyncio
import logging
from google import genai
from google.genai import types
import json
import re

from app.config import GEMINI_API_KEY

# ── Configure Gemini at module level ────────────────────────────

logging.info(f"[GEMINI] Key loaded: {GEMINI_API_KEY[:8] if GEMINI_API_KEY else 'MISSING'}")
client = genai.Client(api_key=GEMINI_API_KEY)


# ── Custom exception ────────────────────────────────────────────

class AIServiceError(Exception):
    """Raised when the Gemini API call fails or returns unparseable output."""
    pass


# ── Prompts ─────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are Animend, a veterinary clinical decision support 
AI specialising in livestock diseases in developing countries. You analyse 
images and symptom descriptions to provide PRELIMINARY diagnostic guidance 
for farmers.

CRITICAL SAFETY RULES:
1. Answer ONLY based on what is visible in the provided image and the 
   farmer's symptom description. Do not invent symptoms not present.
2. If the image is unclear, blurry, or does not show the animal clearly, 
   lower your confidence score to reflect this uncertainty — do not guess.
3. Never state a diagnosis with false certainty. If multiple diseases 
   match the symptoms, name the most likely one and reflect uncertainty 
   in the confidence score (below 60).
4. The zoonotic_risk field must be true only for diseases with documented 
   human transmission risk (e.g. Brucellosis, Anthrax, Rabies, Ringworm, 
   Salmonellosis). Do not flag non-zoonotic diseases as zoonotic.
5. Always respond with ONLY valid JSON — no text before or after.
6. Confidence must be a 0–100 integer. Severity must be exactly: 
   low, medium, high, or critical.
7. Keep all text fields under 150 words each.
8. Immediate action must be something a farmer with no equipment can 
   do right now — isolation, water, shade, basic first aid only. 
   Never recommend prescription drugs by name."""

USER_TEMPLATE = """Animal type: {animal_type}
Farmer describes: {symptoms}

{vision_context}

You have been provided with two signals:
1. A raw image of the animal (visual input above)
2. Pre-classification results from a dedicated vision model (shown above)

Synthesise BOTH signals with the farmer's symptom description.
If the vision model's top prediction aligns with visible symptoms, 
weight it heavily. If it contradicts the symptoms, trust the symptoms 
and image over the classifier label.

Respond ONLY with this exact JSON structure:
{{
  "disease": "full disease name",
  "confidence": 85,
  "severity": "high",
  "description": "brief plain-language explanation",
  "immediate_action": "what to do right now",
  "treatment": "treatment steps",
  "prevention": "prevention advice",
  "vet_required": true,
  "zoonotic_risk": false,
  "vision_model_agreement": true
}}

vision_model_agreement must be true if your diagnosis matches the 
vision classifier's top prediction, false if you overrode it."""


# ── Public API ──────────────────────────────────────────────────

def _validate_result(result: dict) -> dict:
    """
    Post-process Gemini output to catch hallucination patterns.
    Enforces safety constraints the hackathon guide recommends.
    """
    # Rule 1: If confidence < 30, override severity to low to prevent
    # alarming farmers with uncertain high-severity flags
    if result.get("confidence", 50) < 30:
        if result.get("severity") in ("high", "critical"):
            result["severity"] = "medium"

    # Rule 2: Known non-zoonotic diseases should never have zoonotic_risk=True
    # This catches the most common hallucination pattern in clinical AI
    NON_ZOONOTIC = {
        "foot and mouth disease", "fmd", "newcastle disease",
        "bovine respiratory disease", "mastitis", "bloat",
        "milk fever", "grass tetany", "parvovirus"
    }
    disease_lower = result.get("disease", "").lower()
    if any(nz in disease_lower for nz in NON_ZOONOTIC):
        result["zoonotic_risk"] = False

    # Rule 3: Ensure immediate_action never references prescription drugs
    # by checking for common dangerous patterns
    DRUG_PATTERNS = ["mg/kg", "iv injection", "intramuscular", "penicillin",
                     "oxytetracycline", "dexamethasone", "ivermectin dose"]
    action = result.get("immediate_action", "").lower()
    if any(pat in action for pat in DRUG_PATTERNS):
        result["immediate_action"] = (
            "Isolate the animal from the rest of the herd immediately. "
            "Provide fresh water and shade. Contact a veterinarian for "
            "proper treatment and dosing guidance."
        )

    return result


async def get_diagnosis(image_bytes: bytes, animal_type: str,
                        symptoms: str,
                        vision_context: str = "") -> dict:
    """
    Send image + symptoms to Gemini and return a structured diagnosis dict.

    Raises AIServiceError if the API call fails or the response isn't valid JSON.
    """
    prompt = USER_TEMPLATE.format(
        animal_type=animal_type,
        symptoms=symptoms,
        vision_context=vision_context or
        "Vision classifier: not available for this request.",
    )

    models_to_try = [
        "gemini-flash-latest", 
        "gemini-2.0-flash", 
        "gemini-3-flash-preview",
        "gemini-flash-lite-latest"
    ]
    last_error = None

    for model_name in models_to_try:
        for attempt in range(2):
            try:
                logging.info(f"[Gemini] Trying model={model_name} (Attempt {attempt+1})")
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: client.models.generate_content(
                        model=model_name,
                        config=types.GenerateContentConfig(
                            system_instruction=SYSTEM_PROMPT,
                            temperature=0.2, 
                            max_output_tokens=1000
                        ),
                        contents=[
                            types.Content(role="user", parts=[
                                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                                types.Part.from_text(text=prompt),
                            ])
                        ]
                    )
                )

                raw = response.text.strip()
                if not raw: continue
                
                # Strip markdown
                raw = re.sub(r"```json|```", "", raw).strip()
                result = json.loads(raw)

                # Standardize
                result["confidence"] = max(0, min(100, int(result.get("confidence", 50))))
                result["severity"] = str(result.get("severity", "medium")).lower()
                if result["severity"] not in ("low", "medium", "high", "critical"):
                    result["severity"] = "medium"
                result["vet_required"] = bool(result.get("vet_required", False))
                result["zoonotic_risk"] = bool(result.get("zoonotic_risk", False))

                return _validate_result(result)

            except Exception as e:
                last_error = e
                error_msg = str(e)
                logging.warning(f"[Gemini] {model_name} failed: {error_msg}")
                
                is_retryable = "429" in error_msg or "500" in error_msg or "503" in error_msg or "ResourceExhausted" in type(e).__name__
                if is_retryable:
                    if attempt < 1:
                        await asyncio.sleep(2)
                        continue
                    else:
                        break # Try next model
                break # Fatal error, stop entirely

    # Final failure
    if "429" in str(last_error) or "ResourceExhausted" in type(last_error).__name__:
        raise AIServiceError("The AI Diagnostic Service is under extreme heavy load. Please try again in 30 seconds.")
    raise AIServiceError(f"Gemini API call failed: {last_error}")

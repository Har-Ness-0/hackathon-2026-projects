"""
Animend Backend — Hugging Face Vision Classifier

Uses openai/clip-vit-base-patch16 via the HF Inference API for
zero-shot livestock disease classification.

The model receives the animal image and a curated list of livestock
disease labels. It returns probability scores for each label without
any fine-tuning — this is CLIP zero-shot classification.

Output feeds directly into gemini_service.py as structured context,
making Animend a genuine dual-model pipeline.
"""

import httpx
from app.config import HF_API_KEY

# ── HF Inference API endpoint ───────────────────────────────────

HF_API_URL = (
    "https://api-inference.huggingface.co/models/"
    "openai/clip-vit-base-patch16"
)

# ── Livestock disease candidate labels ──────────────────────────
# These are the zero-shot class labels CLIP scores the image against.
# Curated for South Asian livestock context (Nepal, India, Bangladesh).
# CLIP works best with natural language descriptions, not medical codes.

DISEASE_LABELS = [
    "healthy livestock animal",
    "foot and mouth disease in cattle with mouth sores and drooling",
    "lumpy skin disease in cattle with skin nodules and lesions",
    "bovine respiratory disease with nasal discharge and laboured breathing",
    "mastitis in cow with swollen inflamed udder",
    "newcastle disease in poultry with twisted neck and neurological signs",
    "avian influenza in poultry with swollen head and respiratory distress",
    "blackleg disease in cattle with swollen hind leg and lameness",
    "brucellosis in cattle with abortion or swollen joints",
    "ringworm fungal infection in animal with circular bald patches",
    "mange skin disease with severe itching and hair loss",
    "bloat in cattle with distended left flank",
    "pink eye conjunctivitis in cattle with cloudy eye discharge",
    "rabies in animal with aggressive behaviour and excessive salivation",
    "anthrax in livestock with sudden death or bloody discharge",
]

# ── Public API ──────────────────────────────────────────────────

async def classify_image(image_bytes: bytes) -> list[dict]:
    """
    Run zero-shot CLIP classification on an animal image.

    Returns a list of dicts sorted by score descending:
        [{"label": "...", "score": 0.87}, ...]

    Returns an empty list if HF_API_KEY is missing or the API call
    fails — the caller handles graceful degradation.
    """
    if not HF_API_KEY or not HF_API_KEY.startswith("hf_"):
        return []

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/octet-stream",
    }
    params = {"candidate_labels": ",".join(DISEASE_LABELS)}

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                HF_API_URL,
                content=image_bytes,
                headers=headers,
                params=params,
            )

        if response.status_code == 200:
            results = response.json()
            # HF returns list of {"label": ..., "score": ...}
            # already sorted by score desc
            return results[:3]  # Return top 3 only

        elif response.status_code == 503:
            # Model is loading — this is normal on cold start
            # Return empty list so pipeline continues without HF
            print("[HF Vision] Model loading (503) — skipping this request")
            return []

        else:
            print(f"[HF Vision] API error {response.status_code}: {response.text[:200]}")
            return []

    except Exception as e:
        print(f"[HF Vision] Request failed: {e}")
        return []


def format_predictions_for_gemini(predictions: list[dict]) -> str:
    """
    Format the top-3 HF predictions into a concise string that
    Gemini can read as structured context in its prompt.

    Example output:
        Vision classifier detected:
        1. lumpy skin disease in cattle (87% confidence)
        2. mange skin disease (8% confidence)
        3. healthy livestock animal (3% confidence)
    """
    if not predictions:
        return "Vision classifier: no predictions available (fallback mode)."

    lines = ["Vision model pre-classification results:"]
    for i, pred in enumerate(predictions, 1):
        label = pred.get("label", "unknown")
        score = pred.get("score", 0)
        pct = round(score * 100, 1)
        lines.append(f"  {i}. {label} ({pct}% confidence)")

    lines.append(
        "\nUse these as strong prior signals. Override them only if the "
        "farmer's symptom description clearly contradicts the visual signal."
    )

    return "\n".join(lines)

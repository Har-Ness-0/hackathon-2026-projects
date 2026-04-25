"""
Animend Backend — Diagnosis Routes

POST /api/diagnose   — Full AI diagnosis pipeline
GET  /api/diagnoses  — All records for map rendering
GET  /api/diagnoses/{id} — Single diagnosis detail

Supabase calls are wrapped in try/except so the AI diagnosis
still works even when the database is not provisioned yet.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import uuid
from datetime import datetime

from app.services.gemini_service import get_diagnosis, AIServiceError
from app.services.image_service import process_image
from app.services.vision_classifier import (
    classify_image,
    format_predictions_for_gemini,
)
from app.models.diagnosis import DiagnosisResponse
from app.config import SUPABASE_URL, SUPABASE_SERVICE_KEY
from supabase import create_client

router = APIRouter()

# ── Supabase client ─────────────────────────────────────────────
db = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ── POST /api/diagnose ──────────────────────────────────────────


@router.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose(
    image: Optional[UploadFile] = File(default=None),
    file: Optional[UploadFile] = File(default=None),
    animal_type: str = Form(...),
    symptoms: str = Form(...),
    language: str = Form(default="en"),
    lat: Optional[float] = Form(default=None),
    lng: Optional[float] = Form(default=None),
):
    """
    Full diagnosis pipeline:
    1. Read and process image (resize + compress)
    2. Upload to Supabase Storage
    3. Call Gemini AI for structured diagnosis
    4. Store record in Supabase DB
    5. Return DiagnosisResponse to frontend
    """

    # Accept both "image" and legacy "file" form keys.
    upload = image or file
    if upload is None:
        raise HTTPException(status_code=422, detail="Field required: image")

    # 1. Read and process image
    raw_bytes = await upload.read()

    # Check size limit (e.g., 10MB) to prevent memory exhaustion
    if len(raw_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413, detail="Image file too large. Max size is 10MB.")

    try:
        processed_bytes = process_image(raw_bytes)
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Uploaded file is not a valid image.")

    # 2. Upload processed image to Supabase Storage
    photo_path = f"diagnoses/{uuid.uuid4()}.jpg"
    photo_url = None
    try:
        db.storage.from_("animal-photos").upload(
            photo_path,
            processed_bytes,
            file_options={"content-type": "image/jpeg"},
        )
        photo_url = db.storage.from_(
            "animal-photos").get_public_url(photo_path)
    except Exception as e:
        print(f"Supabase storage upload failed: {e}")
        print("Continuing diagnosis without storage upload.")

    # 2.5. Run HF Vision Classifier (parallel AI signal for Gemini)
    # This is non-blocking — if HF fails, the pipeline continues.
    try:
        hf_predictions = await classify_image(processed_bytes)
        vision_context = format_predictions_for_gemini(hf_predictions)
        print(f"[HF Vision] Top prediction: "
              f"{hf_predictions[0]['label'] if hf_predictions else 'none'}")
    except Exception as e:
        print(f"[HF Vision] Classifier failed gracefully: {e}")
        hf_predictions = []
        vision_context = "Vision classifier: unavailable."

    # 3. Call Gemini API for AI diagnosis
    try:
        ai_result = await get_diagnosis(
            processed_bytes, animal_type, symptoms, vision_context
        )
    except AIServiceError as e:
        print(f"Gemini unavailable, using safe fallback diagnosis: {e}")
        ai_result = {
            "disease": "Undetermined Condition (AI unavailable)",
            "confidence": 35,
            "severity": "medium",
            "description": (
                "The AI service is currently unavailable. This is a temporary "
                "fallback result and should not be used as a final diagnosis."
            ),
            "immediate_action": (
                "Isolate the animal, provide clean water and shade, and contact "
                "a veterinarian as soon as possible."
            ),
            "treatment": "Supportive care only until a veterinarian evaluates the animal.",
            "prevention": "Maintain hygiene, isolate symptomatic animals, and monitor the herd.",
            "vet_required": True,
            "zoonotic_risk": False,
            "vision_model_agreement": None,
        }

    # 4. Build the full record
    record = {
        "id": str(uuid.uuid4()),
        "animal_type": animal_type,
        "symptoms_text": symptoms,
        "language": language,
        "image_url": photo_url,
        "disease": ai_result["disease"],
        "confidence": ai_result["confidence"],
        "severity": ai_result["severity"],
        "description": ai_result.get("description", ""),
        "immediate_action": ai_result.get("immediate_action", ""),
        "treatment": ai_result.get("treatment", ""),
        "prevention": ai_result.get("prevention", ""),
        "vet_required": ai_result.get("vet_required", False),
        "zoonotic_risk": ai_result.get("zoonotic_risk", False),
        "vision_model_agreement": ai_result.get(
            "vision_model_agreement", True
        ),
        "lat": lat,
        "lng": lng,
        "created_at": datetime.utcnow().isoformat(),
    }

    # 5. Insert into Supabase
    try:
        db.table("diagnoses").insert(record).execute()
    except Exception as e:
        print(f"Supabase insert failed: {e}")
        print("Continuing diagnosis response without DB persistence.")

    # 6. Return response
    return DiagnosisResponse(**record)


# ── GET /api/diagnoses ──────────────────────────────────────────

@router.get("/diagnoses")
async def get_all_diagnoses():
    """Return all diagnosis records for map rendering, newest first."""
    try:
        result = (
            db.table("diagnoses")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        print(f"Supabase query failed: {e}")
        raise HTTPException(status_code=500, detail="Database query failed")


# ── GET /api/diagnoses/{diagnosis_id} ───────────────────────────

@router.get("/diagnoses/{diagnosis_id}")
async def get_diagnosis_by_id(diagnosis_id: str):
    """Return a single diagnosis record by its UUID."""
    try:
        try:
            uuid.UUID(diagnosis_id)
        except ValueError:
            return {"not_found": True}

        result = (
            db.table("diagnoses")
            .select("*")
            .eq("id", diagnosis_id)
            .limit(1)
            .execute()
        )
        if not result.data:
            return {"not_found": True}
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase query failed: {e}")
        raise HTTPException(status_code=500, detail="Database query failed")

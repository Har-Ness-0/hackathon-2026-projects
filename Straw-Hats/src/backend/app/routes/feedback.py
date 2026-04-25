"""
Animend Backend — Feedback Routes

POST /api/feedback — Farmer confirms or corrects a past diagnosis

Returns {success: true} even if DB is not ready, so the frontend
never crashes on this call.
"""

from fastapi import APIRouter, HTTPException
from app.config import SUPABASE_URL, SUPABASE_SERVICE_KEY
from supabase import create_client
from app.models.diagnosis import FeedbackRequest

router = APIRouter()

# ── Supabase client ─────────────────────────────────────────────
db = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


@router.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    """
    Update a diagnosis record with farmer feedback.
    """
    try:
        # Verify the diagnosis exists
        check = (
            db.table("diagnoses")
            .select("id")
            .eq("id", feedback.diagnosis_id)
            .execute()
        )

        if not check.data:
            return {
                "success": True,
                "saved": False,
                "message": "Diagnosis not found; feedback ignored."
            }

        # Update feedback fields on the record
        db.table("diagnoses").update({
            "feedback_correct": feedback.is_correct,
            "feedback_correction": feedback.correction,
        }).eq("id", feedback.diagnosis_id).execute()

    except Exception as e:
        print(f"Feedback DB write failed: {e}")
        return {
            "success": True,
            "saved": False,
            "message": "Database unavailable; feedback accepted but not persisted."
        }

    return {"success": True, "saved": True}

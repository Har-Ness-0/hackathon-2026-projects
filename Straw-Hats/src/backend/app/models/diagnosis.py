"""
Animend Backend — Pydantic Request / Response Models

These shapes match the API contract the React frontend relies on.
Pydantic validates all incoming and outgoing data automatically.
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


class DiagnosisResponse(BaseModel):
    """Full diagnosis record returned from POST /api/diagnose and GET /api/diagnoses/{id}."""
    id: str
    animal_type: str
    disease: str
    confidence: int = Field(ge=0, le=100)
    severity: Literal["low", "medium", "high", "critical"]
    description: str
    immediate_action: str
    treatment: str
    prevention: str
    vet_required: bool
    zoonotic_risk: bool
    image_url: Optional[str] = None
    vision_model_agreement: Optional[bool] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    created_at: datetime


class OutbreakAlert(BaseModel):
    """Aggregated outbreak cluster returned from GET /api/outbreaks."""
    disease: str
    count: int
    region: str
    severity: str
    lat: float
    lng: float


class FeedbackRequest(BaseModel):
    """Farmer confirms or corrects a past diagnosis via POST /api/feedback."""
    diagnosis_id: str
    is_correct: bool
    correction: Optional[str] = None

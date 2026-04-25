"""
Animend Backend — Diagnosis Endpoint Tests

Tests the health check and the core /api/diagnose endpoint structure.
Requires valid .env credentials to run the AI integration test.
"""

import io
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def _create_test_jpeg() -> bytes:
    """Generate a minimal valid JPEG in memory for testing."""
    img = Image.new("RGB", (100, 100), color=(200, 150, 100))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf.read()


# ── Health Check ────────────────────────────────────────────────

def test_health():
    """Health endpoint should always return 200 with status ok."""
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["version"] == "1.0.0"


# ── Diagnose Endpoint — Structure ──────────────────────────────

def test_diagnose_returns_valid_structure():
    """
    POST /api/diagnose with a test image should return a valid
    diagnosis JSON with all required fields.

    NOTE: This test hits the live Gemini API — requires GEMINI_API_KEY
    and SUPABASE_* credentials in .env to pass.
    """
    test_image = _create_test_jpeg()

    r = client.post(
        "/api/diagnose",
        data={
            "animal_type": "cattle",
            "symptoms": "limping, mouth sores",
        },
        files={
            "image": ("test.jpg", io.BytesIO(test_image), "image/jpeg"),
        },
    )

    assert r.status_code == 200
    body = r.json()

    # Required fields present
    assert "disease" in body
    assert "confidence" in body
    assert "severity" in body
    assert "immediate_action" in body
    assert "treatment" in body
    assert "id" in body

    # Confidence is a valid integer 0-100
    assert isinstance(body["confidence"], int)
    assert 0 <= body["confidence"] <= 100

    # Severity is one of the allowed values
    assert body["severity"] in ("low", "medium", "high", "critical")

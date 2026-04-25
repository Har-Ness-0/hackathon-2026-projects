"""
Animend Backend — Gemini Service Unit Tests

Tests the image service and Gemini prompt formatting in isolation.
"""

import io
from PIL import Image
from app.services.image_service import process_image


# ── Image Service Tests ─────────────────────────────────────────

def test_process_image_returns_jpeg_bytes():
    """process_image should return valid JPEG bytes smaller than input."""
    # Create a large test image
    img = Image.new("RGB", (2048, 2048), color=(100, 200, 150))
    buf = io.BytesIO()
    img.save(buf, format="PNG")  # Save as PNG (larger)
    raw_bytes = buf.getvalue()

    result = process_image(raw_bytes)

    # Result should be bytes
    assert isinstance(result, bytes)
    assert len(result) > 0

    # Result should be smaller than the input PNG
    assert len(result) < len(raw_bytes)

    # Result should be a valid JPEG
    result_img = Image.open(io.BytesIO(result))
    assert result_img.format == "JPEG"

    # Should be resized to max 1024x1024
    assert result_img.width <= 1024
    assert result_img.height <= 1024


def test_process_image_handles_rgba():
    """process_image should convert RGBA to RGB without crashing."""
    img = Image.new("RGBA", (500, 500), color=(100, 200, 150, 128))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    raw_bytes = buf.getvalue()

    result = process_image(raw_bytes)

    result_img = Image.open(io.BytesIO(result))
    assert result_img.mode == "RGB"
    assert result_img.format == "JPEG"


def test_process_image_preserves_small_images():
    """Images already under 1024px should not be upscaled."""
    img = Image.new("RGB", (200, 200), color=(50, 50, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    raw_bytes = buf.getvalue()

    result = process_image(raw_bytes)

    result_img = Image.open(io.BytesIO(result))
    assert result_img.width == 200
    assert result_img.height == 200

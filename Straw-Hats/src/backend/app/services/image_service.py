"""
Animend Backend — Image Processing Service

Resizes and compresses uploaded animal photos before they are sent
to the Gemini API. This reduces latency, API cost, and storage usage.
"""

from PIL import Image, UnidentifiedImageError
import io

MAX_SIZE = (1024, 1024)   # Gemini works best at this resolution
QUALITY = 85              # JPEG quality — good balance of size vs clarity


def process_image(file_bytes: bytes) -> bytes:
    """
    Resize and compress an image before sending to Gemini.

    - Converts RGBA/P mode to RGB (JPEG doesn't support transparency)
    - Thumbnails to 1024×1024 maintaining aspect ratio
    - Re-encodes as optimized JPEG

    Returns JPEG bytes ready for Gemini or Supabase Storage.
    Raises ValueError if the bytes are not a valid image.
    """
    try:
        img = Image.open(io.BytesIO(file_bytes))
    except UnidentifiedImageError:
        raise ValueError("Invalid image file format")

    # Convert modes that JPEG can't handle
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")

    # Resize maintaining aspect ratio (never upscales)
    img.thumbnail(MAX_SIZE, Image.LANCZOS)

    output = io.BytesIO()
    img.save(output, format="JPEG", quality=QUALITY, optimize=True)
    return output.getvalue()

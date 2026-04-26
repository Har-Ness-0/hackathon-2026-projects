import asyncio
import io
from PIL import Image
from app.services.gemini_service import get_diagnosis

async def test():
    # Generate a real valid JPEG image
    img = Image.new('RGB', (512, 512), color = (73, 109, 137))
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    image_bytes = buf.getvalue()

    try:
        print("Testing Gemini API with real image...")
        res = await get_diagnosis(image_bytes, "cow", "The cow has a high fever and blisters on its tongue.")
        print("SUCCESS!")
        print(res)
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(test())

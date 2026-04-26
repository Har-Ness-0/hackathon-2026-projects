import requests
import json

url = "http://localhost:8000/api/diagnose"
data = {
    "animal_type": "cow",
    "symptoms": "My cow is not eating and has blisters.",
    "language": "en"
}
# We need to send a valid image, otherwise it will fail at process_image.
# Let's create a dummy valid jpeg.
from PIL import Image
import io

img = Image.new('RGB', (100, 100), color = 'red')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
img_byte_arr.seek(0)

files = {
    "image": ("dummy.jpg", img_byte_arr, "image/jpeg")
}

response = requests.post(url, data=data, files=files)
print("Status:", response.status_code)
print("Response:", response.text)

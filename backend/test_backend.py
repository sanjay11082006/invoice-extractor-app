import requests
from PIL import Image
import io

def test_backend():
    # Create a dummy image
    img = Image.new('RGB', (100, 100), color = 'white')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    url = 'http://localhost:8000/extract'
    files = {'file': ('test.png', img_byte_arr, 'image/png')}

    try:
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response Text: {response.text}")
        try:
            print("JSON:", response.json())
        except:
            print("Failed to parse JSON")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_backend()

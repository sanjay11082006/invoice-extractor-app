import requests
import time

BASE_URL = "http://localhost:8000"

def test_cors():
    print("Testing CORS...")
    headers = {"Origin": "http://example.com"}
    try:
        response = requests.options(f"{BASE_URL}/extract", headers=headers)
        if "Access-Control-Allow-Origin" not in response.headers:
            print("CORS Test 1 (Block unknown origin): PASSED")
        else:
            print(f"CORS Test 1 FAILED: {response.headers.get('Access-Control-Allow-Origin')}")
            
        headers = {"Origin": "http://localhost:3000"}
        response = requests.options(f"{BASE_URL}/extract", headers=headers)
        if response.headers.get("Access-Control-Allow-Origin") == "http://localhost:3000":
             print("CORS Test 2 (Allow known origin): PASSED")
        else:
             print(f"CORS Test 2 FAILED: {response.headers.get('Access-Control-Allow-Origin')}")
    except Exception as e:
        print(f"CORS Test Error: {e}")

def test_rate_limit():
    print("\nTesting Rate Limit...")
    # This requires sending a valid request, which needs a file.
    # We can use a dummy file.
    files = {'file': ('test.txt', 'dummy content', 'text/plain')}
    
    # Run 12 times
    for i in range(12):
        try:
            response = requests.post(f"{BASE_URL}/extract", files=files)
            print(f"Request {i+1}: Status {response.status_code}")
            if response.status_code == 429:
                print("Rate Limit Test: PASSED")
                return
        except Exception as e:
            print(f"Request {i+1} Error: {e}")
        time.sleep(0.1)
    print("Rate Limit Test: FAILED (No 429 received)")

def test_file_validation():
    print("\nTesting File Validation...")
    # 1. Invalid Type
    files = {'file': ('test.txt', 'dummy content', 'text/plain')}
    response = requests.post(f"{BASE_URL}/extract", files=files)
    if response.status_code == 415:
        print("File Type Validation (Invalid): PASSED")
    else:
        print(f"File Type Validation (Invalid) FAILED: {response.status_code}")

    # 2. Large File (Mocking large file with just checking response if possible, 
    # specific large file needed. We can create a dummy 6MB file)
    with open("large_test_file.png", "wb") as f:
        f.seek(6 * 1024 * 1024)
        f.write(b"\0")
    
    files = {'file': ('large_test_file.png', open("large_test_file.png", "rb"), 'image/png')}
    response = requests.post(f"{BASE_URL}/extract", files=files)
    if response.status_code == 413:
        print("File Size Validation (Too Large): PASSED")
    else:
        print(f"File Size Validation (Too Large) FAILED: {response.status_code}")

if __name__ == "__main__":
    try:
        test_cors()
        test_file_validation()
        test_rate_limit()
    except Exception as e:
        print(f"Test Suite Error: {e}")

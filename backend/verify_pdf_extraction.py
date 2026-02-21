
import sys
import os
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

# Add the directory containing main.py to the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# We need to set the API key in environment to avoid warnings/exit if main checks it
os.environ["GOOGLE_API_KEY"] = "DUMMY_KEY"

# Attempts to import main. If it fails due to missing dependencies, we fail.
try:
    import main
    from main import app
except ImportError as e:
    print(f"Failed to import main: {e}")
    sys.exit(1)

def test_pdf_extraction_flow():
    # Patch the dependencies used inside the route handler
    # main.client is used for generation
    # main.types is used for Part.from_bytes
    
    with patch("main.client") as mock_client, \
         patch("main.types") as mock_types, \
         patch("PIL.Image.open") as mock_image_open:

        # Setup mock response for client.models.generate_content
        mock_generate = MagicMock()
        mock_generate.text = '{"merchant_name": "Test PDF", "total_amount": 100}'
        mock_client.models.generate_content.return_value = mock_generate

        # Setup mock for types.Part.from_bytes
        # We want to ensure it is called.
        mock_part = MagicMock()
        mock_types.Part.from_bytes.return_value = mock_part

        # Check if httpx is installed for TestClient
        try:
            test_client = TestClient(app)
        except Exception as e:
            print(f"Error creating TestClient: {e}")
            sys.exit(1)

        # Mock PDF Content
        pdf_content = b"%PDF-1.4 header..."
        
        # Call the endpoint
        print("Sending request...")
        response = test_client.post(
            "/extract",
            files={"file": ("test.pdf", pdf_content, "application/pdf")}
        )
        
        print(f"Response status: {response.status_code}")
        if response.status_code != 200:
            print(f"Response body: {response.text}")
        
        # Assertions
        
        # 1. Verify PIL.Image.open was NOT called
        if mock_image_open.called:
            print("FAILURE: PIL.Image.open was called for a PDF file!")
        else:
            print("SUCCESS: PIL.Image.open was NOT called.")

        # 2. Verify types.Part.from_bytes WAS called
        if mock_types.Part.from_bytes.called:
            print("SUCCESS: types.Part.from_bytes was called.")
            # Verify args
            # check call_args
            args, kwargs = mock_types.Part.from_bytes.call_args
            # kwargs might not be used if positional args are used, but code says data=..., mime_type=...
            # In main.py: types.Part.from_bytes(data=contents, mime_type="application/pdf")
            passed_mime = kwargs.get('mime_type')
            if passed_mime == 'application/pdf':
                print("SUCCESS: mime_type='application/pdf' was passed.")
            else:
                 print(f"FAILURE: incorrect mime_type passed: {passed_mime}. Kwargs: {kwargs}")
        else:
            print("FAILURE: types.Part.from_bytes was NOT called.")

        # 3. Verify client.models.generate_content WAS called
        if mock_client.models.generate_content.called:
            print("SUCCESS: client.models.generate_content was called.")
        else:
            print("FAILURE: client.models.generate_content was NOT called.")

if __name__ == "__main__":
    try:
        test_pdf_extraction_flow()
        print("\nVerification Test Completed.")
    except Exception as e:
        print(f"\nTest failed with exception: {e}")
        import traceback
        traceback.print_exc()

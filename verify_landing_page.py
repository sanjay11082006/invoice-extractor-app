import urllib.request
import sys

url = "http://localhost:3000"
try:
    with urllib.request.urlopen(url) as response:
        content = response.read().decode('utf-8')
        print(f"Status Code: {response.getcode()}")
        
        checks = [
            ("InvoiceAI", "Title"),
            ("Try It Now", "CTA Button"),
            ("Native PDF Support", "Feature 1"),
            ("Powered by Gemini", "Feature 2"),
            ("Instant Structured Data", "Feature 3")
        ]
        
        all_passed = True
        for check_str, description in checks:
            if check_str in content:
                print(f"[PASS] {description} found")
            else:
                print(f"[FAIL] {description} NOT found")
                all_passed = False
                
        if all_passed:
            print("\nVerification Successful: All elements present.")
            sys.exit(0)
        else:
            print("\nVerification Failed: Missing elements.")
            sys.exit(1)
            
except Exception as e:
    print(f"Error accessing {url}: {e}")
    sys.exit(1)

import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")

print(f"Testing Resend with Key: {resend.api_key[:10]}...")
print(f"From Email: {from_email}")

try:
    params = {
        "from": from_email,
        "to": "mungai.dev@gmail.com", # Testing with a known email or just placeholder
        "subject": "Test Email",
        "html": "<strong>It works!</strong>",
    }
    r = resend.Emails.send(params)
    print("Success! ID:", r.get("id"))
except Exception as e:
    print("Error:", str(e))

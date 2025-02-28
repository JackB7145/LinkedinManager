from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from linkedin_api import Linkedin
from dotenv import load_dotenv
import os
from urllib.parse import urlparse

# Load .env file
load_dotenv()

def parseURL(url):
    # Parse the URL
    parsed_url = urlparse(url)
    # Extract the path and get the last part of the path
    user = parsed_url.path.split('/')[-2]
    return user

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/linkedInUser")
async def read_request_body(request: Request):
    try:
        # Access environment variables
        username = os.getenv('USERNAME')
        password = os.getenv('PASSWORD')

        # Authenticate using any Linkedin user account credentials
        api = Linkedin(username, password)
        
        body = await request.json()
        print(f"Received JSON body: {body}")

        url = body.get("url")
        if not url:
            return {"error": "No 'topic' field in the request body"}

        user = parseURL(url)
        profile = api.get_profile(user)
        
        # Debugging: Print the profile keys
        print(f"Profile keys: {profile.keys()}")

        summary = profile.get('summary', 'Summary not available')
        name = profile.get('firstName', 'First name not available') + " " + profile.get('lastName', 'Last name not available')
        experience = profile.get('experience', 'Experience not available')
        education = profile.get('education', 'Education not available')

        content = {
            "summary": summary,
            "name": name,
            "experience": experience,
            "education": education
        }

        return content

    except Exception as e:
        return {"error": f"Failed to decode JSON: {str(e)}"}

from fastapi import FastAPI, Request  # Import FastAPI framework and Request object
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware for handling cross-origin requests
from linkedin_api import Linkedin  # Import Linkedin API wrapper
from dotenv import load_dotenv  # Import dotenv to load environment variables
import os  # Import OS module to access environment variables
from urllib.parse import urlparse  # Import urlparse to parse URLs
import asyncio
import requests

# Load .env file to access stored environment variables
load_dotenv()

# Create FastAPI app instance
app = FastAPI()

# Configure CORS to allow frontend applications to access the API
origins = [
    "http://localhost:3000",  # Allow frontend running on port 3000
    "http://127.0.0.1:5173",  # Allow frontend running on port 5173
    "*",  # Allow requests from any origin (for development purposes)
]

# Add CORS middleware to allow communication with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Set allowed origins
    allow_credentials=True,  # Allow sending credentials (cookies, authorization headers)
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

async def pollSnapshot(url, headers):

    querystring = {"compress":"true"}

    while True:
        response = requests.get(url, headers=headers, params=querystring)
        
        if response.status_code == 200:
            print(response.json())
            break
                
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            await asyncio.sleep(15)
    
    return response.json()


getSnapshotUrl = os.getenv("SNAPSHOT_URL")
dataURL = os.getenv("DATA_URL")
API_KEY = os.getenv('API_KEY')

# Define an API route for retrieving LinkedIn user details
@app.post("/")
async def read_request_body(request: Request):
    try:
        
        # Extract JSON body from the incoming request
        body = await request.json()
        print(f"Received JSON body: {body}")  # Debugging log

        # Retrieve the LinkedIn profile URL from the request body
        linkedinUrl = body.get("url", "")

        if not linkedinUrl:
            return {"error": "No 'topic' field in the request body"}  # Return error if URL is missing
        
        print("URL Found In Body:", linkedinUrl)

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        }
        params = {
            "dataset_id": "gd_l1viktl72bvl7bjuj0",
            "include_errors": "true",
        }
        data = [
            {"url":linkedinUrl},
        ]

        response = requests.post(getSnapshotUrl, headers=headers, params=params, json=data).json()

        SNAPSHOT_ID = response.get("snapshot_id", None)

        if not SNAPSHOT_ID:
            return {"error": "Information not found"}
        
        print("SnapshotID found: ", SNAPSHOT_ID)

        newDataURL = dataURL+SNAPSHOT_ID

        print("URL: ", newDataURL)

        headers = {"Authorization": f"Bearer {API_KEY}"}

        profile = await pollSnapshot(newDataURL, headers)
    
        # Extract relevant profile details from the API response
        summary = profile.get('about', 'Summary not available')
        name = profile.get('name', "Name not available")
        experience = profile.get('experience', 'Experience not available')
        education = profile.get('education', 'Education not available')
        
        # Create response object with extracted profile data
        content = {
            "summary": summary,  # User's profile summary
            "name": name,  # User's full name
            "experience": experience,  # Work experience details
            "education": education,  # Education details
            "link": linkedinUrl  # Original LinkedIn profile URL
        }

        return content  # Return the extracted LinkedIn profile data

    except Exception as e:
        # Return error message if an exception occurs while processing request
        return {"error": f"Failed to decode JSON: {str(e)}"}
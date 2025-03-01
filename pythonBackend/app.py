from fastapi import FastAPI, Request  # Import FastAPI framework and Request object
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware for handling cross-origin requests
from linkedin_api import Linkedin  # Import Linkedin API wrapper
from dotenv import load_dotenv  # Import dotenv to load environment variables
import os  # Import OS module to access environment variables
from urllib.parse import urlparse  # Import urlparse to parse URLs

# Load .env file to access stored environment variables
load_dotenv()

# Function to extract LinkedIn username from a given profile URL
def parseURL(url):
    # Parse the URL using urlparse
    parsed_url = urlparse(url)
    # Extract the path and get the second last part of the path (LinkedIn username)
    user = parsed_url.path.split('/')[-2]
    return user

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

# Define an API route for retrieving LinkedIn user details
@app.post("/linkedInUser")
async def read_request_body(request: Request):
    try:
        # Access environment variables for LinkedIn authentication
        username = os.getenv('USERNAME')
        password = os.getenv('PASSWORD')

        # Authenticate using LinkedIn API with provided credentials
        api = Linkedin(username, password)
        
        # Extract JSON body from the incoming request
        body = await request.json()
        print(f"Received JSON body: {body}")  # Debugging log

        # Retrieve the LinkedIn profile URL from the request body
        url = body.get("url")
        if not url:
            return {"error": "No 'topic' field in the request body"}  # Return error if URL is missing

        # Extract LinkedIn username from the provided URL
        user = parseURL(url)
        
        # Fetch the user's profile details from LinkedIn API
        profile = api.get_profile(user)
        
        # Debugging: Print the profile data keys
        print(f"Profile keys: {profile}")

        # Extract relevant profile details from the API response
        summary = profile.get('summary', 'Summary not available')
        name = profile.get('firstName', 'First name not available') + " " + profile.get('lastName', 'Last name not available')
        experience = profile.get('experience', 'Experience not available')
        education = profile.get('education', 'Education not available')
        
        # Create response object with extracted profile data
        content = {
            "summary": summary,  # User's profile summary
            "name": name,  # User's full name
            "experience": experience,  # Work experience details
            "education": education,  # Education details
            "link": url  # Original LinkedIn profile URL
        }

        return content  # Return the extracted LinkedIn profile data

    except Exception as e:
        # Return error message if an exception occurs while processing request
        return {"error": f"Failed to decode JSON: {str(e)}"}
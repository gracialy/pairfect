import os
import traceback
import uvicorn
import firebase_admin
import pyrebase
import json

from firebase_admin import credentials, auth
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

# Define request models
class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# Create FastAPI app with additional configuration
app = FastAPI(
    title="pairfect",
    description="API for photo pairing app",
    version="1.0.0"
)

# initialize Firebase only if not already initialized
try:
    # use environment variables for Firebase configuration
    firebase_credentials = os.environ.get('FIREBASE_CREDENTIALS')
    firebase_config_str = os.environ.get('FIREBASE_CONFIG')
    
    if not firebase_credentials or not firebase_config_str:
        raise ValueError("Firebase credentials or config not found in environment variables")
    
    # save credentials to a temporary file
    with open('/tmp/firebase_key.json', 'w') as f:
        f.write(firebase_credentials)
    
    cred = credentials.Certificate('/tmp/firebase_key.json')
    firebase = firebase_admin.initialize_app(cred)
    
    # parse Firebase config
    firebase_config = json.loads(firebase_config_str)
    
    pb = pyrebase.initialize_app(firebase_config)
except Exception as e:
    print(f"Firebase initialization error: {e}")
    traceback.print_exc()
    raise

# CORS middleware
allow_all = ['*']
app.add_middleware(
   CORSMiddleware,
   allow_origins=allow_all,
   allow_credentials=True,
   allow_methods=allow_all,
   allow_headers=allow_all
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Authentication API"}
 
# signup endpoint
@app.post("/signup")
async def signup(request: SignupRequest):
   try:
       # Validate input
       if not request.email or not request.password:
           raise HTTPException(status_code=400, detail="Email and password are required")
       
       # Create user in Firebase Admin Auth
       user = auth.create_user(
           email=request.email,
           password=request.password
       )
       
       return JSONResponse(
           status_code=201, 
           content={'message': f'Successfully created user {user.uid}'}
       )
   except auth.AuthError as e:
       print(f"Firebase Auth Error: {e}")
       raise HTTPException(status_code=400, detail=f"Authentication Error: {str(e)}")
   except Exception as e:
       print(f"Unexpected Signup Error: {e}")
       traceback.print_exc()
       raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")

# login endpoint
@app.post("/login", response_model=dict)
async def login(request: LoginRequest):
   try:
       user = pb.auth().sign_in_with_email_and_password(request.email, request.password)
       jwt = user['idToken']
       return {'token': jwt}
   except Exception as e:
       raise HTTPException(status_code=400, detail=f'Login Error: {str(e)}')
 
# photo pair endpoint
@app.post("/ping")
async def validate(request: Request):
    headers = request.headers
    jwt = headers.get('authorization')
    
    if not jwt:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        user = auth.verify_id_token(jwt)
        return {"message": "Token is valid", "uid": user["uid"]}
    except Exception as e:
        print(f"Token validation error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

if __name__ == "__main__":
   uvicorn.run("main:app", reload=True, host="0.0.0.0", port=8000)
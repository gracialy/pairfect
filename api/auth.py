from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from utils.firebase import auth, pb

router = APIRouter()

class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/api/signup") 
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
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/api/login")
async def login(request: LoginRequest):
    try:
        user = pb.auth().sign_in_with_email_and_password(request.email, request.password)
        jwt = user['idToken']
        return {'token': jwt}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
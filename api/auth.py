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
async def sign_up(request: SignupRequest):
    """
    Creates a new user in Firebase Auth using the provided email and password.
    
    Parameters:
    - **email**: User email.
    - **password**: User password.

    Returns:
    - Success message if the user is created successfully.
    """
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
    """
    Authenticates the user with the provided email and password.
    
    Parameters:
    - **email**: User email.
    - **password**: User password.

    Returns:
    - JWT token.
    """
    try:
        user = pb.auth().sign_in_with_email_and_password(request.email, request.password)
        jwt = user['idToken']
        return {'token': jwt}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
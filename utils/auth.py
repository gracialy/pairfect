from fastapi import Depends, HTTPException, Header
from utils.firebase import auth

# Dependency for extracting and validating Firebase token
def authenticate_user(authorization: str = Header(..., example="Bearer <your_token>")):
    """
    Extracts and validates the Firebase token from the Authorization header.
    Returns the decoded user info if valid, otherwise raises an HTTPException.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header must contain a Bearer token")
    
    token = authorization.split("Bearer ")[-1]
    try:
        user = auth.verify_id_token(token)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

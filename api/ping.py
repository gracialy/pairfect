from fastapi import APIRouter, Request, HTTPException, Header, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from utils.firebase import auth

router = APIRouter()

# Pydantic model for the responses
class ErrorResponse(BaseModel):
    detail: str

class SuccessResponse(BaseModel):
    message: str
    uid: str

# Dependency for extracting the Authorization header
def get_token(authorization: str = Header(..., example="Bearer <your_token>")):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header must contain a Bearer token")
    return authorization.split("Bearer ")[-1]

@router.post(
    "/api/ping",
    response_model=SuccessResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        500: {"model": ErrorResponse, "description": "Internal Server Error"},
    },
)
async def validate(token: str = Depends(get_token)):
    """
    Validates the provided Firebase token.
    
    - **Authorization header**: Bearer <token>
    """
    try:
        user = auth.verify_id_token(token)
        return {"message": "Token is valid", "uid": user["uid"]}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

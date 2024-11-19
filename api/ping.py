from fastapi import FastAPI, Request, HTTPException
from utils.firebase import auth

app = FastAPI()

@app.post("/api/ping")
async def validate(request: Request):
    headers = request.headers
    jwt = headers.get('authorization')
    
    if not jwt:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        user = auth.verify_id_token(jwt)
        return {"message": "Token is valid", "uid": user["uid"]}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
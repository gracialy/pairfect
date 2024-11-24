from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Pairfect API",
    description="API for photo pairing app",
    version="1.0.0",
    docs_url="/api/docs", 
    openapi_url="/api/openapi.json"  # Schema
)

# CORS middleware
allow_all = ['*']
app.add_middleware(
   CORSMiddleware,
   allow_origins=allow_all,
   allow_credentials=True,
   allow_methods=allow_all,
   allow_headers=allow_all
)

@app.get("/api")
async def root():
    return {"message": "Welcome to the pairfect API"}
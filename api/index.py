from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth import router as auth_router
from api.ping import router as ping_router

app = FastAPI(
    title="Pairfect API",
    description="API for photo pairing with the help of Vision AI",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

app.include_router(auth_router)
app.include_router(ping_router)

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
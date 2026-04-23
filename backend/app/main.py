from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "message": "OpsPulseQuintonil API is running",
        "health": "/health",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}
@app.get("/health")
def health_check():
    return {"status": "ok"}
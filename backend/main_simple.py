"""
Simplified FastAPI backend for testing.
"""
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Flowchart Video Generator API",
    version="1.0.0",
    description="Generate animated flowchart videos from text prompts",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class VideoGenerationRequest(BaseModel):
    prompt: str
    quality: str = "medium_quality"
    format: str = "mp4"

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Flowchart Video Generator API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "features": {
            "video_generation": False,  # Manim not installed
            "prompt_parsing": True,
            "basic_api": True
        }
    }

@app.post("/api/generate-video")
async def generate_video(request: VideoGenerationRequest):
    """Generate an animated flowchart video from text prompt."""
    return {
        "success": False,
        "message": "Video generation not yet implemented. Manim needs to be installed.",
        "prompt_received": request.prompt,
        "status": "not_implemented"
    }

@app.get("/api/stats")
async def get_stats():
    """Get API statistics."""
    return {
        "success": True,
        "message": "Basic API is running",
        "data": {
            "video_count": 0,
            "features_available": {
                "basic_api": True,
                "video_generation": False
            }
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

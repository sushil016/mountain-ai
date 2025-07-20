"""
FastAPI backend server for Flowchart Video Generator.
Generates animated flowchart videos from text prompts using Manim.
"""
import asyncio
import uuid
from pathlib import Path
from typing import Optional, Dict, Any
import logging

from fastapi import FastAPI, HTTPException, status, BackgroundTasks, Depends
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import uvicorn

# Import local modules
from config import (
    API_TITLE, API_VERSION, API_DESCRIPTION, VIDEOS_DIR, 
    MAX_PROMPT_LENGTH, ALLOWED_ORIGINS
)

# Try to import services, but handle missing dependencies gracefully
try:
    from services.prompt_parser import PromptParser
    PROMPT_PARSER_AVAILABLE = True
except ImportError:
    PROMPT_PARSER_AVAILABLE = False
    print("⚠️  Prompt parser not available")

try:
    from services.manim_generator import ManimGenerator
    MANIM_AVAILABLE = True
except ImportError:
    MANIM_AVAILABLE = False
    print("⚠️  Manim generator not available")

try:
    from services.video_processor import VideoProcessor
    VIDEO_PROCESSOR_AVAILABLE = True
except ImportError:
    VIDEO_PROCESSOR_AVAILABLE = False
    print("⚠️  Video processor not available")

try:
    from middleware import setup_middleware, validate_prompt, validate_video_id
    MIDDLEWARE_AVAILABLE = True
except ImportError:
    MIDDLEWARE_AVAILABLE = False
    print("⚠️  Middleware not available")

try:
    from utils import (
        generate_video_id, ensure_directories, format_error_response,
        format_success_response, save_generation_log, get_system_stats,
        validate_prompt_complexity, async_cleanup_task
    )
    UTILS_AVAILABLE = True
except ImportError:
    UTILS_AVAILABLE = False
    print("⚠️  Utils not available")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup middleware if available
if MIDDLEWARE_AVAILABLE:
    setup_middleware(app)
else:
    # Basic CORS setup
    from fastapi.middleware.cors import CORSMiddleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Initialize services if available
if PROMPT_PARSER_AVAILABLE:
    prompt_parser = PromptParser()
if MANIM_AVAILABLE:
    manim_generator = ManimGenerator()
if VIDEO_PROCESSOR_AVAILABLE:
    video_processor = VideoProcessor()

# Ensure required directories exist
if UTILS_AVAILABLE:
    ensure_directories()
else:
    # Basic directory creation
    VIDEOS_DIR.mkdir(exist_ok=True)

# Mount static files for video serving if directory exists
if VIDEOS_DIR.exists():
    app.mount("/static/videos", StaticFiles(directory=str(VIDEOS_DIR)), name="videos")

# Pydantic models
class VideoGenerationRequest(BaseModel):
    """Request model for video generation."""
    prompt: str = Field(
        ..., 
        min_length=1, 
        max_length=MAX_PROMPT_LENGTH,
        description="Text prompt describing the flowchart to generate"
    )
    quality: Optional[str] = Field(
        "medium_quality",
        description="Video quality: low_quality, medium_quality, high_quality"
    )
    format: Optional[str] = Field(
        "mp4",
        description="Output video format"
    )
    include_audio: Optional[bool] = Field(
        True,
        description="Whether to include audio narration"
    )
    voice_settings: Optional[Dict] = Field(
        None,
        description="Voice settings for TTS: language, voice, rate, etc."
    )


# Global storage for generation status
generation_status: Dict[str, str] = {}

# Simple utility functions for when utils module is not available
def simple_generate_video_id() -> str:
    """Simple video ID generation."""
    return str(uuid.uuid4())

def simple_validate_prompt(prompt: str) -> str:
    """Simple prompt validation."""
    if not prompt or not prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty"
        )
    
    if len(prompt) > MAX_PROMPT_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prompt too long. Maximum {MAX_PROMPT_LENGTH} characters allowed"
        )
    
    return prompt.strip()


@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("Starting Flowchart Video Generator API...")
    
    # Check available features
    features = []
    if PROMPT_PARSER_AVAILABLE:
        features.append("prompt parsing")
    if MANIM_AVAILABLE:
        features.append("video generation")
    if VIDEO_PROCESSOR_AVAILABLE:
        features.append("video processing")
    if MIDDLEWARE_AVAILABLE:
        features.append("advanced security")
    if UTILS_AVAILABLE:
        features.append("system monitoring")
    
    logger.info(f"Available features: {', '.join(features) if features else 'basic API only'}")
    
    # Start background cleanup task if available
    if UTILS_AVAILABLE:
        asyncio.create_task(async_cleanup_task())
    
    logger.info("API startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("Shutting down Flowchart Video Generator API...")


@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Flowchart Video Generator API",
        "version": API_VERSION,
        "docs": "/docs",
        "health": "/health",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Check system stats if available
        if UTILS_AVAILABLE:
            stats = get_system_stats()
            dependencies = stats.get("dependencies", {})
        else:
            # Basic dependency check
            dependencies = {
                "fastapi": True,
                "uvicorn": True,
                "manim": MANIM_AVAILABLE,
                "prompt_parser": PROMPT_PARSER_AVAILABLE,
                "video_processor": VIDEO_PROCESSOR_AVAILABLE
            }
        
        # Determine overall health
        critical_deps = ["fastapi", "uvicorn"]
        health_status = "healthy" if all(
            dependencies.get(dep, False) for dep in critical_deps
        ) else "degraded"
        
        return {
            "status": health_status,
            "version": API_VERSION,
            "dependencies": dependencies,
            "features": {
                "video_generation": MANIM_AVAILABLE,
                "prompt_parsing": PROMPT_PARSER_AVAILABLE,
                "video_processing": VIDEO_PROCESSOR_AVAILABLE,
                "advanced_security": MIDDLEWARE_AVAILABLE,
                "system_monitoring": UTILS_AVAILABLE
            }
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "version": API_VERSION,
            "error": str(e)
        }


@app.post("/api/generate-video")
async def generate_video(
    request: VideoGenerationRequest,
    background_tasks: BackgroundTasks
):
    """Generate an animated flowchart video from text prompt with optional audio narration."""
    try:
        # Validate prompt
        if MIDDLEWARE_AVAILABLE:
            clean_prompt = validate_prompt(request.prompt)
        else:
            clean_prompt = simple_validate_prompt(request.prompt)
        
        # Check if video generation is available
        if not MANIM_AVAILABLE:
            return {
                "success": False,
                "error": "Video generation not available",
                "message": "Manim is not installed. Please install Manim to enable video generation.",
                "status": "unavailable"
            }
        
        # Analyze prompt complexity if available
        complexity_analysis = None
        if UTILS_AVAILABLE:
            complexity_analysis = validate_prompt_complexity(clean_prompt)
        
        # Generate unique video ID
        if UTILS_AVAILABLE:
            video_id = generate_video_id()
        else:
            video_id = simple_generate_video_id()
        
        # Set initial status
        generation_status[video_id] = "processing"
        
        # Start background video generation with audio
        background_tasks.add_task(
            generate_video_with_audio_background,
            video_id,
            clean_prompt,
            request.quality,
            request.format,
            request.include_audio,
            request.voice_settings
        )
        
        logger.info(f"Started video generation {'with audio' if request.include_audio else 'without audio'} for ID: {video_id}")
        
        return {
            "success": True,
            "video_id": video_id,
            "status": "processing",
            "message": f"Video generation started {'with audio narration' if request.include_audio else 'without audio'}",
            "complexity_analysis": complexity_analysis,
            "audio_enabled": request.include_audio
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error starting video generation: {e}")
        return {
            "success": False,
            "video_id": "",
            "status": "error",
            "message": f"Failed to start video generation: {str(e)}"
        }


async def generate_video_background(
    video_id: str, 
    prompt: str, 
    quality: str, 
    format: str
):
    """Background task for video generation."""
    try:
        logger.info(f"Starting background generation for {video_id}")
        
        if not MANIM_AVAILABLE or not PROMPT_PARSER_AVAILABLE:
            generation_status[video_id] = "failed"
            logger.error(f"Required components not available for {video_id}")
            return
        
        # Update status
        generation_status[video_id] = "parsing"
        
        # Parse prompt into flowchart structure
        flowchart = prompt_parser.parse_prompt(prompt)
        logger.info(f"Parsed flowchart with {len(flowchart.nodes)} nodes")
        
        # Update status
        generation_status[video_id] = "generating"
        
        # Generate video with Manim
        result = await manim_generator.generate_video(flowchart, video_id)
        
        if result.success:
            # Update status
            generation_status[video_id] = "optimizing"
            
            # Optimize video if processor is available
            if VIDEO_PROCESSOR_AVAILABLE:
                video_path = Path(result.video_path)
                optimized_path = await video_processor.optimize_video(video_path)
            
            # Update status
            generation_status[video_id] = "completed"
            
            # Log successful generation
            if UTILS_AVAILABLE:
                save_generation_log(
                    video_id, prompt, True, result.generation_time
                )
            
            logger.info(f"Video generation completed for {video_id}")
            
        else:
            generation_status[video_id] = "failed"
            if UTILS_AVAILABLE:
                save_generation_log(video_id, prompt, False, error=result.error_message)
            logger.error(f"Video generation failed for {video_id}: {result.error_message}")
            
    except Exception as e:
        generation_status[video_id] = "failed"
        if UTILS_AVAILABLE:
            save_generation_log(video_id, prompt, False, error=str(e))
        logger.error(f"Background generation error for {video_id}: {e}")


async def generate_video_with_audio_background(
    video_id: str, 
    prompt: str, 
    quality: str, 
    format: str,
    include_audio: bool = True,
    voice_settings: Optional[Dict] = None
):
    """Background task for video generation with audio narration."""
    try:
        logger.info(f"Starting background generation {'with audio' if include_audio else 'without audio'} for {video_id}")
        
        if not MANIM_AVAILABLE or not PROMPT_PARSER_AVAILABLE:
            generation_status[video_id] = "failed"
            logger.error(f"Required components not available for {video_id}")
            return
        
        # Update status
        generation_status[video_id] = "parsing"
        
        # Parse prompt into flowchart structure
        flowchart = prompt_parser.parse_prompt(prompt)
        logger.info(f"Parsed flowchart with {len(flowchart.nodes)} nodes")
        
        # Update status
        status_msg = "generating_audio" if include_audio else "generating"
        generation_status[video_id] = status_msg
        
        # Generate video with Manim (with or without audio)
        if include_audio:
            result = await manim_generator.generate_video_with_audio(
                flowchart, 
                video_id,
                include_audio=True,
                voice_settings=voice_settings
            )
        else:
            result = await manim_generator.generate_video(flowchart, video_id)
        
        if result.success:
            # Update status
            generation_status[video_id] = "optimizing"
            
            # Optimize video if processor is available
            if VIDEO_PROCESSOR_AVAILABLE:
                video_path = Path(result.video_path)
                optimized_path = await video_processor.optimize_video(video_path)
            
            # Update status
            generation_status[video_id] = "completed"
            
            # Log successful generation
            if UTILS_AVAILABLE:
                save_generation_log(
                    video_id, prompt, True, result.generation_time,
                    extra_data={"has_audio": getattr(result, 'has_audio', False)}
                )
            
            logger.info(f"Video generation completed for {video_id} {'with audio' if getattr(result, 'has_audio', False) else 'without audio'}")
            
        else:
            generation_status[video_id] = "failed"
            if UTILS_AVAILABLE:
                save_generation_log(video_id, prompt, False, error=result.error_message)
            logger.error(f"Video generation failed for {video_id}: {result.error_message}")
            
    except Exception as e:
        generation_status[video_id] = "failed"
        if UTILS_AVAILABLE:
            save_generation_log(video_id, prompt, False, error=str(e))
        logger.error(f"Background generation error for {video_id}: {e}")


@app.get("/api/video-status/{video_id}")
async def get_video_status(video_id: str):
    """Get the status of video generation."""
    try:
        if MIDDLEWARE_AVAILABLE:
            video_id = validate_video_id(video_id)
        
        # Get current status
        status = generation_status.get(video_id, "not_found")
        
        if status == "not_found":
            raise HTTPException(
                status_code=404,
                detail="Video not found"
            )
        
        # If completed, get video info
        video_url = None
        file_size_mb = None
        duration = None
        
        if status == "completed":
            video_path = VIDEOS_DIR / f"{video_id}.mp4"
            if video_path.exists():
                video_url = f"/api/videos/{video_id}"
                
                # Get video info if processor is available
                if VIDEO_PROCESSOR_AVAILABLE:
                    video_info = await video_processor.get_video_info(video_path)
                    if video_info:
                        file_size_mb = video_info.size_mb
                        duration = video_info.duration
            else:
                status = "failed"
        
        return {
            "success": True,
            "video_id": video_id,
            "status": status,
            "video_url": video_url,
            "file_size_mb": file_size_mb,
            "duration": duration
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting video status: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error retrieving video status"
        )


@app.get("/api/videos/{video_id}")
async def download_video(video_id: str):
    """Download or stream the generated video."""
    try:
        if MIDDLEWARE_AVAILABLE:
            video_id = validate_video_id(video_id)
        
        video_path = VIDEOS_DIR / f"{video_id}.mp4"
        
        if not video_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Video file not found"
            )
        
        # Return video file
        return FileResponse(
            path=str(video_path),
            media_type="video/mp4",
            filename=f"flowchart_{video_id}.mp4",
            headers={
                "Accept-Ranges": "bytes",
                "Content-Length": str(video_path.stat().st_size)
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error serving video: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error serving video file"
        )


@app.get("/api/stats")
async def get_api_stats():
    """Get API usage statistics."""
    try:
        if UTILS_AVAILABLE:
            stats = get_system_stats()
            response_data = stats
        else:
            # Basic stats
            video_count = len(list(VIDEOS_DIR.glob("*.mp4"))) if VIDEOS_DIR.exists() else 0
            response_data = {
                "video_count": video_count,
                "features_available": {
                    "video_generation": MANIM_AVAILABLE,
                    "prompt_parsing": PROMPT_PARSER_AVAILABLE,
                    "video_processing": VIDEO_PROCESSOR_AVAILABLE,
                    "advanced_security": MIDDLEWARE_AVAILABLE,
                    "system_monitoring": UTILS_AVAILABLE
                }
            }
        
        # Add generation status info
        status_counts = {}
        for status in generation_status.values():
            status_counts[status] = status_counts.get(status, 0) + 1
        
        response_data["current_generations"] = status_counts
        response_data["total_tracked_videos"] = len(generation_status)
        
        if UTILS_AVAILABLE:
            return format_success_response(response_data, "Statistics retrieved successfully")
        else:
            return {
                "success": True,
                "message": "Statistics retrieved successfully",
                "data": response_data
            }
        
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        if UTILS_AVAILABLE:
            return format_error_response("Error retrieving statistics", str(e))
        else:
            return {
                "success": False,
                "error": "Error retrieving statistics",
                "details": str(e)
            }


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions."""
    if UTILS_AVAILABLE:
        return JSONResponse(
            status_code=exc.status_code,
            content=format_error_response(exc.detail)
        )
    else:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": exc.detail
            }
        )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions."""
    logger.error(f"Unhandled exception: {exc}")
    
    if UTILS_AVAILABLE:
        return JSONResponse(
            status_code=500,
            content=format_error_response(
                "Internal server error",
                "An unexpected error occurred"
            )
        )
    else:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error",
                "message": "An unexpected error occurred"
            }
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
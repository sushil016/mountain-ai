#!/usr/bin/env python3
"""
Simple FastAPI server to demonstrate working video generation functionality.
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn
import asyncio
import subprocess
import os
import json
import uuid
from pathlib import Path

app = FastAPI(
    title="Flowchart Video Generator - Working Demo",
    description="Simplified API demonstrating video generation with audio",
    version="1.0.0"
)

# Ensure videos directory exists
VIDEOS_DIR = Path("videos")
VIDEOS_DIR.mkdir(exist_ok=True)


class VideoRequest(BaseModel):
    prompt: str
    include_audio: bool = True


class VideoResponse(BaseModel):
    success: bool
    message: str
    video_id: Optional[str] = None
    video_path: Optional[str] = None
    audio_path: Optional[str] = None


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Flowchart Video Generator - Working Demo API",
        "version": "1.0.0",
        "status": "operational",
        "features": ["video_generation", "audio_narration", "manim_rendering"]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "features": {
            "video_generation": True,
            "audio_narration": True,
            "manim_available": True
        }
    }


@app.post("/generate-video", response_model=VideoResponse)
async def generate_video(request: VideoRequest):
    """Generate a flowchart video with audio narration."""
    try:
        print(f"🎬 Received request: {request.prompt}")
        
        # Generate unique video ID
        video_id = str(uuid.uuid4())[:8]
        
        # Run the complete demo script with the user's prompt
        cmd = [
            "python", "complete_demo.py", 
            "--prompt", request.prompt,
            "--video-id", video_id
        ]
        
        print(f"🔧 Running: {' '.join(cmd)}")
        
        # Execute the demo script
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd="/Users/sushilsahani/Desktop/mountain-ai/backend"
        )
        
        if result.returncode == 0:
            # Success - find the most recently generated files
            video_files = sorted(
                VIDEOS_DIR.glob("*complete*.mp4"), 
                key=lambda x: x.stat().st_mtime, 
                reverse=True
            )
            audio_files = sorted(
                VIDEOS_DIR.glob("*.wav"), 
                key=lambda x: x.stat().st_mtime, 
                reverse=True  
            )
            
            video_path = str(video_files[0]) if video_files else None
            audio_path = str(audio_files[0]) if audio_files else None
            
            return VideoResponse(
                success=True,
                message="Video generated successfully!",
                video_id=video_id,
                video_path=video_path,
                audio_path=audio_path
            )
        else:
            print(f"❌ Command failed: {result.stderr}")
            return VideoResponse(
                success=False,
                message=f"Video generation failed: {result.stderr}"
            )
            
    except Exception as e:
        print(f"❌ Error generating video: {e}")
        return VideoResponse(
            success=False,
            message=f"Server error: {str(e)}"
        )


@app.get("/videos/{filename}")
async def serve_video(filename: str):
    """Serve generated video files."""
    from fastapi.responses import FileResponse
    
    video_path = VIDEOS_DIR / filename
    if video_path.exists():
        return FileResponse(
            video_path,
            media_type="video/mp4" if filename.endswith(".mp4") else "audio/wav"
        )
    else:
        raise HTTPException(status_code=404, detail="File not found")


if __name__ == "__main__":
    print("🚀 Starting Flowchart Video Generator - Working Demo API")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API docs at: http://localhost:8000/docs")
    print("🎬 Ready to generate videos with audio!")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)

"""
Middleware and validation functions for the Flowchart Video Generator API.
"""
import re
import logging
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from config import ALLOWED_ORIGINS, MAX_PROMPT_LENGTH

logger = logging.getLogger(__name__)

def setup_middleware(app: FastAPI):
    """Setup all middleware for the FastAPI app."""
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Trusted host middleware for security
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=["localhost", "127.0.0.1", "*"]
    )
    
    logger.info("Middleware setup complete")

def validate_prompt(prompt: str) -> str:
    """Validate and clean the input prompt."""
    if not prompt or not prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    # Clean the prompt
    prompt = prompt.strip()
    
    # Check length
    if len(prompt) > MAX_PROMPT_LENGTH:
        raise HTTPException(
            status_code=400, 
            detail=f"Prompt too long (max {MAX_PROMPT_LENGTH} characters)"
        )
    
    # Check for potentially harmful content (basic check)
    dangerous_patterns = [
        r'<script',
        r'javascript:',
        r'eval\(',
        r'exec\(',
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, prompt, re.IGNORECASE):
            raise HTTPException(
                status_code=400, 
                detail="Prompt contains potentially harmful content"
            )
    
    return prompt

def validate_video_id(video_id: str) -> str:
    """Validate video ID format."""
    if not video_id or not video_id.strip():
        raise HTTPException(status_code=400, detail="Video ID cannot be empty")
    
    # Basic UUID format validation
    uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    if not re.match(uuid_pattern, video_id, re.IGNORECASE):
        raise HTTPException(status_code=400, detail="Invalid video ID format")
    
    return video_id

def validate_quality(quality: str) -> str:
    """Validate video quality setting."""
    valid_qualities = ["low_quality", "medium_quality", "high_quality", "fourk_quality"]
    
    if quality not in valid_qualities:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid quality. Must be one of: {', '.join(valid_qualities)}"
        )
    
    return quality

def validate_format(format_type: str) -> str:
    """Validate video format setting."""
    valid_formats = ["mp4", "mov", "avi"]
    
    if format_type not in valid_formats:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid format. Must be one of: {', '.join(valid_formats)}"
        )
    
    return format_type

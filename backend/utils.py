"""
Utility functions for the Flowchart Video Generator API.
"""
import uuid
import json
import asyncio
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

from config import VIDEOS_DIR, TEMP_DIR, LOGS_DIR

logger = logging.getLogger(__name__)

def generate_video_id() -> str:
    """Generate a unique video ID."""
    return str(uuid.uuid4())

def ensure_directories():
    """Ensure all required directories exist."""
    VIDEOS_DIR.mkdir(exist_ok=True)
    TEMP_DIR.mkdir(exist_ok=True)
    LOGS_DIR.mkdir(exist_ok=True)

def format_error_response(error: str, message: str = None) -> Dict[str, Any]:
    """Format error response consistently."""
    return {
        "success": False,
        "error": error,
        "message": message or error,
        "timestamp": datetime.now().isoformat()
    }

def format_success_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """Format success response consistently."""
    return {
        "success": True,
        "timestamp": datetime.now().isoformat(),
        **data
    }

def save_generation_log(video_id: str, data: Dict[str, Any]):
    """Save generation log for debugging."""
    try:
        log_file = LOGS_DIR / f"{video_id}.json"
        with open(log_file, 'w') as f:
            json.dump({
                "video_id": video_id,
                "timestamp": datetime.now().isoformat(),
                **data
            }, f, indent=2)
    except Exception as e:
        logger.error(f"Failed to save generation log: {e}")

def get_system_stats() -> Dict[str, Any]:
    """Get basic system statistics."""
    try:
        videos_count = len(list(VIDEOS_DIR.glob("*.mp4")))
        temp_files_count = len(list(TEMP_DIR.glob("*")))
        
        return {
            "videos_generated": videos_count,
            "temp_files": temp_files_count,
            "disk_usage": {
                "videos_dir_exists": VIDEOS_DIR.exists(),
                "temp_dir_exists": TEMP_DIR.exists(),
                "logs_dir_exists": LOGS_DIR.exists()
            }
        }
    except Exception as e:
        logger.error(f"Failed to get system stats: {e}")
        return {"error": str(e)}

def validate_prompt_complexity(prompt: str) -> Dict[str, Any]:
    """Analyze prompt complexity."""
    words = len(prompt.split())
    lines = len(prompt.split('\n'))
    
    # Simple complexity analysis
    if words < 10:
        complexity = "simple"
    elif words < 50:
        complexity = "medium"
    else:
        complexity = "complex"
    
    return {
        "complexity": complexity,
        "word_count": words,
        "line_count": lines,
        "estimated_duration": max(10, words * 2)  # Rough estimate in seconds
    }

async def async_cleanup_task():
    """Async cleanup task for background processing."""
    try:
        # Clean up old temp files
        cutoff_time = datetime.now() - timedelta(hours=24)
        
        for temp_file in TEMP_DIR.glob("*"):
            if temp_file.is_file():
                file_time = datetime.fromtimestamp(temp_file.stat().st_mtime)
                if file_time < cutoff_time:
                    temp_file.unlink()
                    logger.info(f"Cleaned up old temp file: {temp_file}")
        
        # Clean up old log files
        log_cutoff = datetime.now() - timedelta(days=7)
        for log_file in LOGS_DIR.glob("*.json"):
            if log_file.is_file():
                file_time = datetime.fromtimestamp(log_file.stat().st_mtime)
                if file_time < log_cutoff:
                    log_file.unlink()
                    logger.info(f"Cleaned up old log file: {log_file}")
                    
    except Exception as e:
        logger.error(f"Cleanup task failed: {e}")

def simple_validate_prompt(prompt: str) -> str:
    """Simple prompt validation and cleaning."""
    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty")
    
    prompt = prompt.strip()
    
    if len(prompt) > 2000:
        raise ValueError("Prompt too long (max 2000 characters)")
    
    return prompt

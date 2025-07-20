"""
Configuration settings for the Flowchart Video Generator API.
"""
from pathlib import Path

# API Configuration
API_TITLE = "Flowchart Video Generator API"
API_VERSION = "1.0.0"
API_DESCRIPTION = "Generate animated flowchart videos from text prompts using Manim with optional audio narration"

# Directories
BASE_DIR = Path(__file__).parent
VIDEOS_DIR = BASE_DIR / "videos"
TEMP_DIR = BASE_DIR / "temp"
LOGS_DIR = BASE_DIR / "logs"

# Create directories if they don't exist
VIDEOS_DIR.mkdir(exist_ok=True)
TEMP_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

# Request limits
MAX_PROMPT_LENGTH = 2000
MAX_CONCURRENT_GENERATIONS = 3

# CORS settings
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "*"  # Allow all origins for development
]

# Video settings
DEFAULT_VIDEO_QUALITY = "medium_quality"
DEFAULT_VIDEO_FORMAT = "mp4"
SUPPORTED_QUALITIES = ["low_quality", "medium_quality", "high_quality", "fourk_quality"]
SUPPORTED_FORMATS = ["mp4", "mov", "avi"]

# Audio settings
DEFAULT_VOICE = "alloy"
SUPPORTED_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
DEFAULT_AUDIO_SPEED = 1.0

# File size limits (in MB)
MAX_VIDEO_SIZE_MB = 100
MAX_AUDIO_SIZE_MB = 10

# Cleanup settings
CLEANUP_TEMP_FILES_AFTER_HOURS = 24
CLEANUP_OLD_VIDEOS_AFTER_DAYS = 7

# Manim settings
MANIM_CONFIG = {
    "quality": "medium_quality",  # low_quality, medium_quality, high_quality, fourk_quality
    "preview": False,
    "write_to_movie": True,
    "disable_caching": False,
    "output_file": None,  # Will be set dynamically
    "scene_names": None,
    "verbosity": "WARNING",
    "progress_bar": "none",
    "leave_progress_bars": False
}

# Manim quality settings
MANIM_QUALITIES = {
    "low_quality": {
        "pixel_height": 480,
        "pixel_width": 854,
        "frame_rate": 15
    },
    "medium_quality": {
        "pixel_height": 720,
        "pixel_width": 1280,
        "frame_rate": 30
    },
    "high_quality": {
        "pixel_height": 1080,
        "pixel_width": 1920,
        "frame_rate": 60
    },
    "fourk_quality": {
        "pixel_height": 2160,
        "pixel_width": 3840,
        "frame_rate": 60
    }
}

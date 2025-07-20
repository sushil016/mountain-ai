"""
Video Processor Service for Flowchart Video Generator.
Handles video post-processing, combining video with audio, and format conversions.
"""
import os
import logging
import subprocess
from pathlib import Path
from typing import Optional, Dict, Any
from dataclasses import dataclass

try:
    import moviepy.editor as mp
    MOVIEPY_AVAILABLE = True
except ImportError:
    MOVIEPY_AVAILABLE = False

try:
    import ffmpeg
    FFMPEG_AVAILABLE = True
except ImportError:
    FFMPEG_AVAILABLE = False

logger = logging.getLogger(__name__)


@dataclass
class ProcessingResult:
    """Result of video processing operation."""
    success: bool
    output_path: Optional[str] = None
    error_message: Optional[str] = None
    duration: Optional[float] = None
    file_size_mb: Optional[float] = None


class VideoProcessor:
    """Process and combine video and audio files."""
    
    def __init__(self):
        self.temp_dir = Path("temp")
        self.temp_dir.mkdir(exist_ok=True)
        
        # Check available tools
        self.moviepy_available = MOVIEPY_AVAILABLE
        self.ffmpeg_available = FFMPEG_AVAILABLE
        
        if not self.moviepy_available and not self.ffmpeg_available:
            logger.warning("Neither MoviePy nor FFmpeg is available. Video processing will be limited.")
    
    async def combine_video_audio(
        self,
        video_path: str,
        audio_path: str,
        output_path: str,
        sync_audio: bool = True
    ) -> ProcessingResult:
        """Combine video and audio files into a single output."""
        try:
            video_file = Path(video_path)
            audio_file = Path(audio_path)
            output_file = Path(output_path)
            
            if not video_file.exists():
                return ProcessingResult(
                    success=False,
                    error_message=f"Video file not found: {video_path}"
                )
            
            if not audio_file.exists():
                return ProcessingResult(
                    success=False,
                    error_message=f"Audio file not found: {audio_path}"
                )
            
            # Try MoviePy first, then FFmpeg
            if self.moviepy_available:
                return await self._combine_with_moviepy(video_file, audio_file, output_file, sync_audio)
            elif self.ffmpeg_available:
                return await self._combine_with_ffmpeg(video_file, audio_file, output_file)
            else:
                return ProcessingResult(
                    success=False,
                    error_message="No video processing library available"
                )
                
        except Exception as e:
            logger.error(f"Video processing failed: {e}")
            return ProcessingResult(
                success=False,
                error_message=str(e)
            )
    
    async def _combine_with_moviepy(
        self,
        video_file: Path,
        audio_file: Path,
        output_file: Path,
        sync_audio: bool = True
    ) -> ProcessingResult:
        """Combine video and audio using MoviePy."""
        try:
            # Load video and audio
            video = mp.VideoFileClip(str(video_file))
            audio = mp.AudioFileClip(str(audio_file))
            
            if sync_audio:
                # Adjust audio duration to match video
                if audio.duration > video.duration:
                    audio = audio.subclip(0, video.duration)
                elif audio.duration < video.duration:
                    # Loop audio if it's shorter than video
                    loops_needed = int(video.duration / audio.duration) + 1
                    audio = mp.concatenate_audioclips([audio] * loops_needed).subclip(0, video.duration)
            
            # Combine video and audio
            final_video = video.set_audio(audio)
            
            # Write the result
            final_video.write_videofile(
                str(output_file),
                codec='libx264',
                audio_codec='aac',
                verbose=False,
                logger=None
            )
            
            # Clean up
            video.close()
            audio.close()
            final_video.close()
            
            # Get file info
            file_size_mb = output_file.stat().st_size / (1024 * 1024)
            
            return ProcessingResult(
                success=True,
                output_path=str(output_file),
                duration=video.duration,
                file_size_mb=file_size_mb
            )
            
        except Exception as e:
            logger.error(f"MoviePy processing failed: {e}")
            return ProcessingResult(
                success=False,
                error_message=f"MoviePy processing failed: {e}"
            )
    
    async def _combine_with_ffmpeg(
        self,
        video_file: Path,
        audio_file: Path,
        output_file: Path
    ) -> ProcessingResult:
        """Combine video and audio using FFmpeg."""
        try:
            # Build FFmpeg command
            input_video = ffmpeg.input(str(video_file))
            input_audio = ffmpeg.input(str(audio_file))
            
            # Combine video and audio
            output = ffmpeg.output(
                input_video,
                input_audio,
                str(output_file),
                vcodec='copy',
                acodec='aac',
                shortest=None  # Use shortest duration
            )
            
            # Run FFmpeg
            ffmpeg.run(output, overwrite_output=True, quiet=True)
            
            # Get file info
            file_size_mb = output_file.stat().st_size / (1024 * 1024)
            
            # Get duration using FFmpeg probe
            probe = ffmpeg.probe(str(output_file))
            duration = float(probe['streams'][0]['duration'])
            
            return ProcessingResult(
                success=True,
                output_path=str(output_file),
                duration=duration,
                file_size_mb=file_size_mb
            )
            
        except Exception as e:
            logger.error(f"FFmpeg processing failed: {e}")
            return ProcessingResult(
                success=False,
                error_message=f"FFmpeg processing failed: {e}"
            )
    
    async def convert_format(
        self,
        input_path: str,
        output_path: str,
        target_format: str = "mp4"
    ) -> ProcessingResult:
        """Convert video to different format."""
        try:
            input_file = Path(input_path)
            output_file = Path(output_path)
            
            if not input_file.exists():
                return ProcessingResult(
                    success=False,
                    error_message=f"Input file not found: {input_path}"
                )
            
            if self.moviepy_available:
                # Use MoviePy for format conversion
                video = mp.VideoFileClip(str(input_file))
                video.write_videofile(
                    str(output_file),
                    verbose=False,
                    logger=None
                )
                video.close()
                
                file_size_mb = output_file.stat().st_size / (1024 * 1024)
                
                return ProcessingResult(
                    success=True,
                    output_path=str(output_file),
                    file_size_mb=file_size_mb
                )
            else:
                return ProcessingResult(
                    success=False,
                    error_message="Video conversion requires MoviePy or FFmpeg"
                )
                
        except Exception as e:
            logger.error(f"Format conversion failed: {e}")
            return ProcessingResult(
                success=False,
                error_message=str(e)
            )
    
    async def extract_audio(self, video_path: str, audio_path: str) -> ProcessingResult:
        """Extract audio from video file."""
        try:
            video_file = Path(video_path)
            audio_file = Path(audio_path)
            
            if not video_file.exists():
                return ProcessingResult(
                    success=False,
                    error_message=f"Video file not found: {video_path}"
                )
            
            if self.moviepy_available:
                video = mp.VideoFileClip(str(video_file))
                audio = video.audio
                audio.write_audiofile(str(audio_file), verbose=False, logger=None)
                video.close()
                audio.close()
                
                file_size_mb = audio_file.stat().st_size / (1024 * 1024)
                
                return ProcessingResult(
                    success=True,
                    output_path=str(audio_file),
                    file_size_mb=file_size_mb
                )
            else:
                return ProcessingResult(
                    success=False,
                    error_message="Audio extraction requires MoviePy or FFmpeg"
                )
                
        except Exception as e:
            logger.error(f"Audio extraction failed: {e}")
            return ProcessingResult(
                success=False,
                error_message=str(e)
            )
    
    def get_video_info(self, video_path: str) -> Dict[str, Any]:
        """Get information about a video file."""
        try:
            video_file = Path(video_path)
            
            if not video_file.exists():
                return {"error": f"Video file not found: {video_path}"}
            
            if self.moviepy_available:
                video = mp.VideoFileClip(str(video_file))
                info = {
                    "duration": video.duration,
                    "fps": video.fps,
                    "size": video.size,
                    "file_size_mb": video_file.stat().st_size / (1024 * 1024)
                }
                video.close()
                return info
            else:
                return {"error": "Video info requires MoviePy or FFmpeg"}
                
        except Exception as e:
            logger.error(f"Failed to get video info: {e}")
            return {"error": str(e)}

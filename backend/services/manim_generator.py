"""
Manim generator service for creating animated flowchart videos with audio narration.
"""
import os
import asyncio
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass
import logging

from services.prompt_parser import FlowchartStructure
from services.audio_generator import AudioGenerator
from config import TEMP_DIR, VIDEOS_DIR, MANIM_CONFIG

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class VideoResult:
    """Result of video generation."""
    success: bool
    video_path: Optional[str] = None
    audio_path: Optional[str] = None
    error_message: Optional[str] = None
    generation_time: Optional[float] = None
    has_audio: bool = False


class ManimGenerator:
    """Generate Manim animations from flowchart structures with audio narration."""

    def __init__(self):
        self.temp_dir = TEMP_DIR
        self.videos_dir = VIDEOS_DIR
        
        # Ensure directories exist
        self.temp_dir.mkdir(exist_ok=True)
        self.videos_dir.mkdir(exist_ok=True)

        # Initialize audio generator if available
        try:
            self.audio_generator = AudioGenerator()
        except Exception as e:
            logger.warning(f"Audio generator not available: {e}")
            self.audio_generator = None

    async def generate_video_with_audio(
        self,
        flowchart: FlowchartStructure,
        video_id: str,
        include_audio: bool = True,
        voice_settings: Optional[Dict] = None
    ) -> VideoResult:
        """Generate an animated video with audio narration from flowchart structure."""
        try:
            import time
            start_time = time.time()

            logger.info(f"Starting video generation for {video_id}")

            # Convert flowchart to dictionary for audio generation
            flowchart_dict = self._flowchart_to_dict(flowchart)

            # Generate audio narration if requested and available
            audio_path = None
            narration_segments = []

            if include_audio and self.audio_generator:
                try:
                    # Generate narration script with timing
                    script, timing_segments = await self.audio_generator.create_timed_narration(
                        flowchart_dict,
                        total_video_duration=15.0  # Estimate 15 seconds
                    )

                    # Generate audio file using gTTS (more reliable than pyttsx3)
                    audio_path = await self.audio_generator.generate_audio(
                        script,
                        engine='gtts',
                        voice_settings=voice_settings or {'lang': 'en', 'tld': 'com'}
                    )

                    narration_segments = timing_segments
                    logger.info(f"Audio generated successfully: {audio_path}")

                except Exception as e:
                    logger.warning(f"Audio generation failed: {e}")
                    # Continue without audio

            # Generate Manim Python code with audio synchronization
            manim_code = self._generate_manim_code_with_audio(
                flowchart,
                video_id,
                narration_segments,
                audio_path
            )

            # Write code to temporary file
            temp_file_path = self.temp_dir / f"{video_id}_scene.py"
            with open(temp_file_path, "w") as f:
                f.write(manim_code)

            logger.info(f"Manim code written to: {temp_file_path}")

            # Run Manim to generate video
            video_path = await self._render_manim_video(temp_file_path, video_id)

            # If we have both video and audio, combine them
            final_video_path = video_path
            if audio_path and video_path:
                final_video_path = await self._combine_video_audio(
                    video_path,
                    audio_path,
                    video_id
                )

            # Clean up temporary files
            try:
                temp_file_path.unlink(missing_ok=True)
            except Exception as e:
                logger.warning(f"Could not clean up temp file: {e}")

            generation_time = time.time() - start_time
            logger.info(f"Video generation completed in {generation_time:.2f}s")

            return VideoResult(
                success=True,
                video_path=str(final_video_path),
                audio_path=str(audio_path) if audio_path else None,
                generation_time=generation_time,
                has_audio=bool(audio_path)
            )

        except Exception as e:
            logger.error(f"Video generation failed: {e}")
            return VideoResult(
                success=False,
                error_message=str(e)
            )

    async def generate_video(self, flowchart: FlowchartStructure, video_id: str) -> VideoResult:
        """Generate video without audio (backwards compatibility)."""
        return await self.generate_video_with_audio(flowchart, video_id, include_audio=False)

    def _flowchart_to_dict(self, flowchart: FlowchartStructure) -> Dict:
        """Convert flowchart structure to dictionary for audio generation."""
        return {
            'title': flowchart.title,
            'nodes': [
                {
                    'id': node.id,
                    'text': node.text,
                    'type': node.type.value,
                    'position': list(node.position)
                }
                for node in flowchart.nodes
            ],
            'connections': [
                {
                    'from': edge.from_node,
                    'to': edge.to_node,
                    'type': 'line',  # Default edge type
                    'condition': edge.label
                }
                for edge in flowchart.connections
            ]
        }

    def _generate_manim_code_with_audio(
        self,
        flowchart: FlowchartStructure,
        video_id: str,
        narration_segments: List[Dict],
        audio_path: Optional[Path]
    ) -> str:
        """Generate Manim code with audio synchronization."""

        # Clean video_id for class name (replace hyphens with underscores, remove invalid chars)
        clean_video_id = "".join(c if c.isalnum() else "_" for c in video_id)
        
        # Start with basic structure
        code = f'''"""
Generated Manim scene: {video_id}
Flowchart: {flowchart.title or "Untitled"}
Generated with audio synchronization
"""

from manim import *
import numpy as np

class FlowchartScene_{clean_video_id}(Scene):
    def construct(self):
        # Scene configuration
        self.camera.background_color = WHITE

        # Title
        title = Text("{self._escape_string(flowchart.title or 'Flowchart')}", font_size=36, color=BLACK)
        title.to_edge(UP, buff=0.5)

        # Show title
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Create all flowchart elements
        nodes = {{}}
        edges = []

'''

        # Add node definitions
        for node in flowchart.nodes:
            code += self._generate_node_code(node)

        # Add edge definitions
        for edge in flowchart.connections:
            code += self._generate_edge_code(edge, flowchart.nodes)

        # Add animation sequence
        code += self._generate_animation_sequence(flowchart, narration_segments)

        return code

    def _escape_string(self, text: str) -> str:
        """Escape special characters in strings for Manim code."""
        return text.replace('"', '\\"').replace("'", "\\'").replace("\n", "\\n")

    def _generate_node_code(self, node) -> str:
        """Generate Manim code for a single node."""
        x, y = node.position
        safe_id = self._make_safe_identifier(node.id)
        
        # Determine shape and color based on node type
        if node.type.value in ["start", "end"]:
            shape_code = f"Circle(radius=0.8, color={'GREEN' if node.type.value == 'start' else 'RED'}, fill_opacity=0.3)"
        elif node.type.value == "decision":
            shape_code = "Polygon([-0.8, 0.5, 0], [0.8, 0.5, 0], [1.0, 0, 0], [0.8, -0.5, 0], [-0.8, -0.5, 0], [-1.0, 0, 0], color=YELLOW, fill_opacity=0.3)"
        else:
            shape_code = "Rectangle(width=2.0, height=1.0, color=BLUE, fill_opacity=0.3)"

        code = f'''
        # Node: {node.id}
        {safe_id}_text = Text("{self._escape_string(node.text)}", font_size=20, color=BLACK)
        {safe_id}_text.move_to([{x}, {y}, 0])
        
        {safe_id}_shape = {shape_code}
        {safe_id}_shape.move_to([{x}, {y}, 0])
        
        nodes["{node.id}"] = VGroup({safe_id}_shape, {safe_id}_text)

'''
        return code

    def _generate_edge_code(self, edge, nodes) -> str:
        """Generate Manim code for an edge."""
        from_node = next((n for n in nodes if n.id == edge.from_node), None)
        to_node = next((n for n in nodes if n.id == edge.to_node), None)

        if not from_node or not to_node:
            return ""

        safe_from = self._make_safe_identifier(edge.from_node)
        safe_to = self._make_safe_identifier(edge.to_node)
        edge_key = f"{edge.from_node}_{edge.to_node}"

        code = f'''
        # Edge: {edge.from_node} -> {edge.to_node}
        edge_{safe_from}_{safe_to} = Arrow(
            start=[{from_node.position[0]}, {from_node.position[1] - 0.5}, 0],
            end=[{to_node.position[0]}, {to_node.position[1] + 0.5}, 0],
            color=BLACK,
            buff=0.1
        )
        edges.append(edge_{safe_from}_{safe_to})

'''
        if edge.label:
            code += f'''
        edge_label_{safe_from}_{safe_to} = Text("{self._escape_string(edge.label)}", font_size=16, color=BLACK)
        edge_label_{safe_from}_{safe_to}.next_to(edge_{safe_from}_{safe_to}, RIGHT, buff=0.1)
        edges.append(edge_label_{safe_from}_{safe_to})

'''
        return code

    def _make_safe_identifier(self, text: str) -> str:
        """Convert text to a safe Python identifier."""
        # Replace non-alphanumeric characters with underscores
        safe = "".join(c if c.isalnum() else "_" for c in text)
        # Ensure it doesn't start with a number
        if safe and safe[0].isdigit():
            safe = "n_" + safe
        return safe or "unnamed"

    def _generate_animation_sequence(self, flowchart, narration_segments) -> str:
        """Generate the animation sequence."""
        code = '''
        # Animation sequence
        all_nodes = list(nodes.values())
        
        # Show nodes one by one
        for i, node in enumerate(all_nodes):
            self.play(FadeIn(node), run_time=0.8)
            self.wait(0.3)
        
        # Show edges
        for edge in edges:
            self.play(Create(edge), run_time=0.5)
            self.wait(0.2)

        # Hold final state
        self.wait(2)

        # Fade out everything
        all_objects = all_nodes + edges
        if all_objects:
            self.play(FadeOut(*all_objects), run_time=1)
'''
        return code

    async def _render_manim_video(self, script_path: Path, video_id: str) -> Path:
        """Render the Manim script to video."""
        try:
            output_dir = self.videos_dir
            clean_video_id = "".join(c if c.isalnum() else "_" for c in video_id)
            scene_name = f"FlowchartScene_{clean_video_id}"
            
            # Map quality settings to Manim's expected values
            quality_map = {
                "low_quality": "l",
                "medium_quality": "m", 
                "high_quality": "h",
                "fourk_quality": "k"
            }
            
            manim_quality = quality_map.get(MANIM_CONFIG.get("quality", "medium_quality"), "m")
            
            # Manim command (updated for v0.19.0)
            cmd = [
                "python", "-m", "manim", "render",
                str(script_path),
                scene_name,
                "--media_dir", str(output_dir),
                "-q", manim_quality,
                "--verbosity", MANIM_CONFIG.get("verbosity", "WARNING")
            ]

            if MANIM_CONFIG.get("disable_caching", False):
                cmd.append("--disable_caching")

            logger.info(f"Running Manim command: {' '.join(cmd)}")

            # Run Manim process
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=str(script_path.parent)
            )

            stdout, stderr = await process.communicate()

            logger.info(f"Manim stdout: {stdout.decode()}")
            if stderr:
                logger.warning(f"Manim stderr: {stderr.decode()}")

            if process.returncode != 0:
                raise Exception(f"Manim rendering failed (code {process.returncode}): {stderr.decode()}")

            # Find the generated video file
            video_file = self._find_generated_video(output_dir, scene_name)
            if not video_file:
                raise Exception(f"Generated video file not found. Searched in {output_dir} for {scene_name}")

            # Move to final location with predictable name
            final_path = self.videos_dir / f"{video_id}.mp4"
            if final_path.exists():
                final_path.unlink()  # Remove existing file
            video_file.rename(final_path)

            logger.info(f"Video successfully generated: {final_path}")
            return final_path

        except Exception as e:
            logger.error(f"Error in _render_manim_video: {e}")
            raise

    def _find_generated_video(self, output_dir: Path, scene_name: str) -> Optional[Path]:
        """Find the generated video file in Manim's output structure."""
        # Manim typically outputs to videos/[script_name]/[quality]/[scene_name].mp4
        logger.info(f"Searching for video file with scene name: {scene_name}")
        logger.info(f"Search directory: {output_dir}")
        
        for root, dirs, files in os.walk(output_dir):
            logger.info(f"Checking directory: {root}, files: {files}")
            for file in files:
                if file.endswith('.mp4') and (scene_name in file or scene_name.lower() in file.lower()):
                    found_path = Path(root) / file
                    logger.info(f"Found video file: {found_path}")
                    return found_path
        
        logger.error(f"No video file found for scene: {scene_name}")
        return None

    async def _combine_video_audio(
        self,
        video_path: Path,
        audio_path: Path,
        video_id: str
    ) -> Path:
        """Combine video and audio using ffmpeg."""
        try:
            output_path = self.videos_dir / f"{video_id}_with_audio.mp4"

            # Use ffmpeg to combine video and audio
            cmd = [
                "ffmpeg", "-y",  # Overwrite output file
                "-i", str(video_path),  # Video input
                "-i", str(audio_path),  # Audio input
                "-c:v", "copy",  # Copy video codec
                "-c:a", "aac",  # Audio codec
                "-shortest",  # End when shortest stream ends
                str(output_path)
            ]

            logger.info(f"Running FFmpeg command: {' '.join(cmd)}")

            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            stdout, stderr = await process.communicate()

            if process.returncode == 0:
                logger.info(f"Audio and video combined successfully: {output_path}")
                return output_path
            else:
                logger.error(f"FFmpeg error: {stderr.decode()}")
                return video_path  # Return original video if combination fails

        except Exception as e:
            logger.error(f"Error combining video and audio: {e}")
            return video_path  # Return original video if combination fails
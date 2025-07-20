"""
Manim generator service for creating animated flowchart videos with audio narration.
"""
import os
import asyncio
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass

from services.prompt_parser import FlowchartStructure
from services.audio_generator import AudioGenerator
from config import TEMP_DIR, VIDEOS_DIR, MANIM_CONFIG


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
        
        # Initialize audio generator if available
        try:
            self.audio_generator = AudioGenerator()
        except Exception:
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
                    
                except Exception as e:
                    print(f"⚠️  Audio generation failed: {e}")
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
            except Exception:
                pass
            
            generation_time = time.time() - start_time
            
            return VideoResult(
                success=True,
                video_path=str(final_video_path),
                audio_path=str(audio_path) if audio_path else None,
                generation_time=generation_time,
                has_audio=bool(audio_path)
            )
            
        except Exception as e:
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
                    'type': node.node_type,
                    'position': list(node.position)
                }
                for node in flowchart.nodes
            ],
            'connections': [
                {
                    'from': edge.from_node,
                    'to': edge.to_node,
                    'type': edge.edge_type,
                    'condition': edge.label
                }
                for edge in flowchart.edges
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
        
        # Start with basic structure
        code = f'''"""
Generated Manim scene: {video_id}
Flowchart: {flowchart.title or "Untitled"}
Generated with audio synchronization
"""

from manim import *
import numpy as np

class FlowchartScene_{video_id.replace("-", "_")}(Scene):
    def construct(self):
        # Scene configuration
        self.camera.background_color = WHITE
        
        # Title
        title = Text("{flowchart.title or "Flowchart"}", font_size=36, color=BLACK)
        title.to_edge(UP, buff=0.5)
        
        # Show title
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        
        # Create all flowchart elements
        nodes = {{}}
        edges = {{}}
        
'''
        
        # Add node definitions
        for node in flowchart.nodes:
            code += self._generate_node_code(node)
        
        # Add edge definitions  
        for edge in flowchart.edges:
            code += self._generate_edge_code(edge, flowchart.nodes)
        
        # Add animation sequence
        code += self._generate_animation_sequence(flowchart, narration_segments)
        
        return code
    
    def _generate_node_code(self, node) -> str:
        """Generate Manim code for a single node."""
        x, y = node.position
        
        if node.node_type == "start" or node.node_type == "end":
            shape = "Circle"
            color = "GREEN" if node.node_type == "start" else "RED"
        elif node.node_type == "decision":
            shape = "Polygon"
            color = "YELLOW"
        else:
            shape = "Rectangle"
            color = "BLUE"
        
        code = f'''
        # Node: {node.id}
        {node.id}_text = Text("{node.text}", font_size=20, color=BLACK)
        {node.id}_text.move_to([{x}, {y}, 0])
        
        if "{shape}" == "Circle":
            {node.id}_shape = Circle(radius=0.8, color={color}, fill_opacity=0.3)
        elif "{shape}" == "Polygon":
            {node.id}_shape = Polygon(
                [-0.8, 0.5, 0], [0.8, 0.5, 0], [1.0, 0, 0], [0.8, -0.5, 0], 
                [-0.8, -0.5, 0], [-1.0, 0, 0], color={color}, fill_opacity=0.3
            )
        else:
            {node.id}_shape = Rectangle(width=2.0, height=1.0, color={color}, fill_opacity=0.3)
        
        {node.id}_shape.move_to([{x}, {y}, 0])
        nodes["{node.id}"] = VGroup({node.id}_shape, {node.id}_text)
        
'''
        return code
    
    def _generate_edge_code(self, edge, nodes) -> str:
        """Generate Manim code for an edge."""
        from_node = next((n for n in nodes if n.id == edge.from_node), None)
        to_node = next((n for n in nodes if n.id == edge.to_node), None)
        
        if not from_node or not to_node:
            return ""
        
        code = f'''
        # Edge: {edge.from_node} -> {edge.to_node}
        edge_{edge.from_node}_{edge.to_node} = Arrow(
            start=[{from_node.position[0]}, {from_node.position[1] - 0.5}, 0],
            end=[{to_node.position[0]}, {to_node.position[1] + 0.5}, 0],
            color=BLACK,
            buff=0.1
        )
        edges["{edge.from_node}_{edge.to_node}"] = edge_{edge.from_node}_{edge.to_node}
        
'''
        if edge.label:
            code += f'''
        edge_label_{edge.from_node}_{edge.to_node} = Text("{edge.label}", font_size=16, color=BLACK)
        edge_label_{edge.from_node}_{edge.to_node}.next_to(edge_{edge.from_node}_{edge.to_node}, RIGHT, buff=0.1)
        edges["{edge.from_node}_{edge.to_node}_label"] = edge_label_{edge.from_node}_{edge.to_node}
        
'''
        return code
    
    def _generate_animation_sequence(self, flowchart, narration_segments) -> str:
        """Generate the animation sequence."""
        code = '''
        # Animation sequence
        all_nodes = list(nodes.values())
        all_edges = list(edges.values())
        
        # Show nodes one by one
        for i, node in enumerate(all_nodes):
            self.play(FadeIn(node), run_time=0.8)
            if i < len(all_edges):
                self.wait(0.3)
                # Show corresponding edge
                if i < len(all_edges):
                    self.play(Create(all_edges[i]), run_time=0.5)
        
        # Hold final state
        self.wait(2)
        
        # Fade out everything
        self.play(FadeOut(*self.mobjects), run_time=1)
'''
        return code
    
    async def _render_manim_video(self, script_path: Path, video_id: str) -> Path:
        """Render the Manim script to video."""
        output_dir = self.videos_dir
        
        # Manim command
        scene_name = f"FlowchartScene_{video_id.replace('-', '_')}"
        cmd = [
            "python", "-m", "manim",
            str(script_path),
            scene_name,
            "--media_dir", str(output_dir),
            "--quality", MANIM_CONFIG["quality"],
            "--format", MANIM_CONFIG["format"],
            "--verbosity", MANIM_CONFIG["verbosity"]
        ]
        
        if MANIM_CONFIG.get("disable_caching"):
            cmd.append("--disable_caching")
        
        # Run Manim process
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(self.temp_dir.parent)
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            raise Exception(f"Manim rendering failed: {stderr.decode()}")
        
        # Find the generated video file
        video_file = self._find_generated_video(output_dir, scene_name)
        if not video_file:
            raise Exception("Generated video file not found")
        
        # Move to final location with predictable name
        final_path = self.videos_dir / f"{video_id}.mp4"
        video_file.rename(final_path)
        
        return final_path
    
    def _find_generated_video(self, output_dir: Path, scene_name: str) -> Optional[Path]:
        """Find the generated video file in Manim's output structure."""
        # Manim typically outputs to videos/[script_name]/[quality]/[scene_name].mp4
        for root, dirs, files in os.walk(output_dir):
            for file in files:
                if file.endswith('.mp4') and scene_name in file:
                    return Path(root) / file
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
                "-c:a", "aac",   # Audio codec
                "-shortest",     # End when shortest stream ends
                str(output_path)
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0:
                return output_path
            else:
                print(f"FFmpeg error: {stderr.decode()}")
                return video_path  # Return original video if combination fails
                
        except Exception as e:
            print(f"Error combining video and audio: {e}")
            return video_path  # Return original video if combination fails
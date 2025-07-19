#!/usr/bin/env python3
"""
Generate a flowchart video with audio narration demonstrating the new feature.
"""
import asyncio
import sys
from pathlib import Path
from dataclasses import dataclass
from typing import List, Tuple

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent))

@dataclass
class FlowchartNode:
    """Represents a node in the flowchart."""
    id: str
    text: str
    node_type: str  # 'start', 'process', 'decision', 'end', 'data'
    position: Tuple[float, float] = (0, 0)

@dataclass
class FlowchartEdge:
    """Represents an edge between nodes."""
    from_node: str
    to_node: str
    label: str = ""
    edge_type: str = "normal"  # 'normal', 'yes', 'no'

@dataclass
class FlowchartStructure:
    """Complete flowchart structure."""
    nodes: List[FlowchartNode]
    edges: List[FlowchartEdge]
    title: str = ""

def create_coffee_flowchart() -> FlowchartStructure:
    """Create a coffee making flowchart."""
    nodes = [
        FlowchartNode(id="start", text="Start Making Coffee", node_type="start", position=(0, 3)),
        FlowchartNode(id="heat", text="Heat Water to 200°F", node_type="process", position=(0, 2)),
        FlowchartNode(id="grind", text="Grind Coffee Beans", node_type="process", position=(0, 1)),
        FlowchartNode(id="brew", text="Brew Coffee", node_type="process", position=(0, 0)),
        FlowchartNode(id="taste", text="Taste Good?", node_type="decision", position=(0, -1)),
        FlowchartNode(id="serve", text="Serve Hot", node_type="process", position=(-2, -2)),
        FlowchartNode(id="adjust", text="Adjust Recipe", node_type="process", position=(2, -2)),
        FlowchartNode(id="end", text="Enjoy Coffee", node_type="end", position=(0, -3))
    ]
    
    edges = [
        FlowchartEdge(from_node="start", to_node="heat"),
        FlowchartEdge(from_node="heat", to_node="grind"),
        FlowchartEdge(from_node="grind", to_node="brew"),
        FlowchartEdge(from_node="brew", to_node="taste"),
        FlowchartEdge(from_node="taste", to_node="serve", label="Yes", edge_type="yes"),
        FlowchartEdge(from_node="taste", to_node="adjust", label="No", edge_type="no"),
        FlowchartEdge(from_node="adjust", to_node="brew"),
        FlowchartEdge(from_node="serve", to_node="end")
    ]
    
    return FlowchartStructure(
        nodes=nodes,
        edges=edges,
        title="Perfect Coffee Making Process"
    )

async def generate_coffee_video_with_audio():
    """Generate a coffee making flowchart video with audio narration."""
    try:
        from services.manim_generator import ManimGenerator
        print("✅ ManimGenerator imported successfully")
    except ImportError as e:
        print(f"❌ ManimGenerator import error: {e}")
        return False
    
    print("🎬 Generating Coffee Making Flowchart Video with Audio...")
    print("=" * 60)
    
    # Create flowchart
    flowchart = create_coffee_flowchart()
    print(f"📋 Created flowchart with {len(flowchart.nodes)} nodes and {len(flowchart.edges)} edges")
    print(f"📝 Title: {flowchart.title}")
    
    # Initialize Manim generator
    manim_gen = ManimGenerator()
    
    try:
        # Generate video with audio
        print("🎵 Generating video with audio narration...")
        result = await manim_gen.generate_video_with_audio(
            flowchart, 
            video_id="coffee_making_with_audio",
            include_audio=True,
            voice_settings={
                'lang': 'en',  # For gTTS
                'tld': 'com',  # For gTTS
                'slow': False  # For gTTS
            }
        )
        
        if result.success:
            print("✅ Video generation completed successfully!")
            print(f"📹 Video file: {result.video_path}")
            if result.audio_path:
                print(f"🔊 Audio file: {result.audio_path}")
            print(f"🎵 Has audio: {result.has_audio}")
            print(f"⏱️  Generation time: {result.generation_time:.1f} seconds")
            
            # Copy to videos folder with a nice name
            from pathlib import Path
            import shutil
            video_path = Path(result.video_path)
            if video_path.exists():
                dest_path = Path("videos/coffee_making_with_audio_demo.mp4")
                shutil.copy2(video_path, dest_path)
                print(f"📁 Video also saved as: {dest_path}")
            
            return True
        else:
            print(f"❌ Video generation failed: {result.error_message}")
            return False
            
    except Exception as e:
        print(f"❌ Error during generation: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Main function."""
    print("🎬 Audio-Enabled Video Generation Demo")
    print("=" * 60)
    print("This script demonstrates generating flowchart videos with AI narration!")
    print()
    
    success = await generate_coffee_video_with_audio()
    
    print()
    print("=" * 60)
    if success:
        print("🎉 SUCCESS! Your coffee making flowchart video with audio is ready!")
        print("   Check the videos folder for the generated video.")
        print("   The video includes synchronized audio narration explaining each step.")
    else:
        print("⚠️  Generation failed. Check the error messages above.")

if __name__ == "__main__":
    asyncio.run(main())

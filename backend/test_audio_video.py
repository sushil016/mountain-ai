#!/usr/bin/env python3
"""
Test script for audio-enhanced flowchart video generation.
Demonstrates the new audio narration feature.
"""
import asyncio
import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent))

try:
    from services.audio_generator import AudioGenerator
    from services.prompt_parser import PromptParser  
    from services.manim_generator import ManimGenerator
    print("✅ All services imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

async def test_audio_generation():
    """Test the audio generation functionality."""
    print("🎵 Testing Audio Generation...")
    
    # Initialize audio generator
    audio_gen = AudioGenerator()
    
    # Create a sample flowchart structure for testing
    sample_flowchart = {
        'title': 'Simple Decision Process',
        'nodes': [
            {'id': 'start', 'text': 'Start Process', 'type': 'start', 'position': [0, 2]},
            {'id': 'check', 'text': 'Check Conditions', 'type': 'decision', 'position': [0, 0]},
            {'id': 'yes_action', 'text': 'Take Action A', 'type': 'process', 'position': [-2, -2]},
            {'id': 'no_action', 'text': 'Take Action B', 'type': 'process', 'position': [2, -2]},
            {'id': 'end', 'text': 'End Process', 'type': 'end', 'position': [0, -4]}
        ],
        'connections': [
            {'from': 'start', 'to': 'check', 'type': 'normal'},
            {'from': 'check', 'to': 'yes_action', 'type': 'yes', 'condition': 'Yes'},
            {'from': 'check', 'to': 'no_action', 'type': 'no', 'condition': 'No'},
            {'from': 'yes_action', 'to': 'end', 'type': 'normal'},
            {'from': 'no_action', 'to': 'end', 'type': 'normal'}
        ]
    }
    
    try:
        # Test script generation
        script = await audio_gen.generate_narration_script(sample_flowchart)
        print(f"📝 Generated script:\n{script}\n")
        
        # Test timed narration
        script, timing_segments = await audio_gen.create_timed_narration(
            sample_flowchart, 
            total_video_duration=15.0
        )
        print(f"⏱️  Generated {len(timing_segments)} timing segments")
        for i, segment in enumerate(timing_segments):
            print(f"  Segment {i+1}: {segment['start_time']:.1f}s - {segment['text'][:50]}...")
        
        # Test audio generation (using offline engine for reliability)
        print("\n🔊 Generating audio...")
        audio_file = await audio_gen.generate_audio(
            script, 
            engine='pyttsx3',  # Use offline engine
            voice_settings={'rate': 150, 'volume': 0.9}
        )
        
        duration = audio_gen.get_audio_duration(audio_file)
        print(f"✅ Audio generated: {audio_file}")
        print(f"📏 Duration: {duration:.1f} seconds")
        
        return True
        
    except Exception as e:
        print(f"❌ Audio generation failed: {e}")
        return False
    finally:
        # Cleanup
        audio_gen.cleanup()

async def test_prompt_to_video_with_audio():
    """Test complete pipeline from prompt to video with audio."""
    print("\n🎬 Testing Complete Pipeline with Audio...")
    
    # Sample natural language prompt
    prompt = "Create a flowchart for a simple online shopping process: start, browse products, add to cart, checkout, payment, and order confirmation"
    
    try:
        # Initialize services
        parser = PromptParser()
        manim_gen = ManimGenerator()
        
        print(f"📝 Input prompt: {prompt}")
        
        # Parse prompt
        print("🔍 Parsing prompt...")
        flowchart = parser.parse_prompt(prompt)
        print(f"✅ Parsed flowchart with {len(flowchart.nodes)} nodes and {len(flowchart.edges)} edges")
        
        # Generate video with audio
        print("🎬 Generating video with audio narration...")
        result = await manim_gen.generate_video_with_audio(
            flowchart,
            video_id="test_audio_video",
            include_audio=True,
            voice_settings={'rate': 160, 'volume': 0.8}
        )
        
        if result.success:
            print(f"✅ Video with audio generated successfully!")
            print(f"📹 Video: {result.video_path}")
            if result.audio_path:
                print(f"🔊 Audio: {result.audio_path}")
            print(f"⏱️  Generation time: {result.generation_time:.1f}s")
            print(f"🎵 Has audio: {result.has_audio}")
            return True
        else:
            print(f"❌ Video generation failed: {result.error_message}")
            return False
            
    except Exception as e:
        print(f"❌ Pipeline test failed: {e}")
        return False

async def main():
    """Main test function."""
    print("🚀 Testing Audio-Enhanced Flowchart Video Generation\n")
    
    # Test audio generation
    audio_success = await test_audio_generation()
    
    # Test complete pipeline
    pipeline_success = await test_prompt_to_video_with_audio()
    
    print(f"\n📊 Test Results:")
    print(f"   Audio Generation: {'✅ Passed' if audio_success else '❌ Failed'}")
    print(f"   Complete Pipeline: {'✅ Passed' if pipeline_success else '❌ Failed'}")
    
    if audio_success and pipeline_success:
        print("\n🎉 All tests passed! Audio-enhanced video generation is working.")
    else:
        print("\n⚠️  Some tests failed. Check the logs above for details.")

if __name__ == "__main__":
    asyncio.run(main())

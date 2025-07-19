#!/usr/bin/env python3
"""
Simple test of the video generation API using the working demo components.
"""
import asyncio
import json
from pathlib import Path
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import working components
from services.audio_generator import AudioGenerator
from complete_demo import generate_complete_video


async def test_api_functionality():
    """Test the core video generation functionality."""
    print("🔧 Testing Core API Functionality")
    print("=" * 50)
    
    # Test 1: Audio Generation
    print("\n📻 Test 1: Audio Generation")
    try:
        audio_gen = AudioGenerator()
        
        # Test simple narration
        script_segments = [
            (0, 3, "Welcome to our test flowchart."),
            (3, 6, "This demonstrates the API functionality."),
            (6, 9, "Thank you for watching!")
        ]
        
        result = audio_gen.generate_narration_audio(
            script_segments=script_segments,
            output_filename="api_test"
        )
        
        if result.success:
            print(f"✅ Audio generated: {result.audio_path}")
            print(f"📏 Duration: {result.duration:.1f}s, Size: {result.file_size_kb:.1f} KB")
        else:
            print(f"❌ Audio generation failed: {result.error}")
            
    except Exception as e:
        print(f"❌ Audio test failed: {e}")
    
    # Test 2: Complete Video Generation
    print("\n🎬 Test 2: Complete Video Generation")
    try:
        prompt = "Create a simple flowchart showing: Start -> Process Data -> Check Results -> End"
        
        print(f"📝 Prompt: {prompt}")
        
        # Use the working complete demo function
        result = await generate_complete_video(
            prompt=prompt,
            video_id="api_test_video"
        )
        
        if result.get("success"):
            print(f"✅ Complete video generated successfully!")
            print(f"📹 Video: {result.get('video_path')}")
            print(f"🔊 Audio: {result.get('audio_path')}")
            print(f"🎬 Final: {result.get('final_video_path')}")
        else:
            print(f"❌ Video generation failed: {result.get('error')}")
            
    except Exception as e:
        print(f"❌ Complete video test failed: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n🎉 API functionality test completed!")


if __name__ == "__main__":
    asyncio.run(test_api_functionality())

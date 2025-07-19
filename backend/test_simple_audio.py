#!/usr/bin/env python3
"""
Simple test for audio generation with a working prompt.
"""
import asyncio
import sys
from pathlib import Path

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent))

try:
    from services.audio_generator import AudioGenerator
    print("✅ AudioGenerator imported successfully")
except ImportError as e:
    print(f"❌ AudioGenerator import error: {e}")
    sys.exit(1)

async def test_simple_audio():
    """Test basic audio generation."""
    print("🎵 Testing Simple Audio Generation...")
    
    # Initialize audio generator
    audio_gen = AudioGenerator()
    print(f"📱 Available engines: {list(audio_gen.engines.keys())}")
    
    # Create a simple sample for narration
    sample_text = """
    Welcome to this flowchart explanation. 
    First, we start the process. 
    Then, we process the data. 
    Finally, we reach the end. 
    Thank you for watching this demonstration.
    """
    
    try:
        # Generate audio using offline engine for reliability
        print("🔊 Generating audio...")
        audio_file = await audio_gen.generate_audio(
            sample_text, 
            engine='pyttsx3',  # Use offline engine
            voice_settings={'rate': 150, 'volume': 0.9}
        )
        
        print(f"✅ Audio generated: {audio_file}")
        print(f"📏 File size: {audio_file.stat().st_size / 1024:.1f} KB")
        
        return True
        
    except Exception as e:
        print(f"❌ Audio generation failed: {e}")
        return False
    finally:
        # Cleanup
        audio_gen.cleanup()

async def test_narration_script():
    """Test narration script generation."""
    print("📝 Testing Narration Script Generation...")
    
    audio_gen = AudioGenerator()
    
    # Simple flowchart structure
    flowchart = {
        'title': 'Coffee Making Process',
        'nodes': [
            {'id': 'start', 'text': 'Start Making Coffee', 'type': 'start'},
            {'id': 'heat', 'text': 'Heat Water', 'type': 'process'},
            {'id': 'add', 'text': 'Add Coffee', 'type': 'process'},
            {'id': 'stir', 'text': 'Stir Well', 'type': 'process'},
            {'id': 'serve', 'text': 'Serve Hot', 'type': 'process'},
            {'id': 'end', 'text': 'Enjoy Coffee', 'type': 'end'}
        ],
        'connections': [
            {'from': 'start', 'to': 'heat'},
            {'from': 'heat', 'to': 'add'},
            {'from': 'add', 'to': 'stir'},
            {'from': 'stir', 'to': 'serve'},
            {'from': 'serve', 'to': 'end'}
        ]
    }
    
    try:
        # Generate narration script
        script = await audio_gen.generate_narration_script(flowchart)
        print(f"📄 Generated script:")
        print(script)
        
        # Generate timed narration
        timed_script, segments = await audio_gen.create_timed_narration(
            flowchart, 
            total_video_duration=20.0
        )
        
        print(f"\n⏱️  Generated {len(segments)} timed segments:")
        for i, segment in enumerate(segments):
            print(f"  {i+1}. {segment['start_time']:.1f}s: {segment['text'][:50]}...")
            
        return True
        
    except Exception as e:
        print(f"❌ Script generation failed: {e}")
        return False
    finally:
        audio_gen.cleanup()

async def main():
    """Main test function."""
    print("🎬 Starting Audio Generation Tests...")
    print("=" * 50)
    
    # Test basic audio generation
    audio_success = await test_simple_audio()
    
    print("\n" + "=" * 50)
    
    # Test narration script generation
    script_success = await test_narration_script()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"   Audio Generation: {'✅ Pass' if audio_success else '❌ Fail'}")
    print(f"   Script Generation: {'✅ Pass' if script_success else '❌ Fail'}")
    
    if audio_success and script_success:
        print("\n🎉 All audio tests passed! Your system is ready for audio-enabled video generation.")
    else:
        print("\n⚠️  Some tests failed. Check the error messages above.")

if __name__ == "__main__":
    asyncio.run(main())

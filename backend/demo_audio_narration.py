#!/usr/bin/env python3
"""
Simple demonstration of audio-enabled flowchart video generation.
This bypasses the module import issues and creates a direct demo.
"""
import asyncio
import sys
from pathlib import Path
from typing import Dict

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent))

async def create_audio_demo():
    """Create an audio demo for flowchart explanation."""
    
    try:
        from services.audio_generator import AudioGenerator
        print("✅ AudioGenerator imported successfully")
    except ImportError as e:
        print(f"❌ AudioGenerator import error: {e}")
        return False
    
    print("🎵 Creating Audio Demo for Flowchart Narration")
    print("=" * 50)
    
    # Initialize audio generator
    audio_gen = AudioGenerator()
    print(f"📱 Available TTS engines: {list(audio_gen.engines.keys())}")
    
    # Create a sample flowchart structure for audio generation
    sample_flowchart = {
        'title': 'Online Shopping Process',
        'nodes': [
            {'id': 'start', 'text': 'Start Shopping', 'type': 'start', 'position': [0, 3]},
            {'id': 'browse', 'text': 'Browse Products', 'type': 'process', 'position': [0, 2]},
            {'id': 'select', 'text': 'Select Items', 'type': 'process', 'position': [0, 1]},
            {'id': 'cart', 'text': 'Add to Cart', 'type': 'process', 'position': [0, 0]},
            {'id': 'check', 'text': 'Review Cart', 'type': 'decision', 'position': [0, -1]},
            {'id': 'checkout', 'text': 'Proceed to Checkout', 'type': 'process', 'position': [-2, -2]},
            {'id': 'continue', 'text': 'Continue Shopping', 'type': 'process', 'position': [2, -2]},
            {'id': 'payment', 'text': 'Make Payment', 'type': 'process', 'position': [-2, -3]},
            {'id': 'end', 'text': 'Order Complete', 'type': 'end', 'position': [-2, -4]}
        ],
        'connections': [
            {'from': 'start', 'to': 'browse', 'type': 'normal'},
            {'from': 'browse', 'to': 'select', 'type': 'normal'},
            {'from': 'select', 'to': 'cart', 'type': 'normal'},
            {'from': 'cart', 'to': 'check', 'type': 'normal'},
            {'from': 'check', 'to': 'checkout', 'type': 'yes', 'condition': 'Satisfied'},
            {'from': 'check', 'to': 'continue', 'type': 'no', 'condition': 'Need More'},
            {'from': 'continue', 'to': 'browse', 'type': 'normal'},
            {'from': 'checkout', 'to': 'payment', 'type': 'normal'},
            {'from': 'payment', 'to': 'end', 'type': 'normal'}
        ]
    }
    
    try:
        print("📝 Generating narration script...")
        # Generate narration script
        script = await audio_gen.generate_narration_script(sample_flowchart)
        print(f"📄 Generated Script ({len(script)} characters):")
        print("-" * 30)
        print(script)
        print("-" * 30)
        
        print("\n⏱️  Creating timed narration segments...")
        # Generate timed narration for 20-second video
        timed_script, segments = await audio_gen.create_timed_narration(
            sample_flowchart, 
            total_video_duration=20.0
        )
        
        print(f"🎬 Generated {len(segments)} timed segments:")
        for i, segment in enumerate(segments, 1):
            print(f"  {i}. {segment['start_time']:.1f}s-{segment['start_time']+segment['duration']:.1f}s: {segment['text'][:60]}...")
        
        print("\n🔊 Generating audio file...")
        # Generate audio using Google TTS
        audio_file = await audio_gen.generate_audio(
            timed_script, 
            engine='gtts',
            voice_settings={
                'lang': 'en',
                'tld': 'com',
                'slow': False
            }
        )
        
        print(f"✅ Audio generated successfully!")
        print(f"📁 Audio file: {audio_file}")
        print(f"📏 File size: {audio_file.stat().st_size / 1024:.1f} KB")
        
        # Get audio duration
        duration = audio_gen.get_audio_duration(audio_file)
        print(f"⏱️  Audio duration: {duration:.1f} seconds")
        
        # Copy audio to videos folder with descriptive name
        import shutil
        dest_audio = Path("videos/online_shopping_narration_demo.wav")
        shutil.copy2(audio_file, dest_audio)
        print(f"📁 Audio also saved as: {dest_audio}")
        
        print("\n🎉 Audio demo completed successfully!")
        print("   The generated audio provides a natural language explanation")
        print("   of the flowchart that would be synchronized with the video.")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during audio generation: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        # Cleanup temporary files
        audio_gen.cleanup()

async def test_api_integration():
    """Test if the audio feature works with the API."""
    print("\n🌐 Testing API Integration...")
    print("=" * 50)
    
    import requests
    
    try:
        # Test if server is running
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ FastAPI server is running")
            
            # Test audio-enabled video generation
            payload = {
                "prompt": "Create a flowchart for making tea: start -> boil water -> add tea -> steep -> serve -> end",
                "include_audio": True,
                "voice_settings": {
                    "lang": "en",
                    "tld": "com"
                }
            }
            
            print("📡 Testing audio-enabled video generation endpoint...")
            response = requests.post(
                "http://localhost:8000/api/generate-video",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ API request successful: {result}")
                return True
            else:
                print(f"❌ API request failed: {response.status_code} - {response.text}")
                return False
        else:
            print("❌ Server not responding properly")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"⚠️  Server not running or not accessible: {e}")
        print("   You can start the server with: python main.py")
        return False

async def main():
    """Main demonstration function."""
    print("🎬 Audio-Enabled Flowchart Generation Demo")
    print("=" * 60)
    print("This demo shows the new audio narration feature!")
    print()
    
    # Test audio generation
    audio_success = await create_audio_demo()
    
    # Test API integration
    api_success = await test_api_integration()
    
    print("\n" + "=" * 60)
    print("📊 Demo Results:")
    print(f"   Audio Generation: {'✅ Success' if audio_success else '❌ Failed'}")
    print(f"   API Integration: {'✅ Success' if api_success else '⚠️  Server not running'}")
    
    if audio_success:
        print("\n🎉 SUCCESS! Audio narration is working perfectly!")
        print("   Your flowchart videos can now include:")
        print("   • Natural language explanations")
        print("   • Synchronized timing with animations")
        print("   • Multiple TTS engine options")
        print("   • Customizable voice settings")
        print()
        print("   Next steps:")
        print("   1. Start the server: python main.py")
        print("   2. Send requests with 'include_audio': true")
        print("   3. Enjoy videos with professional narration!")
    else:
        print("\n⚠️  Some issues encountered. Check the errors above.")

if __name__ == "__main__":
    asyncio.run(main())

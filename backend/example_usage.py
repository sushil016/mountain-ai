"""
Example usage of the Flowchart Video Generator API.
This script demonstrates how to use the API to generate videos.
"""
import requests
import time
import json
from typing import Dict, Any


class FlowchartVideoClient:
    """Client for interacting with the Flowchart Video Generator API."""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
    
    def health_check(self) -> Dict[str, Any]:
        """Check API health status."""
        response = self.session.get(f"{self.base_url}/health")
        response.raise_for_status()
        return response.json()
    
    def generate_video(self, prompt: str, quality: str = "medium_quality") -> Dict[str, Any]:
        """Start video generation from prompt."""
        payload = {
            "prompt": prompt,
            "quality": quality,
            "format": "mp4"
        }
        
        response = self.session.post(f"{self.base_url}/api/generate-video", json=payload)
        response.raise_for_status()
        return response.json()
    
    def get_video_status(self, video_id: str) -> Dict[str, Any]:
        """Get video generation status."""
        response = self.session.get(f"{self.base_url}/api/video-status/{video_id}")
        response.raise_for_status()
        return response.json()
    
    def download_video(self, video_id: str, output_path: str = None) -> str:
        """Download generated video."""
        if output_path is None:
            output_path = f"flowchart_{video_id}.mp4"
        
        response = self.session.get(f"{self.base_url}/api/videos/{video_id}")
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        return output_path
    
    def wait_for_completion(self, video_id: str, timeout: int = 300, poll_interval: int = 5) -> Dict[str, Any]:
        """Wait for video generation to complete."""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            status = self.get_video_status(video_id)
            
            if status["status"] == "completed":
                return status
            elif status["status"] == "failed":
                raise Exception(f"Video generation failed for {video_id}")
            
            print(f"Status: {status['status']} - waiting...")
            time.sleep(poll_interval)
        
        raise TimeoutError(f"Video generation timed out after {timeout} seconds")


def example_simple_flowchart():
    """Example: Generate a simple process flowchart."""
    print("🎬 Example 1: Simple Process Flowchart")
    print("=" * 50)
    
    client = FlowchartVideoClient()
    
    # Check API health
    health = client.health_check()
    print(f"API Status: {health['status']}")
    
    # Define prompt
    prompt = "Start -> Validate user input -> Process data -> Save to database -> Send confirmation email -> End"
    
    print(f"Prompt: {prompt}")
    
    # Generate video
    result = client.generate_video(prompt, quality="low_quality")
    video_id = result["video_id"]
    
    print(f"Video ID: {video_id}")
    print(f"Estimated time: {result['complexity_analysis']['estimated_time_seconds']} seconds")
    
    # Wait for completion
    try:
        final_status = client.wait_for_completion(video_id)
        print(f"✅ Video completed! Size: {final_status['file_size_mb']:.2f} MB")
        
        # Download video
        output_path = client.download_video(video_id, "simple_flowchart.mp4")
        print(f"📥 Downloaded to: {output_path}")
        
    except Exception as e:
        print(f"❌ Error: {e}")


def example_decision_flowchart():
    """Example: Generate a decision-based flowchart."""
    print("\n🎬 Example 2: Decision-Based Flowchart")
    print("=" * 50)
    
    client = FlowchartVideoClient()
    
    prompt = """
    User authentication process:
    Start -> Check if user exists in database -> 
    If user exists, verify password -> 
    If password correct, grant access to dashboard ->
    If password incorrect, show error message ->
    If user doesn't exist, redirect to registration ->
    End process
    """
    
    print(f"Prompt: {prompt.strip()}")
    
    try:
        result = client.generate_video(prompt, quality="medium_quality")
        video_id = result["video_id"]
        
        print(f"Video ID: {video_id}")
        print(f"Complexity: {result['complexity_analysis']['complexity']}")
        print(f"Decision points: {result['complexity_analysis']['decision_points']}")
        
        # Wait for completion
        final_status = client.wait_for_completion(video_id)
        print(f"✅ Video completed! Duration: {final_status['duration']:.1f} seconds")
        
        # Download video
        output_path = client.download_video(video_id, "decision_flowchart.mp4")
        print(f"📥 Downloaded to: {output_path}")
        
    except Exception as e:
        print(f"❌ Error: {e}")


def example_business_process():
    """Example: Generate a complex business process flowchart."""
    print("\n🎬 Example 3: Complex Business Process")
    print("=" * 50)
    
    client = FlowchartVideoClient()
    
    prompt = """
    E-commerce order processing workflow:
    1. Customer places order on website
    2. System validates order details and inventory
    3. If inventory available, proceed to payment processing
    4. If payment successful, generate order confirmation
    5. Send order to fulfillment center
    6. Pick and pack items
    7. Generate shipping label
    8. Ship order and send tracking info to customer
    9. If payment fails, notify customer and hold order
    10. If inventory insufficient, backorder items and notify customer
    11. Update order status in system
    12. End process
    """
    
    print(f"Prompt: {prompt.strip()}")
    
    try:
        result = client.generate_video(prompt, quality="high_quality")
        video_id = result["video_id"]
        
        complexity = result["complexity_analysis"]
        print(f"Video ID: {video_id}")
        print(f"Complexity: {complexity['complexity']}")
        print(f"Word count: {complexity['word_count']}")
        print(f"Process steps: {complexity['process_steps']}")
        print(f"Estimated time: {complexity['estimated_time_seconds']} seconds")
        
        # Wait for completion with longer timeout for complex video
        final_status = client.wait_for_completion(video_id, timeout=600)
        print(f"✅ Video completed!")
        print(f"   File size: {final_status['file_size_mb']:.2f} MB")
        print(f"   Duration: {final_status['duration']:.1f} seconds")
        
        # Download video
        output_path = client.download_video(video_id, "business_process.mp4")
        print(f"📥 Downloaded to: {output_path}")
        
    except Exception as e:
        print(f"❌ Error: {e}")


def example_batch_generation():
    """Example: Generate multiple videos in batch."""
    print("\n🎬 Example 4: Batch Video Generation")
    print("=" * 50)
    
    client = FlowchartVideoClient()
    
    prompts = [
        "Software deployment: Start -> Build code -> Run tests -> If tests pass, deploy -> If tests fail, fix issues -> End",
        "Customer support: Receive ticket -> Categorize issue -> Assign to team -> Resolve issue -> Follow up -> Close ticket",
        "Data backup: Start -> Check data integrity -> Create backup -> Verify backup -> Store in cloud -> Send report -> End"
    ]
    
    video_ids = []
    
    # Start all generations
    for i, prompt in enumerate(prompts, 1):
        print(f"\n📝 Starting generation {i}: {prompt[:50]}...")
        result = client.generate_video(prompt, quality="low_quality")
        video_ids.append(result["video_id"])
        print(f"   Video ID: {result['video_id']}")
    
    # Wait for all to complete
    print(f"\n⏳ Waiting for {len(video_ids)} videos to complete...")
    
    for i, video_id in enumerate(video_ids, 1):
        try:
            final_status = client.wait_for_completion(video_id, timeout=180)
            output_path = client.download_video(video_id, f"batch_video_{i}.mp4")
            print(f"✅ Video {i} completed: {output_path}")
        except Exception as e:
            print(f"❌ Video {i} failed: {e}")


def example_api_stats():
    """Example: Get API statistics."""
    print("\n📊 API Statistics")
    print("=" * 50)
    
    client = FlowchartVideoClient()
    
    try:
        response = client.session.get(f"{client.base_url}/api/stats")
        response.raise_for_status()
        stats = response.json()
        
        data = stats["data"]
        print(f"Video count: {data.get('video_count', 0)}")
        print(f"Total video size: {data.get('total_video_size_mb', 0):.2f} MB")
        print(f"Disk free: {data.get('disk_free_gb', 0):.2f} GB")
        
        if "current_generations" in data:
            print(f"Current generations: {data['current_generations']}")
        
        if "dependencies" in data:
            deps = data["dependencies"]
            print(f"Dependencies: Manim={deps.get('manim', False)}, FFmpeg={deps.get('ffmpeg', False)}")
        
    except Exception as e:
        print(f"❌ Error getting stats: {e}")


def main():
    """Run all examples."""
    print("🚀 Flowchart Video Generator - API Examples")
    print("=" * 60)
    
    try:
        # Run examples
        example_simple_flowchart()
        example_decision_flowchart()
        example_business_process()
        example_batch_generation()
        example_api_stats()
        
        print("\n🎉 All examples completed successfully!")
        print("\nGenerated videos:")
        print("  - simple_flowchart.mp4")
        print("  - decision_flowchart.mp4")
        print("  - business_process.mp4")
        print("  - batch_video_1.mp4")
        print("  - batch_video_2.mp4")
        print("  - batch_video_3.mp4")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API server.")
        print("   Make sure the server is running on http://localhost:8000")
        print("   Start it with: python run.py")
    
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    main()
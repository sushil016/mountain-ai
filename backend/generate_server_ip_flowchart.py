"""
Simple Server IP Flowchart Generator using Manim
Creates an animated flowchart explaining server IP concepts
"""
from manim import *
import uuid

class ServerIPFlowchart(Scene):
    def construct(self):
        # Set background color
        self.camera.background_color = "#1e1e1e"
        
        # Title
        title = Text("Server IP Address Concepts", font_size=48, color=WHITE)
        title.to_edge(UP, buff=0.8)
        
        # Create nodes with server IP concepts
        # Start node
        start_shape = Circle(radius=0.8, color=GREEN, fill_opacity=0.3)
        start_text = Text("Start", font_size=24, color=GREEN)
        start_node = VGroup(start_shape, start_text).move_to([-4, 2, 0])
        
        # What is IP node
        ip_shape = Rectangle(width=3, height=1.2, color=BLUE, fill_opacity=0.3)
        ip_text = Text("What is an IP Address?", font_size=20, color=BLUE)
        ip_node = VGroup(ip_shape, ip_text).move_to([-1, 2, 0])
        
        # Types decision node
        types_shape = Polygon([0, 0.8, 0], [1.2, 0, 0], [0, -0.8, 0], [-1.2, 0, 0], 
                             color=YELLOW, fill_opacity=0.3)
        types_text = Text("Types of IP?", font_size=18, color=YELLOW)
        types_node = VGroup(types_shape, types_text).move_to([2, 2, 0])
        
        # Public IP node
        public_shape = Rectangle(width=2.5, height=1, color=RED, fill_opacity=0.3)
        public_text = Text("Public IP", font_size=20, color=RED)
        public_detail = Text("Visible on Internet", font_size=14, color=RED)
        public_node = VGroup(public_shape, public_text, public_detail.shift(DOWN*0.3)).move_to([5, 3, 0])
        
        # Private IP node
        private_shape = Rectangle(width=2.5, height=1, color=PURPLE, fill_opacity=0.3)
        private_text = Text("Private IP", font_size=20, color=PURPLE)
        private_detail = Text("Internal Network", font_size=14, color=PURPLE)
        private_node = VGroup(private_shape, private_text, private_detail.shift(DOWN*0.3)).move_to([5, 1, 0])
        
        # Server setup node
        server_shape = Rectangle(width=3, height=1.2, color=ORANGE, fill_opacity=0.3)
        server_text = Text("Server Configuration", font_size=18, color=ORANGE)
        server_node = VGroup(server_shape, server_text).move_to([2, -0.5, 0])
        
        # DNS decision
        dns_shape = Polygon([0, 0.8, 0], [1.2, 0, 0], [0, -0.8, 0], [-1.2, 0, 0], 
                           color=YELLOW, fill_opacity=0.3)
        dns_text = Text("Need DNS?", font_size=18, color=YELLOW)
        dns_node = VGroup(dns_shape, dns_text).move_to([-1, -0.5, 0])
        
        # Domain setup
        domain_shape = Rectangle(width=2.5, height=1, color=TEAL, fill_opacity=0.3)
        domain_text = Text("Setup Domain", font_size=18, color=TEAL)
        domain_detail = Text("example.com", font_size=14, color=TEAL)
        domain_node = VGroup(domain_shape, domain_text, domain_detail.shift(DOWN*0.3)).move_to([-4, -2, 0])
        
        # Direct IP
        direct_shape = Rectangle(width=2.5, height=1, color=PINK, fill_opacity=0.3)
        direct_text = Text("Use Direct IP", font_size=18, color=PINK)
        direct_detail = Text("192.168.1.100", font_size=14, color=PINK)
        direct_node = VGroup(direct_shape, direct_text, direct_detail.shift(DOWN*0.3)).move_to([2, -2, 0])
        
        # End node
        end_shape = Circle(radius=0.8, color=RED, fill_opacity=0.3)
        end_text = Text("Server Ready", font_size=20, color=RED)
        end_node = VGroup(end_shape, end_text).move_to([-1, -3, 0])
        
        # Create arrows
        arrow1 = Arrow(start_node.get_right(), ip_node.get_left(), color=WHITE, stroke_width=3)
        arrow2 = Arrow(ip_node.get_right(), types_node.get_left(), color=WHITE, stroke_width=3)
        arrow3 = Arrow(types_node.get_top(), public_node.get_left(), color=GREEN, stroke_width=3)
        arrow4 = Arrow(types_node.get_bottom(), private_node.get_left(), color=PURPLE, stroke_width=3)
        arrow5 = Arrow(public_node.get_bottom(), server_node.get_top(), color=WHITE, stroke_width=3)
        arrow6 = Arrow(private_node.get_bottom(), server_node.get_top(), color=WHITE, stroke_width=3)
        arrow7 = Arrow(server_node.get_left(), dns_node.get_right(), color=WHITE, stroke_width=3)
        arrow8 = Arrow(dns_node.get_bottom(), domain_node.get_top(), color=GREEN, stroke_width=3)
        arrow9 = Arrow(dns_node.get_bottom(), direct_node.get_top(), color=RED, stroke_width=3)
        arrow10 = Arrow(domain_node.get_right(), end_node.get_left(), color=WHITE, stroke_width=3)
        arrow11 = Arrow(direct_node.get_bottom(), end_node.get_right(), color=WHITE, stroke_width=3)
        
        # Labels for decision arrows
        yes_label1 = Text("Public", font_size=12, color=GREEN).next_to(arrow3, UP)
        yes_label2 = Text("Private", font_size=12, color=PURPLE).next_to(arrow4, DOWN)
        yes_label3 = Text("Yes", font_size=12, color=GREEN).next_to(arrow8, LEFT)
        no_label = Text("No", font_size=12, color=RED).next_to(arrow9, RIGHT)
        
        # Animation sequence
        self.play(Write(title), run_time=2)
        self.wait(1)
        
        # Show start node with entrance animation
        self.play(
            FadeIn(start_node, scale=0.5),
            run_time=1.5
        )
        self.wait(0.5)
        
        # Show IP explanation
        self.play(
            Create(arrow1),
            FadeIn(ip_node),
            run_time=1.5
        )
        self.wait(1)
        
        # Show types decision
        self.play(
            Create(arrow2),
            FadeIn(types_node),
            run_time=1.5
        )
        self.wait(1)
        
        # Show IP types
        self.play(
            Create(arrow3),
            Create(arrow4),
            FadeIn(public_node),
            FadeIn(private_node),
            FadeIn(yes_label1),
            FadeIn(yes_label2),
            run_time=2
        )
        self.wait(1)
        
        # Show server configuration
        self.play(
            Create(arrow5),
            Create(arrow6),
            FadeIn(server_node),
            run_time=1.5
        )
        self.wait(1)
        
        # Show DNS decision
        self.play(
            Create(arrow7),
            FadeIn(dns_node),
            run_time=1.5
        )
        self.wait(1)
        
        # Show final options
        self.play(
            Create(arrow8),
            Create(arrow9),
            FadeIn(domain_node),
            FadeIn(direct_node),
            FadeIn(yes_label3),
            FadeIn(no_label),
            run_time=2
        )
        self.wait(1)
        
        # Show end
        self.play(
            Create(arrow10),
            Create(arrow11),
            FadeIn(end_node),
            run_time=1.5
        )
        self.wait(1)
        
        # Create a flowing dot animation
        flowing_dot = Dot(color=YELLOW, radius=0.15)
        flowing_dot.move_to(start_node.get_center())
        self.add(flowing_dot)
        
        # Animate the flow through the main path (public IP -> domain)
        self.play(
            flowing_dot.animate.move_to(ip_node.get_center()),
            start_node.animate.set_color(YELLOW),
            run_time=1
        )
        self.play(start_node.animate.set_color(GREEN), run_time=0.3)
        
        self.play(
            flowing_dot.animate.move_to(types_node.get_center()),
            ip_node.animate.set_color(YELLOW),
            run_time=1
        )
        self.play(ip_node.animate.set_color(BLUE), run_time=0.3)
        
        self.play(
            flowing_dot.animate.move_to(public_node.get_center()),
            types_node.animate.set_color(YELLOW),
            run_time=1
        )
        self.play(types_node.animate.set_color(YELLOW), run_time=0.3)
        
        self.play(
            flowing_dot.animate.move_to(server_node.get_center()),
            public_node.animate.set_color(YELLOW),
            run_time=1
        )
        self.play(public_node.animate.set_color(RED), run_time=0.3)
        
        self.play(
            flowing_dot.animate.move_to(dns_node.get_center()),
            server_node.animate.set_color(YELLOW),
            run_time=1
        )
        self.play(server_node.animate.set_color(ORANGE), run_time=0.3)
        
        self.play(
            flowing_dot.animate.move_to(domain_node.get_center()),
            dns_node.animate.set_color(YELLOW),
            run_time=1
        )
        self.play(dns_node.animate.set_color(YELLOW), run_time=0.3)
        
        self.play(
            flowing_dot.animate.move_to(end_node.get_center()),
            domain_node.animate.set_color(YELLOW),
            run_time=1
        )
        self.play(domain_node.animate.set_color(TEAL), run_time=0.3)
        
        # Final highlight
        self.play(
            end_node.animate.set_color(YELLOW),
            run_time=1
        )
        self.play(FadeOut(flowing_dot), run_time=0.5)
        
        # Hold the final result
        self.wait(2)
        
        # Fade out everything
        all_objects = VGroup(
            title, start_node, ip_node, types_node, public_node, private_node,
            server_node, dns_node, domain_node, direct_node, end_node,
            arrow1, arrow2, arrow3, arrow4, arrow5, arrow6, arrow7, arrow8, arrow9, arrow10, arrow11,
            yes_label1, yes_label2, yes_label3, no_label
        )
        
        self.play(FadeOut(all_objects), run_time=2)


def generate_server_ip_video():
    """Generate the server IP flowchart video and save it to videos folder"""
    import os
    
    # Ensure videos directory exists
    videos_dir = "videos"
    os.makedirs(videos_dir, exist_ok=True)
    
    # Generate unique filename
    video_id = str(uuid.uuid4())
    
    # Configure Manim to output to our videos directory
    config.media_dir = videos_dir
    config.video_dir = videos_dir
    config.disable_caching = True
    config.quality = "medium_quality"
    config.format = "mp4"
    
    # Create and render the scene
    scene = ServerIPFlowchart()
    scene.render()
    
    # Find the generated video file and rename it
    import glob
    
    # Look for the most recently created mp4 file in videos directory
    mp4_files = glob.glob(os.path.join(videos_dir, "**/*.mp4"), recursive=True)
    if mp4_files:
        latest_file = max(mp4_files, key=os.path.getctime)
        new_filename = f"server_ip_flowchart_{video_id}.mp4"
        new_path = os.path.join(videos_dir, new_filename)
        
        # Copy the file to our desired location
        import shutil
        shutil.copy2(latest_file, new_path)
        
        print(f"✅ Video saved to: {new_path}")
        print(f"📁 Video size: {os.path.getsize(new_path) / (1024*1024):.2f} MB")
        return new_path
    else:
        print("❌ No video file was generated")
        return None


if __name__ == "__main__":
    print("🎬 Generating Server IP Flowchart Video...")
    video_path = generate_server_ip_video()
    if video_path:
        print(f"🎉 Success! Video saved at: {video_path}")
    else:
        print("💥 Failed to generate video")

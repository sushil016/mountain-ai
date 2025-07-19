"""
Generated Manim scene for Customer Support Demo
"""
from manim import *

class CustomerSupportDemo_customer_support_demo_72b7c32b(Scene):
    def construct(self):
        # Scene configuration
        self.camera.background_color = WHITE
        
        # Title
        title = Text("Customer Support Ticket Process", font_size=32, color=BLACK)
        title.to_edge(UP, buff=0.5)
        
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        
        # Create nodes
        nodes = {}
        
        # Start node
        start_circle = Circle(radius=0.6, color=GREEN, fill_opacity=0.3)
        start_text = Text("Ticket\nReceived", font_size=16, color=BLACK)
        start_group = VGroup(start_circle, start_text)
        start_group.move_to([0, 2.5, 0])
        nodes["start"] = start_group
        
        # Process nodes
        categorize_rect = Rectangle(width=1.8, height=0.8, color=BLUE, fill_opacity=0.3)
        categorize_text = Text("Categorize\nIssue", font_size=14, color=BLACK)
        categorize_group = VGroup(categorize_rect, categorize_text)
        categorize_group.move_to([0, 1.5, 0])
        nodes["categorize"] = categorize_group
        
        # Decision node
        urgent_diamond = Polygon(
            [-0.8, 0.4, 0], [0.8, 0.4, 0], [1.0, 0, 0], [0.8, -0.4, 0], 
            [-0.8, -0.4, 0], [-1.0, 0, 0], color=YELLOW, fill_opacity=0.3
        )
        urgent_text = Text("Is Urgent?", font_size=12, color=BLACK)
        urgent_group = VGroup(urgent_diamond, urgent_text)
        urgent_group.move_to([0, 0.5, 0])
        nodes["urgent"] = urgent_group
        
        # Escalate path
        escalate_rect = Rectangle(width=1.8, height=0.8, color=RED, fill_opacity=0.3)
        escalate_text = Text("Escalate to\nManager", font_size=12, color=BLACK)
        escalate_group = VGroup(escalate_rect, escalate_text)
        escalate_group.move_to([-2.5, -0.5, 0])
        nodes["escalate"] = escalate_group
        
        # Assign path
        assign_rect = Rectangle(width=1.8, height=0.8, color=BLUE, fill_opacity=0.3)
        assign_text = Text("Assign to\nAgent", font_size=12, color=BLACK)
        assign_group = VGroup(assign_rect, assign_text)
        assign_group.move_to([2.5, -0.5, 0])
        nodes["assign"] = assign_group
        
        # Resolve node
        resolve_rect = Rectangle(width=1.8, height=0.8, color=BLUE, fill_opacity=0.3)
        resolve_text = Text("Resolve\nIssue", font_size=14, color=BLACK)
        resolve_group = VGroup(resolve_rect, resolve_text)
        resolve_group.move_to([0, -1.5, 0])
        nodes["resolve"] = resolve_group
        
        # Follow up node
        followup_rect = Rectangle(width=1.8, height=0.8, color=BLUE, fill_opacity=0.3)
        followup_text = Text("Follow Up", font_size=14, color=BLACK)
        followup_group = VGroup(followup_rect, followup_text)
        followup_group.move_to([0, -2.5, 0])
        nodes["followup"] = followup_group
        
        # End node
        end_circle = Circle(radius=0.6, color=RED, fill_opacity=0.3)
        end_text = Text("Close\nTicket", font_size=16, color=BLACK)
        end_group = VGroup(end_circle, end_text)
        end_group.move_to([0, -3.5, 0])
        nodes["end"] = end_group
        
        # Create arrows
        arrow1 = Arrow(start=[0, 1.9, 0], end=[0, 1.3, 0], color=BLACK, buff=0.1)
        arrow2 = Arrow(start=[0, 0.9, 0], end=[0, 0.9, 0], color=BLACK, buff=0.1)
        arrow3 = Arrow(start=[-0.5, 0.2, 0], end=[-2.0, -0.2, 0], color=BLACK, buff=0.1)
        arrow4 = Arrow(start=[0.5, 0.2, 0], end=[2.0, -0.2, 0], color=BLACK, buff=0.1)
        arrow5 = Arrow(start=[-2.5, -0.9, 0], end=[-0.5, -1.2, 0], color=BLACK, buff=0.1)
        arrow6 = Arrow(start=[2.5, -0.9, 0], end=[0.5, -1.2, 0], color=BLACK, buff=0.1)
        arrow7 = Arrow(start=[0, -1.9, 0], end=[0, -2.1, 0], color=BLACK, buff=0.1)
        arrow8 = Arrow(start=[0, -2.9, 0], end=[0, -3.1, 0], color=BLACK, buff=0.1)
        
        # Labels
        yes_label = Text("Yes", font_size=12, color=RED).next_to(arrow3, UP, buff=0.1)
        no_label = Text("No", font_size=12, color=GREEN).next_to(arrow4, UP, buff=0.1)
        
        # Animation sequence
        self.play(FadeIn(nodes["start"]), run_time=1)
        self.wait(0.5)
        
        self.play(Create(arrow1), run_time=0.5)
        self.play(FadeIn(nodes["categorize"]), run_time=1)
        self.wait(0.5)
        
        self.play(Create(arrow2), run_time=0.5)
        self.play(FadeIn(nodes["urgent"]), run_time=1)
        self.wait(0.5)
        
        self.play(Create(arrow3), Create(arrow4), run_time=0.8)
        self.play(Write(yes_label), Write(no_label), run_time=0.5)
        self.play(FadeIn(nodes["escalate"]), FadeIn(nodes["assign"]), run_time=1)
        self.wait(1)
        
        self.play(Create(arrow5), Create(arrow6), run_time=0.8)
        self.play(FadeIn(nodes["resolve"]), run_time=1)
        self.wait(0.5)
        
        self.play(Create(arrow7), run_time=0.5)
        self.play(FadeIn(nodes["followup"]), run_time=1)
        self.wait(0.5)
        
        self.play(Create(arrow8), run_time=0.5)
        self.play(FadeIn(nodes["end"]), run_time=1)
        
        # Hold final state
        self.wait(3)
        
        # Fade out
        self.play(FadeOut(*self.mobjects), run_time=1.5)

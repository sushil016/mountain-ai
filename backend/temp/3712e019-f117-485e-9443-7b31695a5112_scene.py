"""
Generated Manim scene: 3712e019-f117-485e-9443-7b31695a5112
Flowchart: Simple Workflow: Start -> Input Data -> Process ->
Generated with audio synchronization
"""

from manim import *
import numpy as np

class FlowchartScene_3712e019_f117_485e_9443_7b31695a5112(Scene):
    def construct(self):
        # Scene configuration
        self.camera.background_color = WHITE
        
        # Title
        title = Text("Simple Workflow: Start -> Input Data -> Process ->", font_size=36, color=BLACK)
        title.to_edge(UP, buff=0.5)
        
        # Show title
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        
        # Create all flowchart elements
        nodes = {}
        edges = {}
        

        # Node: node_0
        node_0_text = Text("Simple workflow: start", font_size=20, color=BLACK)
        node_0_text.move_to([0.0, 0.0, 0])
        
        if "Circle" == "Circle":
            node_0_shape = Circle(radius=0.8, color=GREEN, fill_opacity=0.3)
        elif "Circle" == "Polygon":
            node_0_shape = Polygon(
                [-0.8, 0.5, 0], [0.8, 0.5, 0], [1.0, 0, 0], [0.8, -0.5, 0], 
                [-0.8, -0.5, 0], [-1.0, 0, 0], color=GREEN, fill_opacity=0.3
            )
        else:
            node_0_shape = Rectangle(width=2.0, height=1.0, color=GREEN, fill_opacity=0.3)
        
        node_0_shape.move_to([0.0, 0.0, 0])
        nodes["node_0"] = VGroup(node_0_shape, node_0_text)
        

        # Node: node_1
        node_1_text = Text("Input data", font_size=20, color=BLACK)
        node_1_text.move_to([2.0, 0.0, 0])
        
        if "Rectangle" == "Circle":
            node_1_shape = Circle(radius=0.8, color=BLUE, fill_opacity=0.3)
        elif "Rectangle" == "Polygon":
            node_1_shape = Polygon(
                [-0.8, 0.5, 0], [0.8, 0.5, 0], [1.0, 0, 0], [0.8, -0.5, 0], 
                [-0.8, -0.5, 0], [-1.0, 0, 0], color=BLUE, fill_opacity=0.3
            )
        else:
            node_1_shape = Rectangle(width=2.0, height=1.0, color=BLUE, fill_opacity=0.3)
        
        node_1_shape.move_to([2.0, 0.0, 0])
        nodes["node_1"] = VGroup(node_1_shape, node_1_text)
        

        # Node: node_2
        node_2_text = Text("Process", font_size=20, color=BLACK)
        node_2_text.move_to([4.0, 0.0, 0])
        
        if "Rectangle" == "Circle":
            node_2_shape = Circle(radius=0.8, color=BLUE, fill_opacity=0.3)
        elif "Rectangle" == "Polygon":
            node_2_shape = Polygon(
                [-0.8, 0.5, 0], [0.8, 0.5, 0], [1.0, 0, 0], [0.8, -0.5, 0], 
                [-0.8, -0.5, 0], [-1.0, 0, 0], color=BLUE, fill_opacity=0.3
            )
        else:
            node_2_shape = Rectangle(width=2.0, height=1.0, color=BLUE, fill_opacity=0.3)
        
        node_2_shape.move_to([4.0, 0.0, 0])
        nodes["node_2"] = VGroup(node_2_shape, node_2_text)
        

        # Node: node_3
        node_3_text = Text("Output result", font_size=20, color=BLACK)
        node_3_text.move_to([6.0, 0.0, 0])
        
        if "Rectangle" == "Circle":
            node_3_shape = Circle(radius=0.8, color=BLUE, fill_opacity=0.3)
        elif "Rectangle" == "Polygon":
            node_3_shape = Polygon(
                [-0.8, 0.5, 0], [0.8, 0.5, 0], [1.0, 0, 0], [0.8, -0.5, 0], 
                [-0.8, -0.5, 0], [-1.0, 0, 0], color=BLUE, fill_opacity=0.3
            )
        else:
            node_3_shape = Rectangle(width=2.0, height=1.0, color=BLUE, fill_opacity=0.3)
        
        node_3_shape.move_to([6.0, 0.0, 0])
        nodes["node_3"] = VGroup(node_3_shape, node_3_text)
        

        # Node: node_4
        node_4_text = Text("End", font_size=20, color=BLACK)
        node_4_text.move_to([8.0, 0.0, 0])
        
        if "Circle" == "Circle":
            node_4_shape = Circle(radius=0.8, color=RED, fill_opacity=0.3)
        elif "Circle" == "Polygon":
            node_4_shape = Polygon(
                [-0.8, 0.5, 0], [0.8, 0.5, 0], [1.0, 0, 0], [0.8, -0.5, 0], 
                [-0.8, -0.5, 0], [-1.0, 0, 0], color=RED, fill_opacity=0.3
            )
        else:
            node_4_shape = Rectangle(width=2.0, height=1.0, color=RED, fill_opacity=0.3)
        
        node_4_shape.move_to([8.0, 0.0, 0])
        nodes["node_4"] = VGroup(node_4_shape, node_4_text)
        

        # Edge: node_0 -> node_1
        edge_node_0_node_1 = Arrow(
            start=[0.0, -0.5, 0],
            end=[2.0, 0.5, 0],
            color=BLACK,
            buff=0.1
        )
        edges["node_0_node_1"] = edge_node_0_node_1
        

        # Edge: node_1 -> node_2
        edge_node_1_node_2 = Arrow(
            start=[2.0, -0.5, 0],
            end=[4.0, 0.5, 0],
            color=BLACK,
            buff=0.1
        )
        edges["node_1_node_2"] = edge_node_1_node_2
        

        # Edge: node_2 -> node_3
        edge_node_2_node_3 = Arrow(
            start=[4.0, -0.5, 0],
            end=[6.0, 0.5, 0],
            color=BLACK,
            buff=0.1
        )
        edges["node_2_node_3"] = edge_node_2_node_3
        

        # Edge: node_3 -> node_4
        edge_node_3_node_4 = Arrow(
            start=[6.0, -0.5, 0],
            end=[8.0, 0.5, 0],
            color=BLACK,
            buff=0.1
        )
        edges["node_3_node_4"] = edge_node_3_node_4
        

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

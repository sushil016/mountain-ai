"""
Generated Manim scene: df7fc6bd-92db-41da-ad30-1aa74b2d9ecb
Flowchart: Data Processing Algorithm: Start -> Read Input ->
Generated with audio synchronization
"""

from manim import *
import numpy as np

class FlowchartScene_df7fc6bd_92db_41da_ad30_1aa74b2d9ecb(Scene):
    def construct(self):
        # Scene configuration
        self.camera.background_color = WHITE

        # Title
        title = Text("Data Processing Algorithm: Start -> Read Input ->", font_size=36, color=BLACK)
        title.to_edge(UP, buff=0.5)

        # Show title
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Create all flowchart elements
        nodes = {}
        edges = []


        # Node: node_0
        node_0_text = Text("Data processing algorithm: start", font_size=20, color=BLACK)
        node_0_text.move_to([0.0, 0.0, 0])
        
        node_0_shape = Circle(radius=0.8, color=GREEN, fill_opacity=0.3)
        node_0_shape.move_to([0.0, 0.0, 0])
        
        nodes["node_0"] = VGroup(node_0_shape, node_0_text)


        # Node: node_1
        node_1_text = Text("Read input", font_size=20, color=BLACK)
        node_1_text.move_to([2.0, 0.0, 0])
        
        node_1_shape = Rectangle(width=2.0, height=1.0, color=BLUE, fill_opacity=0.3)
        node_1_shape.move_to([2.0, 0.0, 0])
        
        nodes["node_1"] = VGroup(node_1_shape, node_1_text)


        # Node: node_2
        node_2_text = Text("Validate data", font_size=20, color=BLACK)
        node_2_text.move_to([4.0, 0.0, 0])
        
        node_2_shape = Rectangle(width=2.0, height=1.0, color=BLUE, fill_opacity=0.3)
        node_2_shape.move_to([4.0, 0.0, 0])
        
        nodes["node_2"] = VGroup(node_2_shape, node_2_text)


        # Node: node_3
        node_3_text = Text("If valid process else show error", font_size=20, color=BLACK)
        node_3_text.move_to([6.0, 0.0, 0])
        
        node_3_shape = Polygon([-0.8, 0.5, 0], [0.8, 0.5, 0], [1.0, 0, 0], [0.8, -0.5, 0], [-0.8, -0.5, 0], [-1.0, 0, 0], color=YELLOW, fill_opacity=0.3)
        node_3_shape.move_to([6.0, 0.0, 0])
        
        nodes["node_3"] = VGroup(node_3_shape, node_3_text)


        # Node: node_4
        node_4_text = Text("Save results", font_size=20, color=BLACK)
        node_4_text.move_to([8.0, 0.0, 0])
        
        node_4_shape = Rectangle(width=2.0, height=1.0, color=BLUE, fill_opacity=0.3)
        node_4_shape.move_to([8.0, 0.0, 0])
        
        nodes["node_4"] = VGroup(node_4_shape, node_4_text)


        # Node: node_5
        node_5_text = Text("Generate report", font_size=20, color=BLACK)
        node_5_text.move_to([10.0, 0.0, 0])
        
        node_5_shape = Rectangle(width=2.0, height=1.0, color=BLUE, fill_opacity=0.3)
        node_5_shape.move_to([10.0, 0.0, 0])
        
        nodes["node_5"] = VGroup(node_5_shape, node_5_text)


        # Node: node_6
        node_6_text = Text("End", font_size=20, color=BLACK)
        node_6_text.move_to([12.0, 0.0, 0])
        
        node_6_shape = Circle(radius=0.8, color=RED, fill_opacity=0.3)
        node_6_shape.move_to([12.0, 0.0, 0])
        
        nodes["node_6"] = VGroup(node_6_shape, node_6_text)


        # Edge: node_0 -> node_1
        edge_node_0_node_1 = Arrow(
            start=[0.0, -0.5, 0],
            end=[2.0, 0.5, 0],
            color=BLACK,
            buff=0.1
        )
        edges.append(edge_node_0_node_1)


        # Edge: node_1 -> node_2
        edge_node_1_node_2 = Arrow(
            start=[2.0, -0.5, 0],
            end=[4.0, 0.5, 0],
            color=BLACK,
            buff=0.1
        )
        edges.append(edge_node_1_node_2)


        # Edge: node_2 -> node_3
        edge_node_2_node_3 = Arrow(
            start=[4.0, -0.5, 0],
            end=[6.0, 0.5, 0],
            color=BLACK,
            buff=0.1
        )
        edges.append(edge_node_2_node_3)


        # Edge: node_3 -> node_4
        edge_node_3_node_4 = Arrow(
            start=[6.0, -0.5, 0],
            end=[8.0, 0.5, 0],
            color=BLACK,
            buff=0.1
        )
        edges.append(edge_node_3_node_4)


        # Edge: node_4 -> node_5
        edge_node_4_node_5 = Arrow(
            start=[8.0, -0.5, 0],
            end=[10.0, 0.5, 0],
            color=BLACK,
            buff=0.1
        )
        edges.append(edge_node_4_node_5)


        # Edge: node_5 -> node_6
        edge_node_5_node_6 = Arrow(
            start=[10.0, -0.5, 0],
            end=[12.0, 0.5, 0],
            color=BLACK,
            buff=0.1
        )
        edges.append(edge_node_5_node_6)


        # Animation sequence
        all_nodes = list(nodes.values())
        
        # Show nodes one by one
        for i, node in enumerate(all_nodes):
            self.play(FadeIn(node), run_time=0.8)
            self.wait(0.3)
        
        # Show edges
        for edge in edges:
            self.play(Create(edge), run_time=0.5)
            self.wait(0.2)

        # Hold final state
        self.wait(2)

        # Fade out everything
        all_objects = all_nodes + edges
        if all_objects:
            self.play(FadeOut(*all_objects), run_time=1)

"""
Prompt Parser Service for Flowchart Video Generator.
Parses natural language prompts into structured flowchart data.
"""
import re
import logging
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)


class NodeType(Enum):
    """Types of flowchart nodes."""
    START = "start"
    END = "end"
    PROCESS = "process"
    DECISION = "decision"
    INPUT_OUTPUT = "input_output"
    CONNECTOR = "connector"


@dataclass
class FlowchartNode:
    """A single node in the flowchart."""
    id: str
    type: NodeType
    text: str
    position: Tuple[float, float] = (0.0, 0.0)
    color: str = "#4CAF50"
    narration: str = ""


@dataclass
class FlowchartConnection:
    """A connection between two nodes."""
    from_node: str
    to_node: str
    label: str = ""
    condition: str = ""


@dataclass
class FlowchartStructure:
    """Complete flowchart structure."""
    nodes: List[FlowchartNode]
    connections: List[FlowchartConnection]
    title: str = "Flowchart"
    description: str = ""
    estimated_duration: float = 10.0


class PromptParser:
    """Parse natural language prompts into flowchart structures."""
    
    def __init__(self):
        self.node_keywords = {
            NodeType.START: ["start", "begin", "initialize", "commence"],
            NodeType.END: ["end", "finish", "complete", "terminate", "stop"],
            NodeType.PROCESS: ["process", "execute", "run", "perform", "do"],
            NodeType.DECISION: ["if", "decide", "check", "verify", "determine", "?"],
            NodeType.INPUT_OUTPUT: ["input", "output", "read", "write", "display", "show"]
        }
    
    def parse_prompt(self, prompt: str) -> FlowchartStructure:
        """Parse a natural language prompt into a flowchart structure."""
        try:
            # Clean and prepare the prompt
            cleaned_prompt = self._clean_prompt(prompt)
            
            # Extract steps from the prompt
            steps = self._extract_steps(cleaned_prompt)
            
            # Create nodes from steps
            nodes = self._create_nodes_from_steps(steps)
            
            # Create connections between nodes
            connections = self._create_connections(nodes)
            
            # Generate narration for each node
            self._generate_narration(nodes, cleaned_prompt)
            
            # Estimate duration
            duration = self._estimate_duration(nodes)
            
            return FlowchartStructure(
                nodes=nodes,
                connections=connections,
                title=self._extract_title(cleaned_prompt),
                description=cleaned_prompt[:100] + "..." if len(cleaned_prompt) > 100 else cleaned_prompt,
                estimated_duration=duration
            )
            
        except Exception as e:
            logger.error(f"Failed to parse prompt: {e}")
            # Return a simple default flowchart
            return self._create_default_flowchart(prompt)
    
    def _clean_prompt(self, prompt: str) -> str:
        """Clean and normalize the input prompt."""
        # Remove extra whitespace
        prompt = re.sub(r'\s+', ' ', prompt.strip())
        
        # Convert to lowercase for processing
        return prompt.lower()
    
    def _extract_steps(self, prompt: str) -> List[str]:
        """Extract individual steps from the prompt."""
        # Look for common step separators
        separators = ['->', '→', '➜', '-', '•', '1.', '2.', '3.', '4.', '5.']
        
        steps = []
        
        # Split by common separators
        for sep in separators:
            if sep in prompt:
                parts = prompt.split(sep)
                steps = [part.strip() for part in parts if part.strip()]
                break
        
        # If no separators found, split by sentences
        if not steps:
            steps = [s.strip() for s in prompt.split('.') if s.strip()]
        
        # If still no steps, split by commas
        if not steps:
            steps = [s.strip() for s in prompt.split(',') if s.strip()]
        
        # Ensure we have at least 3 steps (start, process, end)
        if len(steps) < 3:
            steps = ["Start", prompt, "End"]
        
        return steps
    
    def _create_nodes_from_steps(self, steps: List[str]) -> List[FlowchartNode]:
        """Create flowchart nodes from extracted steps."""
        nodes = []
        
        for i, step in enumerate(steps):
            # Determine node type
            node_type = self._determine_node_type(step, i, len(steps))
            
            # Create node
            node = FlowchartNode(
                id=f"node_{i}",
                type=node_type,
                text=step.capitalize(),
                position=(i * 2.0, 0.0),
                color=self._get_node_color(node_type)
            )
            
            nodes.append(node)
        
        return nodes
    
    def _determine_node_type(self, step: str, index: int, total: int) -> NodeType:
        """Determine the type of node based on the step content."""
        step_lower = step.lower()
        
        # First step is usually start
        if index == 0:
            return NodeType.START
        
        # Last step is usually end
        if index == total - 1:
            return NodeType.END
        
        # Check for decision keywords
        if any(keyword in step_lower for keyword in self.node_keywords[NodeType.DECISION]):
            return NodeType.DECISION
        
        # Check for input/output keywords
        if any(keyword in step_lower for keyword in self.node_keywords[NodeType.INPUT_OUTPUT]):
            return NodeType.INPUT_OUTPUT
        
        # Default to process
        return NodeType.PROCESS
    
    def _get_node_color(self, node_type: NodeType) -> str:
        """Get color for node type."""
        colors = {
            NodeType.START: "#4CAF50",  # Green
            NodeType.END: "#F44336",    # Red
            NodeType.PROCESS: "#2196F3", # Blue
            NodeType.DECISION: "#FF9800", # Orange
            NodeType.INPUT_OUTPUT: "#9C27B0", # Purple
            NodeType.CONNECTOR: "#607D8B"  # Blue Grey
        }
        return colors.get(node_type, "#4CAF50")
    
    def _create_connections(self, nodes: List[FlowchartNode]) -> List[FlowchartConnection]:
        """Create connections between nodes."""
        connections = []
        
        for i in range(len(nodes) - 1):
            connection = FlowchartConnection(
                from_node=nodes[i].id,
                to_node=nodes[i + 1].id,
                label=""
            )
            connections.append(connection)
        
        return connections
    
    def _generate_narration(self, nodes: List[FlowchartNode], original_prompt: str):
        """Generate narration text for each node."""
        for i, node in enumerate(nodes):
            if node.type == NodeType.START:
                node.narration = f"We begin our process with: {node.text}"
            elif node.type == NodeType.END:
                node.narration = f"Finally, we {node.text.lower()}"
            elif node.type == NodeType.DECISION:
                node.narration = f"Next, we need to {node.text.lower()}"
            else:
                node.narration = f"Then we {node.text.lower()}"
    
    def _estimate_duration(self, nodes: List[FlowchartNode]) -> float:
        """Estimate the total duration of the video."""
        # Base duration per node (seconds)
        base_duration = 3.0
        
        # Additional time for narration
        narration_time = sum(len(node.narration.split()) * 0.5 for node in nodes)
        
        # Transition time between nodes
        transition_time = (len(nodes) - 1) * 1.0
        
        return base_duration * len(nodes) + narration_time + transition_time
    
    def _extract_title(self, prompt: str) -> str:
        """Extract a title from the prompt."""
        # Take first 50 characters and clean up
        title = prompt[:50].strip()
        if title.endswith('.'):
            title = title[:-1]
        return title.title()
    
    def _create_default_flowchart(self, prompt: str) -> FlowchartStructure:
        """Create a simple default flowchart."""
        nodes = [
            FlowchartNode(
                id="start",
                type=NodeType.START,
                text="Start",
                position=(0.0, 0.0),
                color="#4CAF50",
                narration="We begin our process"
            ),
            FlowchartNode(
                id="process",
                type=NodeType.PROCESS,
                text="Process",
                position=(2.0, 0.0),
                color="#2196F3",
                narration="We perform the main process"
            ),
            FlowchartNode(
                id="end",
                type=NodeType.END,
                text="End",
                position=(4.0, 0.0),
                color="#F44336",
                narration="We complete the process"
            )
        ]
        
        connections = [
            FlowchartConnection("start", "process"),
            FlowchartConnection("process", "end")
        ]
        
        return FlowchartStructure(
            nodes=nodes,
            connections=connections,
            title="Simple Flowchart",
            description=prompt[:100],
            estimated_duration=10.0
        )

GitHub Copilot Requirements File for Flowchart Video Generator Website
This requirements file outlines the detailed specifications for building a website that generates animated flowchart videos from user text prompts. The system shifts back to a Python-based backend using Manim for video animation generation, while incorporating a modern, dynamic frontend with advanced animations. The goal is to create a unique, engaging user experience that stands out through fluid transitions, interactive elements, and a sleek design. Use this file as input for GitHub Copilot to generate code snippets, components, or full implementations step by step.

Project Overview
Core Functionality: Users input a text prompt describing a flowchart (e.g., "Flowchart for project management decision process"). The backend parses the prompt, generates Manim Python code to create an animated video, renders it to MP4, and serves it to the frontend for display and download.

Tech Stack:

Backend: Python with FastAPI (preferred for async handling) or Flask, integrated with Manim library.

Frontend: React.js for dynamic UI, with Framer Motion for declarative animations and GSAP for complex, timeline-based animations.

Database/Storage: Optional SQLite or cloud storage (e.g., AWS S3) for caching generated videos.

Deployment: Heroku, Vercel, or Docker for local/cloud hosting.

Key Differentiators: Modern, dynamic design with animated UI elements for a "different" feel—e.g., flowing transitions between sections, interactive prompt input with real-time feedback, and separation of UI components via animated modals or panels.

Detailed Website Requirements
Overall Architecture:

Client-server model: Frontend sends prompts via API to backend; backend processes and returns video URL.

Security: Implement input validation to prevent injection attacks; use HTTPS for API calls.

Performance: Optimize video rendering with Manim's caching; limit concurrent requests to avoid overload.

Error Handling: Graceful failures with user-friendly messages (e.g., "Invalid prompt—please specify nodes and flows").

Accessibility: Ensure WCAG compliance with alt text for visuals and keyboard navigation.

Backend Requirements (Python/Manim Focus):

Endpoint: POST /generate-video accepting JSON with "prompt" field.

Prompt Parsing: Use natural language processing (e.g., via spaCy or simple regex) to extract nodes (e.g., steps, decisions), edges (connections), and logic (e.g., conditionals).

Manim Integration: Dynamically generate Python code using classes like VGroup, Rectangle, Arrow, Text, and animations (Create, FadeIn, MoveAlongPath, updaters for real-time effects).

Video Rendering: Execute Manim code to produce MP4; make videos downloadable with options for resolution (e.g., 720p default).

Optimization: Use Manim's low-quality rendering for previews; handle examples like animating binary search with highlighted paths.

Installation: Include pip requirements (e.g., manim, fastapi, uvicorn).

Frontend Requirements (React with Framer Motion and GSAP):

Framework: React.js with hooks for state management (no Redux unless scaled).

Routing: Single-page app with pages for home (prompt input), gallery (past generations), and about.

State Management: Use React Context or Zustand for handling prompt input, loading states, and video URLs.

API Integration: Use Axios or Fetch to call backend endpoints; display loading spinners during generation.

Responsiveness: Mobile-first design using CSS media queries; support dark/light mode toggles.

UI Design and Animation Requirements
The UI should feel modern and dynamic, with clear separation between sections (e.g., input area, preview pane, download controls) achieved through animated transitions. Incorporate Framer Motion for React-native animations and GSAP for precise, performant effects to create a "different" experience—e.g., fluid morphing elements, parallax scrolling, and interactive hover states.

Layout Structure:

Header: Animated navigation bar with logo; use GSAP for smooth scroll-based opacity changes.

Main Section: Divided into prompt input (left panel) and video preview (right panel); animate separation with Framer Motion's drag gestures or slide transitions.

Footer: Static links to docs/privacy; subtle GSAP fade-in on load.

Key UI Components:

Prompt Input Field: Textarea with auto-suggest (e.g., common flowchart terms); animate expansion on focus using Framer Motion's variants (e.g., scale from 0.9 to 1 with spring physics).

Generate Button: Styled as a glowing orb; use GSAP timelines for hover effects (e.g., color shift, particle bursts) and click animations (e.g., ripple expand).

Video Display Section: Embedded video player with controls; animate entry with Framer Motion (e.g., fade-in from bottom, stagger child elements like play button).

Download Button: Icon-based; GSAP for download progress animation (e.g., circular fill).

Error/Loading Modals: Pop-up overlays with Framer Motion for smooth open/close (e.g., motion.div with initial opacity 0, animate to 1).

Gallery View: Grid of past videos; use GSAP for infinite scroll animations (e.g., cards flipping in on scroll).

Animation Guidelines:

Framer Motion Usage: For declarative, component-level animations—e.g., animate presence for conditional rendering, drag interactions for resizable panels, and layout animations for responsive shifts.

GSAP Usage: For advanced timelines and effects—e.g., pinning elements during scroll, morphing shapes in the header, or sequencing animations (like arrow flows in a mini-preview).

Modern Dynamic Feel: Implement parallax backgrounds, micro-interactions (e.g., button wobbles), and theme switching with animated color transitions. Ensure animations are performant (e.g., use will-change CSS) and optional for low-motion preferences.

Separation and Flow: Use animated dividers (e.g., GSAP-animated lines expanding between sections) to visually separate UI areas, creating a sense of depth and dynamism.

Styling and Theming:

CSS Framework: Tailwind CSS for rapid prototyping; custom themes with variables for colors (e.g., neon accents for a futuristic vibe).

Fonts/Icons: Google Fonts (e.g., Inter for clean text) and React Icons for symbols; animate icon spins with Framer Motion.

Colors: Primary palette of deep blues and vibrant greens for a modern, tech-forward look.

Testing and Deployment Requirements
Unit Tests: Cover backend parsing and frontend components (e.g., using Jest for React, pytest for Python).

Integration Tests: End-to-end flow from prompt to video display.

Deployment Steps: Provide scripts for local setup (e.g., npm run start for frontend, uvicorn for backend); cloud instructions for Heroku (push to repo, set env vars).
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Code, Brain, Zap, Users, Award, Globe } from 'lucide-react';

interface ThumbnailProps {
  title: string;
  description: string;
  image: string;
  tech: string[];
  demo?: string;
}

const ProjectThumbnail: React.FC<ThumbnailProps> = ({ title, description, tech, demo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="group cursor-pointer bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-12 h-12 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2">
            <Code className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
            {title}
          </h3>
          <p className="text-white/70 text-sm mb-4">{description}</p>
          
          <div className="flex flex-wrap gap-2">
            {tech.map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-md"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-zinc-900 rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-6 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white/60" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Project Overview</h3>
                    <p className="text-white/70 mb-4">{description}</p>
                    
                    <h4 className="text-md font-semibold text-white mb-2">Key Features</h4>
                    <ul className="text-white/70 text-sm space-y-1 mb-4">
                      <li>• AI-powered text parsing and analysis</li>
                      <li>• Real-time flowchart generation</li>
                      <li>• Professional video export</li>
                      <li>• Multiple format support</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Technology Stack</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {tech.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-white/10 text-white text-sm rounded-lg text-center"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    
                    {demo && (
                      <a
                        href={demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        View Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const AboutPage: React.FC = () => {
  const projects = [
    {
      title: "FlowChart AI Core",
      description: "The main AI engine that processes natural language and converts it into structured flowchart data using advanced NLP algorithms.",
      image: "/api/placeholder/400/300",
      tech: ["Python", "TensorFlow", "NLP", "FastAPI"],
      demo: "#"
    },
    {
      title: "Animation Engine",
      description: "Built on Manim library, this module creates smooth, professional animations from flowchart data with customizable styles and transitions.",
      image: "/api/placeholder/400/300",
      tech: ["Python", "Manim", "FFmpeg", "OpenGL"],
      demo: "#"
    },
    {
      title: "Web Interface",
      description: "Modern React frontend with real-time preview capabilities, drag-and-drop functionality, and seamless user experience.",
      image: "/api/placeholder/400/300",
      tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
      demo: "#"
    },
    {
      title: "Export Pipeline",
      description: "High-performance video rendering system that converts animations to multiple formats with optimized compression and quality settings.",
      image: "/api/placeholder/400/300",
      tech: ["Node.js", "FFmpeg", "WebAssembly", "Docker"],
      demo: "#"
    }
  ];

  const stats = [
    { icon: <Users className="w-8 h-8" />, label: "Active Users", value: "10,000+" },
    { icon: <Zap className="w-8 h-8" />, label: "Videos Created", value: "500,000+" },
    { icon: <Globe className="w-8 h-8" />, label: "Countries", value: "150+" },
    { icon: <Award className="w-8 h-8" />, label: "Uptime", value: "99.9%" }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 pixel-text text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.2
            }}
          >
            About{' '}
            <motion.span 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Mountain AI
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-white/70 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            We're revolutionizing how people create and share complex information through the power of AI-generated flowchart animations. Our mission is to make professional visualization accessible to everyone.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="text-gray-400 mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-12 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-white/70 mb-6">
                At Mountain AI, we believe that complex ideas shouldn't require complex tools. Our AI-powered platform transforms natural language descriptions into professional, animated flowcharts that communicate clearly and effectively.
              </p>
              <p className="text-white/70 mb-6">
                Whether you're a business analyst documenting processes, a teacher explaining concepts, or a developer mapping out algorithms, our technology adapts to your needs and creates visualizations that truly resonate with your audience.
              </p>
              <div className="flex items-center gap-4">
                <Brain className="w-8 h-8 text-gray-400" />
                <span className="text-white font-medium">Powered by Advanced AI</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Code className="w-24 h-24 text-white/20" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Project Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Project Architecture
          </h2>
          <p className="text-lg text-white/70 text-center mb-16 max-w-3xl mx-auto">
            Explore the key components that power our AI-driven flowchart generation platform. Click on any project to learn more about its technical implementation.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <ProjectThumbnail {...project} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Built by Innovators</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-12">
            Our team combines expertise in artificial intelligence, computer graphics, and user experience design to create tools that make complex visualization simple and accessible.
          </p>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">5+</div>
                <div className="text-white/60 text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-white/60 text-sm">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Open</div>
                <div className="text-white/60 text-sm">Source Core</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

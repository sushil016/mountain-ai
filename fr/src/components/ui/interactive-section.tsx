"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles, Zap, Eye } from 'lucide-react';
import { ShineBorder } from '../magicui/shine-border';

export const InteractiveSection: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const demos = [
    {
      id: 'ai-generation',
      title: 'AI Generation',
      description: 'Watch as AI transforms your text into animated flowcharts',
      icon: <Sparkles className="w-6 h-6" />,
      gradient: 'from-gray-400 to-gray-600',
      animation: 'typing'
    },
    {
      id: 'real-time-preview',
      title: 'Real-time Preview',
      description: 'See your flowchart come to life as you type',
      icon: <Eye className="w-6 h-6" />,
      gradient: 'from-gray-500 to-gray-700',
      animation: 'preview'
    },
    {
      id: 'instant-export',
      title: 'Instant Export',
      description: 'Download professional videos in seconds',
      icon: <Zap className="w-6 h-6" />,
      gradient: 'from-gray-600 to-gray-800',
      animation: 'export'
    }
  ];

  // Auto-cycle through demos
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demos.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isPlaying, demos.length]);

  const TypewriterDemo = () => {
    const [text, setText] = useState('');
    const fullText = 'Create a flowchart for user login process...';
    
    useEffect(() => {
      if (activeDemo !== 0) return;
      
      let index = 0;
      setText('');
      
      const timer = setInterval(() => {
        if (index < fullText.length) {
          setText(fullText.slice(0, index + 1));
          index++;
        } else {
          setTimeout(() => {
            setText('');
            index = 0;
          }, 2000);
        }
      }, 100);
      
      return () => clearInterval(timer);
    }, [activeDemo, fullText]);
    
    return (
      <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-green-400">
          $ {text}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="ml-1"
          >
            |
          </motion.span>
        </div>
      </div>
    );
  };

  const FlowchartPreview = () => {
    const [nodes, setNodes] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);
    
    useEffect(() => {
      if (activeDemo !== 1) return;
      
      const nodePositions = [
        { x: 50, y: 20 },
        { x: 20, y: 60 },
        { x: 80, y: 60 },
        { x: 50, y: 100 }
      ];
      
      let index = 0;
      setNodes([]);
      
      const timer = setInterval(() => {
        if (index < nodePositions.length) {
          setNodes(prev => [...prev, { 
            id: index, 
            ...nodePositions[index], 
            opacity: 0 
          }]);
          
          // Animate in the node
          setTimeout(() => {
            setNodes(prev => prev.map(node => 
              node.id === index ? { ...node, opacity: 1 } : node
            ));
          }, 100);
          
          index++;
        } else {
          setTimeout(() => {
            setNodes([]);
            index = 0;
          }, 2000);
        }
      }, 800);
      
      return () => clearInterval(timer);
    }, [activeDemo]);
    
    return (
      <div className="relative bg-gray-900/50 rounded-lg p-6 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 120">
          {/* Connections */}
          {nodes.length > 1 && (
            <motion.line
              x1="50" y1="30" x2="50" y2="50"
              stroke="#ffffff" strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          {nodes.length > 2 && (
            <>
              <motion.line
                x1="50" y1="50" x2="30" y2="60"
                stroke="#ffffff" strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              <motion.line
                x1="50" y1="50" x2="70" y2="60"
                stroke="#ffffff" strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </>
          )}
          
          {/* Nodes */}
          {nodes.map((node) => (
            <motion.circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r="8"
              fill="#ffffff"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: node.opacity }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            />
          ))}
        </svg>
      </div>
    );
  };

  const ExportDemo = () => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
      if (activeDemo !== 2) return;
      
      setProgress(0);
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setTimeout(() => setProgress(0), 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      return () => clearInterval(timer);
    }, [activeDemo]);
    
    return (
      <div className="bg-gray-900/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-medium">Exporting Video...</div>
            <div className="text-white/60 text-sm">1080p • MP4</div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-white h-2 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="text-right text-white/60 text-sm mt-2">{progress}%</div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 pixel-text text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.2
            }}
          >
            See It In{' '}
            <motion.span 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Action
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-white/70 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Experience the magic of AI-powered flowchart generation with these interactive demonstrations
          </motion.p>

          {/* Demo Controls */}
          <motion.div 
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="text-sm">{isPlaying ? 'Pause' : 'Play'}</span>
            </motion.button>
            
            <motion.button
              onClick={() => setActiveDemo(0)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Restart</span>
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo Selector */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {demos.map((demo, index) => (
              <motion.div
                key={demo.id}
                className={`relative cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                  activeDemo === index 
                    ? 'bg-white/10 border-white/30' 
                    : 'bg-white/5 border-white/10 hover:bg-white/7 hover:border-white/20'
                }`}
                onClick={() => setActiveDemo(index)}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {activeDemo === index && (
                    <motion.div
                      className="absolute inset-0 bg-white/5 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative flex items-center gap-4">
                  <motion.div 
                    className={`p-3 rounded-xl bg-gradient-to-r ${demo.gradient} text-white`}
                  >
                    {demo.icon}
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-2 ${
                      activeDemo === index ? 'text-white' : 'text-white/80'
                    }`}>
                      {demo.title}
                    </h3>
                    <p className={`text-sm ${
                      activeDemo === index ? 'text-white/70' : 'text-white/60'
                    }`}>
                      {demo.description}
                    </p>
                  </div>

                  {/* Active indicator dot */}
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activeDemo === index ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Demo Display */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 overflow-hidden">
              <ShineBorder
                shineColor={["#ffffff", "#e5e7eb", "#9ca3af"]}
                borderWidth={2}
                duration={3}
              />
              
              {/* Demo content */}
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDemo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeDemo === 0 && <TypewriterDemo />}
                    {activeDemo === 1 && <FlowchartPreview />}
                    {activeDemo === 2 && <ExportDemo />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {demos.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeDemo === index ? 'w-8 bg-white' : 'w-2 bg-white/30'
                  }`}
                  onClick={() => setActiveDemo(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

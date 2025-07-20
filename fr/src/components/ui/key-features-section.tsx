"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Video, Zap, Download } from 'lucide-react';

export const KeyFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Parsing",
      description: "Advanced AI understands your text and identifies nodes, connections, and flow logic automatically",
      gradient: "from-gray-400 to-gray-600",
      accent: "gray"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Professional Animation",
      description: "High-quality video output with smooth transitions and clear visualizations using Manim library",
      gradient: "from-gray-500 to-gray-700",
      accent: "gray"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Generation",
      description: "From prompt to video in under 60 seconds - no complex software or design skills required",
      gradient: "from-gray-600 to-gray-800",
      accent: "gray"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Download Ready",
      description: "Export your videos in HD for presentations, documentation, or sharing across platforms",
      gradient: "from-gray-500 to-gray-700",
      accent: "gray"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const featureVariants = {
    hidden: { 
      opacity: 0, 
      x: -30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
        duration: 0.6
      }
    }
  };

  return (
    <section id="features" className="py-20 px-4 bg-transparent">
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
            Powerful{' '}
            <motion.span 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Features
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-white/70 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Built with cutting-edge technology to deliver professional results with zero learning curve.
          </motion.p>
        </motion.div>

        <motion.div
          className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 md:p-12 overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 100,
            duration: 0.8
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-gray-500/5" />

          <div className="relative z-10">
            <motion.div
              className="grid md:grid-cols-2 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={featureVariants}
                  className="group flex items-start gap-6 p-6 rounded-2xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  {/* Feature Icon */}
                  <div 
                    className={`p-4 rounded-xl bg-gradient-to-r ${feature.gradient} text-white flex-shrink-0`}
                  >
                    {feature.icon}
                  </div>
                  
                  {/* Feature Content */}
                  <div className="flex-1">
                    <motion.h3 
                      className="text-xl font-bold text-white mb-3 group-hover:text-gray-300 transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {feature.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {feature.description}
                    </motion.p>

                    {/* Gradient accent line */}
                    <motion.div
                      className="mt-4 h-1 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom accent */}
            <motion.div
              className="mt-12 pt-8 border-t border-white/10 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.p className="text-white/60 text-sm">
                All features work together seamlessly •{' '}
                <motion.span 
                  className="bg-white/20 text-white px-2 py-1 rounded-md"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: 1.0,
                    type: "spring",
                    damping: 15,
                    stiffness: 200
                  }}
                >
                  Zero setup required
                </motion.span>{' '}
                • Built for professionals
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

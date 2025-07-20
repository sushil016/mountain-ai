"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const WhyChooseSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 120,
        duration: 0.6
      }
    }
  };

  const features = [
    {
      title: "No Signup Required",
      description: "Start creating immediately without registration",
      highlight: "immediately",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Free to Try",
      description: "Generate your first video at no cost",
      highlight: "no cost",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Instant Results",
      description: "See your flowchart come to life in real-time",
      highlight: "real-time",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Professional Quality",
      description: "Studio-grade animations powered by Manim",
      highlight: "Studio-grade",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      title: "Multiple Formats",
      description: "Export in various resolutions and formats",
      highlight: "various resolutions",
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Global Community",
      description: "Join thousands of professionals worldwide",
      highlight: "thousands of professionals",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <motion.span 
          key={index} 
          className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.8 + index * 0.1,
            type: "spring",
            damping: 20,
            stiffness: 200
          }}
        >
          {part}
        </motion.span>
      ) : part
    );
  };

  // Minimal Hover Card Component
  const MinimalHoverCard: React.FC<{
    feature: typeof features[0];
    index: number;
  }> = ({ feature, index }) => {
    return (
      <motion.div
        variants={itemVariants}
        className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
        whileHover={{ 
          y: -3,
          scale: 1.01,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
      >
        {/* Subtle gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`} />
        
        <div className="relative z-10">
          <motion.h3 
            className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            {feature.title}
          </motion.h3>
          
          <motion.p 
            className="text-white/70 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            {highlightText(feature.description, feature.highlight)}
          </motion.p>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 md:p-12 overflow-hidden w-full"
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
      {/* Subtle animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="relative text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 pixel-text text-blue-400"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 100,
            delay: 0.3
          }}
        >
          Why Choose{' '}
          <motion.span 
            className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ 
              delay: 0.5,
              type: "spring",
              damping: 20,
              stiffness: 120
            }}
          >
            Mountain AI
          </motion.span>
          ?
        </motion.h2>
        
        <motion.p 
          className="text-base md:text-lg text-white/70 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Experience the{' '}
          <motion.span 
            className="bg-white/10 px-2 py-1 rounded-md"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, type: "spring", damping: 20, stiffness: 200 }}
          >
            next generation
          </motion.span>{' '}
          of flowchart creation with cutting-edge AI technology.
        </motion.p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((feature, index) => (
          <MinimalHoverCard key={index} feature={feature} index={index} />
        ))}
      </motion.div>

      <motion.div
        className="text-center mt-12 pt-6 border-t border-white/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <motion.p className="text-white/60 text-sm">
          Trusted by{' '}
          <motion.span 
            className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              delay: 1.2,
              type: "spring",
              damping: 15,
              stiffness: 200
            }}
          >
            10,000+
          </motion.span>{' '}
          creators worldwide •{' '}
          <motion.span 
            className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              delay: 1.3,
              type: "spring",
              damping: 15,
              stiffness: 200
            }}
          >
            99.9% uptime
          </motion.span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

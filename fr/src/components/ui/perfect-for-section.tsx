"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const PerfectForSection: React.FC = () => {
  const useCases = [
    {
      category: "Business",
      items: [
        "Project management decision workflows",
        "Business process documentation",
        "Customer journey mapping"
      ],
      gradient: "from-blue-500 to-cyan-500",
      icon: ""
    },
    {
      category: "Technical",
      items: [
        "Software algorithm explanations",
        "System architecture flowcharts",
        "API workflow documentation"
      ],
      gradient: "from-blue-500 to-indigo-500",
      icon: ""
    },
    {
      category: "Educational",
      items: [
        "Educational content for complex topics",
        "Training material creation",
        "Step-by-step tutorials"
      ],
      gradient: "from-blue-500 to-emerald-500",
      icon: ""
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
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
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 pixel-text text-blue-400"
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
            Perfect For Every{' '}
            <motion.span 
              className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Workflow
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-white/70 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            From simple processes to complex decision trees, our AI understands your domain and creates professional visualizations.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative"
            >
              <motion.div
                className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 h-full overflow-hidden"
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Animated border */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${useCase.gradient} opacity-20 rounded-2xl`}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 0.2 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                  style={{
                    maskImage: 'linear-gradient(90deg, transparent, black, transparent)',
                    WebkitMaskImage: 'linear-gradient(90deg, transparent, black, transparent)'
                  }}
                />

                <div className="relative z-10">
                  {/* Icon and Category */}
                  <motion.div 
                    className="flex items-center gap-3 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="text-3xl">{useCase.icon}</div>
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${useCase.gradient} bg-clip-text text-transparent`}>
                      {useCase.category}
                    </h3>
                  </motion.div>

                  {/* Use case items */}
                  <div className="space-y-4">
                    {useCase.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        className="flex items-start gap-3 group/item"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1 + itemIndex * 0.05 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-white/80 group-hover/item:text-white transition-colors duration-200">
                          {item}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Hover arrow */}
                  <motion.div
                    className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface FlowchartInterfaceCardProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const FlowchartInterfaceCard: React.FC<FlowchartInterfaceCardProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  onGenerate,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100
      }
    }
  };

  const textareaVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.98,
      y: 10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 120,
        delay: 0.2
      }
    }
  };

  const buttonVariants = {
    idle: { 
      scale: 1,
      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.15)"
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.25)",
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 200
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300
      }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="relative bg-zinc-950 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 p-8"
        whileHover={{ 
          borderColor: "rgba(156, 163, 175, 0.6)",
          transition: { duration: 0.3 }
        }}
      >
        <motion.div 
          className="max-w-2xl mx-auto"
          variants={itemVariants}
        >
          
          {/* Input Area */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            <motion.div variants={itemVariants}>
              <motion.div 
                className="relative group"
                variants={textareaVariants}
              >
                <motion.textarea
                  id="flowchart-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your flowchart... (e.g., 'Create a flowchart for user login process with validation steps and error handling')"
                  className="w-full h-48 px-6 py-4 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  disabled={isGenerating}
                  whileFocus={{
                    scale: 1.01,
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                    transition: { 
                      type: "spring",
                      damping: 20,
                      stiffness: 300
                    }
                  }}
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative group"
              variants={itemVariants}
            >
              <motion.button
                onClick={onGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 text-lg"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                animate={isGenerating ? {
                  scale: [1, 1.02, 1],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                } : "idle"}
              >
                <motion.span 
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {isGenerating ? (
                    <>
                      <motion.div 
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        Generating...
                      </motion.span>
                    </>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        type: "spring",
                        damping: 20,
                        stiffness: 200,
                        delay: 0.4
                      }}
                    >
                      🚀 Generate Video
                    </motion.span>
                  )}
                </motion.span>
              </motion.button>
            </motion.div>
            
            <motion.p 
              className="text-center text-gray-400 text-sm"
              variants={itemVariants}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              💡 Ready to bring your ideas to life? Describe any process or workflow above and watch the magic happen.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

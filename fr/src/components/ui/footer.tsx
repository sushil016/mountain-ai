import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <motion.section 
      className="py-20 px-4 bg-transparent"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.8 
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-zinc-950/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-12">
          <footer className="text-center">
            <div className="mb-8">
              <h3 className="text-3xl font-bold pixel-text text-blue-400 mb-4">FlowChart AI</h3>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Powered by cutting-edge AI and animation technology for professional results. 
                Transform your ideas into beautiful flowchart videos in minutes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Product</h4>
                <div className="space-y-2 text-white/60">
                  <p className="hover:text-white transition-colors cursor-pointer">Features</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Pricing</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Examples</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Documentation</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Company</h4>
                <div className="space-y-2 text-white/60">
                  <p className="hover:text-white transition-colors cursor-pointer">About</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Blog</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Careers</p>
                  <p className="hover:text-white transition-colors cursor-pointer">News</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Support</h4>
                <div className="space-y-2 text-white/60">
                  <p className="hover:text-white transition-colors cursor-pointer">Help Center</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Contact</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Status</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Community</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Legal</h4>
                <div className="space-y-2 text-white/60">
                  <p className="hover:text-white transition-colors cursor-pointer">Privacy Policy</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Terms of Service</p>
                  <p className="hover:text-white transition-colors cursor-pointer">Cookie Policy</p>
                  <p className="hover:text-white transition-colors cursor-pointer">GDPR</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/10">
              <p className="text-white/50 text-sm">
                © 2025 Mountain AI. Built with React, Python & Manim. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </motion.section>
  );
};

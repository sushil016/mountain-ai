import { Link } from 'react-router-dom';
import { PricingSection } from '../components/ui/pricing-section';
import { WhyChooseSection } from '../components/ui/why-choose-section';
import { PerfectForSection } from '../components/ui/perfect-for-section';
import { KeyFeaturesSection } from '../components/ui/key-features-section';
import { InteractiveSection } from '../components/ui/interactive-section';
import { TextReveal } from '../components/magicui/text-reveal';
import { motion } from 'framer-motion';
import { Play, BookOpen } from 'lucide-react';

export const HomePage = () => {

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/background-section2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
      
      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      {/* Hero Section */}
      <motion.section 
        id="home" 
        className="relative z-10 pt-48 pb-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 pixel-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.2 
            }}
          >
            Transform Ideas Into{' '}
            <motion.span 
              className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 100,
                delay: 0.5 
              }}
            >
              Animated Flowcharts
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-white/80 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.4 
            }}
          >
            Create stunning, professional flowchart videos from simple text prompts using AI-powered animation technology
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.5 
            }}
          >
            {/* Primary CTA - Generate Video */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/generate-flowchart"
                className="group relative px-6 py-3 bg-white text-black font-semibold rounded-full transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
              >
                <Play className="w-5 h-5 transition-transform" />
                Generate Video
                <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-xl opacity-0 transition-opacity duration-300 -z-10"></div>
              </Link>
            </motion.div>

            {/* Secondary CTA - Documentation */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/documentation"
                className="group relative px-6 py-3 border border-white/20 hover:border-white/30 text-white font-semibold rounded-full transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center backdrop-blur-sm"
              >
                <BookOpen className="w-5 h-5 " />
                Documentation
                <div className="absolute inset-0 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
            </motion.div>
          </motion.div>
          
          <TextReveal className="text-sm md:text-xl mb-8 text-white/60 max-w-7xl mx-auto">
            Skip the complexity of traditional design tools. Just describe your process, workflow, or decision tree in plain English, and watch as our system generates a beautifully animated flowchart video in minutes.
          </TextReveal>

          {/* Trust Indicators */}
          {/* <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Claude Sonnet 4</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Professional Quality</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm">All Export Ready</span>
            </div>
          </motion.div> */}
        </div>
      </motion.section>

      {/* Interface Section */}
      {/* <motion.section 
        id="interface" 
        className="relative z-10 py-20 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          type: "spring",
          damping: 20,
          stiffness: 100,
          duration: 0.8 
        }}
      >
        <div className="max-w-7xl mx-auto">
          <FlowchartInterfaceCard
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
          />
        </div>
      </motion.section> */}

      {/* Interactive Experience Section */}
      <div className="relative z-10">
        <InteractiveSection />
      </div>

      {/* Features Grid */}
      <div className="relative z-10">
        <KeyFeaturesSection />
      </div>

      {/* Use Cases Section */}
      <div className="relative z-10">
        <PerfectForSection />
      </div>

      {/* Why Choose Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <WhyChooseSection />
        </div>
      </section>

      {/* Pricing Section */}
      <div className="relative z-10">
        <PricingSection />
      </div>
    </div>
  );
};

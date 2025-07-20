import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does FlowChart AI work?",
    answer: "FlowChart AI uses advanced natural language processing to understand your text descriptions and automatically generates professional flowchart animations. Simply describe your process in plain English, and our AI creates a beautifully animated flowchart video."
  },
  {
    question: "What types of flowcharts can I create?",
    answer: "You can create various types including process flows, decision trees, organizational charts, user journey maps, system architecture diagrams, and workflow visualizations. Our AI adapts to different flowchart styles and purposes."
  },
  {
    question: "How long does it take to generate a flowchart?",
    answer: "Most flowcharts are generated within 30-60 seconds, depending on complexity. Simple flowcharts with 5-10 steps typically take 30 seconds, while more complex diagrams with 20+ elements may take up to 2 minutes."
  },
  {
    question: "Can I customize the appearance and styling?",
    answer: "Yes! You can customize colors, fonts, shapes, animation styles, and layouts. Our platform offers multiple themes, from professional business styles to creative designs, plus advanced customization options for premium users."
  },
  {
    question: "What export formats are supported?",
    answer: "We support MP4 video exports in various resolutions (HD, Full HD, 4K), as well as PNG/SVG for static images, and GIF for lightweight animations. Premium users also get access to editable formats like After Effects projects."
  },
  {
    question: "Is there an API for integration?",
    answer: "Yes, we offer a comprehensive REST API for developers who want to integrate flowchart generation into their applications. Documentation and SDKs are available for popular programming languages."
  },
  {
    question: "How accurate is the AI interpretation?",
    answer: "Our AI has a 95%+ accuracy rate in understanding process descriptions and creating appropriate flowcharts. If the initial result isn't perfect, you can refine your description or use our editing tools to make adjustments."
  },
  {
    question: "What are the usage limits?",
    answer: "Free users get 3 flowcharts per month. Pro users get unlimited generation, priority processing, and advanced features. Enterprise plans include API access, custom branding, and dedicated support."
  }
];

const documentationSections = [
  {
    title: "Getting Started",
    content: [
      "1. **Sign up** for your FlowChart AI account",
      "2. **Describe your process** in the text input field",
      "3. **Click Generate** and wait for your animated flowchart",
      "4. **Download or share** your creation"
    ]
  },
  {
    title: "Writing Effective Prompts",
    content: [
      "• **Be specific** about the steps in your process",
      "• **Use action words** like 'start', 'decide', 'end'",
      "• **Include decision points** with 'if/then' logic",
      "• **Mention parallel processes** when applicable"
    ]
  },
  {
    title: "Advanced Features",
    content: [
      "• **Custom styling** with themes and colors",
      "• **Animation control** for timing and effects",
      "• **Collaborative editing** with team members",
      "• **Template library** for common use cases"
    ]
  }
];

const FAQ: React.FC<{ faq: FAQItem; index: number }> = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border border-gray-700 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        className="w-full px-6 py-4 text-left bg-gray-900/50 hover:bg-gray-800/50 transition-colors duration-200 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 text-gray-300 leading-relaxed">
          {faq.answer}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const DocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 pixel-text">
            Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about creating amazing flowchart animations with AI
          </p>
        </motion.div>

        {/* Quick Start Guide */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Quick Start Guide</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {documentationSections.map((section, index) => (
              <motion.div
                key={index}
                className={`bg-gray-900/50 rounded-lg p-6 border transition-colors cursor-pointer ${
                  activeSection === index ? 'border-blue-500' : 'border-gray-700 hover:border-gray-600'
                }`}
                whileHover={{ y: -5 }}
                onClick={() => setActiveSection(index)}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">{section.title}</h3>
                <ul className="space-y-2 text-gray-300">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Interactive Demo Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Try It Now</h2>
          <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Sample Prompts</h3>
                <div className="space-y-3">
                  {[
                    "Create a user registration process flowchart",
                    "Design a customer support workflow",
                    "Build a project approval decision tree",
                    "Make an e-commerce checkout process"
                  ].map((prompt, index) => (
                    <motion.button
                      key={index}
                      className="w-full text-left p-3 bg-gray-800 rounded border border-gray-600 hover:border-blue-500 transition-colors text-sm"
                      whileHover={{ x: 5 }}
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Best Practices</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm">Use clear, actionable language</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm">Include decision points and outcomes</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm">Specify start and end points</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-sm">Keep it logical and sequential</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQ key={index} faq={faq} index={index} />
            ))}
          </div>
        </motion.section>

        {/* API Documentation Teaser */}
        <motion.section
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-8 border border-blue-500/30">
            <h3 className="text-2xl font-bold mb-4">Need API Access?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Integrate FlowChart AI into your applications with our comprehensive REST API. 
              Perfect for automating documentation, generating dynamic visualizations, and more.
            </p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
              View API Docs
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

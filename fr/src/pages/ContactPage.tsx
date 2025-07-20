import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get help from our support team",
      contact: "support@flowchartai.com",
      icon: "📧"
    },
    {
      title: "Business Inquiries",
      description: "Partnership and enterprise sales",
      contact: "business@flowchartai.com",
      icon: "💼"
    },
    {
      title: "Technical Support",
      description: "API and integration assistance",
      contact: "developers@flowchartai.com",
      icon: "🔧"
    }
  ];

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
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about FlowChart AI? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold mb-2 text-green-400">Message Sent!</h3>
                  <p className="text-gray-300">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-white"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                      <option value="api">API Access</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-white resize-vertical"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-8">
                We're here to help and answer any question you might have. 
                We look forward to hearing from you.
              </p>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{method.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
                        <p className="text-gray-400 mb-2">{method.description}</p>
                        <a 
                          href={`mailto:${method.contact}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {method.contact}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                For urgent technical issues, our 24/7 support portal is always available.
              </p>
            </div>

            {/* Response Time */}
            <div className="bg-blue-600/10 rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Quick Response Guarantee</h3>
              <p className="text-gray-300 text-sm">
                We typically respond to all inquiries within 24 hours during business days. 
                For premium customers, we guarantee a response within 4 hours.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

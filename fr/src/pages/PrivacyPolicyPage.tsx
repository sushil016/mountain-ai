import React from 'react';
import { motion } from 'framer-motion';

export const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "**Account Information**: When you create an account, we collect your name, email address, and password.",
        "**Usage Data**: We collect information about how you use our service, including flowcharts created, features used, and interaction patterns.",
        "**Device Information**: We may collect information about your device, including IP address, browser type, and operating system.",
        "**Content Data**: We process the text prompts you provide to generate flowcharts, but we do not store this data permanently unless you save the project."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "**Service Provision**: To provide, maintain, and improve our flowchart generation service.",
        "**Communication**: To send you important updates, respond to your inquiries, and provide customer support.",
        "**Analytics**: To understand how our service is used and to improve user experience.",
        "**Security**: To protect against fraud, unauthorized access, and other security issues."
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "**Third-Party Services**: We may use third-party services for analytics, payment processing, and infrastructure. These services have their own privacy policies.",
        "**Legal Requirements**: We may disclose information if required by law or to protect our rights and safety.",
        "**Business Transfers**: In case of merger, acquisition, or sale of assets, user information may be transferred as part of the transaction.",
        "**Consent**: We will never sell your personal information to third parties for marketing purposes."
      ]
    },
    {
      title: "Data Security",
      content: [
        "**Encryption**: All data transmitted between your device and our servers is encrypted using industry-standard SSL/TLS protocols.",
        "**Access Controls**: We implement strict access controls to ensure only authorized personnel can access user data.",
        "**Regular Audits**: We conduct regular security audits and penetration testing to identify and address vulnerabilities.",
        "**Data Backup**: Your data is regularly backed up to prevent loss due to technical failures."
      ]
    },
    {
      title: "Your Rights",
      content: [
        "**Access**: You can request access to the personal information we hold about you.",
        "**Correction**: You can request that we correct any inaccurate or incomplete information.",
        "**Deletion**: You can request that we delete your personal information, subject to certain legal limitations.",
        "**Portability**: You can request that we provide your data in a machine-readable format.",
        "**Opt-out**: You can opt out of certain communications and data processing activities."
      ]
    },
    {
      title: "Cookies and Tracking",
      content: [
        "**Essential Cookies**: We use cookies necessary for the basic functionality of our service.",
        "**Analytics Cookies**: We use analytics cookies to understand how our service is used and to improve it.",
        "**Preference Cookies**: We use cookies to remember your preferences and settings.",
        "**Control**: You can control cookie settings through your browser, but this may affect service functionality."
      ]
    },
    {
      title: "Children's Privacy",
      content: [
        "Our service is not intended for children under 13 years of age.",
        "We do not knowingly collect personal information from children under 13.",
        "If we become aware that we have collected information from a child under 13, we will take steps to delete it.",
        "If you believe we have collected information from a child under 13, please contact us immediately."
      ]
    },
    {
      title: "International Transfers",
      content: [
        "Your information may be transferred to and processed in countries other than your own.",
        "We ensure appropriate safeguards are in place when transferring data internationally.",
        "We comply with applicable data protection laws regarding international transfers.",
        "By using our service, you consent to such transfers as described in this policy."
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 pixel-text">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We take your privacy seriously. This policy explains how we collect, use, 
            and protect your information when you use FlowChart AI.
          </p>
          <div className="mt-6 text-sm text-gray-400">
            Last updated: January 2025
          </div>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          className="bg-blue-600/10 rounded-lg p-6 border border-blue-500/30 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Privacy Policy Summary</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• We collect minimal information necessary to provide our service</li>
            <li>• We never sell your personal information to third parties</li>
            <li>• Your flowchart content is processed securely and not stored permanently unless you save it</li>
            <li>• You have full control over your data and can request deletion at any time</li>
            <li>• We use industry-standard security measures to protect your information</li>
          </ul>
        </motion.div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              className="bg-gray-900/50 rounded-lg p-8 border border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
              <div className="space-y-4">
                {section.content.map((paragraph, paragraphIndex) => (
                  <p 
                    key={paragraphIndex} 
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                    }}
                  />
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          className="mt-12 bg-gray-900/50 rounded-lg p-8 border border-gray-700 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Questions About This Policy?</h2>
          <p className="text-gray-300 mb-6">
            If you have any questions about this Privacy Policy or how we handle your data, 
            please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </a>
            <a 
              href="mailto:privacy@flowchartai.com"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Email Privacy Team
            </a>
          </div>
        </motion.div>

        {/* Data Rights Notice */}
        <motion.div
          className="mt-8 p-6 bg-yellow-600/10 border border-yellow-500/30 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">Your Data Rights</h3>
          <p className="text-gray-300 text-sm">
            Under various data protection laws (including GDPR and CCPA), you have specific rights 
            regarding your personal information. To exercise these rights or if you have concerns 
            about our data practices, please contact our privacy team.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

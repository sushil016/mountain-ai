"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { RainbowButton } from '../magicui/rainbow-button';

export const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
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

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: <Star className="w-6 h-6" />,
      features: [
        "Up to 3 flowcharts per month",
        "Basic templates",
        "Standard export quality",
        "Community support",
        "Watermark included"
      ],
      buttonText: "Get Started Free",
      popular: false,
      gradient: "from-gray-600 to-gray-700"
    },
    {
      name: "Mountain+",
      description: "Most popular for professionals",
      monthlyPrice: 199,
      yearlyPrice: 1990, // 10 months pricing
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Unlimited flowcharts",
        "Premium templates library",
        "HD export quality",
        "Priority support",
        "No watermarks",
        "Advanced animations",
        "Custom branding"
      ],
      buttonText: "Start Mountain+",
      popular: true,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Mountain Pro",
      description: "For teams and enterprises",
      monthlyPrice: 499,
      yearlyPrice: 4990, // 10 months pricing
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Everything in Mountain+",
        "Team collaboration",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Analytics dashboard",
        "White-label solution",
        "Enterprise security"
      ],
      buttonText: "Contact Sales",
      popular: false,
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 pixel-text text-blue-400">
            Choose Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Mountain</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Scale your flowchart creation with plans designed for every need. 
            <span className="bg-white/10 px-2 py-1 rounded-md mx-1">Start free</span> 
            and upgrade as you grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-white/60'}`}>Monthly</span>
            <motion.button
              className="relative w-14 h-7 bg-gray-700 rounded-full p-1 transition-colors"
              onClick={() => setIsYearly(!isYearly)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-5 h-5 bg-blue-500 rounded-full shadow-md"
                animate={{ x: isYearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-white/60'}`}>
              Yearly 
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md ml-2 text-xs">
                Save 17%
              </span>
            </span>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 flex flex-col ${
                plan.popular 
                  ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-105' 
                  : 'border-white/10 hover:border-white/20'
              } transition-all duration-300`}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} text-white mb-4`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/60 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">
                    ₹{isYearly ? Math.floor((plan.yearlyPrice || 0) / 12) : (plan.monthlyPrice || 0)}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-white/60 text-sm mb-1">/month</span>
                  )}
                </div>
                {isYearly && plan.yearlyPrice > 0 && (
                  <p className="text-green-400 text-sm">
                    <span className="bg-green-500/20 px-2 py-1 rounded-md">
                      ₹{plan.yearlyPrice}/year - Save ₹{(plan.monthlyPrice * 12) - plan.yearlyPrice}
                    </span>
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.name === 'Free' ? (
                <motion.button
                  className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 mt-auto  text-white text-sm border border-white/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.buttonText}
                </motion.button>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-auto"
                >
                  <RainbowButton 
                    className="w-full h-11 px-6 font-semibold text-black rounded-xl"
                  >
                    {plan.buttonText}
                  </RainbowButton>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white/60 text-sm mb-4">
            All plans include <span className="bg-white/10 px-2 py-1 rounded-md">24/7 support</span> and 
            <span className="bg-white/10 px-2 py-1 rounded-md mx-1">30-day money-back guarantee</span>
          </p>
          <p className="text-white/40 text-xs">
            Prices in Indian Rupees (₹). Taxes may apply.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CookiesPolicy = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.8
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white shadow-xl rounded-lg overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-[#401735] py-6 px-6">
            <h1 className="text-3xl font-bold text-white">Cookie Policy</h1>
            <p className="mt-2 text-sm text-white/80">Effective Date: April 30, 2025</p>
          </div>
          
          <div className="px-6 py-8 prose prose-rose max-w-none">
            <motion.p variants={itemVariants} className="text-gray-700 mb-8 text-lg">
              We use cookies and similar technologies to enhance your browsing experience, 
              serve personalized content, and analyze our traffic. Some cookies are essential 
              for the functioning of the site, while others help us improve and personalize your experience.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-gray-700 mb-8">
              You can manage your preferences or withdraw your consent at any time by visiting the Cookie Settings. 
              For more information, please read our{' '}
              <Link href="/PrivacyPolicy" className="text-[#401735] font-medium hover:underline">
                Privacy Policy
              </Link>.
            </motion.p>
            
            <div className="mt-10 text-sm text-gray-500">
              <p>
                If you have any questions about these Terms and Conditions or the Service Agreement, please contact us at{' '}
                <a href="mailto:info@styltarastudios.com" className="text-[#401735] hover:underline">
                  info@styltarastudios.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CookiesPolicy;
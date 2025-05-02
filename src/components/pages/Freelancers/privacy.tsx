"use client";

import React from 'react';
import { motion } from 'framer-motion';

const FreelancerPrivacyPolicy = () => {
  // Animation variants
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
            <h1 className="text-3xl font-bold text-white">Freelancer Privacy Policy</h1>
            <p className="mt-2 text-sm text-white/80">Effective Date: April 30, 2025</p>
          </div>
          
          <div className="px-6 py-8 prose prose-rose max-w-none">
            <motion.p variants={itemVariants} className="text-gray-700 mb-8">
              At Styltara Studios, we value the privacy of our freelancers and are committed to protecting your personal information.
            </motion.p>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Name</li>
                <li>Address</li>
                <li>Government ID proofs</li>
                <li>Bank details for payment</li>
              </ul>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use of Information</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>For assignment of projects</li>
                <li>For payments</li>
                <li>For compliance with legal requirements</li>
              </ul>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Sharing of Information</h2>
              <p className="text-gray-700">
                Freelancer information is not shared externally, except when required by law.
              </p>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Retention</h2>
              <p className="text-gray-700">
                We retain freelancer information for compliance and operational purposes for a minimum of 5 years after contract end.
              </p>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Protection of Information</h2>
              <p className="text-gray-700">
                Access to freelancer data is restricted to authorized personnel only.
              </p>
            </motion.section>
            
            <motion.div variants={itemVariants} className="mt-10 text-sm text-gray-500">
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:info@styltarastudios.com" className="text-[#401735] hover:underline">
                  info@styltarastudios.com
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FreelancerPrivacyPolicy;
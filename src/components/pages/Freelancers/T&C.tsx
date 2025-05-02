"use client";

import React from 'react';
import { motion } from 'framer-motion';

const FreelancerTermsAndConditions = () => {
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
    <div className="bg-gradient-to-b from-white to-neutral-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-3xl font-bold text-white">Freelancer Agreement Terms</h1>
            <p className="mt-2 text-sm text-white/80">Effective Date: April 30, 2025</p>
          </div>
          
          <div className="px-6 py-8 prose prose-indigo max-w-none">
            <motion.p variants={itemVariants} className="text-gray-700 mb-8">
              This agreement outlines the terms and conditions for freelancers working with Styltara Studios Pvt Ltd.
              By accepting any assignment or project from Styltara Studios, you agree to abide by these terms.
            </motion.p>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Engagement</h2>
              <p className="text-gray-700">
                Freelancers are engaged as independent contractors, not employees.
              </p>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Non-Solicitation and Non-Compete</h2>
              <p className="text-gray-700">
                Freelancers agree:
              </p>
              <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-2">
                <li>Not to solicit or accept direct work from Styltara&apos;s clients for 24 months after the last engagement.</li>
                <li>Not to offer similar services to Styltara&apos;s clients independently or through another entity.</li>
              </ul>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Confidentiality</h2>
              <p className="text-gray-700">
                Freelancers must maintain the confidentiality of all client information, project details, and internal processes.
              </p>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p className="text-gray-700">
                All work done during assignments shall be the sole property of Styltara Studios Pvt Ltd.
              </p>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Breach</h2>
              <p className="text-gray-700">
                Violation of these terms will result in legal action, including financial penalties and injunctive relief.
              </p>
            </motion.section>
            
            <motion.div variants={itemVariants} className="mt-8 text-sm text-gray-500">
              <p>
                For questions about these terms, please contact us at{' '}
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

export default FreelancerTermsAndConditions;
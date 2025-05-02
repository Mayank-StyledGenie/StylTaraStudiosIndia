"use client";

import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="mt-2 text-sm text-white/80">Effective Date: April 30, 2025</p>
          </div>
          
          <div className="px-6 py-8 prose prose-rose max-w-none">
            <motion.p variants={itemVariants} className="text-gray-700 mb-8">
              At Styltara Studios Pvt Ltd, we respect your privacy and are committed to protecting your personal information.
            </motion.p>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Address</li>
                <li>Payment information</li>
              </ul>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Information</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>To provide and manage services</li>
                <li>To process payments</li>
                <li>To communicate updates and offers</li>
                <li>To improve our services</li>
              </ul>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Sharing of Information</h2>
              <p className="text-gray-700">
                We do not sell, rent, or trade your information. We may share information only with 
                trusted partners essential for delivering our services.
              </p>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700">
                We implement strict measures to protect your data. This includes encryption, secure servers,
                regular security assessments, and limited access to personal information by our staff.
              </p>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Cookies</h2>
              <p className="text-gray-700">
                Our website may use cookies to enhance user experience. Cookies are small files stored 
                on your device that help us provide you with a better browsing experience, analyze site 
                traffic, and personalize content. You can set your browser to refuse cookies, but this 
                may limit certain features of our website.
              </p>
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700">
                You have the right to access, update, or delete your personal data by contacting us at{' '}
                <a href="mailto:info@styltarastudios.com" className="text-[#401735] hover:underline">
                  info@styltarastudios.com
                </a>.
              </p>
              
            </motion.section>
            
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Changes to Policy</h2>
              <p className="text-gray-700">
                We may update our privacy policy. Any changes will be posted on this page with a revised 
                effective date. We encourage you to review our privacy policy periodically.
              </p>
            </motion.section>
            
            
            <div className="mt-10 text-sm text-gray-500">
              <p>
                If you have any questions about these Terms and Conditions, please contact us at{' '}
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

export default PrivacyPolicy;
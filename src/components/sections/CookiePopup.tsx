"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCookieBite } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

type CookiePreferences = {
  essential: boolean; 
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
};

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const savedPreferences = JSON.parse(localStorage.getItem('cookie-preferences') ?? '{}');
        setPreferences(prev => ({
          ...prev,
          ...savedPreferences
        }));
      } catch (error) {
        console.error('Error loading cookie preferences', error);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const newPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    setPreferences(newPreferences);
    saveConsent(newPreferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectNonEssential = () => {
    const newPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    setPreferences(newPreferences);
    saveConsent(newPreferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies can't be changed
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', 'true');
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    
    // Here you could also set actual cookies based on preferences
    // or trigger analytics/tracking initialization if allowed
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-1000">
      {!showPreferences ? (
        <div className="bg-white shadow-lg border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-3 sm:mb-0">
              <FaCookieBite size={24} className="text-amber-500 mr-2" />
              <p className="text-sm text-gray-700">
                We use cookies to improve your experience, analyze site traffic, and deliver personalized services.
                By continuing to browse our site, you consent to our use of cookies.{' '}
                <Link href="/CookiePolicy" className="text-blue-600 underline hover:text-blue-800">
                <button 
                  
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Learn more
                </button>
                </Link>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRejectNonEssential}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Reject Non-Essential
              </button>
              <Link 
                href="/CookiePolicy"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cookie Policy
              </Link>
              <button
                onClick={handleAcceptAll}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[#2C383D] hover:bg-blue-700"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg border-t border-gray-200 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FaCookieBite size={24} className="text-amber-500 mr-2" />
                Cookie Preferences
              </h2>
              <button 
                onClick={() => setShowPreferences(false)} 
                className="text-gray-400 hover:text-gray-500"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            
            <div className="prose prose-sm max-w-none mb-6">
              <p className="text-gray-700">
                <strong>Cookie Policy:</strong> We use cookies and similar technologies to enhance your browsing
                experience, serve personalized content, and analyze our traffic. Some cookies are essential for
                the functioning of the site, while others help us improve and personalize your experience.
              </p>
              <p className="text-gray-700">
                You can manage your preferences or withdraw your consent at any time by visiting the Cookie Settings.
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">Essential Cookies</h3>
                  <p className="text-sm text-gray-500">
                    Necessary for the website to function properly. Cannot be disabled.
                  </p>
                </div>
                <div className="bg-blue-500 relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
                  <span className="translate-x-5 relative inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ease-in-out"></span>
                </div>
              </div>
              
              {[
                {
                  key: 'analytics',
                  title: 'Analytics Cookies',
                  description: 'Help us understand how visitors interact with our website.'
                },
                {
                  key: 'marketing',
                  title: 'Marketing Cookies',
                  description: 'Used to track visitors across websites for advertising purposes.'
                },
                {
                  key: 'personalization',
                  title: 'Personalization Cookies',
                  description: 'Allow us to remember your preferences and customize your experience.'
                }
              ].map(({key, title, description}) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange(key as keyof CookiePreferences)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      preferences[key as keyof CookiePreferences] ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      preferences[key as keyof CookiePreferences] ? 'translate-x-5' : 'translate-x-0'
                    }`}></span>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleRejectNonEssential}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Reject All
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Preferences
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <Link href="/cookie-policy" className="underline hover:text-gray-700">
                View full Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
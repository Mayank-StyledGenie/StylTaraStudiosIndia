"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { colors } from '@/styles/colors';

const ServiceBookingSuccess = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md opacity-0 transform translate-y-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : ''}`}>
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-xl sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"  style={{backgroundColor: colors.primary.darkpurple}}>
              <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">Service Booking Confirmed!</h2>
            <p className="mt-3 text-center text-sm sm:text-base text-gray-600">
              Thank you for booking with StylTara Studios.<br/> 
              We&apos;ve received your request and will be in touch shortly.
            </p>
            
            <div className="mt-8 space-y-4">
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to your email address with all the details.
              </p>
              
              <div className="border-t border-gray-200 pt-5">
                <h3 className="text-sm font-medium text-gray-700">What happens next?</h3>
                <ul className="mt-4 text-sm text-left text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{color: colors.primary.darkpurple}}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {' '}Our team will review your booking details
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{color: colors.primary.darkpurple}}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {' '}You&apos;ll receive a confirmation with any additional information
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{color: colors.primary.darkpurple}}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {' '}Our team will be ready to provide exceptional service on your scheduled date
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link href="/" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200" style={{backgroundColor: colors.primary.gunmetal}}>
                  Return to Home
                </Link>
                <Link href="/#services" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                  Explore More Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingSuccess;
"use client";
import Link from 'next/link';
import { useEffect,useState } from 'react';
import { colors } from '@/styles/colors';

const RegistrationSuccess = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }
  , []);

  
  return (
    <div className={`min-h-screen bg-gradient-to- from-be-50 to-igo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 opacity-0 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8'}`}>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl inset-shadow-sm sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100" style={{ backgroundColor: colors.primary.darkpurple }}>
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Registration Successful!</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Thank you for registering.<br/> We will review your application and get back to you soon.
            </p>
            
            <div className="mt-6" >
              <Link href="/" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" style={{ backgroundColor: colors.primary.gunmetal}}>
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
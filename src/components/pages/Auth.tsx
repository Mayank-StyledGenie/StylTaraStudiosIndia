"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors } from '@/styles/colors';

const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to profile if already logged in
    if (status === 'authenticated' && session) {
      router.push('/profile');
    }

    // Set error message if present in URL
    if (error) {
      setErrors(prevErrors => ({
        ...prevErrors,
        general: `Authentication error: ${error}`
      }));
    }
  }, [session, status, router, error]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrors({
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      general: ''
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    // Using validateForm as an inner function to avoid dependency issues
    const validateFormData = () => {
      const newErrors = {
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        general: ''
      };

      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (!isLogin) {
        if (formData.name && formData.name.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        }

        if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
          newErrors.mobile = 'Please enter a valid 10-digit mobile number';
        }

        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }

      setErrors(newErrors);
    };

    validateFormData();
  }, [formData, isLogin]);

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Add state parameter to track that redirect is happening properly
      await signIn(provider, {
        callbackUrl: '/profile',
        redirect: true
      });
    } finally {
      // This might not run due to redirection, but add it for safety
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check for validation errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) return;

    // Check for empty required fields
    if (!formData.email || !formData.password) {
      setErrors({
        ...errors,
        general: 'Email and password are required'
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle login
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password
        });

        if (result?.error) {
          setErrors({
            ...errors,
            general: 'Invalid email or password'
          });
        } else {
          router.push('/profile');
        }
      } else {
        // Handle registration
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            password: formData.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? 'Registration failed');
        }

        // Auto login after successful registration
        await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password
        });

        router.push('/profile');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrors(prevErrors => ({
        ...prevErrors,
        general: errorMessage
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Extract the button label logic to a separate variable
  const getButtonLabel = () => {
    if (isLoading) {
      return (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      );
    }
    return isLogin ? 'Login' : 'Create Account';
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-4 mb-15 mt-7">
      <div className="w-full max-w-md mb-15 bg-white rounded-lg shadow-2xl p-6 md:p-8 inset-shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2" style={{ color: colors.primary.darkpurple }}>
          {isLogin ? 'Login' : 'Create Account'}
        </h1>
        <p className="text-center text-black mb-6">
          {isLogin
            ? 'Welcome back! Please login to your account.'
            : 'Create a new account to get started.'}
        </p>

        <div className="flex flex-col space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaGoogle className="h-5 w-5 mr-2" style={{ color: '#34A853' }} />
            Continue with Google
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="mobile" className="block text-sm font-medium text-black mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.mobile ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex justify-center items-center"
            style={{ backgroundColor: colors.primary.darkpurple }}
          >
            {getButtonLabel()}
          </button>
        </form>

        <button
          onClick={handleToggle}
          className="w-full mt-4 text-black hover:text-black text-sm font-medium py-2 text-center"
        >
          {isLogin ? 'New user? Create an account' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { colors } from '@/styles/colors';

interface FormData {
  fullName: string;
  contactEmail: string;
  contactPhone: string;
  consultationMode: string;
  trainingLocation: string;
  areaOfInterest: string;
  hasBackground: string;
  backgroundDetails: string;
  trainingReason: string;
  preferredLanguage: string;
  preferredDateTime: string;
  additionalQuestions: string;
}

interface FormErrors {
  fullName?: string;
  contactEmail?: string;
  contactPhone?: string;
  consultationMode?: string;
  trainingLocation?: string;
  areaOfInterest?: string;
  hasBackground?: string;
  backgroundDetails?: string;
  preferredLanguage?: string;
  preferredDateTime?: string;
}

// Type for form field values
type FormFieldValue = string | undefined;

const MakeupAndStylingTrainingsConsultationForm = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    contactEmail: '',
    contactPhone: '',
    consultationMode: '',
    trainingLocation: '',
    areaOfInterest: '',
    hasBackground: '',
    backgroundDetails: '',
    trainingReason: '',
    preferredLanguage: '',
    preferredDateTime: '',
    additionalQuestions: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const consultationModeOptions = ['Online', 'Offline'];
  const locationOptions = ['Mumbai', 'Pune', 'Jaipur', 'Delhi'];
  const areaOfInterestOptions = [
    'Basic Makeup',
    'Advanced Makeup',
    'Personal Styling',
    'Professional Styling',
    'Complete Image Makeover'
  ];
  const hasBackgroundOptions = ['Yes', 'No'];
  const languageOptions = ['English', 'Hindi'];
  
  // Generic handler for all form fields
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    validateField(name, value);
  };
  
  // Field validators as separate functions to reduce cognitive complexity
  const fieldValidators = {
    fullName: (value: FormFieldValue, newErrors: FormErrors): boolean => {
      if (!value?.trim()) {
        newErrors.fullName = 'Name is required';
        return false;
      } 
      
      if (value.trim().length < 2) {
        newErrors.fullName = 'Name must be at least 2 characters';
        return false;
      }
      
      return true;
    },
    
    contactEmail: (value: FormFieldValue, newErrors: FormErrors): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!value?.trim()) {
        newErrors.contactEmail = 'Email is required';
        return false;
      } 
      
      if (!emailRegex.test(value)) {
        newErrors.contactEmail = 'Please enter a valid email address';
        return false;
      }
      
      return true;
    },
    
    contactPhone: (value: FormFieldValue, newErrors: FormErrors): boolean => {
      const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
      
      if (!value?.trim()) {
        newErrors.contactPhone = 'Phone number is required';
        return false;
      } 
      
      if (!phoneRegex.test(value)) {
        newErrors.contactPhone = 'Please enter a valid phone number';
        return false;
      }
      
      return true;
    },
    
    consultationMode: (value: FormFieldValue, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.consultationMode = 'Please select a consultation mode';
        return false;
      }
      
      return true;
    },
    
    trainingLocation: (value: FormFieldValue, newErrors: FormErrors, formData: FormData): boolean => {
      if (formData.consultationMode === 'Offline' && !value) {
        newErrors.trainingLocation = 'Location is required for offline training';
        return false;
      }
      
      return true;
    },
    
    areaOfInterest: (value: FormFieldValue, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.areaOfInterest = 'Please select an area of interest';
        return false;
      }
      
      return true;
    },
    
    hasBackground: (value: FormFieldValue, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.hasBackground = 'Please indicate if you have background in styling/makeup';
        return false;
      }
      
      return true;
    },
    
    backgroundDetails: (value: FormFieldValue, newErrors: FormErrors, formData: FormData): boolean => {
      if (formData.hasBackground === 'Yes' && !value?.trim()) {
        newErrors.backgroundDetails = 'Please explain your background';
        return false;
      }
      
      return true;
    },
    
    preferredLanguage: (value: FormFieldValue, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.preferredLanguage = 'Please select your preferred language';
        return false;
      }
      
      return true;
    },
    
    preferredDateTime: (value: FormFieldValue, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.preferredDateTime = 'Please select your preferred date and time';
        return false;
      }
      
      return true;
    }
  };
  
  // Simpler validateField function
  const validateField = (name: string, value: FormFieldValue): boolean => {
    const newErrors = { ...errors };
    
    // Clear any existing error for this field
    delete newErrors[name as keyof FormErrors];
    
    // Call the appropriate validation function based on field name
    const validator = fieldValidators[name as keyof typeof fieldValidators];
    const isValid = validator 
      ? validator(value, newErrors, formData) 
      : true;
    
    setErrors(newErrors);
    return isValid;
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    
    const fields: (keyof FormData)[] = [
      'fullName', 'contactEmail', 'contactPhone', 'consultationMode', 
      'areaOfInterest', 'hasBackground', 'preferredLanguage', 'preferredDateTime'
    ];
    
    if (formData.consultationMode === 'Offline') {
      fields.push('trainingLocation');
    }
    
    if (formData.hasBackground === 'Yes') {
      fields.push('backgroundDetails');
    }
    
    fields.forEach(field => {
      const valid = validateField(field, formData[field]);
      if (!valid) isValid = false;
    });
    
    return isValid;
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSubmit = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSubmit.append(key, formData[key as keyof FormData].toString());
      });
      
      const response = await fetch('/api/makeupstylingandtrainingconsultation', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      if (response.ok) {
        toast.success('Training consultation request submitted successfully!');
        router.push('/success');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('There was an error submitting your training consultation request');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 sm:py-12 px-3 sm:px-6 lg:px-8 opacity-0 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8'}`}>
      <div className="max-w-3xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
        <div className="bg-gray-600 py-3 sm:py-6 px-4 sm:px-8" style={{backgroundColor: colors.primary.darkpurple}}>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Makeup & Styling Training </h1>
          <p className="text-white text-xs sm:text-base mt-1 sm:mt-2">Let our experts help you develop your makeup and styling skills</p>
        </div>
        
        <form onSubmit={handleSubmit} className="py-4 sm:py-8 px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.fullName ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="Enter your name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.contactEmail ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="your.email@example.com"
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.contactPhone ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="+91 9876543210"
              />
              {errors.contactPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="consultationMode" className="block text-sm font-medium text-gray-700">
                Preferred Mode <span className="text-red-500">*</span><span className="block text-xs text-gray-500 mt-1">(Offline is currently available in Jaipur, Mumbai, Pune, Delhi only)</span>
              </label>
              <select
                id="consultationMode"
                name="consultationMode"
                value={formData.consultationMode}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.consultationMode ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select mode</option>
                {consultationModeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.consultationMode && (
                <p className="mt-1 text-sm text-red-600">{errors.consultationMode}</p>
              )}
            </div>
            
            {formData.consultationMode === 'Offline' && (
              <div className="col-span-1">
                <label htmlFor="trainingLocation" className="block text-sm font-medium text-gray-700">
                  Location (if offline) <span className="text-red-500">*</span>
                </label>
                <select
                  id="trainingLocation"
                  name="trainingLocation"
                  value={formData.trainingLocation}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.trainingLocation ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                >
                  <option value="">Select location</option>
                  {locationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.trainingLocation && (
                  <p className="mt-1 text-sm text-red-600">{errors.trainingLocation}</p>
                )}
              </div>
            )}
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="areaOfInterest" className="block text-sm font-medium text-gray-700">
                Area of Interest <span className="text-red-500">*</span>
              </label>
              <select
                id="areaOfInterest"
                name="areaOfInterest"
                value={formData.areaOfInterest}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.areaOfInterest ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select area of interest</option>
                {areaOfInterestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.areaOfInterest && (
                <p className="mt-1 text-sm text-red-600">{errors.areaOfInterest}</p>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="hasBackground" className="block text-sm font-medium text-gray-700">
                Background in Styling/Makeup (if any) <span className="text-red-500">*</span>
              </label>
              <select
                id="hasBackground"
                name="hasBackground"
                value={formData.hasBackground}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.hasBackground ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select an option</option>
                {hasBackgroundOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.hasBackground && (
                <p className="mt-1 text-sm text-red-600">{errors.hasBackground}</p>
              )}
            </div>
            
            {formData.hasBackground === 'Yes' && (
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="backgroundDetails" className="block text-sm font-medium text-gray-700">
                  Please explain your background <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="backgroundDetails"
                  name="backgroundDetails"
                  rows={3}
                  value={formData.backgroundDetails}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.backgroundDetails ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                  placeholder="Describe your experience in makeup or styling"
                />
                {errors.backgroundDetails && (
                  <p className="mt-1 text-sm text-red-600">{errors.backgroundDetails}</p>
                )}
              </div>
            )}
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="trainingReason" className="block text-sm font-medium text-gray-700">
                Why do you want to take this training?
              </label>
              <textarea
                id="trainingReason"
                name="trainingReason"
                rows={3}
                value={formData.trainingReason}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                placeholder="Tell us why you're interested in this training"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Preferred language of training <span className="text-red-500">*</span>
              </p>
              <div className="flex space-x-6">
                {languageOptions.map((language) => (
                  <div key={language} className="flex items-center">
                    <input
                      id={`language-${language}`}
                      name="preferredLanguage"
                      type="radio"
                      value={language}
                      checked={formData.preferredLanguage === language}
                      onChange={handleChange}
                      className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <label htmlFor={`language-${language}`} className="ml-2 text-sm text-gray-700">
                      {language}
                    </label>
                  </div>
                ))}
              </div>
              {errors.preferredLanguage && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredLanguage}</p>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="preferredDateTime" className="block text-sm font-medium text-gray-700">
                Preferred date/time slot <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="preferredDateTime"
                name="preferredDateTime"
                value={formData.preferredDateTime}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.preferredDateTime ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              />
              {errors.preferredDateTime && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredDateTime}</p>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="additionalQuestions" className="block text-sm font-medium text-gray-700">
                Additional questions or expectations
              </label>
              <textarea
                id="additionalQuestions"
                name="additionalQuestions"
                rows={3}
                value={formData.additionalQuestions}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                placeholder="Do you have any specific questions or expectations from this training?"
              />
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              style={{ backgroundColor: colors.primary.darkpurple }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Book Now'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeupAndStylingTrainingsConsultationForm;
"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { colors } from '@/styles/colors';

interface FormData {
  fullName: string;
  contactEmail: string;
  contactPhone: string;
  occupation: string;
  coachingPurpose: string;
  coachingMode: string;
  preferredDateTime: string;
  hasPreviousCoaching: string;
  preferredLanguage: string;
  additionalExpectations: string;
}

interface FormErrors {
  fullName?: string;
  contactEmail?: string;
  contactPhone?: string;
  occupation?: string;
  coachingPurpose?: string;
  coachingMode?: string;
  preferredDateTime?: string;
  hasPreviousCoaching?: string;
  preferredLanguage?: string;
}

// Moving regex patterns outside of case blocks
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{8,20}$/;

const SoftSkillsAndEtiquetteCoachingForm = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    contactEmail: '',
    contactPhone: '',
    occupation: '',
    coachingPurpose: '',
    coachingMode: '',
    preferredDateTime: '',
    hasPreviousCoaching: '',
    preferredLanguage: '',
    additionalExpectations: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const coachingPurposeOptions = [
    'Professional communication',
    'Public speaking',
    'Dining/business etiquette',
    'Personal branding',
    'Interview preparation'
  ];
  const coachingModeOptions = ['Online', 'In-person'];
  const hasPreviousCoachingOptions = ['Yes', 'No'];
  const languageOptions = ['English', 'Hindi'];
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    validateField(name, value);
  };
  
  // Modified to be different from handleChange
  const handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Add specific datetime handling logic
    const selectedDate = new Date(value);
    const now = new Date();
    
    if (selectedDate < now) {
      const newErrors = { ...errors };
      newErrors.preferredDateTime = 'Please select a future date and time';
      setErrors(newErrors);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear the error if it exists
      if (errors.preferredDateTime) {
        const newErrors = { ...errors };
        delete newErrors.preferredDateTime;
        setErrors(newErrors);
      }
    }
  };
  
  // Field validators as separate functions to reduce cognitive complexity
  const validators = {
    fullName: (value: string): string | undefined => {
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return undefined;
    },
    
    contactEmail: (value: string): string | undefined => {
      if (!value.trim()) return 'Email is required';
      if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
      return undefined;
    },
    
    contactPhone: (value: string): string | undefined => {
      if (!value.trim()) return 'Phone number is required';
      if (!PHONE_REGEX.test(value)) return 'Please enter a valid phone number';
      return undefined;
    },
    
    occupation: (value: string): string | undefined => {
      if (!value.trim()) return 'Occupation/Current Role is required';
      return undefined;
    },
    
    coachingPurpose: (value: string): string | undefined => {
      if (!value) return 'Please select a purpose for coaching';
      return undefined;
    },
    
    coachingMode: (value: string): string | undefined => {
      if (!value) return 'Please select a coaching mode';
      return undefined;
    },
    
    hasPreviousCoaching: (value: string): string | undefined => {
      if (!value) return 'Please indicate if you have taken similar coaching before';
      return undefined;
    },
    
    preferredLanguage: (value: string): string | undefined => {
      if (!value) return 'Please select your preferred language';
      return undefined;
    },
    
    preferredDateTime: (value: string): string | undefined => {
      if (!value) return 'Please select your preferred date and time';
      return undefined;
    }
  };
  
  // Simplified validateField function
  const validateField = (name: string, value: string): boolean => {
    const newErrors = { ...errors };
    const validator = validators[name as keyof typeof validators];
    
    if (validator) {
      const errorMessage = validator(value);
      
      if (errorMessage) {
        newErrors[name as keyof FormErrors] = errorMessage;
        setErrors(newErrors);
        return false;
      } else {
        delete newErrors[name as keyof FormErrors];
        setErrors(newErrors);
        return true;
      }
    }
    
    return true;
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    
    const fields: (keyof FormData)[] = [
      'fullName', 'contactEmail', 'contactPhone', 'occupation', 
      'coachingPurpose', 'coachingMode', 'hasPreviousCoaching',
      'preferredLanguage', 'preferredDateTime'
    ];
    
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
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });
      
      const response = await fetch('/api/softskills', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      if (response.ok) {
        toast.success('Coaching consultation request submitted successfully!');
        router.push('/success');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('There was an error submitting your coaching consultation request');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 sm:py-12 px-3 sm:px-6 lg:px-8 opacity-0 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8'}`}>
      <div className="max-w-3xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
        <div className="bg-gray-600 py-3 sm:py-6 px-4 sm:px-8" style={{backgroundColor: colors.primary.darkpurple}}>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Soft Skills & Etiquette Coaching</h1>
          <p className="text-white text-xs sm:text-base mt-1 sm:mt-2">Enhance your professional presence and communication skills</p>
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
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                Occupation/Current Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.occupation ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="Enter your current job role or occupation"
              />
              {errors.occupation && (
                <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="coachingPurpose" className="block text-sm font-medium text-gray-700">
                Purpose of Coaching <span className="text-red-500">*</span>
              </label>
              <select
                id="coachingPurpose"
                name="coachingPurpose"
                value={formData.coachingPurpose}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.coachingPurpose ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select purpose</option>
                {coachingPurposeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.coachingPurpose && (
                <p className="mt-1 text-sm text-red-600">{errors.coachingPurpose}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="coachingMode" className="block text-sm font-medium text-gray-700">
                Preferred Coaching Mode <span className="text-red-500">*</span><span className="block text-xs text-gray-500 mt-1">(In-person is currently available in Jaipur, Mumbai, Pune, Delhi only)</span>
              </label>
              <select
                id="coachingMode"
                name="coachingMode"
                value={formData.coachingMode}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.coachingMode ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select mode</option>
                {coachingModeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.coachingMode && (
                <p className="mt-1 text-sm text-red-600">{errors.coachingMode}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="hasPreviousCoaching" className="block text-sm font-medium text-gray-700">
                Have you taken any similar coaching before? <span className="text-red-500">*</span>
              </label>
              <select
                id="hasPreviousCoaching"
                name="hasPreviousCoaching"
                value={formData.hasPreviousCoaching}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.hasPreviousCoaching ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select an option</option>
                {hasPreviousCoachingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.hasPreviousCoaching && (
                <p className="mt-1 text-sm text-red-600">{errors.hasPreviousCoaching}</p>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="preferredDateTime" className="block text-sm font-medium text-gray-700">
                Preferred Date/Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="preferredDateTime"
                name="preferredDateTime"
                value={formData.preferredDateTime}
                onChange={handleDateTimeChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.preferredDateTime ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              />
              {errors.preferredDateTime && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredDateTime}</p>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Language preference <span className="text-red-500">*</span>
                </legend>
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
              </fieldset>
              {errors.preferredLanguage && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredLanguage}</p>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="additionalExpectations" className="block text-sm font-medium text-gray-700">
                Additional expectations or areas to focus on
              </label>
              <textarea
                id="additionalExpectations"
                name="additionalExpectations"
                rows={3}
                value={formData.additionalExpectations}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                placeholder="Let us know about any specific areas you'd like to focus on during the coaching"
              />
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              style={{backgroundColor: colors.primary.darkpurple}}
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

export default SoftSkillsAndEtiquetteCoachingForm;
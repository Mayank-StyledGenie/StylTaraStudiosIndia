"use client";
import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { colors } from '@/styles/colors';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  portfolioLink: string;
  certificationsFile: File | null;
  socialMediaLinks: string;
  location: string;
  specialization: string;
  experience: string;
  trainingMethods: string;
  availability: string;
  rate: string;
  references: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  portfolioLink?: string;
  certificationsFile?: string;
  location?: string;
  specialization?: string;
  experience?: string;
  availability?: string;
  rate?: string;
  agreeToTerms?: string;
}

// Moving regex patterns outside of case blocks
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{8,20}$/;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const SoftSkillsEtiquetteTrainerForm = () => {
  const router = useRouter();
  const certFileInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);  
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    portfolioLink: '',
    certificationsFile: null,
    socialMediaLinks: '',
    location: '',
    specialization: '',
    experience: '',
    trainingMethods: '',
    availability: '',
    rate: '',
    references: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certFileName, setCertFileName] = useState('');
  
  const specializationOptions = [
    'Communication Skills', 'Leadership', 'Corporate Etiquette','Other'
  ];
  
  const availabilityOptions = ['Full-time', 'Part-time', 'Project-Based'];
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    validateField(name, type === 'checkbox' ? (checked ?? false) : value);
  };
  
  const handleCertFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, certificationsFile: file }));
      setCertFileName(file.name);
      validateField('certificationsFile', file);
    }
  };
  
  const triggerCertFileInput = () => {
    certFileInputRef.current?.click();
  };

  // Field validators as separate functions to reduce cognitive complexity
  const validators = {
    fullName: (value: string): string | undefined => {
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return undefined;
    },
    
    email: (value: string): string | undefined => {
      if (!value.trim()) return 'Email is required';
      if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
      return undefined;
    },
    
    phone: (value: string): string | undefined => {
      if (!value.trim()) return 'Phone number is required';
      if (!PHONE_REGEX.test(value)) return 'Please enter a valid phone number';
      return undefined;
    },
    
    certificationsFile: (value: File): string | undefined => {
      if (!value) return 'Certification file is required';
      if (value.size > MAX_FILE_SIZE) return 'File size exceeds 10MB limit';
      if (!ACCEPTED_FILE_TYPES.includes(value.type)) {
        return 'Invalid file format. Accepted formats: PDF, DOC, DOCX, JPG, PNG, ZIP';
      }
      return undefined;
    },
    
    location: (value: string): string | undefined => {
      if (!value.trim()) return 'Location is required';
      return undefined;
    },
    
    specialization: (value: string): string | undefined => {
      if (!value) return 'Please select a specialization';
      return undefined;
    },
    
    experience: (value: string): string | undefined => {
      if (!value.trim()) return 'Years of experience is required';
      return undefined;
    },
    
    availability: (value: string): string | undefined => {
      if (!value) return 'Please select your availability';
      return undefined;
    },
    
    rate: (value: string): string | undefined => {
      if (!value.trim()) return 'Rate is required';
      return undefined;
    },
    
    agreeToTerms: (value: boolean): string | undefined => {
      if (!value) return 'You must agree to the terms and conditions';
      return undefined;
    }
  };

  // Simplified validateField function to reduce cognitive complexity
  const validateField = (name: string, value: string | boolean | File | null): boolean => {
    const newErrors = { ...errors };
    let isValid = true;

    // Handle each field type appropriately
    if (name === 'fullName' || name === 'email' || name === 'phone' ||
        name === 'location' || name === 'specialization' || 
        name === 'experience' || name === 'availability' || name === 'rate') {
      const validator = validators[name as keyof typeof validators];
      // Cast validator to the correct function type to fix type issue
      const typedValidator = validator as (val: string) => string | undefined;
      const errorMessage = typedValidator(value as string);
      
      if (errorMessage) {
        newErrors[name as keyof FormErrors] = errorMessage;
        isValid = false;
      } else {
        delete newErrors[name as keyof FormErrors];
      }
    } 
    else if (name === 'certificationsFile' && value) {
      const errorMessage = validators.certificationsFile(value as File);
      
      if (errorMessage) {
        newErrors.certificationsFile = errorMessage;
        isValid = false;
      } else {
        delete newErrors.certificationsFile;
      }
    }
    else if (name === 'agreeToTerms') {
      const errorMessage = validators.agreeToTerms(value as boolean);
      
      if (errorMessage) {
        newErrors.agreeToTerms = errorMessage;
        isValid = false;
      } else {
        delete newErrors.agreeToTerms;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    
    const fields: (keyof FormData)[] = [
      'fullName', 'email', 'phone', 'location', 'certificationsFile',
      'specialization', 'experience', 'availability', 'agreeToTerms'
    ];
    
    fields.forEach(field => {
      // Fixed redundant condition
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
        if (key !== 'certificationsFile' && key !== 'agreeToTerms') {
          formDataToSubmit.append(key, value as string);
        }
      });
      
      formDataToSubmit.append('agreeToTerms', formData.agreeToTerms.toString());
      
      if (formData.certificationsFile) {
        formDataToSubmit.append('certificationsFile', formData.certificationsFile);
      }
      
      const response = await fetch('/api/softskills&etiquettetrainer', {
        method: 'POST',
        body: formDataToSubmit, 
      });
      
      if (response.ok) {
        toast.success('Registration submitted successfully!');
        router.push('/registrationsuccess');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('There was an error submitting your registration');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from--50 to--100 py-4 sm:py-12 px-3 sm:px-6 lg:px-8 opacity-0 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8'}`}>
      <div className="max-w-3xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
        <div className="bg-gray-600 py-3 sm:py-6 px-4 sm:px-8" style={{backgroundColor: colors.primary.darkpurple}}>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Freelance Soft Skills & Etiquette Trainer Registration</h1>
          <p className="text-white text-xs sm:text-base mt-1 sm:mt-2">Join our network of professional trainers</p>
        </div>
        
        <form onSubmit={handleSubmit} className="py-4 sm:py-8 px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-1">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.fullName ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.email ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.phone ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                placeholder="+91 2345678900"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="portfolioLink" className="block text-sm font-medium text-gray-700">
                Trainer Portfolio/Website Link
              </label>
              <input
                type="url"
                id="portfolioLink"
                name="portfolioLink"
                value={formData.portfolioLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="https://yourportfolio.com"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="certificationsFile" className="block text-sm font-medium text-gray-700">
                Certifications/Accreditations - Upload <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="certificationsFile"
                  name="certificationsFile"
                  ref={certFileInputRef}
                  onChange={handleCertFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                />
                <button
                  type="button"
                  onClick={triggerCertFileInput}
                  className={`inline-flex items-center px-4 py-2 border ${
                    errors.certificationsFile ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  Choose File
                </button>
                <span className="ml-3 text-sm text-gray-500">
                  {certFileName || "No file chosen"}
                </span>
              </div>
              {errors.certificationsFile && (
                <p className="mt-1 text-sm text-red-600">{errors.certificationsFile}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Accepted formats: PDF, DOC, DOCX, JPG, PNG, ZIP (max 10MB)
              </p>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="socialMediaLinks" className="block text-sm font-medium text-gray-700">
                Social Media Links (Optional)
              </label>
              <input
                type="text"
                id="socialMediaLinks"
                name="socialMediaLinks"
                value={formData.socialMediaLinks}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="LinkedIn, Twitter, Instagram (comma separated)"
              />
            </div>
            
            <div className="col-span-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.location ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                placeholder="City, Country"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                Specialization <span className="text-red-500">*</span>
              </label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.specialization ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
              >
                <option value="">Select specialization</option>
                {specializationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.experience ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                placeholder="e.g., 5 years"
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                Availability <span className="text-red-500">*</span>
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.availability ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
              >
                <option value="">Select availability</option>
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.availability && (
                <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                Rate 
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="text"
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  className={`pl-7 block w-full rounded-md border ${
                    errors.rate ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                  placeholder="e.g., 150/hour or 900/day"
                />
              </div>
              {errors.rate && (
                <p className="mt-1 text-sm text-red-600">{errors.rate}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="trainingMethods" className="block text-sm font-medium text-gray-700">
                Training Methods/Approach (Optional)
              </label>
              <textarea
                id="trainingMethods"
                name="trainingMethods"
                rows={3}
                value={formData.trainingMethods}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="Describe your training methods and approach"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="references" className="block text-sm font-medium text-gray-700">
                References/Client Testimonials (Optional)
              </label>
              <textarea
                id="references"
                name="references"
                rows={3}
                value={formData.references}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="Please provide details of previous clients or testimonials"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${
                      errors.agreeToTerms ? 'border-red-300 ring-red-500' : ''
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className={`font-medium ${errors.agreeToTerms ? 'text-red-700' : 'text-gray-700'}`}>
                    I agree to the <a href="/T&C-freelancers" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a> and <a href="/Privacy-freelancers" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a> <span className="text-red-500">*</span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                'Submit Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoftSkillsEtiquetteTrainerForm;
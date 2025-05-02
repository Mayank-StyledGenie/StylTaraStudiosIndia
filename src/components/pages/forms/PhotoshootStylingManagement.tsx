"use client";
import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { colors } from '@/styles/colors';
import Image from 'next/image';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  photoshootType: string;
  location: string;
  preferredDate: string;
  hasPhotographer: string;
  stylingRequirements: string;
  needsHairMakeup: string;
  references: File[];
  theme: string;
  budgetRange: number;
  additionalNotes: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  photoshootType?: string;
  location?: string;
  preferredDate?: string;
  hasPhotographer?: string;
  stylingRequirements?: string;
  needsHairMakeup?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{8,20}$/;

const PhotoshootStylingManagementForm = () => {
  const router = useRouter();
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    photoshootType: '',
    location: '',
    preferredDate: '',
    hasPhotographer: '',
    stylingRequirements: '',
    needsHairMakeup: '',
    references: [],
    theme: '',
    budgetRange: 5000,
    additionalNotes: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceFileNames, setReferenceFileNames] = useState<string[]>([]);
  const [referencePreviewUrls, setReferencePreviewUrls] = useState<string[]>([]);
  
  const photoshootTypeOptions = ['Portfolio', 'Fashion', 'Brand', 'Maternity', 'Family', 'Other'];
  const locationOptions = ['Mumbai', 'Pune', 'Jaipur', 'Delhi'];
  const stylingRequirementsOptions = ['Clothes only', 'Clothes + Accessories', 'Full styling + on-day assistance'];
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    validateField(name, value);
  };
  
  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };
  
  const handleReferenceUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (fileList.length > 5) {
        toast.error('Maximum 5 references allowed');
        return;
      }
      
      const newFiles = [...formData.references, ...fileList].slice(0, 5);
      setFormData(prev => ({ ...prev, references: newFiles }));
      
      const fileNames = newFiles.map(file => file.name);
      setReferenceFileNames(fileNames);
      
      const previewUrls = newFiles.map(file => URL.createObjectURL(file));
      
      referencePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      
      setReferencePreviewUrls(previewUrls);
    }
  };
  
  const removeReference = (index: number) => {
    const updatedReferences = [...formData.references];
    updatedReferences.splice(index, 1);
    setFormData(prev => ({ ...prev, references: updatedReferences }));
    
    const updatedFileNames = [...referenceFileNames];
    updatedFileNames.splice(index, 1);
    setReferenceFileNames(updatedFileNames);
    
    URL.revokeObjectURL(referencePreviewUrls[index]);
    
    const updatedPreviewUrls = [...referencePreviewUrls];
    updatedPreviewUrls.splice(index, 1);
    setReferencePreviewUrls(updatedPreviewUrls);
  };
  
  const triggerReferenceInput = () => {
    referenceInputRef.current?.click();
  };
  
  const validators = {
    fullName: (value: string): string | undefined => {
      if (!value.trim()) return 'Name is required';
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
    
    photoshootType: (value: string): string | undefined => {
      if (!value) return 'Please select a photoshoot type';
      return undefined;
    },
    
    location: (value: string): string | undefined => {
      if (!value) return 'Please select a location';
      return undefined;
    },
    
    preferredDate: (value: string): string | undefined => {
      if (!value) return 'Please select a preferred date';
      return undefined;
    },
    
    hasPhotographer: (value: string): string | undefined => {
      if (!value) return 'Please indicate if you have a photographer';
      return undefined;
    },
    
    stylingRequirements: (value: string): string | undefined => {
      if (!value) return 'Please select your styling requirements';
      return undefined;
    },
    
    needsHairMakeup: (value: string): string | undefined => {
      if (!value) return 'Please indicate if you need hair & makeup';
      return undefined;
    }
  };
  
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
      'fullName', 'email', 'phone', 'photoshootType',
      'location', 'preferredDate', 'hasPhotographer', 
      'stylingRequirements', 'needsHairMakeup'
    ];
    
    fields.forEach(field => {
      const fieldValue = typeof formData[field] === 'string' 
        ? formData[field]
        : '';
      
      const valid = validateField(field, fieldValue);
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
        if (key !== 'references') {
          if (typeof value === 'number' || typeof value === 'boolean') {
            formDataToSubmit.append(key, value.toString());
          } else if (typeof value === 'string') {
            formDataToSubmit.append(key, value);
          }
        }
      });
      
      formData.references.forEach((reference, index) => {
        formDataToSubmit.append(`reference${index + 1}`, reference);
      });
      
      const response = await fetch('/api/PhotoshootStylingManagement', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      if (response.ok) {
        toast.success('Photoshoot styling request submitted successfully!');
        router.push('/success');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('There was an error submitting your styling request');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 sm:py-12 px-3 sm:px-6 lg:px-8 opacity-0 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8'}`}>
      <div className="max-w-3xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
        <div className="bg-gray-600 py-3 sm:py-6 px-4 sm:px-8" style={{backgroundColor: colors.primary.darkpurple}}>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Photoshoot Styling & Management</h1>
          <p className="text-white text-xs sm:text-base mt-1 sm:mt-2">Let our expert stylists create the perfect look for your photoshoot</p>
        </div>
        
        <form onSubmit={handleSubmit} className="py-4 sm:py-8 px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-1">
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
                placeholder="Your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.email ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
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
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="+91 9876543210"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="photoshootType" className="block text-sm font-medium text-gray-700">
                Type of Photoshoot <span className="text-red-500">*</span>
              </label>
              <select
                id="photoshootType"
                name="photoshootType"
                value={formData.photoshootType}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.photoshootType ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select photoshoot type</option>
                {photoshootTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.photoshootType && (
                <p className="mt-1 text-sm text-red-600">{errors.photoshootType}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Photoshoot Location <span className="text-red-500">*</span>
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.location ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select location</option>
                {locationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                Preferred Date(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.preferredDate ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              />
              {errors.preferredDate && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="hasPhotographer-yes" className="block text-sm font-medium text-gray-700 mb-2">
                Do you already have a photographer? <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    id="hasPhotographer-yes"
                    name="hasPhotographer"
                    type="radio"
                    value="Yes"
                    checked={formData.hasPhotographer === 'Yes'}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="hasPhotographer-yes" className="ml-2 text-sm text-gray-700">
                    Yes
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="hasPhotographer-no"
                    name="hasPhotographer"
                    type="radio"
                    value="No"
                    checked={formData.hasPhotographer === 'No'}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="hasPhotographer-no" className="ml-2 text-sm text-gray-700">
                    No
                  </label>
                </div>
              </div>
              {errors.hasPhotographer && (
                <p className="mt-1 text-sm text-red-600">{errors.hasPhotographer}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="stylingRequirements" className="block text-sm font-medium text-gray-700">
                Styling Requirements <span className="text-red-500">*</span>
              </label>
              <select
                id="stylingRequirements"
                name="stylingRequirements"
                value={formData.stylingRequirements}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.stylingRequirements ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select styling requirements</option>
                {stylingRequirementsOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.stylingRequirements && (
                <p className="mt-1 text-sm text-red-600">{errors.stylingRequirements}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="needsHairMakeup-yes" className="block text-sm font-medium text-gray-700 mb-2">
                Do you need hair & makeup? <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    id="needsHairMakeup-yes"
                    name="needsHairMakeup"
                    type="radio"
                    value="Yes"
                    checked={formData.needsHairMakeup === 'Yes'}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="needsHairMakeup-yes" className="ml-2 text-sm text-gray-700">
                    Yes
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="needsHairMakeup-no"
                    name="needsHairMakeup"
                    type="radio"
                    value="No"
                    checked={formData.needsHairMakeup === 'No'}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="needsHairMakeup-no" className="ml-2 text-sm text-gray-700">
                    No
                  </label>
                </div>
              </div>
              {errors.needsHairMakeup && (
                <p className="mt-1 text-sm text-red-600">{errors.needsHairMakeup}</p>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-2">
                Mood board or references (upload)
              </label>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <input
                    type="file"
                    id="references"
                    name="references"
                    ref={referenceInputRef}
                    onChange={handleReferenceUpload}
                    className="hidden"
                    accept="image/*"
                    multiple
                    max={5}
                    aria-labelledby="upload-references-label"
                  />
                  <button
                    type="button"
                    id="upload-references-label"
                    onClick={triggerReferenceInput}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Upload References
                  </button>
                  <span className="ml-3 text-sm text-gray-500">
                    {referenceFileNames.length > 0 
                      ? `${referenceFileNames.length} image(s) selected` 
                      : "No images chosen"}
                  </span>
                </div>
                
                {referencePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                    {referencePreviewUrls.map((url, i) => (
                      <div key={`reference-${i}-${referenceFileNames[i]}`} className="relative">
                        <div className="relative h-24 sm:h-32 w-full">
                          <Image 
                            src={url}
                            alt={`Reference ${referenceFileNames[i] || i+1}`}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeReference(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                          aria-label={`Remove reference ${i+1}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Max 5 images, formats: JPG, PNG, JPEG (max 5MB each)
              </p>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                Any specific theme or vision for the shoot?
              </label>
              <textarea
                id="theme"
                name="theme"
                rows={3}
                value={formData.theme}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                placeholder="Describe the theme, mood or vision you have for this photoshoot"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700">
                Budget range (optional): ₹{formData.budgetRange}
              </label>
              <input
                type="range"
                id="budgetRange"
                name="budgetRange"
                min="50000"
                max="1000000"
                step="20000"
                value={formData.budgetRange}
                onChange={handleRangeChange}
                className="mt-2 block w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹50,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
                Additional notes or requests
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows={3}
                value={formData.additionalNotes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                placeholder="Any other details that would help us understand your requirements better"
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

export default PhotoshootStylingManagementForm;

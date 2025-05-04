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
  consultationMode: string;
  ageGroup: string;
  gender: string;
  occupation: string;
  location: string;
  stylingGoals: string[];
  images: File[];
  bodyConcerns: string;
  preferredDateTime: string;
  additionalNotes: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  consultationMode?: string;
  ageGroup?: string;
  gender?: string;
  location?: string;
  stylingGoals?: string;
  preferredDateTime?: string;
}

// Type for form field values
type FormFieldValue = string | string[] | File[];

// Validation rules
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{8,20}$/;

const StylingConsultationForm = () => {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    consultationMode: '',
    ageGroup: '',
    gender: '',
    occupation: '',
    location: '',
    stylingGoals: [],
    images: [],
    bodyConcerns: '',
    preferredDateTime: '',
    additionalNotes: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFileNames, setImageFileNames] = useState<string[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const consultationModeOptions = ['Online', 'In-person'];
  const ageGroupOptions = ['Under 18', '18-25', '26-35', '36-50', '50+'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const locationOptions = ['Mumbai', 'Pune', 'Jaipur', 'Delhi','Other'];
  const stylingGoalsOptions = [
    'I want to improve my everyday looks',
    'I need help with outfits for special events',
    'I’m ready to refresh and rebuild my wardrobe',
    'I want to create a strong personal style/brand',
    'Others'
  ];
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    validateField(name, value);
  };
  
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    const updatedGoals = checked
      ? [...formData.stylingGoals, value]
      : formData.stylingGoals.filter(goal => goal !== value);
    
    setFormData(prev => ({
      ...prev,
      stylingGoals: updatedGoals
    }));
    
    validateField('stylingGoals', updatedGoals);
  };
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (fileList.length > 3) {
        toast.error('Maximum 3 images allowed');
        return;
      }
      
      const newFiles = [...formData.images, ...fileList].slice(0, 3);
      setFormData(prev => ({ ...prev, images: newFiles }));
      
      const fileNames = newFiles.map(file => file.name);
      setImageFileNames(fileNames);
      
      // Revoke old preview URLs to prevent memory leaks
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      
      // Create new preview URLs
      const previewUrls = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(previewUrls);
    }
  };
  
  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: updatedImages }));
    
    const updatedFileNames = [...imageFileNames];
    updatedFileNames.splice(index, 1);
    setImageFileNames(updatedFileNames);
    
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    const updatedPreviewUrls = [...imagePreviewUrls];
    updatedPreviewUrls.splice(index, 1);
    setImagePreviewUrls(updatedPreviewUrls);
  };
  
  const triggerImageInput = () => {
    imageInputRef.current?.click();
  };
  
  // Field validators as separate functions to reduce cognitive complexity
  const validators = {
    fullName: (value: FormFieldValue): string | undefined => {
      if (typeof value !== 'string') return 'Invalid name format';
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return undefined;
    },
    
    email: (value: FormFieldValue): string | undefined => {
      if (typeof value !== 'string') return 'Invalid email format';
      if (!value.trim()) return 'Email is required';
      if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
      return undefined;
    },
    
    phone: (value: FormFieldValue): string | undefined => {
      if (typeof value !== 'string') return 'Invalid phone format';
      if (!value.trim()) return 'Phone number is required';
      if (!PHONE_REGEX.test(value)) return 'Please enter a valid phone number with country code';
      return undefined;
    },
    
    consultationMode: (value: FormFieldValue): string | undefined => {
      if (typeof value !== 'string') return 'Invalid consultation mode';
      if (!value) return 'Please select a consultation mode';
      return undefined;
    },
    
    ageGroup: (value: FormFieldValue): string | undefined => {
      if (typeof value !== 'string') return 'Invalid age group';
      if (!value) return 'Please select an age group';
      return undefined;
    },
    
    gender: (value: FormFieldValue): string | undefined => {
      if (typeof value !== 'string') return 'Invalid gender selection';
      if (!value) return 'Please select a gender identity';
      return undefined;
    },
    
    location: (value: FormFieldValue): string | undefined => {
      if (typeof value !== 'string') return 'Invalid location';
      if (!value) return 'Please select your location';
      return undefined;
    },
    
    stylingGoals: (value: FormFieldValue): string | undefined => {
      if (!Array.isArray(value)) return 'Invalid styling goals';
      if (value.length === 0) return 'Please select at least one styling goal';
      return undefined;
    },
    
    preferredDateTime: (value: FormFieldValue): string | undefined => {
      if (typeof value !== 'string') return 'Invalid date/time format';
      if (!value) return 'Please select your preferred date and time';
      return undefined;
    }
  };
  
  // Simpler validateField function
  const validateField = (name: string, value: FormFieldValue): boolean => {
    const newErrors = { ...errors };
    
    // Get validator function for this field
    const validator = validators[name as keyof typeof validators];
    
    if (validator) {
      const errorMessage = validator(value);
      
      if (errorMessage) {
        newErrors[name as keyof FormErrors] = errorMessage;
        setErrors(newErrors);
        return false;
      } else {
        // Delete the error if it's fixed
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
      'fullName', 'email', 'phone', 'consultationMode',
      'ageGroup', 'gender', 'stylingGoals',
      'preferredDateTime'
    ];

    if (formData.consultationMode === 'Offline') {
      fields.push('location');
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
        if (key !== 'images' && key !== 'stylingGoals') {
          formDataToSubmit.append(key, formData[key as keyof FormData] as string);
        }
      });
      
      formDataToSubmit.append('stylingGoals', JSON.stringify(formData.stylingGoals));
      
      formData.images.forEach((image, index) => {
        formDataToSubmit.append(`image${index + 1}`, image);
      });
      
      const response = await fetch('/api/personalizedstylingconsultation', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      if (response.ok) {
        toast.success('Styling consultation request submitted successfully!');
        router.push('/success');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('There was an error submitting your consultation request');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from--50 to--100 py-4 sm:py-12 px-3 sm:px-6 lg:px-8 opacity-0 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8'}`}>
      <div className="max-w-3xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
        <div className="bg-gray-600 py-3 sm:py-6 px-4 sm:px-8" style={{backgroundColor: colors.primary.darkpurple}}>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Personalized Styling Consultation</h1>
          <p className="text-white text-xs sm:text-base mt-1 sm:mt-2">Let our expert stylists help you achieve your fashion goals</p>
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
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
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
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number (with country code) <span className="text-red-500">*</span>
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
              <label htmlFor="consultationMode" className="block text-sm font-medium text-gray-700">
                Preferred Mode of Consultation <span className="text-red-500">*</span><span className="text-xs text-gray-500">(In-person is currently available in Jaipur, Mumbai, Pune, Delhi only)</span>
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
                <option value="">Select consultation mode</option>
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
            
            <div className="col-span-1">
              <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">
                Age Group <span className="text-red-500">*</span>
              </label>
              <select
                id="ageGroup"
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.ageGroup ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select age group</option>
                {ageGroupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.ageGroup && (
                <p className="mt-1 text-sm text-red-600">{errors.ageGroup}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender Identity <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.gender ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select gender identity</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                Occupation
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                placeholder="Corporate Professional, Student, etc."
              />
            </div>
            
            {formData.consultationMode === 'Offline' && (
              <div className="col-span-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location (if offline) <span className="text-red-500">*</span>
                </label>
                <select
                  id="trainingLocation"
                  name="trainingLocation"
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
            )}
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="stylingGoals" className="block text-sm font-medium text-gray-700 mb-2">
                What are your key styling goals? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2" id="stylingGoals">
                {stylingGoalsOptions.map((goal) => (
                  <div key={goal} className="flex items-center">
                    <input
                      id={`goal-${goal}`}
                      name="stylingGoals"
                      type="checkbox"
                      value={goal}
                      checked={formData.stylingGoals.includes(goal)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <label htmlFor={`goal-${goal}`} className="ml-3 text-sm text-gray-700">
                      {goal}
                    </label>
                  </div>
                ))}
              </div>
              {errors.stylingGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.stylingGoals}</p>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <p id="upload-images-label" className="block text-sm font-medium text-gray-700 mb-2">
                Upload 2-3 recent pictures (optional but helpful)
              </p>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                    multiple
                    aria-labelledby="upload-images-label"
                  />
                  <button
                    type="button"
                    onClick={triggerImageInput}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                    aria-label="Select images to upload"
                  >
                    Choose Images
                  </button>
                  <span className="ml-3 text-sm text-gray-500">
                    {imageFileNames.length > 0 
                      ? `${imageFileNames.length} image(s) selected` 
                      : "No images chosen"}
                  </span>
                </div>
                
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                    {imagePreviewUrls.map((url) => (
                      <div key={url} className="relative">
                        <div className="h-24 sm:h-32 w-full relative">
                          <Image 
                            src={url} 
                            alt="Image preview"
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const index = imagePreviewUrls.indexOf(url);
                            if (index !== -1) removeImage(index);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                          aria-label="Remove image"
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
                Max 3 images, formats: JPG, PNG, JPEG (max 5MB each)
              </p>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="bodyConcerns" className="block text-sm font-medium text-gray-700">
                Any body or color concerns we should be aware of?
              </label>
              <textarea
                id="bodyConcerns"
                name="bodyConcerns"
                rows={3}
                value={formData.bodyConcerns}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                placeholder="E.g., color preferences, areas you'd like to highlight or downplay, etc."
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="preferredDateTime" className="block text-sm font-medium text-gray-700">
                Preferred date/time for consultation <span className="text-red-500">*</span>
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
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
                Additional notes or expectations
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows={3}
                value={formData.additionalNotes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                placeholder="Tell us any other details that would help us prepare for your consultation"
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

export default StylingConsultationForm;

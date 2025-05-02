"use client";
import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { colors } from '@/styles/colors';
import Image from 'next/image';

// Define regex patterns outside functions to avoid case block declarations
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{8,20}$/;

interface FormData {
  fullName: string;
  contactPhone: string;
  contactEmail: string;
  weddingLocation: string;
  weddingDate: string;
  package: string;
  events: string[];
  hasVendors: string;
  inspirationImages: File[];
  consultationMode: string;
  budgetRange: number;
  additionalNotes: string;
}

interface FormErrors {
  fullName?: string;
  contactPhone?: string;
  contactEmail?: string;
  weddingLocation?: string;
  weddingDate?: string;
  package?: string;
  events?: string;
  hasVendors?: string;
  consultationMode?: string;
}

const WeddingStylingConsultationForm = () => {
  const router = useRouter();
  const inspirationInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    contactPhone: '',
    contactEmail: '',
    weddingLocation: '',
    weddingDate: '',
    package: '',
    events: [],
    hasVendors: '',
    inspirationImages: [],
    consultationMode: '',
    budgetRange: 50000,
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

  const packageOptions = [
    'Bride/Groom Styling',
    'Full Wedding Styling (bride, groom, family)',
    'Wedding Photoshoot Styling',
    'Wedding Day Coordination & Management'
  ];

  const eventOptions = [
    'Engagement',
    'Haldi',
    'Mehendi',
    'Sangeet',
    'Reception'
  ];

  const vendorOptions = ['Yes', 'No'];
  const consultationModeOptions = ['Offline', 'Online'];
  const locationOptions = ['Mumbai', 'Pune', 'Jaipur', 'Delhi'];

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

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData(prev => {
      const updatedEvents = checked
        ? [...prev.events, value]
        : prev.events.filter(event => event !== value);

      return {
        ...prev,
        events: updatedEvents
      };
    });

    validateField('events', checked ? [...formData.events, value] : formData.events.filter(event => event !== value));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (fileList.length > 5) {
        toast.error('Maximum 5 images allowed');
        return;
      }

      const newFiles = [...formData.inspirationImages, ...fileList].slice(0, 5);
      setFormData(prev => ({ ...prev, inspirationImages: newFiles }));

      const fileNames = newFiles.map(file => file.name);
      setImageFileNames(fileNames);

      const previewUrls = newFiles.map(file => URL.createObjectURL(file));

      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));

      setImagePreviewUrls(previewUrls);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...formData.inspirationImages];
    updatedImages.splice(index, 1);
    setFormData(prev => ({ ...prev, inspirationImages: updatedImages }));

    const updatedFileNames = [...imageFileNames];
    updatedFileNames.splice(index, 1);
    setImageFileNames(updatedFileNames);

    URL.revokeObjectURL(imagePreviewUrls[index]);

    const updatedPreviewUrls = [...imagePreviewUrls];
    updatedPreviewUrls.splice(index, 1);
    setImagePreviewUrls(updatedPreviewUrls);
  };

  const triggerImageInput = () => {
    if (inspirationInputRef.current) {
      inspirationInputRef.current.click();
    }
  };

  // Field validation functions to reduce cognitive complexity
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

    weddingLocation: (value: string): string | undefined => {
      if (!value) return 'Wedding location is required';
      return undefined;
    },

    weddingDate: (value: string): string | undefined => {
      if (!value) return 'Wedding date is required';
      return undefined;
    },

    package: (value: string): string | undefined => {
      if (!value) return 'Please select a package';
      return undefined;
    },

    events: (value: string[]): string | undefined => {
      if (!value.length) return 'Please select at least one event';
      return undefined;
    },

    hasVendors: (value: string): string | undefined => {
      if (!value) return 'Please indicate if you have vendors';
      return undefined;
    },

    consultationMode: (value: string): string | undefined => {
      if (!value) return 'Please select a consultation mode';
      return undefined;
    }
  };

  // Simplified validateField function with proper typing
  const validateField = (name: string, value: string | string[] | boolean | number | File[]): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    let errorMessage: string | undefined;

    // Type-safe validation
    switch (name) {
      case 'fullName':
        errorMessage = validators.fullName(value as string);
        break;

      case 'contactEmail':
        errorMessage = validators.contactEmail(value as string);
        break;

      case 'contactPhone':
        errorMessage = validators.contactPhone(value as string);
        break;

      case 'weddingLocation':
        errorMessage = validators.weddingLocation(value as string);
        break;

      case 'weddingDate':
        errorMessage = validators.weddingDate(value as string);
        break;

      case 'package':
        errorMessage = validators.package(value as string);
        break;

      case 'events':
        errorMessage = validators.events(value as string[]);
        break;

      case 'hasVendors':
        errorMessage = validators.hasVendors(value as string);
        break;

      case 'consultationMode':
        errorMessage = validators.consultationMode(value as string);
        break;

      default:
        break;
    }

    if (errorMessage) {
      newErrors[name as keyof FormErrors] = errorMessage;
      isValid = false;
    } else {
      delete newErrors[name as keyof FormErrors];
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateForm = (): boolean => {
    let isValid = true;

    const fields: (keyof FormData)[] = [
      'fullName', 'contactEmail', 'contactPhone', 'weddingLocation',
      'weddingDate', 'package', 'events', 'hasVendors', 'consultationMode'
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

      // Fix stringification issue by handling each type appropriately
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'inspirationImages' && key !== 'events') {
          formDataToSubmit.append(key, value.toString());
        }
      });

      formDataToSubmit.append('events', JSON.stringify(formData.events));

      formData.inspirationImages.forEach((image, index) => {
        formDataToSubmit.append(`inspiration${index + 1}`, image);
      });

      const response = await fetch('/api/weddingstylingconsultation', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (response.ok) {
        toast.success('Wedding styling consultation request submitted successfully!');
        router.push('/success');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('There was an error submitting your wedding styling consultation request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 sm:py-12 px-3 sm:px-6 lg:px-8 opacity-0 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8'}`}>
      <div className="max-w-3xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
        <div className="bg-gray-600 py-3 sm:py-6 px-4 sm:px-8" style={{backgroundColor: colors.primary.darkpurple}}>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Wedding Styling & Photoshoot</h1>
          <p className="text-white text-xs sm:text-base mt-1 sm:mt-2">Let our wedding styling experts help make your special day perfect</p>
        </div>

        <form onSubmit={handleSubmit} className="py-4 sm:py-8 px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium -700">
                Name of Bride/Groom <span className="text-red-500">*</span>
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
                placeholder="Enter name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="contactPhone" className="block text-sm font-medium -700">
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
              <label htmlFor="contactEmail" className="block text-sm font-medium -700">
                Email Address <span className="text-red-500">*</span>
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
              <label htmlFor="weddingLocation" className="block text-sm font-medium -700">
                City of Wedding <span className="text-red-500">*</span>
              </label>
              <select
                id="weddingLocation"
                name="weddingLocation"
                value={formData.weddingLocation}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.weddingLocation ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select location</option>
                {locationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.weddingLocation && (
                <p className="mt-1 text-sm text-red-600">{errors.weddingLocation}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="weddingDate" className="block text-sm font-medium -700">
                Wedding Date(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="weddingDate"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.weddingDate ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              />
              {errors.weddingDate && (
                <p className="mt-1 text-sm text-red-600">{errors.weddingDate}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="package" className="block text-sm font-medium -700">
                Which package are you interested in? <span className="text-red-500">*</span>
              </label>
              <select
                id="package"
                name="package"
                value={formData.package}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.package ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select package</option>
                {packageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.package && (
                <p className="mt-1 text-sm text-red-600">{errors.package}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <fieldset>
                <legend className="block text-sm font-medium -700 mb-2">
                  Events to be styled <span className="text-red-500">*</span>
                </legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {eventOptions.map((event) => (
                    <div key={event} className="flex items-center">
                      <input
                        id={`event-${event}`}
                        name="events"
                        type="checkbox"
                        value={event}
                        checked={formData.events.includes(event)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <label htmlFor={`event-${event}`} className="ml-2 text-sm -700">
                        {event}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.events && (
                  <p className="mt-1 text-sm text-red-600">{errors.events}</p>
                )}
              </fieldset>
            </div>

            <div className="col-span-1">
              <label htmlFor="hasVendors" className="block text-sm font-medium -700">
                Do you already have vendors? <span className="text-red-500">*</span>
                <span className="text-xs -500 ml-1">(photographer, makeup, stylist)</span>
              </label>
              <select
                id="hasVendors"
                name="hasVendors"
                value={formData.hasVendors}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.hasVendors ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select an option</option>
                {vendorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.hasVendors && (
                <p className="mt-1 text-sm text-red-600">{errors.hasVendors}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="consultationMode" className="block text-sm font-medium -700">
                Preferred consultation mode <span className="text-red-500">*</span>
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

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="inspirationImages" className="block text-sm font-medium -700 mb-2">
                Any inspirations or vision for your looks?
              </label>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <input
                    type="file"
                    id="inspirationImages"
                    name="inspirationImages"
                    ref={inspirationInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                  <button
                    type="button"
                    onClick={triggerImageInput}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium -700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Upload Inspirations
                  </button>
                  <span className="ml-3 text-sm -500">
                    {imageFileNames.length > 0 
                      ? `${imageFileNames.length} image(s) selected` 
                      : "No images chosen"}
                  </span>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={`${formData.inspirationImages[index].name}-${formData.inspirationImages[index].lastModified}`} className="relative">
                        <div className="h-24 sm:h-32 w-full relative">
                          <Image 
                            src={url} 
                            alt={`Preview ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-md"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                          aria-label={`Remove image ${index + 1}`}
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
              <p className="mt-1 text-xs -500">
                Max 5 images, formats: JPG, PNG, JPEG (max 5MB each)
              </p>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="budgetRange" className="block text-sm font-medium -700">
                Budget range (optional): ₹{formData.budgetRange.toLocaleString()}
              </label>
              <input
                type="range"
                id="budgetRange"
                name="budgetRange"
                min="10000"
                max="500000"
                step="10000"
                value={formData.budgetRange}
                onChange={handleRangeChange}
                className="mt-2 block w-full"
                style={{backgroundColor: colors.secondary.chestnut}}
              />
              <div className="flex justify-between text-xs text-black mt-1">
                <span>₹10,000</span>
                <span>₹500,000</span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="additionalNotes" className="block text-sm font-medium -700">
                Additional notes or cultural preferences
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows={3}
                value={formData.additionalNotes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                placeholder="Tell us about any specific cultural requirements, preferences, or other details that would help us understand your vision"
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

export default WeddingStylingConsultationForm;
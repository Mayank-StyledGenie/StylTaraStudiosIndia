"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { colors } from '@/styles/colors';

interface FormData {
  companyName: string;
  contactPersonName: string;
  designation: string;
  contactInfo: string;
  numberOfParticipants: string;
  exactNumberOfParticipants?: string;
  serviceType: string;
  industryType: string;
  otherIndustryType?: string;
  companyLocation: string;
  preferredDates: string;
  serviceMode: string;
  dressCodeGuidelines: string;
  sessionObjectives: string;
  additionalNotes: string;
}

interface FormErrors {
  companyName?: string;
  contactPersonName?: string;
  designation?: string;
  contactInfo?: string;
  numberOfParticipants?: string;
  exactNumberOfParticipants?: string;
  serviceType?: string;
  industryType?: string;
  otherIndustryType?: string;
  companyLocation?: string;
  preferredDates?: string;
  serviceMode?: string;
  sessionObjectives?: string;
}

const CorporateStylingForm = () => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactPersonName: '',
    designation: '',
    contactInfo: '',
    numberOfParticipants: '',
    exactNumberOfParticipants: '',
    serviceType: '',
    industryType: '',
    otherIndustryType: '',
    companyLocation: '',
    preferredDates: '',
    serviceMode: '',
    dressCodeGuidelines: '',
    sessionObjectives: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const participantsOptions = ['1-10', '10+'];
  const serviceTypeOptions = [
    'Individual Executive Styling/Photoshoot/makeup/Combo',
    'Team Styling',
    'Corporate Grooming Workshop',
    'Branding + Photoshoot + Makeup'
  ];
  const industryTypeOptions = [
    'Information Technology',
    'Banking & Finance',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Education',
    'Hospitality & Tourism',
    'Media & Entertainment',
    'Real Estate',
    'Consulting',
    'FMCG',
    'Other'
  ];
  const locationOptions = ['Mumbai', 'Pune', 'Jaipur', 'Delhi', 'Other'];
  const serviceModeOptions = ['Online', 'On-site'];

  // Combined handleChange function that handles both normal and date inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    validateField(name, value);
  };

  // Define a type for form field values that accepts undefined values as well
  type FormFieldValue = string | number | boolean | undefined;

  // Refactored validateField with lower cognitive complexity
  // Split into smaller, focused validation functions
  const validateField = (name: string, value: FormFieldValue): boolean => {
    const newErrors = { ...errors };

    // Clear any existing error for this field
    delete newErrors[name as keyof FormErrors];

    // Call the appropriate validation function based on the field name
    const isValid = fieldValidators[name as keyof typeof fieldValidators]?.(value as string, newErrors) ?? true;

    setErrors(newErrors);
    return isValid;
  };

  // Object containing field-specific validation functions
  const fieldValidators = {
    companyName: (value: string, newErrors: FormErrors): boolean => {
      if (!value.trim()) {
        newErrors.companyName = 'Company name is required';
        return false;
      }
      if (value.trim().length < 2) {
        newErrors.companyName = 'Company name must be at least 2 characters';
        return false;
      }
      return true;
    },

    contactPersonName: (value: string, newErrors: FormErrors): boolean => {
      if (!value.trim()) {
        newErrors.contactPersonName = 'Contact person name is required';
        return false;
      }
      if (value.trim().length < 2) {
        newErrors.contactPersonName = 'Name must be at least 2 characters';
        return false;
      }
      return true;
    },

    designation: (value: string, newErrors: FormErrors): boolean => {
      if (!value.trim()) {
        newErrors.designation = 'Designation is required';
        return false;
      }
      return true;
    },

    contactInfo: (value: string, newErrors: FormErrors): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;

      if (!value.trim()) {
        newErrors.contactInfo = 'Contact information is required';
        return false;
      }
      if (!(emailRegex.test(value) || phoneRegex.test(value))) {
        newErrors.contactInfo = 'Please enter a valid email address or phone number';
        return false;
      }
      return true;
    },

    numberOfParticipants: (value: string, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.numberOfParticipants = 'Please select number of participants';
        return false;
      }
      return true;
    },

    exactNumberOfParticipants: (value: string, newErrors: FormErrors): boolean => {
      if (formData.numberOfParticipants === '10+' && !value.trim()) {
        newErrors.exactNumberOfParticipants = 'Please provide the exact number of participants';
        return false;
      }
      if (value && !/^\d+$/.test(value)) {
        newErrors.exactNumberOfParticipants = 'Please enter a valid number';
        return false;
      }
      return true;
    },

    serviceType: (value: string, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.serviceType = 'Please select a service type';
        return false;
      }
      return true;
    },

    industryType: (value: string, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.industryType = 'Please select your industry type';
        return false;
      }
      return true;
    },

    otherIndustryType: (value: string, newErrors: FormErrors): boolean => {
      if (formData.industryType === 'Other' && !value.trim()) {
        newErrors.otherIndustryType = 'Please specify your industry type';
        return false;
      }
      return true;
    },

    companyLocation: (value: string, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.companyLocation = 'Please select your company location';
        return false;
      }
      return true;
    },

    preferredDates: (value: string, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.preferredDates = 'Please select your preferred date and time';
        return false;
      }
      return true;
    },

    serviceMode: (value: string, newErrors: FormErrors): boolean => {
      if (!value) {
        newErrors.serviceMode = 'Please select whether the service will be online or on-site';
        return false;
      }
      return true;
    },

    sessionObjectives: (value: string, newErrors: FormErrors): boolean => {
      if (!value.trim()) {
        newErrors.sessionObjectives = 'Please specify the objectives of the session/project';
        return false;
      }
      return true;
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Define required fields
    const requiredFields: (keyof FormData)[] = [
      'companyName', 'contactPersonName', 'designation', 'contactInfo',
      'numberOfParticipants', 'serviceType', 'industryType',
      'companyLocation', 'preferredDates', 'serviceMode', 'sessionObjectives'
    ];

    requiredFields.forEach(field => {
      const valid = validateField(field, formData[field]);
      if (!valid) isValid = false;
    });

    // Validate conditional fields
    if (formData.numberOfParticipants === '10+') {
      const valid = validateField('exactNumberOfParticipants', formData.exactNumberOfParticipants);
      if (!valid) isValid = false;
    }

    if (formData.industryType === 'Other') {
      const valid = validateField('otherIndustryType', formData.otherIndustryType);
      if (!valid) isValid = false;
    }

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
        const value = formData[key as keyof FormData];
        if (value !== undefined && value !== null && value !== '') {
          formDataToSubmit.append(key, value.toString());
        }
      });

      const response = await fetch('/api/corporatestyling', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (response.ok) {
        toast.success('Corporate styling request submitted successfully!');
        router.push('/success');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('There was an error submitting your corporate styling request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 sm:py-12 px-3 sm:px-6 lg:px-8 opacity-0 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8'}`}>
      <div className="max-w-3xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
        <div className="bg-gray-600 py-3 sm:py-6 px-4 sm:px-8" style={{ backgroundColor: colors.primary.darkpurple }}>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Corporate Styling</h1>
          <p className="text-white text-xs sm:text-base mt-1 sm:mt-2">Enhance your team&apos;s professional image and brand presence</p>
        </div>

        <form onSubmit={handleSubmit} className="py-4 sm:py-8 px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.companyName ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="Enter your company name"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contactPersonName"
                name="contactPersonName"
                value={formData.contactPersonName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.contactPersonName ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="Enter contact person's name"
              />
              {errors.contactPersonName && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPersonName}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.designation ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="Enter your designation"
              />
              {errors.designation && (
                <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
                Contact Info (Email/Phone) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.contactInfo ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="Email or phone number"
              />
              {errors.contactInfo && (
                <p className="mt-1 text-sm text-red-600">{errors.contactInfo}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="numberOfParticipants" className="block text-sm font-medium text-gray-700">
                Number of Participants <span className="text-red-500">*</span>
              </label>
              <select
                id="numberOfParticipants"
                name="numberOfParticipants"
                value={formData.numberOfParticipants}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.numberOfParticipants ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select number of participants</option>
                {participantsOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.numberOfParticipants && (
                <p className="mt-1 text-sm text-red-600">{errors.numberOfParticipants}</p>
              )}
            </div>

            {formData.numberOfParticipants === '10+' && (
              <div className="col-span-1">
                <label htmlFor="exactNumberOfParticipants" className="block text-sm font-medium text-gray-700">
                  Exact Number of Participants <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="exactNumberOfParticipants"
                  name="exactNumberOfParticipants"
                  value={formData.exactNumberOfParticipants}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.exactNumberOfParticipants ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                  placeholder="Enter exact number"
                />
                {errors.exactNumberOfParticipants && (
                  <p className="mt-1 text-sm text-red-600">{errors.exactNumberOfParticipants}</p>
                )}
              </div>
            )}

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                Type of Service Required <span className="text-red-500">*</span>
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.serviceType ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select service type</option>
                {serviceTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="industryType" className="block text-sm font-medium text-gray-700">
                Industry Type <span className="text-red-500">*</span>
              </label>
              <select
                id="industryType"
                name="industryType"
                value={formData.industryType}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.industryType ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select industry</option>
                {industryTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.industryType && (
                <p className="mt-1 text-sm text-red-600">{errors.industryType}</p>
              )}
            </div>

            {formData.industryType === 'Other' && (
              <div className="col-span-1">
                <label htmlFor="otherIndustryType" className="block text-sm font-medium text-gray-700">
                  Specify Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="otherIndustryType"
                  name="otherIndustryType"
                  value={formData.otherIndustryType}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.otherIndustryType ? 'border-red-300 ring-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                  placeholder="Please specify your industry"
                />
                {errors.otherIndustryType && (
                  <p className="mt-1 text-sm text-red-600">{errors.otherIndustryType}</p>
                )}
              </div>
            )}

            <div className="col-span-1">
              <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700">
                Company Location <span className="text-red-500">*</span>
              </label>
              <select
                id="companyLocation"
                name="companyLocation"
                value={formData.companyLocation}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.companyLocation ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select location</option>
                {locationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.companyLocation && (
                <p className="mt-1 text-sm text-red-600">{errors.companyLocation}</p>
              )}
            </div>

            <div className="col-span-1">
              <label htmlFor="serviceMode" className="block text-sm font-medium text-gray-700">
                Online or On-site <span className="text-red-500">*</span>
                <span className="block text-xs text-gray-500 mt-1">(On-site is currently available in Jaipur, Mumbai, Pune, Delhi only)</span>
              </label>
              <select
                id="serviceMode"
                name="serviceMode"
                value={formData.serviceMode}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.serviceMode ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              >
                <option value="">Select mode</option>
                {serviceModeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.serviceMode && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceMode}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="preferredDates" className="block text-sm font-medium text-gray-700">
                Preferred Dates <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="preferredDates"
                name="preferredDates"
                value={formData.preferredDates}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.preferredDates ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
              />
              {errors.preferredDates && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredDates}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="dressCodeGuidelines" className="block text-sm font-medium text-gray-700">
                Any internal dress code or branding guidelines to follow?
              </label>
              <textarea
                id="dressCodeGuidelines"
                name="dressCodeGuidelines"
                rows={3}
                value={formData.dressCodeGuidelines}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                placeholder="Please specify any dress code or brand guidelines we should be aware of"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="sessionObjectives" className="block text-sm font-medium text-gray-700">
                Objectives of the session/project <span className="text-red-500">*</span>
              </label>
              <textarea
                id="sessionObjectives"
                name="sessionObjectives"
                rows={3}
                value={formData.sessionObjectives}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.sessionObjectives ? 'border-red-300 ring-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500`}
                placeholder="What outcomes are you looking to achieve from this service?"
              />
              {errors.sessionObjectives && (
                <p className="mt-1 text-sm text-red-600">{errors.sessionObjectives}</p>
              )}
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
                placeholder="Any additional information or special requests"
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

export default CorporateStylingForm;
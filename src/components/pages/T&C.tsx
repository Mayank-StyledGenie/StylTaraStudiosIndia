import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | StylTara Studios',
  description: 'Legal terms and conditions for using StylTara Studios services',
};

const TermsAndConditionsPage = () => {
  return (
    <div className="bg-gradient-to-b from-white to-neutral-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-[#401735] py-6 px-6">
            <h1 className="text-3xl font-extrabold text-white">Terms and Conditions</h1>
            <p className="mt-2 text-sm text-white/80">Effective Date: April 30, 2025</p>
          </div>
          
          <div className="px-6 py-8 prose prose-indigo max-w-none">
            <p className="text-gray-700">
              Welcome to Styltara Studios Pvt Ltd. By accessing and using our website and services, 
              you agree to be bound by the following terms and conditions.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Services</h2>
            <p className="text-gray-700">
              We provide personal styling, wardrobe upgrades, photoshoots, makeup services, 
              soft skills training, wedding styling, commercial styling, and certification 
              programs in styling, makeup, and soft skills.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">2. Eligibility</h2>
            <p className="text-gray-700">
              You must be at least 18 years old to use our services.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Service Locations</h2>
            <p className="text-gray-700 mb-2">
              <strong>Online:</strong> Entire India
            </p>
            <p className="text-gray-700">
              <strong>In-person:</strong> Mumbai, Delhi, Jaipur, and Pune
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Payments</h2>
            <p className="text-gray-700">
              Full payment is required to confirm any booking unless otherwise agreed. 
              We accept online payments through secure payment gateways.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">5. Cancellations & Refunds</h2>
            <p className="text-gray-700">
              Please refer to our Cancellation Policy below.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">6. Intellectual Property</h2>
            <p className="text-gray-700">
              All content, including designs, photographs, and branding, is the intellectual 
              property of Styltara Studios Pvt Ltd. Unauthorized use is prohibited.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">7. Limitation of Liability</h2>
            <p className="text-gray-700">
              We are not liable for any indirect, incidental, or consequential damages 
              arising from the use of our services.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">8. Governing Law</h2>
            <p className="text-gray-700">
              These terms are governed by the laws of India.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">9. Modifications</h2>
            <p className="text-gray-700">
              We reserve the right to change these terms at any time. Updated terms will be 
              posted on our website.
            </p>
            
            {/* Service Agreement Section */}
            <div className="mt-12 border-t-2 border-gray-100 pt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Agreement</h2>
              <p className="text-gray-700 mb-6">
                This Agreement is made between Styltara Studio Pvt Ltd (&quot;Service Provider&quot;) and the Client.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">1. Scope of Services</h3>
                  <p className="text-gray-700">
                    Styltara will provide services as agreed upon in writing with the client.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">2. Fees and Payment Terms</h3>
                  <p className="text-gray-700">
                    Payment terms are stated in the service proposal or invoice. Full payment must be made before service commencement unless otherwise agreed.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">3. Cancellation</h3>
                  <p className="text-gray-700">
                    Clients must refer to the Cancellation Policy.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">4. Confidentiality</h3>
                  <p className="text-gray-700">
                    Both parties agree to keep all information exchanged during the engagement confidential.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">5. Intellectual Property</h3>
                  <p className="text-gray-700">
                    All materials developed during the project remain the property of Styltara Studios Pvt Ltd unless otherwise agreed.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">6. Non-Solicitation</h3>
                  <p className="text-gray-700">
                    Clients agree not to solicit or hire Styltara&apos;s freelancers or contractors independently for a period of 12 months post-engagement.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">7. Governing Law</h3>
                  <p className="text-gray-700">
                    This Agreement shall be governed by Indian law.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 mt-10 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Cancellation Policy</h3>
              <p className="font-medium text-gray-700 mt-2">Cancellation and Refund Policy</p>
              <ul className="list-disc pl-5 mt-4 text-gray-700 space-y-2">
                <li>Cancellation made more than 7 days before the appointment: 90% refund (10% processing fee).</li>
                <li>Cancellation made between 3–7 days: 50% refund.</li>
                <li>Cancellation made less than 3 days before appointment: No refund.</li>
                <li>Rescheduling is allowed once if requested at least 48 hours in advance.</li>
              </ul>
            </div>
            
            <div className="mt-10 text-sm text-gray-500">
              <p>
                If you have any questions about these Terms and Conditions or the Service Agreement, please contact us at{' '}
                <a href="mailto:info@styltarastudios.com" className="text-[#401735] hover:underline">
                  info@styltarastudios.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
"use client";
import Link from 'next/link';
import Image from 'next/image';
import Container from '../ui/Container';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { typography } from '@/styles/typography';
import Logo from '@/images/logo1.svg'; 
import { useState } from 'react';
import { colors } from '@/styles/colors';

interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [loading, setLoading] = useState(false);

  interface SubscribeResponse {
    error?: string;
  }
  
  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email?.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email' });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data: SubscribeResponse = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', message: 'Subscription successful!' });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: data.error ?? 'Something went wrong' });
      }
    } catch (error: unknown) {
      console.error('Subscription error:', error);
      setStatus({ type: 'error', message: 'Failed to subscribe. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-200 py-4 z-999" style={{ backgroundColor: colors.primary.bone }} >
      <Container marginLeft="5vw" marginRight="5vw" >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10" >
          <div className="col-span-1">
            <div className="mb-0">
              <Link href="/" className="flex items-center h-20">
                <Image
                  src={Logo}
                  alt="StylTara Studios"
                  width={170}
                  height={60}
                  className="object-contain"
                />
              </Link>
            </div>
            <p className={`${typography.body.B3} text-black mb-4 font-bold m-0`}><strong>Style that makes you shine. </strong></p>
          </div>
        

          <div className="col-span-1">
            <p className={`${typography.body.B3} font-bold text-black mb-4`}><strong>Company</strong></p>
            <ul className={`${typography.body.base} space-y-2`}>
              <li>
                <Link href="/aboutus" className="text-gray-900 hover:text-black">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-gray-900 hover:text-black">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contactus" className="text-gray-900 hover:text-black">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <p className={`${typography.body.B3} font-bold text-black mb-4`}><strong>Social Media</strong></p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/people/StylTara-Studio/61575701046612/?mibextid=wwXIfr" aria-label="Facebook" className={`bg-[#401735] p-2 rounded-full`} >
                <FaFacebookF className="w-5 h-5 text-[#D8D2C2]" />
              </Link>
              <Link href="https://www.linkedin.com/company/styltara-studio-pvt-ltd/" aria-label="LinkedIn" className="bg-[#401735] p-2 rounded-full">
                <FaLinkedinIn className="w-5 h-5 text-[#D8D2C2]" />
              </Link>
              <Link href="https://www.instagram.com/styltara_studio/" aria-label="Instagram" className="bg-[#401735] p-2 rounded-full">
                <FaInstagram className="w-5 h-5 text-[#D8D2C2]" />
              </Link>
            </div>
          </div>

          <div className="col-span-1">
            <p className={`${typography.body.B3} font-bold text-black mb-2`}><strong>Subscribe To Our Newsletter</strong></p>
            <p className={`${typography.body.base} text-gray-900 mb-4`}>
              *Stay chic, stay updated.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col">
              <div className="flex">
                <input 
                  type="email"
                  placeholder="Enter your e-mail"
                  className="mr-4 px-4 py-2 w-full rounded-full focus:outline-none border border-[#401735] bg-[#D8D2C2]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  type="submit" 
                  className={`bg-[#401735] text-white rounded-full p-3 flex items-center justify-center ${loading ? 'opacity-70' : ''}`}
                  disabled={loading}
                  aria-label="Subscribe"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-t-2 border-white rounded-full animate-spin"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              
                {status && (
                <div className={`mt-2 text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {status.message}
                </div>
                )}
                
            </form>
          </div>
        </div>
        <div className={`${typography.body.base} mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center`}>
          <div className="text-gray-900 text-sm">
            © 2025 StylTara Studio Pvt Ltd. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/PrivacyPolicy" className="text-gray-900 hover:text-black text-sm">
              Privacy Policy
            </Link>
            <Link href="/TermsandConditions" className="text-gray-900 hover:text-black text-sm">
              Terms of Service
            </Link>
            <Link href="/CookiePolicy" className="text-gray-900 hover:text-black text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
        
      </Container>
    </footer>
  );
};

export default Footer;
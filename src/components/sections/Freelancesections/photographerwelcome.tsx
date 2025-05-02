import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import Button from '@/components/ui/Button';
import Link from 'next/link';


export default function PhotographerWelcomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen text-white">
        
      <div className="container mx-auto px-6 py-12 md:py-24 max-w-6xl relative z-10">
        {/* Header */}
        <header className={`mb-12 opacity-0 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8'}`}>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-3" style={{color: colors.primary.darkpurple}}>
            Styltara Studios
          </h1>
        </header>

        {/* Main Content */}
        <div className={`bg-[#D8D2C2] backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-800 shadow-2xl mb-12 opacity-0 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8'}`}>
          <div className="flex items-start space-x-6">
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400" style={{color: colors.primary.darkpurple}}>
                Freelance Photographer
              </h2>
              
              <div className={`space-y-6 text-black ${typography.body.B2}`}>
                <p className={`text-lg leading-relaxed  ${typography.body.B2}`}>
                  Thank you for your interest in joining the Styltara creative network! We&apos;re looking for talented photographers who can capture personality, style, and stories through their lens.
                </p>
                <p className={`text-lg leading-relaxed  ${typography.body.B2}`}>
                  Whether it&apos;s personal shoots, weddings, or professional portfolios—you&apos;ll collaborate with stylists and creatives to bring every frame to life.
                </p>
              </div>
              
              <div className="mt-10">
                <Link href="/forms/Photographers-registration-form" className="inline-block">
                <Button
                  className={`group relative overflow-hidden rounded-lg text-lg font-medium px-8 py-4 text-white shadow-lg transition-all duration-300 ease-out `}
                >
                  <span className="relative z-10 flex items-center">
                    JOIN NOW
                    <ChevronRight className={`ml-2 transition-transform duration-300 `} size={18} />
                  </span>
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
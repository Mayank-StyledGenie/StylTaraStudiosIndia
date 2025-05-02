import HeroSection from '@/components/sections/Homepagesections/HeroSection';
import ServicesSection from '@/components/sections/Homepagesections/ServicesSection';
import HowItWorksSection from '@/components/sections/Homepagesections/HowItWorksSection';
import WhatourClientsSay from '../sections/Homepagesections/WhatourClientsSay';
import CapturedMoments from '../sections/Homepagesections/CapturedMoments';
import LocationsMessage from '../sections/Homepagesections/LocationsMessage';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <LocationsMessage />
      <HowItWorksSection />
      {/*<PricingSection />*/}
      <CapturedMoments />
      <WhatourClientsSay />
    </>
  );
}
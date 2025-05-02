import React from 'react';
import Link from 'next/link';
import { typography } from '@/styles/typography';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { colors } from '@/styles/colors';

const ApplyBanner: React.FC = () => {
  return (
    <section className="py-12 px-4 bg-gray-100" style={{backgroundColor: colors.primary.gunmetal}}>
    <Container marginLeft="5vw" marginRight="5vw">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center text-white">
        <h2 className={` ${typography.heading.h2} text-3xl md:text-4xl font-bold mb-6 md:mb-0 text-center md:text-left`}>
          Be Part Of Our Dynamic &<br className="hidden md:block" /> Creative Team
        </h2>
        
        <Link href="/Freelance">
          <Button className={`text-black bg-[#D8D2C2] py-3 px-8 rounded-md transition-colors font-medium text-lg`} style={{backgroundColor: colors.primary.bone}} variant='secondary'>
            <strong>Join Now</strong>
          </Button>
        </Link>
      </div>
      </Container>
    </section>
  );
};

export default ApplyBanner;

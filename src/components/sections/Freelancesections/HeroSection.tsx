import React from 'react';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import {typography} from '@/styles/typography';
import { colors } from '@/styles/colors';
import Heroimage from '@/images/Freelance/freelanceheroimage.png'

const HeroSection: React.FC = () => {
  return (
    <section className="py-12 mb-15">
      <Container marginLeft='5vw' marginRight='5vw'>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0 min-h-[70vh]">
        <div className="py-15 md:col-span-3">
          <div className='rounded-tl-3xl rounded-bl-3xl px-[10vw] py-15' style={{backgroundColor: colors.primary.gunmetal}}>
          <h2 className={`text-3xl md:text-4xl font-bold text-white mb-6 ${typography.special.d2}`}>
        Grow Your Creative Career with StylTara.
          </h2>
          <p className={`text-white mb-6 ${typography.body.B1}`}>
        Calling all fashion stylists, makeup artists, and photographers — collaborate with us and bring your creative vision to life.
          </p>
          <p className={`text-white mb-6 ${typography.body.B1}`}>
        Build your portfolio, work with diverse clients, and be part of a growing fashion-forward community.
          </p>
          </div>
        </div>
        
        <div className="rounded-lg flex items-center justify-center w-full justify-self-start h-[545px] md:col-span-2">
          <Image
            src={Heroimage}
            alt='Hero Image'
            className="rounded-lg object-cover w-full h-full"
            width={500}
            height={545}
            ></Image>
          
        </div>
      </div>
      
      </Container>
    </section>
  );
};

export default HeroSection;
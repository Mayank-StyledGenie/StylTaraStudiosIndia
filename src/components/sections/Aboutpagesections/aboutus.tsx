import React from 'react';
import Image from 'next/image';
import Tara from '@/images/Tara.svg';
import Container from '@/components/ui/Container';
import { typography } from '@/styles/typography';
import AboutHero from '@/images/Aboutus/aboutsushero.png'
import Aboutus from '@/images/Aboutus/aboutus.png'
import { colors } from '@/styles/colors';


const AboutSection: React.FC = () => {
  return (
    <section className="py-12 mb-16">
    <div className="w-full h-64 md:h-80 lg:h-126 relative -mt-12 mb-12">
      <Image 
        src= {AboutHero}
        alt="Styltara Studio Banner" 
        layout="fill"
        objectFit="cover"
        priority
        className='relative inset-0 object-cover'
      />
    </div>
    <Container marginLeft="5vw" marginRight="5vw">
     
      <h2 className={`${typography.heading.h2} text-3xl md:text-4xl font-bold mb-8`} style={{color: colors.primary.darkpurple}}>About Us</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div>
          <div className={`${typography.body.B2} font-bold text-xl mb-2`}><strong>Styltara Studio –</strong> Style That Makes You Shine</div>
          <p className={`${typography.body.B2} mb-4 `}>
            Imagine standing in front of your wardrobe, staring at a sea of
            clothes but feeling like you have nothing to wear. Sound familiar?
            You&apos;re not alone. Fashion is everywhere, but styling? That&apos;s an art—
            and not everyone has mastered it.
          </p>
          
          <p className={`${typography.body.B2} mb-4 `}>
            Enter Styltara Studio, where we turn fashion confusion into effortless
            elegance. Born from the creative minds of Preety Pareek, a
            passionate fashion stylist with an eye for detail, and Avani Mutgi, a
            designer who brings bold ideas to life, Styltara is not just a styling
            studio—it&apos;s a transformation hub.
          </p>
          
          <p className={`${typography.body.B2} mb-4 `}>
            Whether it&apos;s curating the perfect wedding look, creating
            commercially stunning visuals, personal styling, and countless other
            services we offer, we believe that fashion should do more than just
            fit—it should speak. <strong>Our philosophy is simple: every individual is a
            star, and we&apos;re here to make them shine.</strong>
          </p>
        </div>
        
        <div className="flex w-full h-full justify-center items-center">
            <div className="rounded-2xl w-[70%]  h-full relative">
              <Image 
                src={Aboutus}
                alt="Styltara Studio" 
                layout="fill"
                className="object-cover rounded-lg w-[100%] h-full "
              />
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative">
        <Image 
          src={Tara} 
          alt="Styltara Logo" 
          layout="fill"
          className="object-contain"
        />
          </div>
        </div>
        
        <div>
        <p className={`${typography.body.B2} mb-6 `}>
            <span className="font-bold">The name &apos;Tara&apos; means star,</span> and that&apos;s exactly what we
            want for every client—to step out feeling radiant,
            confident, and unstoppable. We don&apos;t just style outfits; we
            tell stories through fashion, crafting looks that celebrate
            individuality.
          </p>
          
          <p className={`${typography.body.B2} mb-6 `}>
            So, whether you&apos;re dressing for the spotlight or simply
            want to elevate your everyday wardrobe, Styltara Studio is
            where your journey to effortless style begins. Because the
            right styling doesn&apos;t just change how you look—it changes
            how you feel.
          </p>
          
          <h4 className={`${typography.heading.h4} md:text-2xl italic font-medium`} style={{color: colors.secondary.mossgreen}}>
            Let&apos;s style, shine, and make every moment a fashion statement.
          </h4>
        </div>
      </div>
    </Container>
    </section>
  );
};

export default AboutSection;
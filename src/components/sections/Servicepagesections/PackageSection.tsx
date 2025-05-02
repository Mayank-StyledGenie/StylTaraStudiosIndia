"use client";
import Container from '@/components/ui/Container';
import { typography } from '@/styles/typography';
import Button from '@/components/ui/Button';
import { colors } from '@/styles/colors';
import Link from 'next/link';

interface PackageItem {
  id: number;
  image: string;
  title: string;
  description: string[];
  benefit: string;
}

interface PackageCardsProps {
  packages: PackageItem[];
  bookingFee?: string;
  bookingNote?: string;
  empty?: boolean; 
  title?: string;
}

const PackageCards = ({ 
  packages = [],
  bookingFee = "Rs. 299/-", 
  bookingNote = "*This is only a booking fee and will be adjusted in the final service charge. Please note, the booking fee is non-refundable. Once you book, you will receive the full pricing details for your selected service. ",
  empty = true,
  title = "Personalized Styling Consultation",
}: PackageCardsProps) => {
  const safePackages = packages || [];
  
  const getGridClass = () => {
    const count = safePackages.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count === 3) return "grid-cols-1 md:grid-cols-3";
    if (count === 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };
  
  const getGridStyle = () => {
    const count = safePackages.length;
    if (count === 2) {
      return {
        className: "gap-10 md:gap-10 md:space-x-2 md:flex md:justify-center",
        style: { maxWidth: '950px', margin: '0 auto' }
      };
    }
    return {
      className: "gap-10",
      style: {}
    };
  };
  
  const getMaxWidthClass = () => {
    const count = safePackages.length;
    if (count === 2) return "max-w-[481px]";
    return "max-w-[379px]"; 
  };

  const gridStyle = getGridStyle();

  if (safePackages.length === 0) {
    return (
      <section className="py-10">
        <Container marginLeft="5vw" marginRight="5vw">
          <p className="text-center">No packages available.</p>
        </Container>
      </section>
    );
  }

  let formurl = "/"

  if(title === "Personalized Styling Consultation"){
    formurl = "/forms/PersonalizedStylingConsultation"
  }else if(title === "Photoshoot Styling & Management"){
    formurl = "/forms/PhotoshootStylingandManagement"
  }
  else if(title === "Wedding Styling & Photoshoot"){
    formurl = "/forms/WeddingStylingandPhotoshoot"
  }
  else if(title === "Makeup & Styling Trainings"){
    formurl = "/forms/MakeupandStylingTraining"
  }
  else if(title === "Soft Skills & Etiquette Coaching"){
    formurl = "/forms/SoftSkillsandEtiquetteCoaching"
  }
  else if(title === "Corporate Styling, Makeup, Photoshoot & Soft Skills"){
    formurl = "/forms/CorporateStyling"
  }

  return (
    
    <section className="py-10">
      <Container marginLeft="5vw" marginRight="5vw">
        <div 
          className={`mb-12 grid ${getGridClass()} ${gridStyle.className} justify-items-center mx-auto`}
          style={gridStyle.style}
        >
          {safePackages.map((card) => (
            <div 
              key={card.id} 
              className={`flex flex-col inset-shadow-sm shadow-xl p-7 rounded-3xl shadow-lg ${getMaxWidthClass()} w-full ${empty ? 'h-fit' : ''}`}
            >
              <h2 className={`${typography.heading.h2} mb-5 inset-shadow-sm shadow-lg -mx-7 px-5 mt-[-28px] mb-5 py-5 rounded-t-3xl`} style={{color: colors.primary.darkpurple}}>{card.title}</h2>
              <ul className="list-disc list-outside pl-9 mb-3">
              {card.description.map((item, index) => {
                const parts = item.split(':');
                // Create a more stable key using card ID and item content or index
                const itemKey = `${card.id}-${item.substring(0, 20).replace(/\s+/g, '')}-${index}`;
                
                if (parts.length > 1) {
                const term = parts[0];
                const definition = parts.slice(1).join(':');
                
                return (
                  <li key={itemKey} className={`${typography.body.B2} mb-1`}>
                  <span className="font-medium">
                    {term}:
                  </span>
                  <span className="font-normal">
                    {definition}
                  </span>
                  </li>
                );
                } else {
                return (
                  <li key={itemKey} className={`${typography.body.B2} mb-1 `}>
                  {item}
                  </li>
                );
                }
              })}
              </ul>
              <div className={empty ? 'mt-auto' : ''}>
              <p className={typography.body.B2}>
                <strong>{card.benefit}</strong> 
              </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center ">
          <Link href={formurl} className="inline-block">
          <Button variant="primary" className="mt-20">Get Styled Now</Button>
          </Link>
        </div>
        <div className="text-center mt-10">
          <div className={`font-inter text-[28px] font-weight-700 font-bold mb-5`}>Booking Price: {bookingFee}</div>
          <p className={`mb-7 max-w-3xl text-[18px] mx-auto`}>
            {bookingNote}
          </p>
        </div>
      </Container>
    </section>
  );
}   

export default PackageCards;
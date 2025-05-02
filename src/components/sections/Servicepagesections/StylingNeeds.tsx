import Image from 'next/image';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { typography } from '@/styles/typography';
import { colors } from '@/styles/colors';
import Link from 'next/link';

interface StylingNeedsProps {
  title: string;
  description: string;
  imageUrl?: string;
  NeedsQuestion: string;
  Needs?: {
    id: string | number;
    term: string;
    text: string;
  }[];
}

const defaultNeeds = [
  { 
    id: 1, 
    term: "Expert Wardrobe Transformation",
    text: "Transform your wardrobe with personalized recommendations that match your body type and lifestyle."
  },
  { 
    id: 2, 
    term: "Authentic Style Discovery",
    text: "Discover your unique personal style that enhances your confidence and makes you feel authentically you."
  },
  { 
    id: 3, 
    term: "Wardrobe Maximization",
    text: "Learn how to make the most of your existing wardrobe and identify key pieces that will elevate your look."
  },
  { 
    id: 4, 
    term: "Smart Shopping Guidance",
    text: "Save time and money by shopping smarter with guidance from a professional who understands what works for you."
  },
  { 
    id: 5, 
    term: "Life Event Preparation",
    text: "Prepare for important life events, interviews, or changes with a wardrobe that supports your goals."
  }
];


const StylingNeeds = ({ title, description, imageUrl = "/images/styling-needs.jpg", NeedsQuestion, Needs = defaultNeeds }: StylingNeedsProps) => {
 
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
    <section className="py-12 mb-12">
      <Container marginLeft="5vw" marginRight="1vw">
        <div className="text-center mb-20">
          <h1 className={`${typography.heading.h1} text-4xl mb-6 max-w-3xl mx-auto`} style={{color: colors.primary.darkpurple}}>{title}</h1>
          <p className={`${typography.body.B1} max-w-4xl mx-auto  mb-5`}>
            {description}
          </p>
          <div className="mt-8">
            <Link href= {formurl} className="inline-block">
            <Button variant="primary" className="px-9 py-3">Get Styled Now</Button>
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden mb-20">
            <div className="absolute inset-0 left-auto w-full h-[80%] top-[20%] md:h-full md:w-4/5 md:top-0" style={{backgroundColor: colors.primary.gunmetal, zIndex: -1}}></div>
          
          <div className="relative py-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 items-center px-4">
              <div className="rounded-lg aspect-square flex items-center justify-center relative overflow-hidden h-128 w-full md:w-1/2">
              <Image 
                src={imageUrl}
                alt="Personal Styling" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              </div>

              <div className="pr-4 pl-2 md:pr-0 text-white w-full md:w-1/2">
              <h2 className={`${typography.heading.h2} mb-8`}>
                {NeedsQuestion}
              </h2>
              
              <ul className="space-y-6 text-white">
                {Needs.map((item) => (
                <li key={item.id} className="flex items-start">
                  <span className="text-black mr-5 mt-1 flex-shrink-0">
                  <svg width="35" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 5L30 12L18 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  </span>
                  <div>
                  <span className={`${typography.body.B1} font-medium inline`}>
                    {item.term}
                  </span>
                  <span className={`${typography.body.B1} font-normal ml-1 inline`}>
                    {item.text}
                  </span>
                  </div>
                </li>
                ))}
              </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default StylingNeeds;
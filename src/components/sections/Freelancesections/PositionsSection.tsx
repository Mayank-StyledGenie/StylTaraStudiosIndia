import React from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { typography } from '@/styles/typography';
import PhotographerWelcomePage from "@/components/sections/Freelancesections/photographerwelcome";
import MakeupArtistWelcomePage from "@/components/sections/Freelancesections/makeupartistwelcome";
import SoftSkillsTrainerWelcomePage from "@/components/sections/Freelancesections/softskillstrainerwelcome";
import StylistWelcome from './stylistwelcompage';

const PositionsSection: React.FC = () => {
const positions = [
    {
        id: 'photographer',
        title: 'Freelance Photographer',
        link: '/Freelance/photographer',
        component: PhotographerWelcomePage
    },
    {
        id: 'makeup-artist',
        title: 'Freelance Makeup Artist',
        link: '/Freelance/makeupartist',
        component: MakeupArtistWelcomePage
    },
    {
        id: 'stylist',
        title: 'Freelance Stylist',
        link: '/Freelance/stylist',
        component: StylistWelcome
    },
    {
      id: 'soft-skills-trainer',
      title: 'Freelance Soft Skills & Etiquette Trainer',
      link: '/Freelance/softskillstrainer',
      component: SoftSkillsTrainerWelcomePage
  }
];


  return (
    <section className="py-12 mb-25">
    <Container marginLeft='5vw' marginRight='5vw'>
      <div className="">
      <h2 className="text-3xl font-bold mb-12">Our Open Positions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {positions.map((position) => (
        <div key={position.id} className="shadow-xl inset-shadow-sm Sp-1 rounded-lg text-center h-[300px] flex flex-col">
          <div className="flex-1 flex items-center justify-center px-4">
          <h3 className={`text-xl font-medium ${typography.heading.h3}`}>{position.title}</h3>
          </div>
          <div className="mb-8">
          <Link href={position.link}>
            <Button className="bg-gray-800 text-white py-2 px-4 rounded inline-block cursor-pointer">
            Apply Now
            </Button>
          </Link>
          </div>
        </div>
        ))}
      </div>
      </div>
    </Container>
    </section>
  );
};

export default PositionsSection;
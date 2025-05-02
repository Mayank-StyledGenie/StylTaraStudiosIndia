import Container from '@/components/ui/Container';
import React from 'react';
import { typography } from '@/styles/typography';
import { colors } from '@/styles/colors';
import { GoGoal } from "react-icons/go";
import { MdOutlineHandshake, MdOutlineLocationOn } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";


const FreelancerNetwork: React.FC = () => {
  const benefits = [
    {
      id: 'benefit-1', // Add unique ID
      icon: '/icons/target.svg',
      title: 'Access to diverse projects',
      description: '— from personal styling to corporate makeovers and weddings'
    },
    {
      id: 'benefit-2', // Add unique ID
      icon: '/icons/collaboration.svg',
      title: 'Collaboration with our in-house fashion stylists & design teams',
      description: ''
    },
    {
      id: 'benefit-3', // Add unique ID
      icon: '/icons/location.svg',
      title: 'Opportunities across India',
      description: ''
    },
    {
      id: 'benefit-4', // Add unique ID
      icon: '/icons/globe.svg',
      title: 'A chance to showcase your talent to a broader audience via our platform',
      description: ''
    }
  ];

  return (
    <section className="py-12">
      <Container marginLeft='5vw' marginRight='5vw'>
      <div className="">
        <h2 className={`text-3xl font-bold mb-8 ${typography.heading.h2}`}>Join the Styltara Freelancer Network</h2>
        
        <p className={`text-blackmb-8 ${typography.body.B2}`} >
          Are you a Photographer, Makeup Artist, or Soft Skills Trainer passionate about helping people transform their personal and professional image? Styltara Studios invites talented freelancers to be part of our growing creative ecosystem.
        </p>
        <br/>
        <p className={`text-blackmb-8 ${typography.body.B2} mb-25`} >
          Whether you&apos;re capturing moments through your lens, enhancing beauty with your artistry, or empowering individuals with confident communication, we provide the platform and community to help you thrive.
        </p>
        
        <h2 className={`text-3xl font-bold text-center mb-10 ${typography.heading.h2}`}>What We Offer:</h2>
        
        <div className="rounded-lg p-12 mb-12 max-w-3xl mx-auto" style={{backgroundColor: colors.primary.bone}}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <div key={benefit.id} className="flex items-start">
                <div className="mr-7 w-10 h-10 flex-shrink-0 justify-center iteems-center ">
                  <svg className="w-20 h-20 text-gray-800 mr-10 " viewBox="0 0 24 24" fill="currentColor">
                    {index === 0 && (
                     <GoGoal className="w-20 h-20 text-[#2C383D] mr-17" />
                    )}
                    {index === 1 && (
                      <MdOutlineHandshake className="w-20 h-20 text-[#A7513D] mr-17" />
                    )}
                    {index === 2 && (
                      <MdOutlineLocationOn className="w-20 h-20 text-[#401735] mr-17" />
                    )}
                    {index === 3 && (
                      <CiGlobe className="w-20 h-20 text-[#88903B] mr-17" />
                    )}
                  </svg>
                </div>
                <div>
                <p className={`text-black mb-0 ${typography.body.B1}`} >{benefit.title}</p>
                  {benefit.description && <p className={`text-black mb-8 ${typography.body.B1}`} >{benefit.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-10 mt-25">
        <p className={`text-black mb-0 italic ${typography.body.B1}`} >
            Bring your creativity, skill, and energy—we&apos;ll handle the rest.
          </p>
          <br/>
          <p className={`text-black mb-0 italic ${typography.body.B1} `} >
            Apply now to become a featured freelancer with Styltara Studios and be part of a movement redefining style and self-expression.
          </p>
        </div>
      </div>
      </Container>
    </section>
  );
};

export default FreelancerNetwork;
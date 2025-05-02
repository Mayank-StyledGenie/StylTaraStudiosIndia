import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { typography } from '@/styles/typography';
import Container from '@/components/ui/Container';
import { colors } from '@/styles/colors';
import Avani from '@/images/Aboutus/Avani.png'; 
import Preety from '@/images/Aboutus/Preety.jpeg';
import Akash from '@/images/Aboutus/Akash.png';
import Ishwari from '@/images/Aboutus/Ishwari.jpg';
import Mayank from '@/images/Aboutus/Mayank.jpeg';
import Muskan from '@/images/Aboutus/Muskan.jpeg';

interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  image: string;
  linkedIn: string;
}

const TeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Avani Mutgi",
      title: "Co-Founder & Graphic Designer",
      bio: "Avani believes design is about telling stories that leave a lasting impression. A specialist in visual storytelling, branding, and retail aesthetics, she designs high-impact fashion sets, retail spaces, and brand campaigns that reflect unique identities. She transforms concepts into stunning experiences, bringing brands to life in unforgettable ways. Her vision elevates every project, ensuring it resonates with its audience.",
      image: Avani.src,
      linkedIn: "https://www.linkedin.com/in/avani-mutgi-904b8a156/"
    },
    {
      id: 2,
      name: "Preety Pareek",
      title: "Co-Founder & Head of Fashion Styling",
      bio: "For Preety, fashion is more than style—it’s storytelling. A fashion design graduate with an innate talent for styling, she has worked with top production houses, high-profile campaigns, and celebrities, crafting looks that leave a lasting impact. At Styltara Studio, she brings her expertise to transform wardrobes and elevate confidence, ensuring every client doesn’t just dress up but owns their moment. Because here, style isn’t just worn—it shines.",
      image: Preety.src,
      linkedIn: "https://www.linkedin.com/in/avani-mutgi-904b8a156/"
    },
    {
      id: 3,
      name: "Akash Mutgi",
      title: "Business Consultant",
      bio: "Akash’s approach to business success is built on insight and precision. As a Strategic Business Consultant with a keen eye for operational efficiency and market trends, he crafts strategies that drive growth and streamline operations. With a proven track record of building business in Germany, he brings global expertise to every challenge.",
      image: Akash.src,
      linkedIn: "https://www.linkedin.com/in/akash-am-64b697182/"
    },
    {
      id: 4,
      name: "Ishwari Hakari",
      title: "Head of UI/UX & Social Media",
      bio: "For Ishwari, design is about creating meaningful experiences that are both visual and functional. A skilled UI/UX Designer with a passion for seamless, user-first journeys, she leads the design process with a focus on intuitive, aesthetic solutions aligned with user needs. She has experience in Germany’s e-commerce sector, delivering impactful design solutions.",
      image: Ishwari.src,
      linkedIn: "https://www.linkedin.com/in/ishwari-hakari/"
    },
    {
      id: 5,
      name: "Muskan Sharma ",
      title: "Fashion Stylist and Content Creator",
      bio: "Muskan Sharma brings fresh creativity and a keen eye for style to Styltara Studios Pvt Ltd as our Fashion Stylist and Content Creator. With a passion for blending tradition with modern trends, she curates distinctive looks and engaging content that resonate with our diverse clientele. Muskan plays a key role in styling projects, social media storytelling, and bringing the Styltara vision to life through fashion and digital creativity.",
      image: Muskan.src,
      linkedIn: "https://www.linkedin.com/in/muskan-sharma-10473218a/"
    },
    {
      id: 6,
      name: "Mayank Tanwar",
      title: "Software Engineer",
      bio: "Mayank believes great software is about strength and scalability. A skilled Software Engineer with expertise in building high-performance applications, he focuses on developing robust solutions and ensuring systems run seamlessly across platforms. His work drives innovation and enhances the efficiency of every project he contributes to.",
      image: Mayank.src,
      linkedIn: "https://www.linkedin.com/in/mayank-tanwar-866414262"
    },
    
  ];
  
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
    <Container marginLeft="5vw" marginRight="5vw">
      <h2 className={`${typography.heading.h2} text-3xl md:text-4xl font-bold text-center mb-16`} style={{color: colors.primary.darkpurple}}>
        Our Leadership Team<br className="hidden md:block" />
      </h2>
      
      <div className="flex flex-row flex-wrap gap-6 justify-center items-stretch mx-auto mb-26">
  {teamMembers.filter(member => member.id <= 2).map((member) => (
    <div 
      key={member.id} 
      className="bg-gray-50 rounded-lg overflow-hidden shadow-sm flex flex-col w-full max-w-[389px]"
    >
      <div className="aspect-[4/3] relative">
        <Image 
          src={member.image} 
          alt={member.name}
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        />
      </div>
      
      <div className="p-4 bg-gray-50 flex flex-col flex-grow rounded-tl-3xl rounded-bl-3xl relative">
        <div>
          <p className={`${typography.body.B1}font-bold text-xl mb-2`}><strong>{member.name}</strong></p>
          <p className={`${typography.body.B2 }text-gray-600 mb-5`}>{member.title}</p>
          <p className={`${typography.body.B3}text-gray-700 mb-10`}>{member.bio}</p>
        </div>
        
        <div className="absolute bottom-0 right-0 mb-2 mr-2">
          <Link href={member.linkedIn} target="_blank" rel="noopener noreferrer">
            <div className="w-15 h-15 rounded-full flex items-center justify-center transition-colors -right-3 top-4 relative" style={{backgroundColor: colors.primary.darkpurple}}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="white" 
                className="w-5 h-5"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-0.966 0-1.75-0.79-1.75-1.764s0.784-1.764 1.75-1.764 1.75 0.79 1.75 1.764-0.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>
      <h2 className={`${typography.heading.h2} text-3xl md:text-4xl font-bold text-center my-16`} style={{color: colors.primary.darkpurple}}>
        Our Team<br className="hidden md:block" />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.filter(member => member.id >= 3 && member.id <= 5).map((member) => (
          <div 
            key={member.id} 
            className="bg-gray-50 rounded-lg overflow-hidden shadow-sm flex flex-col h-full"
          >
            <div className="aspect-[16/15] relative bg-gray-200">
              <Image 
                src={member.image} 
                alt={member.name}
                layout="fill"
                objectFit="cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
              />
            </div>
            
            <div className="p-4 bg-gray-50 flex flex-col flex-grow relative">
              <div>
                <p className={`${typography.body.B1}font-bold text-xl mb-2`}><strong>{member.name}</strong></p>
                <p className={`${typography.body.B2 }text-gray-600 mb-5`}>{member.title}</p>
                <p className={`${typography.body.B3}text-gray-700 mb-10`}>{member.bio}</p>
              </div>
              
              <div className="absolute bottom-0 right-0 mb-2 mr-2">
                <Link href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                  <div className="w-15 h-15 rounded-full flex items-center justify-center transition-colors -right-3 top-4 relative" style={{backgroundColor: colors.primary.darkpurple}}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="white" 
                      className="w-5 h-5"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-0.966 0-1.75-0.79-1.75-1.764s0.784-1.764 1.75-1.764 1.75 0.79 1.75 1.764-0.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
    </section>
  );
};

export default TeamSection;

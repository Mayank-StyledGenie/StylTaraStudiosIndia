import StylingNeeds from '@/components/sections/Servicepagesections/StylingNeeds';
import PackageCards from '@/components/sections/Servicepagesections/PackageSection';
import SoftSkills from '@/images/Services/SoftSkills.png'

export default function SoftSkillsEtiquetteCoaching() {
    const stylingneeds = [
        {
          id: 1,
          term: 'Improves Communication: ',
          text: 'Enhances listening, speaking, and non-verbal skills for better personal and professional relationships.',
        },
        {
          id: 2,
          term: 'Enhances Professional Image: ',
          text: 'Cultivates proper behavior for a positive and polished image crucial for career growth.',
        },
        {
          id: 3,
          term: 'Boosts Confidence: ',
          text: 'Develops emotional intelligence and problem-solving skills, leading to greater self-assurance in interactions.',
        },
        {
          id: 4,
          term: 'Strengthens Relationships: ',
          text: 'Fosters respect and understanding in personal and professional interactions, leading to stronger connections.',
        },
         {
          id: 5,
          term: 'Adaptability in Settings: ',
          text: 'Equips individuals to navigate diverse social and professional environments (business, social, international) with grace and professionalism..',
         }  
      ];
      const imageUrl = SoftSkills.src;
      const NeedsQuestion = 'Why do you need Soft Skills & Etiquette Coaching ?';
      const description = 'Unlock professional excellence at every stage of your career. Our Soft Skills & Etiquette program is tailored for freshers building corporate confidence, mid-level managers enhancing leadership communication, and senior executives refining their presence and strategic impact.';
      
    
      const packageData = [
          {
            id: 1,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Basic+Package",
            title: "Basic Package",
            description: ["Duration: 2 hours.", 
                          "Topics Covered: Basic communication skills, first impressions, dining etiquette, body language, and professional behavior.",
                          "Practical Session: Role-playing exercises to build confidence. ",
                          ],
            benefit:"Benefits: Budget-friendly package for couples or brides looking for professional photos on their special day. ",
          },
          {
            id: 2,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Luxury+Package",
            title: "Premium Package",
            description: ["Duration: 4–6 hours.", 
                          "Topics Covered: Leadership skills, conflict resolution, presentation skills, advanced body language, and stress management.", 
                          "Practical Session: Coaching on real-life situations, public speaking, and peer feedback."],
            benefit: "Benefits: This is a high-end service offering a comprehensive solution for wedding styling and professional photoshoot coverage.",
          },
        ];
    
    
      return (
      <>
      <StylingNeeds Needs={stylingneeds} title='Soft Skills & Etiquette Coaching' description={description} imageUrl={imageUrl} NeedsQuestion={NeedsQuestion}/>
      <PackageCards
        packages={packageData} 
        bookingFee="Rs. 299/-"
        bookingNote="*This is only a booking fee and will be adjusted in the final service charge. Please note, the booking fee is non-refundable. Once you book, you will receive the full pricing details for your selected service. "
        empty={false}
        title='Soft Skills & Etiquette Coaching'
      />
    </>
  );
}


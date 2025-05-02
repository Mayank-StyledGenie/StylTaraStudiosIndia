import StylingNeeds from '@/components/sections/Servicepagesections/StylingNeeds';
import PackageCards from '@/components/sections/Servicepagesections/PackageSection';
import MakeupStyling from '@/images/Services/MakeupStyling.png'

export default function MakeupStylingTraining () {
    const stylingneeds = [
        {
          id: 1,
          term: 'Skill Development: ',
          text: 'Master essential makeup and styling techniques for personal use or a career in fashion and beauty.',
        },
        {
          id: 2,
          term: 'Boosts Confidence: ',
          text: 'Learn to enhance natural beauty and express personality through styling, leading to increased self-esteem.',
        },
        {
          id: 3,
          term: 'Career Opportunities: ',
          text: 'Provides the foundation for professional roles as makeup artists, stylists, or entrepreneurs in the beauty/fashion industry.',
        },
        {
          id: 4,
          term: 'Up-to-Date Techniques: ',
          text: 'Techniques constantly evolve. Stay up-to-date on the latest trends, tools, and styles to offer fresh, modern services that clients desire.',
        },
         {
          id: 5,
          term: 'Customization for Diverse Needs: ',
          text: 'Learn to cater to various clients (bridal, corporate, etc.), cultures, and occasions with tailored looks.',
         }  
      ];
      const imageUrl = MakeupStyling.src;
      const NeedsQuestion = 'Why do you need Makeup & Styling Trainings ?';
      const description = 'Master the art of makeup and styling with our hands-on training programs led by industry experts. Perfect for aspiring artists and fashion enthusiasts looking to turn passion into profession.';
      
    
      const packageData = [
          {
            id: 1,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Basic+Package",
            title: "Basic Package",
            description: ["Duration: 2–3 hours.", "Topics Covered: Basic makeup techniques (foundation, eyeshadow, lip color), personal styling tips, skincare, and hair care.", "Practical Session: Hands-on practice on models or self application. ","Materials Provided: Training kit, makeup brushes, and a basic makeup product list."],
            benefit:"Benefits: Ideal for beginners who want to learn basic makeup and styling techniques.",
          },
          {
            id: 2,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Premium+Package",
            title: "Premium Package",
            description: ["Duration: 5–6 hours.", 
              "Topics Covered: Advanced makeup techniques (contouring, highlighting, special occasion makeup), personal styling for various events, body type analysis, and hair styling techniques.", 
              "Practical Session: Extensive hands-on training with one on-one attention.",
              "Materials Provided: Full makeup kit, styling lookbook, and hair accessories.", 
              ],
            benefit: "Benefits: For individuals who want to become professional makeup artists or stylists or take their personal style to the next level." 
            ,
          },
          {
            id: 3,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Luxury+Package",
            title: "Luxury Package",
            description: ["Duration: 10–12 days (spread over several weeks or in a workshop format).", 
              "Topics Covered: Advanced makeup techniques, hairstyling, wardrobe consulting, body language, and personal branding.", 
              "Practical Session: In-depth hands-on with models, training on clients, and portfolio building.", 
              "Certification: Upon completion, clients receive a certificate that they can use for professional opportunities.", 
              "Materials Provided: Full professional makeup kit, styling books, and access to an alumni network.", 
              ],
            benefit:"Benefits: A comprehensive course that provides the skills necessary for someone looking to build a career in makeup, styling, and soft skills training." 
            ,
          },
        ];
    
    
      return (
      <>
      <StylingNeeds Needs={stylingneeds} title='Makeup & Styling Trainings' description={description} imageUrl={imageUrl} NeedsQuestion={NeedsQuestion}/>
      <PackageCards
        packages={packageData} 
        bookingFee="Rs. 299/-"
        bookingNote="*This is only a booking fee and will be adjusted in the final service charge. Please note, the booking fee is non-refundable. Once you book, you will receive the full pricing details for your selected service. "
        empty={true}
        title='Makeup & Styling Trainings'
      />
    </>
  );
}


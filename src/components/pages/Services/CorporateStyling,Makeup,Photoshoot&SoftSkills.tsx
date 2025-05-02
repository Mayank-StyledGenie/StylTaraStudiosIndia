import StylingNeeds from '@/components/sections/Servicepagesections/StylingNeeds';
import PackageCards from '@/components/sections/Servicepagesections/PackageSection';
import CorporateStyling from '@/images/Services/CorporateStyling.png'

export default function CorporateStylingMakeupPhotoshootSoftSkills() {
    const stylingneeds = [
        {
          id: 1,
          term: 'Corporate Styling: ',
          text: 'Projects a professional, confident image aligned with company branding, fostering positive first impressions and trust.',
        },
        {
          id: 2,
          term: 'Makeup: ',
          text: 'Ensures a polished, fresh appearance for business events, photoshoots, or public-facing roles, enhancing confidence and projecting a professional image.',
        },
        {
          id: 3,
          term: 'Photoshoot: ',
          text: 'Creates high-quality visuals for marketing and online presence, showcasing company culture and individual/team professionalism.',
        },
        {
          id: 4,
          term: 'Soft Skills: ',
          text: 'Develops crucial communication, leadership, and interpersonal abilities for effective teamwork, client relations, and career success.',
        },
         {
          id: 5,
          term: 'Holistic Professional Development: ',
          text: 'A comprehensive approach ensuring individuals look, feel, and act professionally, boosting personal branding and company image.',
         }  
      ];
      const imageUrl = CorporateStyling.src;
      const NeedsQuestion = 'Why do you need Corporate Styling, Makeup, Photoshoot & Soft Skills ?';
      const description = 'Create a powerful professional image at every level. Our corporate styling, makeup, and photoshoot services are tailored for individuals building personal brands, teams seeking cohesive visual identity, and C-suite leaders elevating their executive presence.';
      
    
      const packageData = [
          {
            id: 1,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Basic+Package",
            title: "Basic Package",
            description: ["Corporate Styling Consultation:   1-hour consultation to help employees or business professionals dress according to their workplace culture or for special corporate events.", 
                          "Photoshoot: 1–2 hours of professional photoshoot in business attire for LinkedIn profiles, corporate websites, or portfolios.", 
                          "Makeup: Natural, office-appropriate makeup with a professional finish.",
                          "Final Deliverables: 15 edited images in digital format.",],
            benefit:"Benefits: Perfect for individuals or small teams looking to enhance their professional image with updated photos and styling. ",
          },
          {
            id: 2,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Premium+Package",
            title: "Premium Package",
            description: ["Extended Corporate Styling Consultation: 2-hour session with a personalized style guide to suit different business settings (meetings, conferences, client presentations).",
                          "Photoshoot: 3-hour professional shoot with up to 3 outfit changes in a business or office setting.",
                          "Makeup: Full makeup to achieve a polished, professional look.",
                          "Soft Skills Coaching: 1-hour session on effective communication, posture, and professional presence.",
                          "Advanced color and body type analysis.",
                          "Final Deliverables: 30 professionally edited photos, plus digital files for social media profiles, resumes, or business websites."],
            benefit: "Benefits: Ideal for executives, entrepreneurs, or professionals who want to project a confident, polished image across various platforms.",
          },
          {
            id: 3,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Luxury+Package",
            title: "Luxury Package",
            description: ["Group Styling Consultation: Group or individual consultation for employees or executives to develop a cohesive company look (suitable for photoshoots or uniform design).", 
                          "Advanced color and body type analysis.",
                          "Corporate Photoshoot: Full-day photoshoot for corporate headshots or team photos in professional attire (on-location or studio-based).",
                          "Makeup & Grooming: Full makeup and grooming services for the entire team to achieve a consistent, polished appearance.",
                          "Soft Skills & Etiquette Coaching: 4-hour session on effective team communication, leadership skills, professional body language, and corporate etiquette.",
                          "Final Deliverables: 50 edited group and individual photos, team portraits, plus digital files. Optional printed photos and albums for the office. "],
            benefit: "Benefits: This package is tailored for companies or teams looking to update their corporate image, improve their internal communication, and enhance their professional presence both online and in real world interactions.",
          },
        ];
    
    
      return (
      <>
      <StylingNeeds Needs={stylingneeds} title='Corporate Styling, Makeup, Photoshoot & Soft Skills' description={description} imageUrl={imageUrl} NeedsQuestion={NeedsQuestion}/>
      <PackageCards
        packages={packageData} 
        bookingFee="Rs. 299/-"
        bookingNote="*This is only a booking fee and will be adjusted in the final service charge. Please note, the booking fee is non-refundable. Once you book, you will receive the full pricing details for your selected service. "
        empty={true}
        title="Corporate Styling, Makeup, Photoshoot & Soft Skills"
      />
    </>
  );
}


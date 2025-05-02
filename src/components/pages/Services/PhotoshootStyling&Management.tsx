import StylingNeeds from '@/components/sections/Servicepagesections/StylingNeeds';
import PackageCards from '@/components/sections/Servicepagesections/PackageSection';
import PhotoshootStyling from '@/images/Services/PhotoshootStyling&Management.png'

export default function PhotoshootStylingManagement() {
    const stylingneeds = [
        {
          id: 1,
          term: 'Brand Consistency: ',
          text: 'Aligns wardrobe, props, and overall look with your brand identity for clear and attractive messaging.',
        },
        {
          id: 2,
          term : 'Enhanced Visuals: ',
          text: 'Professional styling elevates models, products, and locations for impactful, eye-catching images.',
        },
        {
          id: 3,
          term: 'Effective Storytelling: ',
          text: 'Proper styling helps set the mood and context, making photos resonate emotionally with the audience, whether it\'s fashion, wedding, or corporate shoot.',
        },
        {
          id: 4,
          term: 'Time & Budget Efficiency: ',
          text: 'Streamlined process with dedicated management ensures smooth execution and polished results within budget.',
        },
         {
          id: 5,
          term : 'Professional Image: ',
          text: 'High-quality, styled photos elevate your brand or personal projects for marketing, social media, and branding.',
         }  
      ];
      const imageUrl = PhotoshootStyling.src;
      const NeedsQuestion = 'Why do you need Photoshoot Styling & Management ?';
      const description = 'Offering styling, coordination, and direction for photoshoots. This can be for personal photoshoots, influencer content, or professional portfolios.';
      
    
      const packageData = [
          {
            id: 1,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Basic+Package",
            title: "Basic Package",
            description: ["1-2 hour photoshoot with styling assistance.", "Basic direction for the shoot.", "10 edited photos."],
            benefit:"",
          },
          {
            id: 2,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Standard+Package",
            title: "Premium Package",
            description: ["3-hour photoshoot with full styling and wardrobe coordination.", "Assistance with hair and makeup.", "Advanced color and body type analysis.", "30 edited photos."],
            benefit:"",
          },
          {
            id: 3,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Premium+Package",
            title: "Luxury Package",
            description: ["Full day photoshoot with multiple wardrobe changes.", "Professional makeup and hairstyling.", "50+ edited photos and a video teaser.", "Complete shoot management (location scouting, team coordination)."],
            benefit:"",
          },
        ];
    
    
      return (
      <>
      <StylingNeeds Needs={stylingneeds} title='Photoshoot Styling & Management' description={description} imageUrl={imageUrl} NeedsQuestion={NeedsQuestion}/>
      <PackageCards
        packages={packageData} 
        bookingFee="Rs. 299/-"
        bookingNote="*This is only a booking fee and will be adjusted in the final service charge. Please note, the booking fee is non-refundable. Once you book, you will receive the full pricing details for your selected service. "
        empty={false}
        title='Photoshoot Styling & Management'
      />
    </>
  );
}


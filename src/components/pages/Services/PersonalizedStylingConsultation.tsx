import StylingNeeds from '@/components/sections/Servicepagesections/StylingNeeds';
import PackageCards from '@/components/sections/Servicepagesections/PackageSection';
import PersonalStyling from '@/images/Services/PersonalizedStyling.png'

export default function PersonalizedStyling() {
    const stylingneeds = [
        {
          id: 1,
          term: 'Confidence Boost: ',
          text: 'Feel your best for every event, from family to work, in both traditional and modern styles.',
        },
        {
          id: 2,
          term: 'Time Saver: ',
          text: 'Simplify dressing for any occasion (festivals, celebrations, work) with a streamlined wardrobe.',
        },
        {
          id: 3,
          term: 'Cultural & Personal Expression: ',
          text: 'Reflect your unique identity and honor Indian traditions (sarees, lehengas, etc.) with modern flair.',
        },
        {
          id: 4,
          term: 'Smart & Lasting Choices: ',
          text: 'Invest in versatile, high-quality pieces instead of fast fashion.',
        },
         {
          id: 5,
          term: 'Smart & Lasting Choices: ',
          text: 'Invest in versatile, high-quality pieces instead of fast fashion.',
         }  
      ];
      const imageUrl = PersonalStyling.src;
      const NeedsQuestion = 'Why do you need Personal Styling ?';
      const description = 'One-on-one consultations with a professional stylist to help individuals define their style, create wardrobe combinations, and shop for new pieces. This service is ideal for anyone seeking a style makeover or advice on how to dress for various occasions.';
      
    
      const packageData = [
          {
            id: 1,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Basic+Package",
            title: "Basic Package",
            description: ["Personal Style Consultation (30 minutes).", "1/2 hour consultation via video call.", "Style assessment and personal recommendations.", "Virtual shopping guide.", "Basic color and body type analysis."],
            benefit:"",
          },
          {
            id: 2,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Standard+Package",
            title: "Premium Package",
            description: ["2-hour consultation In person or virtual.", "Full wardrobe audit In person or virtual.", "Advanced color and body type analysis.", "Custom shopping recommendations with links.", "Tips for building a versatile wardrobe."],
            benefit:"",
          },
          {
            id: 3,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Premium+Package",
            title: "Luxury Package",
            description: ["Everything in Premium.", "Full Day Styling Consultation In person or virtual.", "Personal shopping tour (local malls or online assistance).", "Creation of a complete lookbook with personalized styling tips.", "Follow-up consultation after 1 month."],
            benefit:"",
          },
        ];
    
    
      return (
      <>
      <StylingNeeds Needs={stylingneeds} title='Personalized Styling Consultation' description={description} imageUrl={imageUrl} NeedsQuestion={NeedsQuestion}/>
      <PackageCards
        packages={packageData} 
        bookingFee="Rs. 299/-"
        bookingNote="*This is only a booking fee and will be adjusted in the final service charge. Please note, the booking fee is non-refundable. Once you book, you will receive the full pricing details for your selected service. "
        empty={false}
        title='Personalized Styling Consultation'
      />
    </>
  );
}


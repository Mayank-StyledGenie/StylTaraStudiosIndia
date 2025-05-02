import StylingNeeds from '@/components/sections/Servicepagesections/StylingNeeds';
import PackageCards from '@/components/sections/Servicepagesections/PackageSection';
import WeddingStyling from '@/images/Services/WeddingStyling&Photoshoot.png'

export default function WeddingStylingPhotoshoot() {
    const stylingneeds = [
        {
          id: 1,
          term: 'Coordinated Aesthetic: ',
          text: 'Ensures a consistent look across attire and decor, aligning with the couple\'s vision for a polished celebration.',
        },
        {
          id: 2,
          term: 'Stress-Free Planning: ',
          text: 'Professionals handle styling and photoshoot details, allowing couples to fully enjoy their special day.',
        },
        {
          id: 3,
          term: 'Timeless Memories: ',
          text: 'Expertly styled and photographed moments create beautiful, lasting memories of the wedding magic.',
        },
        {
          id: 4,
          term: 'Customised for You:',
          text: ' Packages tailored to reflect unique tastes, culture, and traditions in both styling and photography.',
        },
         {
          id: 5,
          term: 'Elevates the Experience: ',
          text: 'Well-styled events and photoshoots create an unforgettable and visually stunning experience for everyone.',
         }  
      ];
      const imageUrl = WeddingStyling.src;
      const NeedsQuestion = 'Why do you need Wedding Styling & Photoshoot ?';
      const description = 'Celebrate your big day in style with personalized bridal and groom styling, perfectly tailored to your theme, culture, and personality. From outfits to accessories, we ensure every look is flawless. Capture every stunning moment with our expert photoshoot services, designed to beautifully document your special day.';
      
    
      const packageData = [
          {
            id: 1,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Basic+Package",
            title: "Basic Package",
            description: ["Bridal Styling Consultation: 2-hour consultation for styling options based on theme, color scheme, etc.", "Bridal Photoshoot: Half-day shoot for bridal portraits.", " Makeup & Hair: Bridal makeup and hair done by professionals. ","Final Deliverables: 20 edited bridal photos in digital format.","Basic color and body type analysis."],
            benefit:"Benefits: Budget-friendly package for couples or brides looking for professional photos on their special day. ",
          },
          {
            id: 2,
            image: "https://placehold.co/600x400/d3d3d3/black?text=Luxury+Package",
            title: "Luxury Package",
            description: ["In-depth Wedding Styling: 3 consultations for bridal, groom, and bridal party styling.", "Photoshoot: Full-day wedding photoshoot, including pre-ceremony, ceremony, and post-ceremony shots. ", "Makeup & Hair: Customized bridal hair and makeup with multiple looks throughout the day.", "Final Deliverables: 150 edited images in a luxury wedding album, printed high-quality pictures, and digital versions.","Advanced color and body type analysis."],
            benefit: "Benefits: This is a high-end service offering a comprehensive solution for wedding styling and professional photoshoot coverage.",
          },
        ];
    
    
      return (
      <>
      <StylingNeeds Needs={stylingneeds} title='Wedding Styling & Photoshoot' description={description} imageUrl={imageUrl} NeedsQuestion={NeedsQuestion}/>
      <PackageCards
        packages={packageData} 
        bookingFee="Rs. 299/-"
        bookingNote="*This is only a booking fee and will be adjusted in the final service charge. Please note, the booking fee is non-refundable. Once you book, you will receive the full pricing details for your selected service. "
        empty={false}
        title='Wedding Styling & Photoshoot'
      />
    </>
  );
}


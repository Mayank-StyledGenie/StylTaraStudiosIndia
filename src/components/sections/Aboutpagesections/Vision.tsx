import { typography } from "@/styles/typography";
import Container from "../../ui/Container";
import { colors } from "@/styles/colors";


const LocationsMessage = () => {
  return (
    <section className="mb-12 p-5" style={{ backgroundColor: colors.primary.darkpurple }} >
    <Container marginLeft="5vw" marginRight="5vw" backgroundColor={colors.primary.darkpurple}>
    <div style={{ backgroundColor: colors.primary.darkpurple }} className="flex justify-center items-center">
        <h2 className={`${typography.heading.h2} text-white`}>Our Vision</h2><br/>
        </div>
      <div
        className={`flex  py-8 ${typography.body.B1} max-w-4xl mx-auto text-center text-white`}
        style={{ backgroundColor: colors.primary.darkpurple }} 
      >
        
        <p className="flex items-center justify-center gap-3 font-medium text-white">
          
        Styltara Studios aims to become a leading hub for styling, beauty, and professional training, where creativity meets expertise. Whether you need a personal transformation, a high-fashion shoot, or career-focused training, we help you express your best self.        </p>
      </div>
    </Container>
    </section>
  );
}

export default LocationsMessage;

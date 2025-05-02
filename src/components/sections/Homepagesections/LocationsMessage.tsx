import { typography } from "@/styles/typography";
import Container from "../../ui/Container";
import { GoLocation } from "react-icons/go";
import { colors } from "@/styles/colors";


const LocationsMessage = () => {
  return (
    <section className="mb-12" style={{ backgroundColor: colors.primary.darkpurple }} >
    <Container marginLeft="5vw" marginRight="5vw" backgroundColor={colors.primary.darkpurple}>
      <div
        className={`flex items-center justify-center py-8 italic ${typography.body.B1} max-w-3xl mx-auto text-center`}
        style={{ backgroundColor: colors.primary.darkpurple }} 
      >
        <p className="flex items-center justify-center gap-3 font-medium text-white">
          <GoLocation  className="flex-shrink-0 text-lg" size={40} /> 
          Our services are currently available online across India, with in-person styling currently offered only in Jaipur, Delhi, Mumbai, and Pune.
        </p>
      </div>
    </Container>
    </section>
  );
}

export default LocationsMessage;

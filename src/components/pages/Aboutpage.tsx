import AboutSection from "@/components/sections/Aboutpagesections/aboutus";
import TeamSection from "@/components/sections/Aboutpagesections/team";
import ApplyBanner from "@/components/sections/Aboutpagesections/beapart";
import Vision from "@/components/sections/Aboutpagesections/Vision";

export default function AboutPage() {
  return (
    <>
      <AboutSection />
      <Vision />
      <TeamSection />
      <ApplyBanner />
      
    </>
  );
}
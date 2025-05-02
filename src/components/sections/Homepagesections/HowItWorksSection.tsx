import Image from 'next/image';
import Container from '@/components/ui/Container';
import { typography } from '@/styles/typography';
import { colors } from '@/styles/colors';
import step1 from '@/images/Homepage/Steps/step1.png';
import step2 from '@/images/Homepage/Steps/step2.png';
import step3 from '@/images/Homepage/Steps/step3.png';

const HowItWorksSection = () => {
  const steps = [
    {
      title: "Step 1: Select a Service",
      description: "Choose from our wide range of services that suit your personal style.",
      imageUrl: step1,
    },
    {
      title: "Step 2: Fill Out Style Form",
      description: "Tell us about your fashion taste, preferences & goals – it only takes a minute!",
      imageUrl: step2,
    },
    {
      title: "Step 3: Book Your Service",
      description: "Once you book, our team will get in touch with you for a personalized consultation.",
      imageUrl: step3,
    },
  ];

  return (
    <section className="py-12 mt-25" style={{ backgroundColor: colors.primary.bone}}>
      <Container marginLeft="5vw" marginRight="5vw">
        <div className="text-center mb-12">
          <h2 className={`${typography.heading.h2} mb-4`} style={{ color: colors.primary.darkpurple}}> How It Works: Discover in 3 Simple Steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <div key={step.title} className="rounded-lg overflow-hidden">
              <div className="bg-gray-200 relative m-3 rounded-full w-[200px] h-[200px] sm: w-[100px] sm: h-[100px] justify-center items-center flex mx-auto">
                {step.imageUrl ? (
                  <Image
                    src={step.imageUrl}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center p-4 m-2 mb-5 rounded-full bg-gray-300">
                    <svg viewBox="0 0 24 24" width="28" height="28" className="text-gray-800">
                      <circle cx="12" cy="8" r="2" fill="currentColor" />
                      <path d="M5 21l4.5-9L14 16l4-10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <polygon points="5,21 19,21 12,14" fill="currentColor" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-2 text-center">
                <h4 className={`${typography.heading.h4} mb-5`}>{step.title}</h4>
                <p className={`flex items-center  mb-5 ${typography.body.B2} max-w-3xl mx-auto`}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;

import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { typography } from '@/styles/typography';
import Link from 'next/link';
import Image from 'next/image';
import Heroimage from '@/images/Homepage/Homepageheroimage.png';
import { colors } from '@/styles/colors';

const HeroSection = () => {
  return (
    <section className="min-h-[80vh] flex flex-col border-t border-blue-100 relative py-12 mb-12">
      <Container marginLeft="5vw" marginRight="5vw">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative">
            <div className="mt-8">
              <h1 className={`${typography.special.d2} mb-6`} style={{ color: colors.primary.darkpurple }}>
                Every Star Has a Style. Let&apos;s Find Yours.
              </h1>
              <p className={`${typography.body.B1} mb-8 max-w-2xl mx-auto pr-12`}>
                At Styltara Studio, we believe fashion isn&apos;t just about what you wear - it&apos;s about how it makes you feel. We craft looks that reflect you, at your brightest.
              </p>
              <Link href="/#services">
                <Button size="md" className="py-3 px-7">Get Styled Now</Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile image (shown only on small screens) */}
        <div className="w-full mt-12 md:hidden relative rounded-3xl overflow-hidden px-0 mx-0 h-[400px]">
          <Image
            src={Heroimage}
            alt="Hero" 
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </Container>
      
      <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block mt-10 rounded-tl-3xl rounded-bl-3xl overflow-hidden">
        <Image
          src={Heroimage}
          alt="Hero"
          fill
          priority
          className="object-cover object-center"
          sizes="50vw"
        />
      </div>
    </section>
  );
};

export default HeroSection;

import Image from 'next/image';
import Container from '@/components/ui/Container';
import { typography } from '@/styles/typography';
import { colors } from '@/styles/colors';
import Coming_Soon from '@/images/Homepage/comingsoon.png';

const CapturedMoments = () => {

    return (
        <div className="py-16">
            <Container marginLeft="5vw" marginRight="5vw">
                <div className="text-center mb-16">
                    <h1 className={`${typography.heading.h2} mb-6`} style={{color: colors.primary.darkpurple}}>Our Work in Frames</h1>
                    <p className= {`${typography.body.B1} text-black mb-8 max-w-2xl mx-auto`}>
                    Each snapshot holds a story—From behind-the-scenes magic to picture-perfect results, here’s a glimpse into our styling journey.
                    </p>
                </div>
                <h3 className={`${typography.heading.h3} md:text-2xl italic font-medium text-center mb-8`} style={{color: colors.secondary.chestnut}}>
                            Coming Soon!
                          </h3>
                <div className="flex">
                    <Image src={Coming_Soon} alt="Coming Soon" className="w-full h-fullrounded-lg" />
                </div>
            </Container>
        </div>
    );  
}

export default CapturedMoments;
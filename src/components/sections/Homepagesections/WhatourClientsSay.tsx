"use client";
import Container from "@/components/ui/Container";
import { typography } from "@/styles/typography";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { colors } from "@/styles/colors";

interface ClientCardProps {
    name: string;
    title: string;
    description: string;
}

const ClientCard = ({ name, title, description }: ClientCardProps) => {
    return (
        <div className="rounded-2xl p-9 inset-shadow-sm shadow-xl h-130 flex flex-col justify-between mx-2 mb-5 relative">
            {/* Top section with description - fixed height with overflow handling */}
            <div className="h-3/4 overflow-y-auto mb-6">
                <p className={`${typography.body.B2} text-gray-800 text-sm leading-relaxed`}>
                    {description}
                </p>
            </div>
            
            {/* Bottom section with name and title - always stays at the bottom */}
            <div className="h-1/4 flex items-end justify-center">
                <div className="text-center">
                    <h4 className={`${typography.body.B2} font-bold`}>{name}</h4>
                    <p className={`${typography.body.B2} text-gray-500`}>{title}</p>
                </div>
            </div>
        </div>
    );
};
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="absolute top-1/2 right-[-20px] lg:right-[-30px] transform -translate-y-1/2 text-gray-900 p-2 rounded-full hover:text-gray-600 transition z-10 bg-white/80"
    >
        <FaChevronRight size={20} className="md:text-2xl" />
    </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="absolute top-1/2 left-[-20px] lg:left-[-30px] transform -translate-y-1/2 text-gray-900 p-2 rounded-full hover:text-gray-600 transition z-10 bg-white/80"
    >
        <FaChevronLeft size={20} className="md:text-2xl" />
    </button>
);

const clients = [
    {
        id: "client-1", // Add unique ID
        name: "Harsimerjeet Kaur",
        title: "Devops Engineer",
        description: "“Styltara Studio completely changed the way I see myself! The personalized styling consultation was not only fun but also so empowering. They took time to understand my personality, lifestyle, and preferences before curating looks that truly felt like me. I feel more confident every day now!”",
        image: "https://cdn-icons-png.flaticon.com/128/456/456212.png",
    },
    {
        id: "client-2", // Add unique ID
        name: "Nidhi Nargund",
        title: "Regulatory Affairs Executive ",
        description: "“Styltara Studio brought our cosmetic products to life! Their creative direction, styling expertise, and Photoshoot Styling & Management  gave us high-end visuals that exceeded expectations. Every product looked editorial worthy!” ",
        image: "https://cdn-icons-png.flaticon.com/128/456/456212.png",
    },
    {
        id: "client-3", // Add unique ID
        name: "Abhinay Kumar",
        title: "Manager",
        description: "“For someone who attends a lot of internal and external meetings with suppliers and partners needs to make the right impression every time. Styltara’s corporate styling helped me craft a wardrobe that truly reflects my role and personality. I now walk into meetings in a personalized look with extra comfort and confidence!” ",
        image: "https://cdn-icons-png.flaticon.com/128/456/456212.png",
    },
];

const WhatourClientsSay = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    dots: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                },
            },
        ],
    };

    return (
        <section className="py-12 relative overflow-visible">
            <Container marginLeft="5vw" marginRight="5vw">
                <div className="text-center">
                    <h2 className={`${typography.heading.h2} mb-4`} style={{color: colors.primary.darkpurple}}>What Our Clients Say</h2>
                    <p className={`${typography.body.B1} text-black max-w-2xl mx-auto`}>
                        Every look we create comes with a story—and these are some of the most heartwarming ones.
                    </p>
                </div>
                <div className="relative py-10">
                    <Slider {...settings} className="overflow-visible mb-10">
                        {clients.map((client) => (
                            <div key={client.id} className="px-2">
                                <ClientCard {...client} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </Container>
        </section>
    );
};

export default WhatourClientsSay;

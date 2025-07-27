import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonialData = [
  {
    image: "/t-avt-4.png",
    name: "M.Amine Chermiti",
    position: "Customer",
    message:
      "I asked Sofienne to create a website for my Narjess 4 building project, and I am very happy with the result. He was able to understand my needs and deliver a quality product on time.",
  },
  {
    image: "/t-avt-1.png",
    name: "Ghazi Atroussi",
    position: "Employer",
    message:
      "Un jeune homme très sérieux et motivé, il a su s'adapter à notre environnement de travail et a fait preuve d'une grande capacité d'apprentissage. Je le recommande vivement.",
  },
  {
    image: "/t-avt-2.png",
    name: "Montassar Kouki",
    position: "Employer",
    message:
      "Sofienne est un professionnel de première classe, il a su mener à bien son projet et a atteint ses objectifs. Je l'encourage à continuer sur cette voie.",
  },
  {
    image: "/t-avt-3.png",
    name: "Yassine Bouabid",
    position: "Customer",
    message:
      "J'ai acheté un site web à Sofienne et je suis très satisfait du résultat. Il a su répondre à mes attentes et a été très réactif tout au long du projet.",
  },
  
];

const TestimonialSlider = () => {
  return (
    <Swiper
      navigation
      pagination={{
        clickable: true,
      }}
      modules={[Navigation, Pagination]}
      className="h-[400px]"
    >
      {testimonialData.map((person, i) => (
        <SwiperSlide key={i}>
          <div className="flex flex-col items-center md:flex-row gap-x-8 h-full px-16">
            {/* avatar, name, position */}
            <div className="w-full max-w-[300px] flex flex-col xl:justify-center items-center relative mx-auto xl:mx-0">
              <div className="flex flex-col justify-center text-center">
                {/* avatar */}
                <div className="mb-2 mx-auto">
                  <Image
                    src={person.image}
                    width={100}
                    height={100}
                    alt={person.name}
                  />
                </div>

                {/* name */}
                <div className="text-lg">{person.name}</div>

                {/* position */}
                <div className="text-[12px] uppercase font-extralight tracking-widest">
                  {person.position}
                </div>
              </div>
            </div>

            {/* quote & message */}
            <div className="flex-1 flex flex-col justify-center before:w-[1px] xl:before:bg-white/20 xl:before:absolute xl:before:left-0 xl:before:h-[200px] relative xl:pl-20">
              {/* quote icon */}
              <div className="mb-4">
                <FaQuoteLeft
                  className="text-4xl xl:text-6xl text-white/20 mx-auto md:mx-0"
                  aria-aria-hidden
                />
              </div>

              {/* message */}
              <div className="xl:text-lg text-center md:text-left">
                {person.message}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TestimonialSlider;

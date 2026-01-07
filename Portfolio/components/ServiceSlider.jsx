import {
  RxCrop,
  RxPencil2,
  RxDesktop,
  RxReader,
  RxRocket,
  RxArrowTopRight,
} from "react-icons/rx";
import { FreeMode, Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

const serviceData = [
  {
    Icon: RxCrop,
    title: "CI/CD",
    description: "Need help with your CI/CD pipeline? I can help you set up a robust and efficient pipeline that will save you time and effort." , 
  },
  {
    Icon: RxPencil2,
    title: "Design",
    description: "I'm happy to help you with your design needs, whether it's a simple logo or a complex web application. I can create designs that are both visually appealing and functional.",
  },
  {
    Icon: RxDesktop,
    title: "Development",
    description: "Hit me up if you need a full-stack developer to help you with your project. I can work with you to create a web application that meets your needs and exceeds your expectations.",
  },
  {
    Icon: RxReader,
    title: "Transcription",
    description: "If you are looking for a transcription agent, I can help you with that too. I have experience in transcribing audio and video files into text format.",
  },
  {
    Icon: RxRocket,
    title: "Gaming",
    description: "I'm also a gaming enthusiast and I can help you with your gaming needs. I can help you with game development, game design, and game testing.",
  },
];

const ServiceSlider = () => {
  return (
    <Swiper
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 15,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
      }}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode, Pagination, Navigation]}
      freeMode
      navigation
      className="h-[240px] sm:h-[340px]"
    >
      {serviceData.map((item, i) => (
        <SwiperSlide key={i}>
          <div className="bg-[rgba(65,47,123,0.15)] h-max rounded-lg px-6 py-8 flex sm:flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,65,169,0.15)] transition-all duration-300">
            {/* icon */}
            <div className="text-4xl text-accent mb-4">
              <item.Icon aria-hidden />
            </div>

            {/* title & description */}
            <div className="mb-8">
              <div className="mb-2 text-lg">{item.title}</div>
              <p className="max-w-[350px] leading-normal">{item.description}</p>
            </div>

            {/* arrow */}
            {/* <div className="text-3xl">
              <RxArrowTopRight
                className="group-hover:rotate-45 group-hover:text-accent transition-all duration-300"
                aria-hidden
              />
            </div> */}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ServiceSlider;

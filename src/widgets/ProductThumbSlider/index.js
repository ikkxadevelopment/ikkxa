"use client";
import Image from "@/components/Image/image";
import Slider from "@/components/Slider";
import { SwiperSlide } from "swiper/react";
import { useState, useEffect, useRef } from "react";
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import ProductMagnifier from "./ProductMagnifier";

export default function ProductThumbSlider({ data }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isOpen,setIsOpen]=useState(false)
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef(null); 

  // Handle slide change and update the current slide index
  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.activeIndex); // Update the current slide index
  };



  // Main slider settings
  const customSettings = {
    slidesPerView: 1,
    pagination: false,
    thumbs:{ swiper: thumbsSwiper },
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
    onSlideChange: handleSlideChange,
    modules:[FreeMode, Navigation, Thumbs]
  };

  // Thumbnail slider settings
  const customSettings2 = {
    spaceBetween: 15,
    slidesPerView: 5,
    pagination: false,
    onSwiper: setThumbsSwiper,
    modules:[FreeMode, Navigation, Thumbs],
    breakpoints: {
      640: {
        spaceBetween: 15,
      },
      768: {
        spaceBetween: 15,
      },
    },
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  };


  return (
    <div className="relative">
      {/* Main slider */}
      <ProductMagnifier data={data} isOpen={isOpen} setIsOpen={setIsOpen} index={currentSlide}  />
      <div className="md:mb-4 relative">
        <Slider
          className={""}
          customSettings={customSettings}
          ref={swiperRef} 
        >
          {data?.large?.map((item, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="aspect-[490/735] w-full relative"
                 onClick={()=>setIsOpen(true)}>
                  <Image
                    src={item}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
                    fill
                    className="object-cover bg-slate-200"
                    alt={`product image ${i}`}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Slider>
      </div>

      {/* Thumbnail slider */}
      <div className="absolute md:static px-4 md:px-0 md:py-0 py-4 bottom-0 left-0 w-full z-10">
        <Slider
          className={""}
          customSettings={customSettings2}
          
        >
          {data?.large?.map((item, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="aspect-[490/735] w-full relative border-white/60 border-2">
                  <Image
                    src={item}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 15vw"
                    fill
                    className="object-cover"
                    alt={`product image ${i}`}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}

"use client";
import Image from "@/components/Image/image";
import Slider from "@/components/Slider";
import { SwiperSlide } from "swiper/react";
import { useState, useEffect, useRef } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";

export default function ProductMagnifier({ data, setIsOpen, isOpen, index }) {
  const [swiperInstance, setSwiperInstance] = useState(null); // Use state to store Swiper instance

  // Main slider settings
  const customSettings = {
    slidesPerView: 1,
    pagination: false,
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
    modules: [FreeMode, Navigation, Thumbs],
    onSwiper: (swiper) => {
      setSwiperInstance(swiper); // Store the Swiper instance when it is initialized
    },
  };

  // UseEffect to navigate to the specific index when the modal opens or when the index changes
  useEffect(() => {
    if (swiperInstance) {
      swiperInstance.slideTo(index); // Use the stored swiper instance to navigate
    }
  }, [index, isOpen, swiperInstance]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-[500px] rounded-none lg:rounded-none p-0">
        <button
          className="text-white font-medium text-sm z-10 p-3 absolute top-3 right-3"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>

        <Slider className={"w-full"} customSettings={customSettings}>
          {data?.large?.map((item, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="aspect-[490/735] w-full relative">
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

        <button className="swiper-button-prev absolute top-1/2 left-3 text-white z-20 drop-shadow text-2xl">
          <MdArrowBackIos />
        </button>
        <button className="swiper-button-next absolute top-1/2 right-3 text-white z-20 drop-shadow text-2xl">
          <MdArrowForwardIos />
        </button>
      </DialogContent>
    </Dialog>
  );
}

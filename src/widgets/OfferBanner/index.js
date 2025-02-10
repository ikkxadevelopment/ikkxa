"use client";
import Image from "@/components/Image/image";
import Slider from "@/components/Slider";
import { SwiperSlide } from "swiper/react";

export default function OfferBanner({}) {
  const customSettings = {
    slidesPerView: 3,
    pagination: false,
    spaceBetween: 15,
    breakpoints: {
      640: {
        spaceBetween: 20,
      },
      768: {
        spaceBetween: 20,
      },
      992: {
        spaceBetween: 30,
      },
    },
    // modules: [Navigation],
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  };
  return (
    <section className={`overflow-hidden bg-slate-50 py-6 lg:py-10`}>
      <div className="container">
        <div className="grid grid-cols-2 mb-4">
          <div>
            <h2 className="text-lg lg:text-xl   font-semibold">Value deals</h2>
          </div>
        </div>
        {data?.data?.slider ? (
          <Slider className={""} customSettings={customSettings}>
            {data?.data?.offers?.map((item, i) => {
              return (
                <SwiperSlide key={i}>
                  <div
                    className="w-full relative"
                    style={{ aspectRatio: `${data?.aspectRatio}` }}
                  >
                    <Image
                      src={"/images/Frame 626649.png"}
                      fill
                      className="object-cover"
                      alt="logo"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Slider>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {data?.data?.offers?.map((item, i) => {
              return (
                <div key={i}>
                  <div
                    className="w-full relative"
                    style={{ aspectRatio: `${data?.aspectRatio}` }}
                  >
                    <Image
                      src={"/images/Frame 626649.png"}
                      fill
                      className="object-cover"
                      alt="logo"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

const data = {
component_name:"",
data:{
  slider: false,
  itemsPerView: 3,
  aspectRatio: 395 / 200,
  offers: [
    {
      url: "/images/b1.png",
      link:"/"
    },
    {
      url: "/images/b1.png",
        link:"/"
    },
    {
      url: "/images/b1.png",
        link:"/"
    },
    {
      url: "/images/b1.png",
        link:"/"
    },
    
  ],
}
}

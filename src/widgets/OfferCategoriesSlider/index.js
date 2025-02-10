"use client";
import Image from "@/components/Image";
import Slider from "@/components/Slider";
import useGetInnerWidth from "@/hooks/useGetInnerWidth";
import Link from "next/link";
import { SwiperSlide } from "swiper/react";

export default function OfferCategoriesSlider({ data }) {
  const {width}= useGetInnerWidth()
  const customSettings = {
    spaceBetween: 10,
    slidesPerView: 5,
    pagination: false,
    // modules: [Navigation],
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  };

  return (
    <section className="py-[10px] md:hidden ">
      <div className="container">
        <Slider className={""} customSettings={customSettings}>
          {datas?.map((item, i)=>{
            return(
              <SwiperSlide key={i}>
              <Link className="block" href={`/en/categories`}>
                <div className="aspect-1/1 relative bg-slate-50 overflow-hidden rounded-full">
                  <Image
                    src={"/images/34.png"}
                    fill
                    className="object-cover"
                    alt={`offer category ${i}`}    
                  />
                </div>
                <div className="pt-1">
                  <p className="text-xs text-center line-clamp-1">
                  {item?.title}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
            )
          })}
         
     
        </Slider>
      </div>
    </section>
  );
}


const datas =[{},{},{},{},{},{}]
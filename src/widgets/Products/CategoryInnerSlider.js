"use client";
import Image from "@/components/Image";
import Slider from "@/components/Slider";
import useGetInnerWidth from "@/hooks/useGetInnerWidth";
import { Link } from "@/i18n/routing";
import { SwiperSlide } from "swiper/react";

export default function CategoryInnerSlider({ data, slug }) {
  const {width}= useGetInnerWidth()
  const customSettings = {
    spaceBetween: 10,
    slidesPerView: 4.5,
    pagination: false,
    breakpoints: {
      640: {
          spaceBetween: 2,
      },
      768: {
          slidesPerView: 7,
      },
      992: {
          slidesPerView: 9,
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
    <section className="py-[10px] w-full">
      <div className="lg:px-3">
    
        <Slider className={""} customSettings={customSettings}>
          {data?.child_category?.map((item, i)=>{
            return(
              <SwiperSlide key={i}>
              <Link className="block" 
              href={{
                pathname: `/categories/${item?.slug}`,
                // query: { sub_category: item?.id },
              }}>

                <div className="aspect-1/1 relative bg-slate-50 overflow-hidden rounded-full">
                  <Image
                    src={item?.image}
                    fill
                    className="object-cover"
                    alt={`${item?.title} image`}
                  />
                </div>
                <div className="pt-2 md:pt-2">
                  <p className="text-[10px] md:text-sm text-center leading-3 line-clamp-2">
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
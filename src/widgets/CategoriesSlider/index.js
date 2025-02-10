"use client";
import CategoryCard from "@/components/CategoryCard";
import Slider from "@/components/Slider";
import { SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation, Grid } from 'swiper/modules';
import "swiper/css/grid";


export default function CategoriesSlider({ data }) {
  // const categoryArray = data?.components["top_categories-7"];

  const customSettings = {
    spaceBetween: 10,
    slidesPerView: 4,
    modules: [Grid],
    grid: {
      rows: 2, 
      fill: 'row',
    },
    breakpoints: {
      640: {
          spaceBetween: 4,
          grid: {
            rows: 2, 
            fill: 'row',
          },
      },
      768: {
          slidesPerView: 6,
          grid: {
            rows: 1,
            fill: 'row',
          },
      },
      992: {
          slidesPerView: 8,
          spaceBetween: 30,
          grid: {
            rows: 1,
            fill: 'row',
          },
      },
  },
    pagination: false,
    // modules: [Navigation],
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  };

  return (
    <section className=" py-6 lg:py-10">
      <div className="container">
        {/* <h2 className="text-[18px] lg:text-xl font-semibold mb-4">All Categories</h2> */}
        <Slider className={""} customSettings={customSettings} >
          {data?.data?.length > 0 &&
            data?.data?.map((item, i) => {
              return (
                <SwiperSlide key={i} className=" max-w-[100px] me-[10px] lg:max-w-[144px] lg:me-[30px]"><CategoryCard data={item}  /></SwiperSlide>
               );
            })}
        </Slider>
      </div>
    </section>
  );
}

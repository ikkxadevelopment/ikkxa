"use client";
import CategoryCard from "@/components/CategoryCard";
import Slider from "@/components/Slider";
import { SwiperSlide } from "swiper/react";

export default function CategoriesSlider({ data }) {
  // const categoryArray = data?.components["top_categories-7"];

  const customSettings = {
    spaceBetween: 30,
    slidesPerView: 8,
    pagination: false,
    // modules: [Navigation],
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  };

  return (
    <section className="py-10">
      <div className="container">
        <h2 className="text-lg lg:text-xl   font-semibold mb-4">All Categories</h2>
        <Slider className={""} customSettings={customSettings}>
          {data?.categories?.length > 0 &&
            data?.categories?.map((item, i) => {
              return (
                <SwiperSlide key={i}><CategoryCard data={item}  /></SwiperSlide>
               );
            })}
        </Slider>
      </div>
    </section>
  );
}

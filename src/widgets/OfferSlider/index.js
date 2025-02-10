"use client";
import BudgetCard from "@/components/BudgetCard";
import Image from "@/components/Image";
import Slider from "@/components/Slider";
import { Link } from "@/i18n/routing";
import { SwiperSlide } from "swiper/react";

export default function OfferSlider({ data }) {
  const meta = data?.data?.meta;
  const customSettings = {
    spaceBetween: 15,
    slidesPerView: 1.3,
    pagination: false,
    // modules: [Navigation],
    breakpoints: {
      640: {
        spaceBetween: 2,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: meta?.items_per_view,
      },
      1400: {
        slidesPerView: meta?.items_per_view,
      },
    },
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  };
  return (
    <section className={`py-6 lg:py-10`}>
      <div className="container">
        <div className="grid grid-cols-2 mb-4">
          <div>
            <h2 className="text-lg lg:text-xl  font-semibold">{meta?.label}</h2>
          </div>
        </div>

        <Slider className={""} customSettings={customSettings}>
          {data?.data?.banner?.map((item, i) => {
            return (
              <SwiperSlide key={i}>
                <Link href={`${item?.url}`} className="relative block aspect aspect-[16/9]">
                  <Image src={`${item?.image}`} fill className="object-cover" />
                </Link>
              </SwiperSlide>
            );
          })}
        </Slider>
      </div>
    </section>
  );
}

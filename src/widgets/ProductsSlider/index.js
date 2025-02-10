"use client";
import ProductCard from "@/components/ProductCard";
import Slider from "@/components/Slider";
import { SwiperSlide } from "swiper/react";
import { IoMdArrowForward } from "react-icons/io";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ProductsSlider({ data }) {
  const t = useTranslations("Index");
  const customSettings = {
    spaceBetween: 15,
    slidesPerView: 1.7,
    pagination: false,
    // modules: [Navigation],
    breakpoints: {
      640: {
        spaceBetween: 2,
      },
      768: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 5,
      },
      1600: {
        slidesPerView: 6,
      },
    },
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  };
  return (
    <section className={`py-6 lg:py-10  `}>
      {/* ${flashSale && "bg-[#fbf4f4]"} */}
      <div className="container">
        <div className="grid grid-cols-2 mb-4">
          <div>
            <h2 className="text-lg lg:text-xl   font-semibold">
              {data?.title}
            </h2>
          </div>
          {data?.slug&&
          <div className="text-end">
            <Link
              href={`/categories/${data?.slug}`}
              className="text-black inline-flex text-base font-medium items-center"
            >
              {t("ViewAll")}
              <span className="ms-2">
                <IoMdArrowForward />
              </span>
            </Link>
          </div>}
        </div>

        <Slider className={""} customSettings={customSettings}>
          {Array.isArray(data?.data) ? (
            data?.data?.map((item, i) => {
              return (
                <SwiperSlide key={i} className="lg:max-w-[261.6px] lg:me-[15px]">
                  {" "}
                  <ProductCard data={item} />{" "}
                </SwiperSlide>
              );
            })
          ) : (
            <div>No items available</div>
          )}
        </Slider>
      </div>
    </section>
  );
}

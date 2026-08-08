"use client";
import Slider from "@/components/Slider";
import { SwiperSlide } from "swiper/react";
import ProductCard from "@/components/ProductCard";
import { useTranslations } from "next-intl";

// Below-the-fold related-products carousel. Split out of ProductDetail and
// lazy-mounted on scroll so its ProductCard subtree stays off the product
// page's initial bundle (DEV-13).
export default function RelatedProducts({ products }) {
  const t = useTranslations("Index");

  const customSettings = {
    spaceBetween: 15,
    slidesPerView: 1.7,
    pagination: false,
    breakpoints: {
      640: { spaceBetween: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 5 },
      1600: { slidesPerView: 6 },
    },
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  };

  return (
    <section className="py-6 lg:py-10">
      <div className="container">
        <div className="grid grid-cols-2 mb-4">
          <div>
            <h2 className="text-lg lg:text-xl font-semibold">
              {t("RelatedProducts")}
            </h2>
          </div>
        </div>

        <Slider className={""} customSettings={customSettings}>
          {Array.isArray(products) ? (
            products.map((item, i) => (
              <SwiperSlide key={i}>
                {" "}
                <ProductCard data={item} />{" "}
              </SwiperSlide>
            ))
          ) : (
            <div>{t("NoItemsAvailable")}</div>
          )}
        </Slider>
      </div>
    </section>
  );
}

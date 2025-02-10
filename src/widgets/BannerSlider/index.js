"use client";
import Image from "@/components/Image/image";
import Slider from "@/components/Slider";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import { Link } from "@/i18n/routing";
import { Autoplay } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

export default function BannerSlider({ data }) {
  const { width } = useGetDeviceType();
  const customSettings = {
    slidesPerView: 1,
    pagination: false,
    autoplay:true,
    loop: true,
    modules: [Autoplay],
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  };
  return (
    <section className={`overflow-hidden bg-slate-50`}>
      <Slider className={""} customSettings={customSettings}>
        {width >= 992 ? (
          <>
            {data?.data?.desktop?.map((item, i) => {
              return (
                <SwiperSlide key={i}>
                  <Link href={`${item?.link}`} className="aspect-[395/345] md:aspect-[1728/500] w-full block relative">
                    <Image
                      src={`${item?.slider_bg_image}`}
                      fill
                      className="object-cover"
                      alt={`${item?.title}`}
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
          </>
        ) : (
          <>
            {data?.data?.mobile?.map((item, i) => {
              return (
                <SwiperSlide key={i}>
                  <Link href={`${item?.link}`} className="aspect-[395/345] md:aspect-[1728/500] w-full block relative">
                    <Image
                      src={`${item?.slider_bg_image}`}
                      fill
                      className="object-cover"
                      alt={`${item?.title}`}
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
          </>
        )}
      </Slider>
    </section>
  );
}

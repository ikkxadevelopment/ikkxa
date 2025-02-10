"use client";
import React from "react";
import { Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useLocale } from "next-intl";



const Slider = ({ children, customSettings, className }) => {
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  return <Swiper {...customSettings} dir={locale==="ar"?"rtl":"ltr"} pagination={true} className={`${className}`}>{children}</Swiper>;
};

export default Slider;

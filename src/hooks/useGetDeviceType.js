"use client"
import useGetInnerWidth from "./useGetInnerWidth";

const useGetDeviceType = () => {
  const width = useGetInnerWidth();

  const isDesktop = width > 991 ;
  const isTablet = width <= 991 && width > 576;
  const isMobile = width <= 576;

  return {
    width,
    isDesktop,
    isTablet,
    isMobile,
  };

};

export default useGetDeviceType;
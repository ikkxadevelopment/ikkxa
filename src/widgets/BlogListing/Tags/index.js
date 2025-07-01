"use client"
import Slider from "@/components/Slider";
import { SwiperSlide } from "swiper/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Tags({ selectedTag, setSelectedTag, tags }) {
    
    const t = useTranslations('Index')
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const params = new URLSearchParams(searchParams);
    const handleTag = (selectedOption) => {
        if (selectedOption ===null) {
            params.delete("tags");
            params.delete("page");
            setSelectedTag(null)    
            router.push(`${pathname}?${params.toString()}`, {scroll: false});
          } else {
            params.set("tags", selectedOption);
            params.set("page", "1");
            window.history.pushState(null, '', `?${params.toString()}`)
            router.push(`${pathname}?${params.toString()}`, {scroll: false});
          }
        }

    const customSettings = {
        spaceBetween: 0,
        slidesPerView: "auto",
        watchSlidesProgress: true,
        a11y: false
        //    freemode: true,
        //    modules: [FreeMode],
    }

    return (
        <div>
            <Slider customSettings={customSettings} className={` w-100 h-100 `} >
                <SwiperSlide className={``} style={{ width: "fit-content" }}>
                    <div role="button" className={`px-5 py-[9px] border-b font-medium   ${selectedTag === null ? "border-[#fdba74] bg-white" : "border-[#D0D0D0]  bg-transparent"}`} onClick={() => {
                        handleTag(null)}}>{t('All')}</div>
                </SwiperSlide>
                {tags?.map((item, i) => {
                    return (
                        <SwiperSlide className={``} style={{ width: "fit-content" }} key={i}>
                            <div role="button" className={`px-5 py-[9px] border-b font-medium    ${selectedTag === item?.slug ? "border-[#fdba74] bg-white" : "border-[#D0D0D0]  bg-transparent"}`} id={item?.slug} onClick={() =>  handleTag(item?.slug)}>{item?.title}</div>
                        </SwiperSlide>
                    )
                })}
            </Slider>
        </div>
    );
}


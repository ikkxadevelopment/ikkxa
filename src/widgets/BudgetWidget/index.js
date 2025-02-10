"use client"
import BudgetCard from "@/components/BudgetCard";
import Slider from "@/components/Slider";
import { SwiperSlide } from "swiper/react";

export default function BudgetWidget({ data }) {
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
                slidesPerView: 4,
            },
            1400:{
                slidesPerView: 5,
            }
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
                        <h2 className="text-lg lg:text-xl  font-semibold">{data?.title}</h2>
                    </div>
                </div>

                <Slider className={""} customSettings={customSettings}>
                    {data?.data?.map((item ,i)=>{
                        return(
                            <SwiperSlide key={i}> <BudgetCard data={item} /> </SwiperSlide>
                        )
                    })}
                </Slider>
            </div>
        </section>
    );
}

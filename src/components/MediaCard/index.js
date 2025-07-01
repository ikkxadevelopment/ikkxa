"use client";
// import Link from "next/link";
import { Link } from "@/i18n/routing";
import Image from "../Image/image";
import { useTranslations } from "next-intl";
import useFormatDate from "@/hooks/useFormatDate";

export default function MediaCard({ data, isSm = false, isLg = false, isPopular = false }) {  
  const t = useTranslations('Index')
  
  return (
    <Link href={`/blogs/${data?.slug}`} className="group h-full flex flex-col w-full relative  ">
      {isLg || isSm ? "" : <>
        <span className="absolute bottom-0 left-0 w-full  bg-[#dbdbdb] h-[2px] z-10 " />
        <span className="absolute bottom-0 left-0 w-full  bg-[#fdba74] h-[2px] z-20 scale-x-0 transform transition-transform origin-left duration-700 ease-in-out group-hover:scale-x-100" />
      </>}
      
        <div className="aspect-[470/263] relative bg-white w-full">
          {data?.thumbnail && <Image src={data?.thumbnail} fill className="object-cover" alt={data?.title} />}
        </div>
      <div className={`flex flex-col justify-between relative z-20 h-full  ${isSm ? "pt-3 pb-4" : isPopular ? "pt-6 pb-4" : "pt-4 pb-8"}`}>
        <div>
          <h4 className={` text-black font-semibold  leading-normal  line-clamp-2 ${isSm ? "text-lg" : isLg ? "text-3xl" : "text-xl mb-3"}`}>{data?.title}</h4>
          <p className=" text-[#828282] text-base  leading-snug mb-3 line-clamp-2">{data?.short_description}</p>
        </div>
          {isLg || isSm || isPopular ? "" : <p className="text-black text-sm lg:text-base font-semibold text-primary">{t('ReadMore')}</p>}
      </div>
    </Link>
  );
}

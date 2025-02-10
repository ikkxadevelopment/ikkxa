"use client";
import Image from "@/components/Image/image";
import { useTranslations } from "next-intl";

export default function ContactAddress({data}) {
  const t = useTranslations("Index");
  return (
    <section className={`overflow-hidden bg-[#151515] py-10 lg:py-[100px]`} id="contactSec">
      <div className="container">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <h2 className="text-sm font-semibold text-white/70 mb-1">
              {t('OurLocations')}
            </h2>
            <h3 className="text-4xl font-semibold text-white  mb-3">
              {t('VisitOurStores')}
            </h3>
            <p className="text-sm mb-8 text-white/70">
              {t('WeHaveStoresAroundTheWorld')}
            </p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-10">
              {data?.data?.stores?.map((item, i)=>{
                return(
                  <div className="" key={i}>
                <h4 className="text-lg font-semibold mb-1 text-white">
                {item?.name}
                </h4>
                <p className="mb-2 text-sm text-white/50 max-w-[250px] leading-normal">
                  {item?.address}
                </p>
                <a href={`${item?.google_map_link}`} target="_blank" className="underline text-[#d29e82] text-sm font-medium">
                  {t('GetDirection')}
                </a>
              </div>
                )
              })}
              {/* <div className="">
                <h4 className="text-lg font-semibold mb-1 text-white">
                 Wholesale Shop
                </h4>
                <p className="mb-2 text-sm text-white/50 max-w-[250px] leading-normal">
                  {t('CompanyAddress')}
                </p>
                <a className="underline text-[#d29e82] text-sm font-medium">
                  {t('GetDirection')}
                </a>
              </div>

              <div className="">
                <h4 className="text-lg font-semibold mb-1 text-white">
               Naseem Shop
                </h4>
                <p className="mb-2 text-sm text-white/50 max-w-[250px] leading-normal">
                {t('CompanyAddress1')}
                </p>
                <a className="underline text-[#d29e82] text-sm font-medium">
                {t('GetDirection')}
                </a>
              </div>


              <div className="">
                <h4 className="text-lg font-semibold mb-1 text-white">
                 Taiba Shop
                </h4>
                <p className="mb-2 text-sm text-white/50 max-w-[250px] leading-normal">
                  {t('CompanyAddress2')}
                </p>
                <a className="underline text-[#d29e82] text-sm font-medium">
                  {t('GetDirection')}
                </a>
              </div>
              <div className="">
                <h4 className="text-lg font-semibold mb-1 text-white">
                 Online Shop
                </h4>
                <p className="mb-2 text-sm text-white/50 max-w-[250px] leading-normal">
                  {t('CompanyAddress3')}
                </p>
                <a className="underline text-[#d29e82] text-sm font-medium">
                  {t('GetDirection')}
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

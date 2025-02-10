"use client";
import EnquireForm from "@/components/EnquireForm";
import Image from "@/components/Image/image";
import { useTranslations } from "next-intl";

export default function ContactBanner({data}) {
  const t = useTranslations("Index");
  return (
    <section className={`overflow-hidden bg-slate-50 py-10 lg:py-10`}>
      <div className="container">
        <div className="grid lg:grid-cols-2">

        <div className="max-w-[870px] ">
          {/* <h2 className="text-sm font-semibold text-[#d29e82] mb-1">{t('ContactUs')}</h2>
          <h3 className="text-2xl lg:text-4xl font-semibold  mb-3">
            We&apos;d love to hear from you
          </h3>
          <p className="text-sm mb-8 text-black/70">
            {t('WeHaveStoresAroundTheWorld')}
          </p> */}
          <div className="aspect aspect-[2000/1143] relative">
            <Image
              src={"/images/dotted-map.avif"}
              fill
              className="object-cover mix-blend-multiply opacity-20"
              alt=""
            />

            <span className="block bg-[#d29e82] w-1 h-1 md:w-2 md:h-2 rounded-full absolute top-[50%] left-[61%] z-20"></span>
            <span className="block bg-[#d29e82] w-1 h-1 md:w-2 md:h-2 rounded-full absolute top-[52%] left-[59%] z-20"></span>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <div className="">
            <h4 className="text-lg font-semibold mb-1">{t('TalkToUs')}</h4>
            <p className="mb-2 text-sm text-black/50">{t('OurTeamIsHereToHelp')}</p>
            <a className="underline text-[#d29e82] text-sm font-medium">  {data?.message?.footer_data?.footer_contact_phone}</a>
          </div>
          <div className="">
            <h4 className="text-lg font-semibold mb-1">{t("B2BHelpcenter")}</h4>
            <p className="mb-2 text-sm text-black/50">{t('OurTeamIsHereToHelp')}</p>
            <a className="underline text-[#d29e82] text-sm font-medium">  {data?.message?.footer_data?.footer_contact_phone}</a>
          </div>
          <div className="">
            <h4 className="text-lg font-semibold mb-1">{t('Support')}</h4>
            <p className="mb-2 text-sm text-black/50">{t('OurTeamIsHereToHelp')}</p>
            <a className="underline text-[#d29e82] text-sm font-medium">support@ikkxa.com</a>
          </div>
        </div>


        </div>


<div>
  
        <div className="max-w-[500px]  mx-auto">
          <h2 className="text-sm font-semibold text-[#d29e82] mb-1">
            {t('ContactUs')}
          </h2>
          <h3 className="text-2xl lg:text-4xl font-semibold  mb-3">
          {t('LovetoHere')}
          </h3>
          <p className="text-sm mb-8 text-black/70">
            {t('WeHaveStoresAroundTheWorld')}
          </p>
          <div className="">
            <EnquireForm />
          </div>
        </div>
        </div>
      
</div>

  
      </div>
    </section>
  );
}

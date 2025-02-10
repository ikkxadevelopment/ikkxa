"use client";
import EnquireForm from "@/components/EnquireForm";
import Image from "@/components/Image/image";
import { useTranslations } from "next-intl";

export default function ContactForm({}) {
  const t = useTranslations("Index");
  return (
    <section className={`overflow-hidden bg-slate-50 py-10 lg:py-10`}>
      <div className="container">
        <div className="max-w-[870px] mx-auto text-center">
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
    </section>
  );
}

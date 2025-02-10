
"use client";
import Image from "@/components/Image/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ContentPage({data}) {
  const t = useTranslations("Index");
  return (
    <section className={`overflow-hidden bg-slate-50 py-10 lg:py-28`}>
      <div className="container">
        <div className="max-w-[870px] mx-auto ">
          <h2 className="text-sm   mb-2">
            <Link href="/" className="text-[#d29e82]">{t("Home")}</Link> / <span >{data?.title}</span></h2>
          <h3 className="text-2xl lg:text-4xl font-semibold  mb-9">
            {data?.title}
          </h3>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data?.content }}></div>
        </div>
       
      </div>
    </section>
  );
}

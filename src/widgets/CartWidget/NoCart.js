"use client";
import Image from "@/components/Image/image";
import { useTranslations } from "next-intl";

const NoCart = () => {
  const t = useTranslations("Index");
  return (
    <section className="">
      <div className="container">
        <div className="aspect-[85/94] relative max-w-40 lg:max-w-56 mx-auto mb-6">
          <Image
            src={"/images/nocart.svg"}
            sizes="50vw"
            fill
            className="object-contain"
            alt={"no items in cart"}
          />
        </div>
        <div className="">
          <h3 className="text-center text-black text-xl lg:text-3xl font-semibold   mb-3 ">
            {t('YourCartIsEmpty')}
          </h3>
          <p className="text-center text-zinc-500 text-sm  lg:text-lg leading-tight">
            {t('noCartTitle')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default NoCart;

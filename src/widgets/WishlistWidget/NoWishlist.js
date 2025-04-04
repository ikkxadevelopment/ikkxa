"use client";
import Image from "@/components/Image/image";
import useHeaderSecond from "@/hooks/useHeaderSecond";
import { useTranslations } from "next-intl";

const NoWishlist = () => {
  const t = useTranslations("Index");
  useHeaderSecond()
  return (
    <section className="py-10 min-h-screen flex items-center">
      <div className="container">
        <div className="aspect-[85/94] relative max-w-24 mx-auto mb-6">
          <Image
            src={"/images/nowishlist.svg"}
            sizes="50vw"
            fill
            className="object-contain"
            alt={"no items in wishlist"}
          />
        </div>
        <div className="">
          <h3 className="text-center text-black text-xl lg:text-3xl font-semibold   mb-3 ">
          {t("YourWishlistEmpty")}
          </h3>
          <p className="text-center text-zinc-500 text-sm  lg:text-lg leading-tight">
          {t("StartAddingItems")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default NoWishlist;

  "use client";
  import Image from "@/components/Image/image";
import Link from "@/components/Link";
  import { useTranslations } from "next-intl";
import { IoMdArrowForward } from "react-icons/io";

  const NoData = () => {
    const t = useTranslations("Index");
    return (
      <section className="py-10">
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
            {t("NoPage")}

              {/* Oops! We couldn&apos;t find what you were looking for! */}
            </h3>
            <p className="text-center text-zinc-500 text-sm  lg:text-lg leading-tight">
            {/* Don&apos;t give up, try and modify your search! */}
            {t('NoDataP')}
            </p>

        


          </div>
        </div>
      </section>
    );
  };

  export default NoData;

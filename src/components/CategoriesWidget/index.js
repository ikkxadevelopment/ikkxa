"use client";

import { Link } from "@/i18n/routing";
import CategoryBlock from "../CategoryBlock";
import Image from "../Image/image";
import { MdArrowOutward } from "react-icons/md";
import { useTranslations } from "next-intl";

export default function CategoriesWidget({ data }) {
  const t = useTranslations("Index");
  return (
    <section className="py-6 lg:py-12 bg-[#F8F8F8]">
      <div className="container">
        <h3 className=" text-black text-base lg:text-2xl font-semibold leading-normal mb-6">
          {t('AllCategories')}
        </h3>

        <div className="lg:grid lg:grid-cols-2 2xl:grid-cols-2 gap-5 hidden">
          {data?.results?.categories?.map((item, i) => {
            return (
              <div key={i}>
                <div className="w-full overflow-hidden h-full min-h-[432px] bg-gray-200 p-8 relative rounded-md flex-col justify-between items-start gap-24 inline-flex">
                {/* bg-gradient-to-b  from-gray-200 to-orange-400  */}
                  <div className=" w-[100%] h-full absolute bottom-0 right-0 pointer-events-none">
                  {/* aspect-[240/355] aspect  */}
                    <Image
                      src={item?.banner_image}
                      fill
                      className="object-cover object-right-top"
                      alt={`${item?.title}`}
                    />
                  </div>
                  <Link
                    href={`/categories/${item?.slug}`}
                    className="self-stretch z-10 text-white text-6xl 2xl:text-8xl font-black  capitalize flex items-center"
                  >
                    {item?.title}
                    <span className="ml-2">
                      <MdArrowOutward />
                    </span>
                  </Link>
                  <div className=" justify-start items-start gap-2 flex flex-wrap max-w-[74%] z-10">
                    {item?.child_categories?.map((cate, index) => {
                      return (
                        <Link
                          href={`/categories/${cate?.slug}`}
                          key={index}
                          className="px-3 py-2 bg-white/70 rounded-3xl   text-stone-950 text-sm"
                        >
                          {cate?.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-5 lg:hidden">
          {data?.results?.categories?.map((item, i) => {
            return (
              <div key={i}>
                <CategoryBlock data={item} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

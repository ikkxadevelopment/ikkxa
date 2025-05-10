import Link from "next/link";

// export default function NotFound() {
//   return (
//     <div>
//       <h2>Not Found</h2>
//       <p>Could not find requested resource</p>
//       <Link href="/">Return Home</Link>
//     </div>
//   );
// }


// "use client";
import Image from "@/components/Image/image";
import { useTranslations } from "next-intl";
import { IoMdArrowForward } from "react-icons/io";

const NotFound = () => {
  const t = useTranslations("Index");
  return (
    <section className="py-10 min-h-screen flex items-center ">
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
          <p className="text-center text-zinc-500 text-sm  lg:text-lg leading-tight max-w-[800px] mb-5 mx-auto">
          {/* Don&apos;t give up, try and modify your search! */}
         
          {t('Nopagep')}
          </p>
          <div className="text-center">
          <Link
              href={`/`}
              className="text-black inline-flex text-base font-medium items-center"
            >
              {t("BackToHome")}
              <span className="ms-2">
                <IoMdArrowForward />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;

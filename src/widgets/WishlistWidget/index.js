"use client";
import ProductCard from "@/components/ProductCard";
import { GET_CART, WISHLIST } from "@/constants/apiRoutes";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useSWR, { useSWRConfig } from "swr";
import { useLocale, useTranslations } from "next-intl";
import { Suspense } from "react";
import { WishlistSkeleton } from "./WishlistSkeleton";
import NoWishlist from "./NoWishlist";
export default function WishlistWidget({}) {
  const { width } = useGetDeviceType();
  const t = useTranslations('Index')
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  
  const { data, error } = useSWR(`${WISHLIST}lang=${locale}`);
  // if (error) return <div>Error: {error.message}</div>;
  if (!data&& !error){
    return (
      <div>
        <WishlistSkeleton />
      </div>
    );
  }
  return (
    <section className="pt-2 pb-10">
      <div className="container">
        {width >= 992 && (
          <Breadcrumb className="mb-7">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('Wishlist')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        {data?.data?.favourite_products?.length > 0 ? (
          <div>
            <h2 className="text-stone-950 text-2xl font-medium mb-4">
              {t('MyWishlist')}{" "}
              <span className="text-neutral-400 text-sm font-medium">
                {data?.data?.favourite_products?.length} {t('items')}
              </span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-4">
              {data?.data?.favourite_products?.map((item, i) => {
                return (
                  <div key={i}>
                    <ProductCard data={item} isWishlist={true} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <NoWishlist />
        )}
      </div>
    </section>
  );
}

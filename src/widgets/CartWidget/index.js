"use client";
import CartItem from "@/components/CartItem";
import { useCartWidget } from "./useCartWidget";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PaymetnIcons from "@/components/PaymentIcons";
import OrderSummary from "@/components/OrderSummary";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import { useCartFetcher } from "@/components/Header/useCartFetcher";
import NoCart from "./NoCart";
import { CartSkeleton } from "./CartSkeleton";
import { useLocale, useTranslations } from "next-intl";
import { useRecoilState } from "recoil";
import { isComponentPresentState } from "@/recoil/atoms";
import { useEffect } from "react";
import useHeaderSecond from "@/hooks/useHeaderSecond";
import TabbyPromoWithButton from "@/components/TabbyPromoWithButton/TabbyPromoWithButton";
import getCurrency from "@/hooks/getCurrency";

const CartWidget = () => {
  const t = useTranslations("Index");
  useHeaderSecond()
  // const { cart, isLoading, isError, addItem, removeItem } = useCartWidget();
  const { width } = useGetDeviceType();
  const { cart, calculations, isLoading, isError } = useCartFetcher();
  // if (isLoading) return <CartSkeleton/>;
  const currency = getCurrency();
  const lang = useLocale();
  return (
    <section className="">
      {(!isLoading && cart?.length > 0) ?
        <>
          <div className="container">
            {width >= 992 && (
              <>
                <Breadcrumb className="mb-2">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{t('MyCart')}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <div className=" justify-center items-center gap-1.5 flex mb-5">
                  <div className="p-2 justify-center items-center gap-2 flex">
                    <div className="text-center text-black text-sm font-medium ">
                      {t('Cart')}
                    </div>
                  </div>
                  <div className="w-20 h-px border border-stone-300"></div>
                  <div className="p-2 opacity-50 justify-center items-center gap-2 flex">
                    <div className="text-center text-black text-sm font-medium ">
                      {t('Checkout')}
                    </div>
                  </div>
                </div>
              </>
            )}

            <h2 className="text-black text-xl font-semibold mb-4">
              {t('YourCart')}{" "}
              <span className="text-neutral-500 text-base font-medium ">
                ( {cart?.length} {t('item')} )
              </span>
            </h2>
          </div>
          <div className="container px-0 lg:px-3">
            <div className="flex flex-wrap lg:-mx-4">
              <div className="flex-col-auto w-full lg:w-[72%] lg:px-4">
                {cart?.map((item, i) => {
                  return <CartItem data={item} key={i} />;
                })}
              </div>
              <div className="flex-col-auto w-full lg:w-[28%] lg:px-4">
                <OrderSummary data={calculations} />
                {/* <p>Total: ${cart.total}</p>
            <button onClick={() => addItem({ id: 'new-item', name: 'New Item', price: 10 })}>
              Add Item
            </button> */}
                <div className="mt-2">
                  <TabbyPromoWithButton
                    price={calculations?.total}
                    publicKey="pk_xyz"
                    merchantCode={lang}
                    currency={currency}
                  />
                  <PaymetnIcons />
                </div>
              </div>
            </div>
          </div>
        </> : <NoCart />}

    </section>
  );
};

export default CartWidget;

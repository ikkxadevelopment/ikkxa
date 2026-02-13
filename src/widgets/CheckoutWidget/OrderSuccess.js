"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "@/components/Image/image";
import { GET_CART, MOYASAR_REDIRECT, ORDER_CHECKOUT } from "@/constants/apiRoutes";
import { Link } from "@/i18n/routing";
import { CiLocationOn } from "react-icons/ci";
import { fetcherWithToken } from "@/utils/fetcher";
import { CiCreditCard1 } from "react-icons/ci";
import { axiosPostWithToken } from "@/lib/getHome";
import Loader from "../Loader";
import { useLocale, useTranslations } from "next-intl";
import getCurrency from "@/hooks/getCurrency";
import { useSWRConfig } from "swr";
import PurchaseTracker from "@/components/pixel/PurchaseTracker";

const OrderSuccess = ({ }) => {
  const t = useTranslations("Index");
  const currency = getCurrency();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const order_id = searchParams.get("id");
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const message = searchParams.get("message");
  const status = searchParams.get("status");
  const lang = useLocale();
  const [locale, country] = lang.split("-");
  const { mutate } = useSWRConfig();
  //   APPROVED
  const address = orderDetails?.shipping_address;

  const handleComplete = async () => {
    const formData = new FormData();
    formData.append("status", status);
    formData.append("order_id", order_id);
    formData.append("paymentID", id);
    formData.append("lang", "en");

    try {
      const result = await axiosPostWithToken(
        `${MOYASAR_REDIRECT}`,
        formData,
        lang
      );
      if (result.success) {
      }
    } catch (error) {
      // setError(error);
      console.error("Checkout error:", error);
    } finally {
      // setLoading(false);
    }
  };
  const handleGetDetail = async (order_id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherWithToken(
        `${ORDER_CHECKOUT}/${order_id}`,
        null,
        country
      );
      if (result.success) {
        mutate(`${GET_CART}lang=${locale}&trx_id=null`)
        setOrderDetails(result.data);
      } else {
        setError("Failed to fetch order details.");
      }
    } catch (error) {
      setError("An error occurred while fetching order details.");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (order_id) {
      handleGetDetail(order_id);

      //   handleComplete()
    }
  }, [order_id]);
  //   if(loading||address)return <div><Loader/></div>

  if (error) {
    return (
      <>

        <section className="min-h-screen lg:min-h-[500px] py-12 flex items-center">
          <div className="container">
            <div className="aspect-[200/157] relative max-w-56 lg:max-w-64 mx-auto mb-6">
              <Image
                src={"/images/nowishlist.svg"}
                sizes="50vw"
                fill
                className="object-contain"
                alt={"no order found"}
              />
            </div>
            <div>
              <h3 className="text-center text-black text-xl lg:text-3xl font-semibold mb-3">
                {t('NoDataFound')}
              </h3>

              <p className="text-center mb-7">
                <Link
                  href="/"
                  className="text-stone-900 text-sm underline leading-tight"
                >
                  {t('BackToHome')}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </>

    );
  }



  return (
    <>

      <Suspense fallback={null}>
        <PurchaseTracker order={orderDetails} />
      </Suspense>
      <section className="min-h-screen lg:min-h-[500px] py-12 flex items-center">
        <div className="container">
          <div className="aspect-[200/157] relative max-w-56 lg:max-w-64 mx-auto mb-6">
            <Image
              src={"/images/oc_img.svg"}
              sizes="50vw"
              fill
              className="object-contain"
              alt={"no items in cart"}
            />
          </div>
          <div>
            <h3 className="text-center text-black text-xl lg:text-3xl font-semibold mb-3">
              {t('OrderPlaced')}
            </h3>
            <p className="text-center text-zinc-500 text-sm lg:text-lg leading-tight mb-7">
              {t("EmailConfirm")} {address?.email}
            </p>
            <p className="text-center mb-7">
              <Link
                href="/"
                className="text-stone-900 text-sm underline leading-tight"
              >
                {t('BackToHome')}
              </Link>
            </p>
            <div className="grid gap-10 md:grid-cols-2 p-4 md:p-6 rounded border border-gray-200 bg-white   mt-4 mx-auto max-w-[800px]">
              <div className=" flex space-x-2 md:space-x-3  ">
                <div className="flex-col-auto w-auto">
                  <span className="text-2xl">
                    <CiLocationOn />
                  </span>
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-black text-base font-semibold mb-3">
                    {address?.name}
                    <span className="ms-2 px-1 py-0.5 bg-neutral-200 rounded inline-block text-stone-500 text-xs font-medium">
                      {address?.type}
                    </span>
                  </h3>
                  <p className="text-neutral-500 text-sm font-normal leading-tight mb-4">
                    {address?.building}, {address?.area}, {address?.city},{" "}
                    {address?.country}
                  </p>
                  <p className="text-neutral-500 text-sm font-normal leading-tight mb-2">
                    {t('Mobile')} :
                    <span className="text-black text-sm font-medium leading-tight">
                      &nbsp;{address?.phone_no}
                    </span>
                  </p>
                  <p className="text-neutral-500 text-sm font-normal leading-tight">
                    {t('Email')} :
                    <span className="text-black text-sm font-medium leading-tight">
                      &nbsp;{address?.email}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 md:space-x-3 ">
                <div className="flex-col-auto w-auto">
                  <span className="text-2xl">
                    <CiCreditCard1 />
                  </span>
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-black text-base font-semibold mb-3">
                    {t('OrderSummary')}
                  </h3>
                  <div className="grid grid-cols-2 mb-2">
                    <div className="text-neutral-500 text-sm font-normal">
                      {t('Subtotal')}
                    </div>
                    <div className="text-right text-sm">
                      {orderDetails?.sub_total} {currency}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 mb-2">
                    <div className="text-neutral-500 text-sm font-normal">
                      {t('Discount')}
                    </div>
                    <div className="text-right text-sm">
                      {orderDetails?.discount} {currency}
                    </div>
                  </div>
                  {orderDetails?.payment_type === "pay_later" && (
                    <div className="grid grid-cols-2 mb-2">
                      <div className="text-neutral-500 text-sm font-normal">
                        {t('Charge')}{" "}
                      </div>
                      <div className="text-right text-sm">
                        {orderDetails?.cod_charge} {currency}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 mb-2">
                    <div className="text-neutral-500 text-sm font-normal">
                      {t('ShippingCose')}
                    </div>
                    <div className="text-right text-sm">
                      {orderDetails?.shipping_cost} {currency}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 mb-2">
                    <div className="text-neutral-500 text-sm font-normal">
                      {t('VAT')}
                    </div>
                    <div className="text-right text-sm">
                      {orderDetails?.total_tax} {currency}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 mb-2">
                    <div className="text-neutral-500 text-sm font-normal">
                      {t('Total')}
                    </div>
                    <div className="text-right text-sm">
                      {orderDetails?.total_payable} {currency}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSuccess;
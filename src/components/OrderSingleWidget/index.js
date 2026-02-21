"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "../Image/image";
import useSWR from "swr";
import { TRACK_ORDER, TRACK_STATUS } from "@/constants/apiRoutes";
import axios from "axios";
import AppBack from "../AppBack";
import DownloadInvoice from "../DownloadInvoice";
import { MdArrowBack } from "react-icons/md";
import { OrderItemCancelModal } from "./OrderItemCancelModal";
import { fetcherWithToken } from "@/utils/fetcher";
import { OrderItemReturnModal } from "./OrderItemReturnModal";
import { useLocale, useTranslations } from "next-intl";
import getCurrency from "@/hooks/getCurrency";

export default function OrderSingleWidget({ slug }) {
  const lang = useLocale();
  const t = useTranslations("Index");
  const currency = getCurrency();
  const [locale, country] = lang.split("-");
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data, error } = useSWR(
    `${TRACK_ORDER}?invoice_no=${slug}&lang=${locale}`
  );
  const resData = data?.data?.order || {};

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      // setError(null);
      try {
        const result = await fetcherWithToken(
          `${TRACK_STATUS}/${resData?.order_tracking_number}?lang=${locale}`,
          null,
          country
        );

        if (result.success) {
          setTrackData(result.data);
        } else {
          // setError("Failed to fetch order details.");
        }
      } catch (error) {
        // setError("An error occurred while fetching order details.");
        console.error("Checkout error:", error);
      } finally {
        // setLoading(false);
      }
    };
    if (resData?.order_tracking_number !== null) {
      fetchData();
    }
  }, [resData]);

  const paymentType = (status) => {
    switch (status) {
      case "unpaid":
        return <span className="status pending text-[#f3ac30]">{t('Unpaid')}</span>;
      case "paid":
        return (
          <span className="status delivered text-[#38ae04] text-sm font-semibold">
            {t('Paid')}
          </span>
        );
    }
  };
  const orderStatus = (status) => {
    switch (status) {
      case "canceled":
        return <span className="status pending text-[#ce2f2f]">{t('Cancelled')}</span>;
      case "pending":
        return <span className="status pending text-[#ce712f]">{t('Pending')}</span>;
      case "delivered":
        return (
          <span className="status delivered text-[#38ae04] font-semibold">
            {t('Delivered')}
          </span>
        );
      case "confirm":
        return (
          <span className="status delivered text-[#38ae04] font-semibold">
            {t('Confirmed')}
          </span>
        );
      case "return_requested":
        return (
          <span className="status cancelled font-semibold">
            {t('ReturnRequested')}
          </span>
        );
      case "picked_up":
        return (
          <span className="status delivered text-[#044bae] font-semibold">
            {t('PickedUp')}
          </span>
        );
    }
  };

  const paymentMethod = (status) => {
    switch (status) {
      case "tabby":
        return (
          <span className="status pending inline-flex items-center  ">
            Tabby
            <div className=" ml-2 aspect-[46/17] w-11 relative">
              <Image
                src={"/images/tabby_logo.png"}
                fill
                className="object-contain"
                alt="tabby logo"
              />
            </div>
          </span>
        );
      case "tamara":
        return (
          <span className="status delivered text-[#38ae04] font-semibold">
            {t('Paid')}
          </span>
        );
      case "pay_later":
        return (
          <span className="status delivered text-[#38ae04] font-semibold">
            {t('CashOnDelivery')}
          </span>
        );
      case "moyasar":
        return (
          <span className="status pending inline-flex items-center  ">
            {t('Card')}
            <div className="  aspect-[46/17] w-14 relative">
              <Image
                src={"/images/icon-visa.png"}
                fill
                className="object-contain"
                alt="visa icon"
              />
            </div>
          </span>
        );
    }
  };

  // payment_status
  // if (loading) return <p>Loading...</p>;
  return (
    <div className="lg:p-6 bg-white rounded lg:border border-stone-200">
      <AppBack route={"/orders"} title={`#${slug}`} />
      <div className="justify-between items-center flex mb-6">
        <Link
          href={"/orders"}
          className="text-black text-base font-medium flex items-center"
        >
          <span className="me-2 inline-block">
            <MdArrowBack />
          </span>
          {t('BackToOrders')}
        </Link>
        <DownloadInvoice id={resData?.id} />
      </div>
      <div className="justify-start items-center gap-3.5 flex mb-6">
        <div className="text-black text-lg font-semibold capitalize leading-relaxed">
          {t('OrdersDetails')}:
          <span className="ms-3 px-2 py-1 inline-block text-black text-xs font-medium bg-zinc-100 rounded-sm">
            {t('ORDERID')}: #{slug}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-y-3 md:gap-y-5 mb-12">
        {/* <div>
          <p className="text-black text-sm font-semibold">
            Estimated delivery:{" "}
            {console.log(resData,"resDataresDataresData")}
            <span className="text-black text-sm font-normal">2-7 days</span>{" "}
          </p>
        </div> */}
        <div className="">
          <p className="text-black text-sm font-semibold">
            {t('OrderDate')}:&nbsp;
            <span className="text-black text-sm font-normal">
              {formattedDate(resData?.date)}
            </span>{" "}
          </p>
        </div>
        <div className="lg:text-end">
          <p className="text-black text-sm font-semibold">
            {t('PaymentStatus')}:&nbsp;
            <span className="text-black text-sm font-normal">
              {paymentType(resData?.payment_status)}
            </span>{" "}
          </p>
        </div>
        {resData?.payment_type && (
          <div>
            <p className="text-black text-sm font-semibold">
              {t('PaymentMethod')}:&nbsp;
              <span className="text-black text-sm font-normal">
                {paymentMethod(resData?.payment_type)}
              </span>{" "}
            </p>
          </div>
        )}
        {resData?.order_status && (
          <div className="lg:text-end">
            <p className="text-black text-sm font-semibold ">
              {t('OrderStatus')}:&nbsp;
              <span className="text-black text-sm font-normal">
                {orderStatus(resData?.order_status)}
              </span>{" "}
            </p>
          </div>
        )}
      </div>

      <ul>
        {trackData?.scans
          ?.slice()
          .reverse()
          .map((item, i) => {
            return (
              <li
                key={i}
                className="min-h-[70px] ps-[30px] relative last-of-type:"
              >
                <div className="w-2.5 h-2.5 bg-orange-400 rounded-full absolute left-0 top-[6px]" />
                <div className="w-[2px] h-full origin-top-left  bg-orange-400 absolute left-1 top-[6px]"></div>

                <div className="justify-between flex items-center  ">
                  <p className="text-black text-base font-medium mb-3">
                    {item?.description}
                    <br />

                    <span className="opacity-50">{item?.city}</span>
                  </p>
                  <p className="text-black text-xs font-medium">
                    {formattedDate(item?.datetime)}
                  </p>
                </div>
              </li>
            );
          })}
      </ul>

      <div className="w-full h-px bg-neutral-200 my-8"></div>

      {resData?.order_details?.map((item, i) => {
        return (
          <div key={i} className="grid grid-cols-12 mb-4 gap-y-3">
            <div className="col-span-12 lg:col-span-10">
              <Link
                href={`/products/${item?.product_slug}`}
                className="block w-full "
              >
                <div className="flex  space-x-3 ">
                  <div className="flex-col-auto w-auto">
                    <div className="aspect-[490/625] w-[75px]  relative">
                      {item?.product_image && (
                        <Image
                          src={item?.product_image}
                          fill
                          className="object-cover"
                          alt={`${item?.product_name} image`}
                        />
                      )}
                    </div>
                  </div>
                  <div className=" flex-1 w-full h-full">
                    <div className="flex space-x-3">
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className=" text-stone-950 mb-2 text-sm font-normal  leading-tight">
                            {item?.product_name}
                          </h3>
                          <p className=" mb-2 text-stone-950 text-sm">
                            {" "}
                            {t('Size')}:{" "}
                            <span className="font-semibold">
                              {" "}
                              {item?.size}{" "}
                            </span>{" "}
                          </p>
                          <p className=" mb-2 text-stone-950 text-sm">
                            {" "}
                            {t('Qty')} :{" "}
                            <span className="font-semibold">
                              {" "}
                              {item?.quantity}
                            </span>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-span-12 lg:col-span-2 lg:text-end">
              {/* "order_return_status": "CANCELLED" */}

              {item?.order_return_status === null ? (
                <>
                  {resData?.order_status === "delivered" &&
                    resData?.is_return_eligible === true ? (
                    <OrderItemReturnModal
                      data={item}
                      orderId={resData?.id}
                      invNo={slug}
                    />
                  ) : resData?.order_status !== "canceled" ? (
                    <OrderItemCancelModal
                      data={item}
                      orderId={resData?.id}
                      invNo={slug}
                    />
                  ) : null}
                </>
              ) : <p>{item?.order_return_status}</p>}

              {/* {console.log(resData,"itememem")} */}
            </div>
          </div>
        );
      })}

      <div className="">
        <div className=" text-black text-base font-semibold capitalize leading-relaxed mb-[10px]">
          {t('ShippingAddress')}
        </div>
        <div className="">
          <div className="text-neutral-800 text-base font-medium leading-normal mb-1">
            {resData?.shipping_address?.name}
          </div>
          <div className=" text-neutral-500 text-sm font-normal leading-normal">
            {resData?.shipping_address?.building &&
              `${resData?.shipping_address?.building},`}{" "}
            {resData?.shipping_address?.area &&
              `${resData?.shipping_address?.area},`}
            <br />
            {resData?.shipping_address?.landmark &&
              `${resData?.shipping_address?.landmark},`}{" "}
            {resData?.shipping_address?.city &&
              `${resData?.shipping_address?.city},`}
            <br />
            {resData?.shipping_address?.state},{" "}
            {resData?.shipping_address?.country}
            <br />
            {t('PhoneNumber')} : {resData?.shipping_address?.phone_no}
            <br />
            {t('Email')}: {resData?.shipping_address?.email}
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-200 my-8"></div>

      <div className="">
        <div className=" text-black text-base font-semibold capitalize leading-relaxed mb-[10px]">
          {t('OrderSummary')}
        </div>

        <ul className=" ">
          <li className="justify-between items-center flex mb-2">
            <div className="text-stone-500 text-sm font-medium ">{t('Subtotal')}</div>
            <div className=" text-end text-stone-500 text-sm font-medium ">
              {resData?.formatted_sub_total} {currency}{" "}
            </div>
          </li>
          <li className="justify-between items-center flex mb-2">
            <div className="text-stone-500 text-sm font-medium ">{t('Discount')}</div>
            <div className="w-56 text-end text-stone-500 text-sm font-medium ">
              - {resData?.formatted_discount} {currency}
            </div>
          </li>
          {resData?.payment_type === "pay_later" && (
            <li className="justify-between items-center flex mb-2">
              <div className="text-stone-500 text-sm font-medium ">
                {t('Charge')}
              </div>
              <div className="w-56 text-end text-stone-500 text-sm font-medium ">
                {resData?.plus_cod_charge} {currency}
              </div>
            </li>
          )}

          <li className="justify-between items-center flex  mb-2">
            <div className="text-stone-500 text-sm font-medium ">{t('Delivery')}</div>
            {resData?.shipping_cost > 0 ? (
              <div className=" text-end text-stone-500 text-sm font-medium ">
                {resData?.formatted_shipping_cost} {currency}{" "}
              </div>
            ) : (
              <div className="w-20 text-end text-green-700 text-sm font-medium ">
                {t('FREE')}
              </div>
            )}
          </li>
          <li className="justify-between items-center flex mb-2">
            <div className="text-stone-500 text-sm font-medium ">
              {t("VATInclusive")}{country === 'SA' ? t("Inclusive") : ""}
            </div>
            <div className="w-56 text-end text-stone-500 text-sm font-medium ">
              {resData?.formatted_tax} {currency}
            </div>
          </li>

          <li className="justify-between items-center flex mb-2">
            <div className="text-neutral-900 text-sm font-semibold ">
              {t('TotalPrice')}
            </div>
            <div className="w-72 text-end text-stone-500 text-sm font-semibold ">
              {resData?.formatted_total_payable} {currency}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
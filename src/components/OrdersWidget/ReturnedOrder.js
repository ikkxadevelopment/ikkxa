"use client";
import { ORDER_STATUS, RETURN_ORDER_LIST } from "@/constants/apiRoutes";
import OrderItem from "../OrderItem";
import useSWR, { useSWRConfig } from "swr";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export default function ReturnedOrder({}) {
  const t = useTranslations("Index");
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const [page, setPage] = useState(1)
  const { data, error } = useSWR(`${RETURN_ORDER_LIST}${page}&lang=${locale}`);
  const orders = data?.data?.orders
  
  return (
    <>
        {orders?.length > 0 ? data?.data?.orders?.map((item, i) => {
          return <OrderItem data={item} key={i} />;
        }) 
        :
          <h6>{t('NoDataFound')}</h6> 
        }
    </>
  );
}
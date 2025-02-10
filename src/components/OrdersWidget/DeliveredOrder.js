"use client";
import { ORDER_STATUS } from "@/constants/apiRoutes";
import OrderItem from "../OrderItem";
import useSWR, { useSWRConfig } from "swr";
import { useLocale, useTranslations } from "next-intl";

export default function DeliveredOrder({}) {
  const t = useTranslations("Index");
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const { data, error } = useSWR(`${ORDER_STATUS}delivered&lang=${locale}`);
  const orders = data?.data?.orders
  
  return (
    <>
        {orders?.length > 0  ? data?.data?.orders?.map((item, i) => {
            return <OrderItem data={item} key={i} />;
        }) 
        :
            <h6>{t('NoDataFound')}</h6> 
        }
    </>
  );
}
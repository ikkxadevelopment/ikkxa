"use client";
import { ALL_ORDERS, ORDER_STATUS, REFUND_ORDER_LIST, RETURN_ORDER_LIST } from "@/constants/apiRoutes";
import OrderItem from "../OrderItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR, { useSWRConfig } from "swr";
import AppBack from "../AppBack";
import { useLocale, useTranslations } from "next-intl";
// import DeliveredOrder from "./DeliveredOrder";
// import CancelledOrder from "./CancelledOrder";
// import ReturnedOrder from "./ReturnedOrder";
import { useState } from "react";

export default function OrdersWidget({}) {
  const t = useTranslations("Index");
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const [page, setPage] = useState(1)
  const [tabValue, setTabValue] = useState('Recent')
  
  const findUrl = (status) => {
    switch (status) {
      case "Recent":
        return ALL_ORDERS;
      case "Delivered":
        return `${ALL_ORDERS}`;
      case "Cancelled":
        return `${ALL_ORDERS}`;
      case "Returned":
        return RETURN_ORDER_LIST
      default:
        return ALL_ORDERS;
    }
  };

  const { data, error } = useSWR(`${findUrl(tabValue)}?page=${page}&lang=${locale}${tabValue==="Cancelled"?`&delivery_status=canceled`:tabValue==="Delivered"?"&delivery_status=delivered":""}`);
  const { mutate } = useSWRConfig();

 
  // if (error) return <div>Error: {error.message}</div>;
  // if (!data) return <div>Loading...</div>;
  return (
    <>
      {" "}
      <AppBack route={"/account"} title={t('Orders')} />
      <div className="lg:p-6 bg-white rounded lg:border lg:border-stone-200 mb-4">
        <h3 className=" text-black text-lg font-semibold mb-5 leading-relaxed hidden md:block">
          {t('Orders')}
        </h3>
        {/* <button onClick={()=>mutate(`${ALL_ORDERS}`)}></button> */}
        <Tabs defaultValue="Recent" onValueChange={(value)=> {setTabValue(value)}}>
          <TabsList className="bg-transparent">
            <TabsTrigger value="Recent">{t('Recent')}</TabsTrigger>
            <TabsTrigger value="Delivered">{t('Delivered')}</TabsTrigger>
            <TabsTrigger value="Cancelled">{t('Cancelled')}</TabsTrigger>
            <TabsTrigger value="Returned">{t('Returned')}</TabsTrigger>
          </TabsList>
          <TabsContent value={tabValue}>
            {data?.data?.orders?.length > 0 ? data?.data?.orders.map((item, i) => {
              return <OrderItem data={item} key={i} />;
            }) : <h6>{t('NoDataFound')}</h6>}
          </TabsContent>
          {/* <TabsContent value="Delivered">
            <DeliveredOrder />
          </TabsContent>
          <TabsContent value="Cancelled">
            <CancelledOrder />
          </TabsContent>
          <TabsContent value="Returned">
            <ReturnedOrder />
          </TabsContent> */}
        </Tabs>
      </div>
    </>
  );
}
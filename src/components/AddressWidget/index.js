"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddressItem from "../AddressItem";
import { ALL_ADDRESSES, ALL_ORDERS } from "@/constants/apiRoutes";
import useSWR from "swr";
import { AddressModal } from "../AddressModal";
import AppBack from "../AppBack";
import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";

export default function AddressWidget() {
  const t = useTranslations("Index");
  // const { data, error } = useSWR(`${ALL_ADDRESSES}`, { suspense: true });
  // console.log("---AddressWidget---");
  const { data, error } = useSWR(`${ALL_ADDRESSES}`);
  const [isOpen, setIsOpen] = useState(false);
  // const data = {}
  // console.log("data-data", data);
  // if (error) return <div>Error: {error.message}</div>;
 
  return (
    <>
      <AppBack route={"/account"} title={t('Addresses')} />
      <div className="lg:p-6 bg-white rounded lg:border lg:border-stone-200 mb-4">
        <h3 className=" text-black text-lg font-semibold mb-5 leading-relaxed">
          {t('Addresses')}{" "}
        </h3>
        {data?.data?.addresses?.map((item, i) => {
          return <AddressItem data={item} key={i} />;
        })}
        <button className="btn btn-outline-secondary btn-sm"
          onClick={()=>setIsOpen(true)}
        >
            {t('AddAddress')}
        </button>
          {/* {isOpen && */}
            <AddressModal mode="add" isOpen={isOpen} setIsOpen={setIsOpen} />
          {/* } */}
      </div>
    </>
  );
}

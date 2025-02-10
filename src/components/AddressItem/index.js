"use client";

import { useState } from "react";
import { AddressModal } from "../AddressModal";
import { AddressRemoveModal } from "./AddressRemoveModal";
import { useAddressItem } from "./useAddressItem";
import { useTranslations } from "next-intl";

export default function AddressItem({ data }) {
  const { removeHandler } = useAddressItem()
  const t = useTranslations("Index");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-5 md:p-6 rounded border border-gray-200 bg-white flex   mb-4">
      <div className="flex-col-auto w-auto">
        <div className={`w-5 h-5 rounded-full border p-1 ${data?.default_shipping===0?"border-black":"border-[#F83E16]"} `}>
        {data?.default_shipping!==0&& <div className="w-full h-full rounded-full bg-[#F83E16]"></div>}
        </div>
      </div>

      <div className="flex-1 w-full ms-2 md:ms-3">
        <h3 className="text-black text-base font-semibold mb-3">
          {data?.name}
          <span className="ms-2 px-1 py-0.5 bg-neutral-200 rounded inline-block text-stone-500 text-xs font-medium ">
            {data?.type}
          </span>
        </h3>

        <p className=" text-neutral-500 text-sm font-normal leading-tight mb-4">
          {data?.building}, {data?.area}, {data?.city}, {data?.country}
        </p>
        <p className="text-neutral-500 text-sm font-normal  leading-tight mb-4">
          Mobile:
          <span className="text-black text-sm font-medium leading-tight">
            {data?.phone_no}
          </span>
        </p>

        <div className="flex justify-between items-center">
          <div>
            {/* <button 
              className="btn btn-outline-secondary btn-sm me-3"
              onClick={() => removeHandler(data?.id)}
            >
              Remove
            </button> */}
            <AddressRemoveModal data={data}/>
            <button className="btn btn-outline-secondary btn-sm"
              onClick={()=>setIsOpen(true)}>
                {t("Edit")}
              </button>
              {isOpen &&
                <AddressModal data={data} mode='edit' isOpen={isOpen} setIsOpen={setIsOpen} />
              }
            {/* <AddressModal data={data} mode='edit'/> */}
          </div>
          {data?.default_shipping===0?"": <div className="text-black text-sm font-normal">    {t("DefaultAddress")}</div>}
        </div>
      </div>
    </div>
  );
}

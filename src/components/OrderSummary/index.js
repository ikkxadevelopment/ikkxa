import { Input } from "../ui/input";
import { ALL_ADDRESSES, APPLIED_COUPON } from "@/constants/apiRoutes";
import useSWR from "swr";
import useCheckout from "./useCheckout";
import Coupon from "./Coupon";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { fetcherWithToken } from "@/utils/fetcher";
import Link from "next/link";
import { AddressModal } from "../AddressModal";
import { useSession } from "next-auth/react";
import { LoginModal } from "../LoginModal";
import { useRecoilState } from "recoil";
import { addressIsOpen, couponAppliedState, loginIsOpen } from "@/recoil/atoms";
import getCurrency from "@/hooks/getCurrency";

export default function OrderSummary({ data }) {
  const t = useTranslations("Index");
  const session = useSession();
  const [isOpen, setIsOpen] = useRecoilState(loginIsOpen);
  const [addressIsModalOpen, setAddressModalOpen] =
    useRecoilState(addressIsOpen);
  const { data: address, error: addressError } = useSWR(`${ALL_ADDRESSES}`);
  const [isLogined, setIsLogined] = useState(false);
  const [couponApplied, setCouponApplied] = useRecoilState(couponAppliedState);
  const currency = getCurrency();
  const defaultAddress =
    address?.data?.addresses?.find((item) => item.default_shipping === 1) ||
    address?.data?.addresses[0];
  const { handleCheckout, loading, error } = useCheckout({
    ...data,
    defaultAddress,
  });

  const lang = useLocale();
  const [locale, country] = lang.split("-");
  // if (loading) return <p>Loading...</p>;
  // if (addressError) return <p>Error loading address.</p>;

  return (
    <div className="p-6 bg-stone-50 md:rounded border border-gray-200 ">
      <h4 className=" text-black text-lg font-semibold mb-3">
        {t("OrderSummary")}
      </h4>
      <Coupon session={session} setCouponApplied={setCouponApplied} />

      {/* position: fixed;
    z-index: 1;
    background: #fff;
    top: 0;
    z-index: 11111111;
    left: 0;
    padding: 18px 16px;
    border-bottom: 1px solid #eee; */}

      <div className="py-5 border-t border-b">
        <div className="flex justify-between mb-2">
          <p className="text-black text-sm">{t("Subtotal")}</p>
          <p className="text-black text-sm ">
            {" "}
            {currency} {data?.sub_total}   
          </p>
        </div>

        <div className="flex justify-between mb-2">
          <p className="text-black text-sm">{t("Discount")}</p>
          <p className="text-sm text-[#00b553]">
            {" "}
            -{currency} {data?.discount}      
          </p>
        </div>

       
        {data?.coupon_discount && (
          <div className="flex justify-between mb-2">
            <p className="text-black text-sm">{t("CouponDiscount")}</p>
            <p className="text-sm text-[#00b553]">
              {" "}
              -{currency} {data?.coupon_discount} 
            </p>
          </div>
        )}

        <div className="flex justify-between mb-2">
          <p className="text-black text-sm">{t("ShippingCharge")}</p>
          <p className="text-black text-sm ">
            {data?.formatted_shipping_cost === "0" ? (
              <span className="text-sm text-[#00b553]">{t("FREE")}</span>
            ) : (
              <span>
                {currency} {data?.shipping_cost} 
              </span>
            )}
          </p>
        </div>
        {data?.tax>0&&
        <div className="flex justify-between ">
          <p className="text-black text-sm">{t("VATInclusive")}{country === 'SA'? t("Inclusive"):""}</p>
          <p className="text-black text-sm ">
            {" "}
            {currency} {data?.tax} 
            </p>
        </div>
      }


      </div>
      <div className="flex justify-between py-4 ">
        <p className="text-black text-base font-semibold">{t("Total")}</p>
        <p className="text-black text-base font-semibold">
          {" "}
          {currency} {data?.total_payable} 
        </p>
      </div>
      {defaultAddress && session?.status === "authenticated" ? (
        <div className="fixed lg:static bottom-0 left-0 w-full z-10 bg-white py-3 lg:py-0 px-4 lg:px-0 lg:shadow-none shadow-sm">
          <button
            className="w-full btn btn-grad btn-lg lg:mb-3 "
            onClick={() => handleCheckout(defaultAddress?.id, `${couponApplied?.coupon_code?couponApplied?.coupon_code:""}`)}
          >
            {loading ? `${t("Loading")}` : `${t("ProceedToCheckout")}`}
          </button>
        </div>
      ) : !defaultAddress && session?.status === "authenticated" ? (
        <div className="fixed lg:static bottom-0 left-0 w-full z-10 bg-white py-3 lg:py-0 px-4 lg:px-0 lg:shadow-none shadow-sm mb-5">
          <button
            className="w-full btn btn-grad btn-lg lg:mb-3 "
            // onClick={()=>setIsLogined(true) }
            onClick={() => setAddressModalOpen(true)}
          >
            {loading ? `${t("Loading")}` : `${t("ProceedToCheckout")}`}
          </button>
        </div>
      ) : (
        <div className="fixed lg:static bottom-0 left-0 w-full z-10 bg-white py-3 lg:py-0 px-4 lg:px-0 lg:shadow-none shadow-sm mb-5">
          <button
            className="w-full btn btn-grad btn-lg lg:mb-3 "
            onClick={() => {
              setIsLogined(true);
              setIsOpen(true);
            }}
          >
            {loading ? `${t("Loading")}` : `${t("ProceedToCheckout")}`}
          </button>
        </div>
      )}
      {data?.formatted_shipping_cost !== "0" && (
        <div className="px-3 py-2 bg-green-100 rounded-sm border text-emerald-500 text-xs font-semibold">
          {t("GetFreeShipping")} {currency}
        </div>
      )}
      {addressIsModalOpen && (
        <AddressModal
          mode="add"
          isOpen={addressIsModalOpen}
          setIsOpen={setAddressModalOpen}
        />
      )}
      {isLogined && isOpen && <LoginModal />}
    </div>
  );
}

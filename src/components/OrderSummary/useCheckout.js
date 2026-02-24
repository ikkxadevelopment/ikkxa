"use client";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useRecoilState } from "recoil";
import { checkoutDataState } from "@/recoil/atoms";
import { COD_ORDER, CONFIRM_ORDER } from "@/constants/apiRoutes";
import { axiosPostWithToken } from "@/lib/getHome";
import qs from "qs";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";

const useCheckout = (data) => {
  const router = useRouter();
  const lang = useLocale();
  const { mutate } = useSWRConfig();
  const [checkoutData, setCheckoutData] = useRecoilState(checkoutDataState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const order_id = checkoutData?.id;

  // ["IKKXA100"].forEach((tag) => checkoutPayload.append("coupon_code[]", tag));

  const codPayload = {
    payment_type: "pay_later",
    order_id: order_id,
  };

  const handleCheckout = async (id, coupon) => {

    const checkoutPayload = new FormData();
    checkoutPayload.append("address_id", id);
    checkoutPayload.append("coupon_code", `${coupon}`);

    setLoading(true);
    setError(null);
    try {
      const result = await axiosPostWithToken(
        `${CONFIRM_ORDER}`,
        checkoutPayload,
        lang
      );
      if (result.success) {
        setCheckoutData(result.data);
        router.push("/checkout");


      }
    } catch (error) {
      setError(error);
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutCod = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await axiosPostWithToken(COD_ORDER, codPayload, lang);
      if (result.success) {
        // router.push('/orders');
        setSuccess(true);
      }
    } catch (error) {
      setError(error);
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleCheckout, handleCheckoutCod, loading, error, success };
};

export default useCheckout;

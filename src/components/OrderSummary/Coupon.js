import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  APPLIED_COUPON,
  COUPON_APPLY,
  COUPON_REMOVE,
  GET_CART,
} from "@/constants/apiRoutes";
import { axiosPostWithToken } from "@/lib/getHome";
import { Input } from "../ui/input";
import { CouponListing } from "./CouponListing";
import { useRecoilState, useRecoilValue } from "recoil";
import { loginIsOpen, trax_id } from "@/recoil/atoms";
import useSWR, { useSWRConfig } from "swr";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function Coupon({ data, setCouponApplied, session }) {
  const lang = useLocale();
  const [locale, country] = lang.split("-");
  const [isLoginOpen, setIsLoginOpen] = useRecoilState(loginIsOpen);
  const t = useTranslations("Index");
  const trx = useRecoilValue(trax_id);
  const [appliedCoupon, setAppliedCoupon] = useState({});
  const { data: appliedData, error: appliedError } = useSWR(
    `${APPLIED_COUPON}?trx_id=${trx}`
  );
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setAppliedCoupon(appliedData?.data[0]);
    // setCouponApplied(appliedData?.data[0])
    if (appliedData?.data?.length > 0) {
      setCouponApplied(appliedData?.data[0]);
    } else {
      setCouponApplied({});
    }
  }, [appliedData]);
  //   const couponId = appliedData?.data[0]?.coupon_id;
  const validationSchema = Yup.object({
    couponCode: Yup.string()
      .required(`${t("CouponCodeIsRequired")}`)
      .min(3, `${t("CouponCodeLimitError")}`),
  });

  const handleRemoveCoupon = async (resetForm) => {
    const removePayload = {
      coupon_id: appliedCoupon?.coupon_id,
      trx_id: trx,
      // order_id:1
    };

    try {
      const result = await axiosPostWithToken(
        `${COUPON_REMOVE}`,
        removePayload,
        lang
      );

      if (result.status) {
        // console.log("removeeddd");
        mutate(`${GET_CART}lang=${locale}&token=true`);
        mutate(`${APPLIED_COUPON}?trx_id=${trx}`);
        resetForm({ values: { couponCode: "" } });
        setAppliedCoupon({});
        setCouponApplied({});
        window.location.reload(); // Refresh the window
      } else {
        console.log("sdfsdf");
      }
    } catch (error) {
      const apiErrorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
    } finally {
      console.log("sdfsdf");
    }
  };

  const handleApplyCoupon = async (values, { setSubmitting, setErrors }) => {
    const checkoutPayload = {
      coupon_code: values.couponCode,
      trx_id: trx,
    };
    if (session?.status === "authenticated") {
      try {
        const result = await axiosPostWithToken(
          `${COUPON_APPLY}`,
          checkoutPayload,
          lang
        );

        if (result.success) {
          mutate(`${GET_CART}lang=${locale}&token=true`);
          mutate(`${APPLIED_COUPON}?trx_id=${trx}`);
          if (appliedData?.data[0]) {
            setCouponApplied(appliedData?.data[0]);
          }
          window.location.reload(); // Refresh the window
        } else {
          setErrors({ apiError: result.message || "Failed to apply coupon" });
        }
      } catch (error) {
        const apiErrorMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        setErrors({ apiError: apiErrorMessage });
      } finally {
        setSubmitting(false);
      }
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ couponCode: appliedCoupon?.coupon_code }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleApplyCoupon}
      >
        {({ isSubmitting, errors, values, resetForm }) => (
          <Form className=" pb-2">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 w-full gap-2">
                <Field
                  type="text"
                  as={Input}
                  name="couponCode"
                  id="couponCode"
                  className="input font-semibold"
                  //   value={values.couponCode}
                  disabled={appliedCoupon?.length > 0}
                  placeholder={t("EnterVoucher")}
                />
              </div>
              {appliedCoupon ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleRemoveCoupon(resetForm)}
                >
                  Remove
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? `${t("Applying")}...` : `${t("Apply")}`}
                </button>
              )}
            </div>
            <ErrorMessage
              name="couponCode"
              component="div"
              className="text-red-500 text-xs"
            />
            {errors.apiError && (
              <div className="text-red-500 text-xs mt-2">{errors.apiError}</div>
            )}
          </Form>
        )}
      </Formik>
      <CouponListing />
    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import { couponAppliedState, trax_id } from "@/recoil/atoms";
import { useSWRConfig } from "swr";
import { APPLIED_COUPON, COUPON_REMOVE } from "@/constants/apiRoutes";
import { axiosPostWithToken } from "@/lib/getHome";
import { useLocale } from "next-intl";

const COUPON_PAGES = ["/cart", "/checkout"];

export default function RouteChangeHandler() {
  const pathname = usePathname();
  const lang = useLocale();
  const [locale] = lang.split("-");
  const prevPathname = useRef(pathname);
  const [couponApplied, setCouponApplied] = useRecoilState(couponAppliedState);
  const trx = useRecoilValue(trax_id);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    const prev = prevPathname.current;
    prevPathname.current = pathname;

    // Only act when navigating AWAY from a coupon page
    const wasOnCouponPage = COUPON_PAGES.some((p) => prev?.includes(p));
    const isOnCouponPage = COUPON_PAGES.some((p) => pathname?.includes(p));

    if (wasOnCouponPage && !isOnCouponPage && couponApplied?.coupon_id) {
      const removeCoupon = async () => {
        try {
          await axiosPostWithToken(
            `${COUPON_REMOVE}`,
            { coupon_id: couponApplied.coupon_id, trx_id: trx },
            lang
          );
        } catch (e) {
          // silently fail — UI is already cleared below
        } finally {
          setCouponApplied(null);
          mutate(`${APPLIED_COUPON}?trx_id=${trx}`);
        }
      };
      removeCoupon();
    }
  }, [pathname]);

  return null;
}

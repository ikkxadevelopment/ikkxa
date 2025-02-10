import useSWR from "swr";
import { useEffect, useState } from "react";
import { GET_CART, WISHLIST } from "@/constants/apiRoutes";
import { useLocale } from "next-intl";
import { trax_id } from "@/recoil/atoms";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";

export const useWishlistFetcher = () => {
  const session = useSession();
  session?.status === "authenticated" 
  const [wishlistLength, setWishlistLength] = useState(0); // Local state for cart length
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  // const [trx, setTrx] = useRecoilState(trax_id);
  const [guestToken, setGuestToken] = useState(null);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const token = localStorage.getItem("guestToken");
  //     setGuestToken(token);
  //   }
  // }, []);
  const url = session?.status === "authenticated" ? `${WISHLIST}lang=${locale}`: null
  // : guestToken === null ? null : `${WISHLIST}lang=${locale}`
        
  const { data, error } = useSWR(url, {
    onSuccess: (data) => {
      if (data) {
        // const totalQuantity = data?.data?.carts?.reduce(
        //   (acc, item) => acc + item.quantity,
        //   0
        // );
        setWishlistLength(data?.data?.favourite_products.length);
        // setTrx(data?.data?.trx_id);
      }
    },
  });

  return {
    cart: data?.data?.favourite_products,  
    wishlistLength,
    // calculations: data?.data?.calculations,
    // isLoading: error && !data,
    // isError: error,
  };
};

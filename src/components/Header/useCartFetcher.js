import useSWR from "swr";
import { useEffect, useState } from "react";
import { GET_CART } from "@/constants/apiRoutes";
import { useLocale } from "next-intl";
import { trax_id } from "@/recoil/atoms";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";

export const useCartFetcher = () => {
  const session = useSession();
  session?.status === "authenticated" 
  const [cartLength, setCartLength] = useState(0); // Local state for cart length
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const [trx, setTrx] = useRecoilState(trax_id);
  const [guestToken, setGuestToken] = useState(null);

  // Ensure localStorage is accessed only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("guestToken");
      setGuestToken(token);
    }
  }, []);

  const url = session?.status === "authenticated" ? `${GET_CART}lang=${locale}&trx_id=null`
  : guestToken === null ? null : `${GET_CART}lang=${locale}&trx_id=${guestToken}`
        
  const { data, error } = useSWR(url, {
    onSuccess: (data) => {
      if (data) {
        const totalQuantity = data?.data?.carts?.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        setCartLength(totalQuantity); // Set the cart length based on fetched data
        setTrx(data?.data?.trx_id);
      }
    },
  });

  return {
    cart: data?.data?.carts,  
    cartLength,
    calculations: data?.data?.calculations,
    isLoading: !error && !data,
    isError: error,
  };
};

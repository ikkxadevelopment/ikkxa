import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import { ADD_WISHLIST, REMOVE_WISHLIST, WISHLIST } from "@/constants/apiRoutes";
import { fetcherWithToken } from "@/utils/fetcher";
import { useLocale } from "next-intl";
import axios from "axios";
import { loginIsOpen } from "@/recoil/atoms";
import { useRecoilState } from "recoil";

export const useWishlistWidget = ({ data, isWishlist = false }) => {
  const session = useSession();
  const { mutate } = useSWRConfig();
  const isinWishlist = data?.user_wishlist;
  const authToken = session?.data?.accessToken;
  const [hasWishlist, setHasWishlist] = useState(isinWishlist);
  const [isOpen, setIsOpen] =  useRecoilState(loginIsOpen);
  const lang = useLocale();
  const [locale, country] = lang.split('-');


const handleWishlist = async (id) => {
  if (!authToken) {
    setIsOpen(true); 
    return;
  }

  try {
    const data = await fetcherWithToken(
      `${hasWishlist || isWishlist ? REMOVE_WISHLIST : ADD_WISHLIST}/${id}`,
      { token: authToken },
      country
    );

    // Update wishlist state based on response
    if (hasWishlist && data?.status === true) {
      setHasWishlist(false);
    } else {
      setHasWishlist(true);
    }

    // Revalidate SWR cache and trigger ISR
    const wishlistKey = `${WISHLIST}lang=${locale}`;
    await mutate(wishlistKey);
    await axios.post("/api/revalidate");

    return data;
  } catch (error) {
    console.error("Error updating wishlist:", error);
  }
};


    // const handleWishlist = async (id) => {
    //   const data = await fetcherWithToken(
    //     `${hasWishlist || isWishlist ? REMOVE_WISHLIST : ADD_WISHLIST}/${id}`,
    //     { token: authToken },
    //     country
    //   );
    //   if (hasWishlist && data?.status === true) {
    //     setHasWishlist(false);
    //   } else {
    //     setHasWishlist(true);
    //   }
    //   const wishlistKey = `${WISHLIST}lang=${locale}`;
    //   await mutate(wishlistKey);
    //   await axios.post('/api/revalidate');
    //   return data;
    // };

  return {
    handleWishlist,
    hasWishlist,
  };
};

import useSWR, { useSWRConfig } from "swr";
import { ALL_ADDRESSES } from "@/constants/apiRoutes";
import { useState } from "react";

export function useSelectAddressModal() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    setIsOpen,
  };
}

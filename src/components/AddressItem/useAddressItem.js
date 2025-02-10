import { ALL_ADDRESSES, DELETE_ADDRESS } from "@/constants/apiRoutes";
import { useToast } from "@/hooks/use-toast";
import { axiosDeleteWithToken, axiosPostWithToken } from "@/lib/getHome";
import { useLocale } from "next-intl";
import { useState } from "react";
import { useSWRConfig } from "swr";

export function useAddressItem() {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const lang = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const removeHandler = async (id) => {
    try {
      const result = await axiosPostWithToken(`${DELETE_ADDRESS}/${id}`, null, lang);
      if (result?.success) {
        // console.log(result,"result in");
        await mutate(`${ALL_ADDRESSES}`);
        setIsOpen(false);
        toast({
          title: result?.message,
          variant: "success",
        });
      } else {
        toast({
          title: result?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      setIsOpen(false);
      toast({
        title: "Please Try again",
        variant: "destructive",
      });
    }
  };

  return {
    removeHandler,
    isOpen,
    setIsOpen,
  };
}

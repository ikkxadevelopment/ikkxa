import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocale, useTranslations } from "next-intl";
import useSWR from "swr";
import { ALL_ADDRESSES, BUY_NOW } from "@/constants/apiRoutes";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { axiosPostWithToken } from "@/lib/getHome";
import { Input } from "../ui/input";
import { useRecoilState } from "recoil";
import { checkoutDataState, loginIsOpen, selectedVariantState, errorMessageProductCard } from "@/recoil/atoms";
import { useToast } from "@/hooks/use-toast";
import getCurrency from "@/hooks/getCurrency";
import { AddressModal } from "../AddressModal";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";

export default function BuyNow({ data, count, detail }) {
  const t = useTranslations("Index");
  const session = useSession();
  const isLogined = session?.status === "authenticated";
  const currency = getCurrency();
  const { toast } = useToast();
  const router = useRouter();
  const lang = useLocale();
  const [checkoutData, setCheckoutData] = useRecoilState(checkoutDataState);
  const { data: address, error: addressError } = useSWR(`${ALL_ADDRESSES}`);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const productDetail = data?.product_stock;
  const [errorMessages, setErrorMessages] = useRecoilState(errorMessageProductCard);
  const [selectedVariant, setSelectedVariant] = useRecoilState(selectedVariantState);
  const handleBuynow = async () => {
    if (!selectedAddressId) {
      toast({
        title: `${t("PleaseSelectVariant")}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const buyNowPayload = {
      coupon_code: couponCode,
      product_id: data?.id,
      address_id: selectedAddressId,
      variants_name: detail?.size,
      quantity: count ? count : 1,
    };

    try {
      const result = await axiosPostWithToken(
        `${BUY_NOW}`,
        buyNowPayload,
        lang
      );

      if (result.success) {
        setCheckoutData(result.data);
        router.push("/checkout");
      } else {
        toast({
          title: result?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const apiErrorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast({
        title: apiErrorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const findProductInSelectedVariant = (productId) => {
    return selectedVariant?.find(item => item.productID === productId);
  };
  const [isLoginOpen, setIsLoginOpen] = useRecoilState(loginIsOpen);
  const handleClick = () => {
    const selectedProduct = findProductInSelectedVariant(data?.id);
    if (!selectedProduct) {
      // Set an error message if no variant is selected
      setErrorMessages({
        [data?.id]: `${t("PleaseSelectVariant")}`
      });
      return;
    }
    if (isLogined) {
      setIsBuyOpen(true)
    } else {
      setIsLoginOpen(true);
    }
  };
  return (
    <>
      <button  className="w-full btn btn-outline-light btn-lg" onClick={() => handleClick()}  >
        {t('BuyNow')}
      </button>
      <Dialog open={isBuyOpen} onOpenChange={setIsBuyOpen}>
        <DialogContent className="max-h-screen overflow-y-auto lg:max-h-[auto] sm:max-w-4xl">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center justify-between mb-3">
              <p className="text-stone-950 text-base font-semibold ">
                {t('ShippingAddress')}
              </p>
              {/* <button className="text-sm font-medium" onClick={()=>setIsBuyOpen(false)}>Close</button> */}
              </div>
            
              <RadioGroup
                onValueChange={(value) => setSelectedAddressId(value)}
              >
                {address?.data?.addresses?.map((item, i) => (
                  <Label
                    key={i}
                    htmlFor={`${item?.id}`}
                    className="flex space-x-4 w-full p-3 lg:p-6 mb-0 rounded border border-gray-200 bg-white"
                  >
                    <RadioGroupItem value={item?.id} id={`${item?.id}`} />
                    <div>
                      <h3 className="text-black text-base font-semibold mb-3">
                        {item?.name}
                        <span className="ms-2 px-1 py-0.5 bg-neutral-200 rounded inline-block text-stone-500 text-xs font-medium">
                          {t('Work')}
                        </span>
                      </h3>
                      <p className="text-neutral-500 text-sm font-normal leading-tight mb-4">
                        {item?.building}, {item?.area}, {item?.city},{" "}
                        {item?.country}
                      </p>
                      <p className="text-neutral-500 text-sm font-normal leading-tight mb-2">
                        {t('Mobile')} :
                        <span className="text-black text-sm font-medium leading-tight">
                          &nbsp;{item?.phone_no}
                        </span>
                      </p>
                      <p className="text-neutral-500 text-sm font-normal leading-tight">
                        {t('Email')} :
                        <span className="text-black text-sm font-medium leading-tight">
                          &nbsp;{item?.email}
                        </span>
                      </p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>

              <button
                className="btn btn-outline-secondary btn-sm mt-3"
                onClick={() => setIsOpen(true)}
              >
                {t('AddAddress')}
              </button>
              {/* {isOpen && */}
              <AddressModal mode="add" isOpen={isOpen} setIsOpen={setIsOpen} />
              {/* } */}
            </div>
            <div className="col-span-12 lg:col-span-5">
              <div className="p-6 bg-stone-50 md:rounded border border-gray-200">
                <h4 className="text-black text-lg font-semibold mb-3">
                  {t("OrderSummary")}
                </h4>
                <Input
                  type="text"
                  name="couponCode"
                  id="couponCode"
                  className="input font-semibold"
                  placeholder={t("EnterVoucher")}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                {/* Order Summary */}
                <div className="flex justify-between pt-3 mb-2">
                  <p className="text-black text-sm">
                    {t("Subtotal")} ({count} items)
                  </p>
                  <p className="text-black text-sm ">
                    {" "}
                    {detail?.price * count} {currency}
                  </p>
                </div>

                <div className="flex justify-between mb-2">
                  <p className="text-black text-sm">{t("Discount")}</p>
                  <p className="text-sm text-[#00b553]">
                    {" "}
                    -{detail?.price * count - detail?.disPrice * count}{" "}
                    {currency}
                  </p>
                </div>

                <div className="flex justify-between py-4">
                  <p className="text-black text-base font-semibold">
                    {t("Total")}
                  </p>
                  <p className="text-black text-base font-semibold">
                    {detail?.disPrice * count} {currency}
                  </p>
                </div>
                <div className="w-full z-10 bg-white py-3 lg:py-0 px-4 lg:px-0 lg:shadow-none shadow-sm">
                  <button
                    className="w-full btn btn-grad btn-lg "
                    onClick={handleBuynow}
                    disabled={loading}
                  >
                    {loading ? t("loading") : t("ProceedToCheckout")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>{t('Close')}</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

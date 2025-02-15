import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSelectAddressModal } from "./useSelectAddressModal";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";
import { AddressModal } from "../AddressModal";
import useCheckout from "../OrderSummary/useCheckout";
import { ALL_ADDRESSES } from "@/constants/apiRoutes";
import useSWR from "swr";
import { useCartFetcher } from "../Header/useCartFetcher";
import { checkoutDataState, couponAppliedState } from "@/recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslations } from "next-intl";

export function SelectAddressModal({}) {
  const t = useTranslations("Index");
  const { isOpen, setIsOpen } = useSelectAddressModal();
  const { data: address, error: addressError } = useSWR(`${ALL_ADDRESSES}`);
  const [checkoutData, setCheckoutData] = useRecoilState(checkoutDataState);
  const { cart, calculations, isLoading } = useCartFetcher();
  const [defaultAddress, setDefaultAddress] = useState({});
  const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
  const defaults = address?.data?.addresses?.find(
    (item) => item.default_shipping === 1
  );
  const data = calculations;
  const { handleCheckout } = useCheckout();
  const couponApplied = useRecoilValue(couponAppliedState);
  let updatedObject;
  let def;
  const handleChangeAddress = (value) => {
    def = address?.data?.addresses?.find((item) => item.id === value);
    setDefaultAddress(def);
  };

  const handleConfirmAddress = ()=>{
    updatedObject = {
      ...checkoutData,
      shipping_address: defaultAddress,
      billing_address: defaultAddress,
    };
    setCheckoutData(updatedObject)
    handleCheckout(defaultAddress?.id,`${couponApplied?.coupon_code?couponApplied?.coupon_code:""}`)
    setIsOpen(false);
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <button className="text-teal-500  text-xs lg:text-sm font-semibold underline leading-none tracking-wide">
          {t('ChangeAddress')}
        </button>
      </DialogTrigger>
      <DialogContent className="h-screen md:h-auto sm:max-w-[640px] p-10 rounded-1 ">
        <DialogHeader>
          <h3 className="text-black text-2xl font-semibold">
            {t('SelectDeliveryAddress')}
          </h3>
        </DialogHeader>
        <div className="lg:max-h-[70vh] overflow-y-auto">
          <RadioGroup
            defaultValue={defaults?.id}
            // value={values.gender}
            onValueChange={(value) => handleChangeAddress(value)}
          >
            {address?.data?.addresses?.map((item, i) => {
              return (
                <Label
                  key={i}
                  htmlFor={`${item?.id}`}
                  className="flex space-x-4 w-full p-3 lg:p-6  mb-0 rounded border border-gray-200 bg-white"
                >
                  <RadioGroupItem value={item?.id} id={`${item?.id}`} />
                  <div className="">
                    <h3 className="text-black text-base font-semibold mb-3">
                      {item?.name}
                      <span className="ms-2 px-1 py-0.5 bg-neutral-200 rounded inline-block text-stone-500 text-xs font-medium ">
                        {t('Work')}
                      </span>
                    </h3>

                    <p className=" text-neutral-500 text-sm font-normal leading-tight mb-4">
                      {item?.building}, {item?.area}, {item?.city},{" "}
                      {item?.country}
                    </p>
                    <p className="text-neutral-500 text-sm font-normal  leading-tight mb-2">
                      <span>{t('Mobile')} </span>:
                      <span className="text-black text-sm font-medium leading-tight">
                        &nbsp;{item?.phone_no}
                      </span>
                    </p>
                    <p className="text-neutral-500 text-sm font-normal  leading-tight">
                      {t('Email')} :
                      <span className="text-black text-sm font-medium leading-tight">
                        &nbsp;{item?.email}
                      </span>
                    </p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </div>

        <DialogFooter>
          <div className="flex justify-between items-center w-full">
            <button className="btn btn-outline-secondary btn-sm"
              onClick={()=>setIsOpenAddressModal(true)}
            >
              {t('AddAddress')}
            </button>
            {isOpenAddressModal &&
              <AddressModal mode="add" isOpen={isOpenAddressModal} setIsOpen={setIsOpenAddressModal} />
            }
            {/* <AddressModal /> */}
            <button className="btn btn-grad btn-lg" onClick={()=>handleConfirmAddress()}>
              {t('Confirm')}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { useCartWidget } from "@/widgets/CartWidget/useCartWidget";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import { useRecoilState } from "recoil";
import {
  cartState,
  errorMessageProductCard,
  selectedVariantState,
} from "@/recoil/atoms";
import { useRouter } from "@/i18n/routing";
import useProductCard from "../ProductCard/useProductCard";
import AddToCart from "../AddToCart";
import { useTranslations } from "next-intl";

export default function SelectVariantDialog({ data }) {
  const {
    addItem,
    isOpen,
    setIsOpen,
    isLoading,
    addToBag,
    variantOpen,
    setIsVariantOpen,
    getVariantByProductID,
  } = useCartWidget();
  const [cartStateItem, setCartStateItem] = useRecoilState(cartState);
  const [selectedVariant, setSelectedVariant] =
    useRecoilState(selectedVariantState);
  const { selectVariant, stockFromVariant } = useProductCard();
  const [errorMessages, setErrorMessages] = useRecoilState(
    errorMessageProductCard
  );

  const router = useRouter();

  const { width } = useGetDeviceType();

  // const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Index')
  const productItem = {};
  return (
    <>
      <button
        className="btn btn-outline-secondary"
        onClick={() => {
          setIsVariantOpen(true);
        }}
      >
        {t('AddToBag')}
      </button>
      <Drawer open={variantOpen} onOpenChange={setIsVariantOpen}>
        <DrawerContent className="pb-4">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-stone-950 text-lg font-semibold text-left">
                <div className="items-center gap-2.5 flex">
                  {/* <div className="w-[26px] h-[26px] bg-emerald-500 rounded-full justify-center items-center gap-2.5 flex" /> */}
                  <div className=" text-emerald-500 text-sm font-semibold ">
                    {t('SelectVariant')}
                  </div>
                </div>
              </DrawerTitle>
            </DrawerHeader>

            {/* <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter> */}
          </div>
          <div className="max-h-[60vh] overflow-y-auto px-3 pb-11">
            <RadioGroup
              className="flex items-center space-x-2"
              onValueChange={(value) =>
                {
                  const stockData = stockFromVariant(data?.stock, value);
                  selectVariant(
                    data?.id,
                    value,
                    stockData.currentStock,
                    stockData.variantId
                  ),
                    setErrorMessages({});
                }
              }
            >
              {data?.stock?.map((option) => (
                <Label
                  key={option.stock_variant}
                  htmlFor={option.stock_variant}
                  className={`flex cursor-pointer relative overflow-hidden items-center rounded-lg  border-2 border-muted bg-popover [&:has([data-disabled])]:bg-zinc-100 p-4 hover:bg-accent hover:text-accent-foreground border-zinc-300 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-white [&:has([data-disabled])]:text-slate-500 `}
                >
                  {option?.current_stock === 0 && (
                    <div className="w-16 bottom-0 left-0 h-px origin-bottom-left rotate-[-44.24deg] border border-zinc-300 absolute"></div>
                  )}
                  {option?.current_stock > 0 && option?.current_stock < 2 && (
                    <div className="w-2 h-2 top-[4px] right-[4px] bg-destructive rounded-full  absolute"></div>
                  )}
                  <RadioGroupItem
                    value={option.stock_variant}
                    id={option.stock_variant}
                    disabled={option?.current_stock === 0}
                    className="sr-only "
                  />
                  <div className="flex-1 ">{option.stock_variant}</div>
                </Label>
              ))}
            </RadioGroup>
            {errorMessages[data.id] && (
              <p style={{ color: "red" }}>{errorMessages[data.id]}</p>
            )}
          </div>

          <div className="bg-white py-2  px-3 grid grid-cols-2 gap-2 absolute bottom-0 left-0 w-full">
            <AddToCart data={data} />
            <button
              className="btn btn-outline-secondary w-full"
              onClick={() => setIsVariantOpen(false)}
            >
              {t('ContinueShopping')}
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

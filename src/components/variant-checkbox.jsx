"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useProductCard from "./ProductCard/useProductCard";
import { useRecoilState } from "recoil";
import { errorMessageProductCard } from "@/recoil/atoms";

export function VariantCheckbox({ data, stock, setProductDetail, setCount }) {
  const { selectVariant, stockFromVariantForDetailPage } = useProductCard();
  const [errorMessages, setErrorMessages] = useRecoilState( errorMessageProductCard );

  const handleChange =(e)=>{
    const stockItem = stock.find(item => item.name === e);
    const stockData = stockFromVariantForDetailPage(stock, e);
    selectVariant(
      data?.id,
      e,
      stockData.currentStock,
      stockData.variantId
    ),
      setErrorMessages({});
      setCount(1)

    setProductDetail({
      sku:stockItem?.sku,
      size:e,
      price: stockItem?.product?.price,
      disPrice:stockItem?.discount_percentage===0?stockItem?.product?.price:stockItem?.discount_percentage,
      quantity: stockItem?.current_stock
    })
  }


  return (
    <>
     <RadioGroup className="flex items-center  flex-wrap space-x-1 md:space-x-2"  onValueChange={(e)=>handleChange(e)}>
        {stock?.map((option) => (
          <Label
            key={option.id}
            htmlFor={option.id}
            className={`flex mb-0 !ml-0 cursor-pointer relative overflow-hidden items-center rounded-lg  border-2 border-muted bg-popover [&:has([data-disabled])]:bg-zinc-100 p-4 hover:bg-accent hover:text-accent-foreground border-zinc-300 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-white [&:has([data-disabled])]:text-slate-500 `}
          >
            {option?.current_stock===0&&<div className="w-16 bottom-0 left-0 h-px origin-bottom-left rotate-[-44.24deg] border border-zinc-300 absolute"></div>}
            {(option?.current_stock>0&&option?.current_stock<2)&&<div className="w-2 h-2 top-[4px] right-[4px] bg-destructive rounded-full  absolute"></div>}
            <RadioGroupItem
              value={option.name}
              id={option.id}
              disabled={option?.current_stock===0}
              className="sr-only "
            />
            <div className="flex-1 ">{option.name}</div>
          </Label>
        ))}
      </RadioGroup>
     
    </>
  );
}

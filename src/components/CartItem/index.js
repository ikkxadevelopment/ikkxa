import { BsHeart } from "react-icons/bs";
import Counter from "../Counter";
import Image from "../Image/image";
import { MdClose } from "react-icons/md";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import { useCartWidget } from "@/widgets/CartWidget/useCartWidget";
import { useWishlistWidget } from "@/widgets/WishlistWidget/useWishlistWidget";
import { useLocale, useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import getCurrency from "@/hooks/getCurrency";

export default function CartItem({ data, isSidebar }) {
  const currency=getCurrency()
  const t = useTranslations("Index");
  const lang = useLocale();
  const [locale, country] = lang.split("-");
  const { width } = useGetDeviceType();
  const { removeItem, updateItem } = useCartWidget();
  const { handleWishlist } = useWishlistWidget({});

  const moveToWishlist = async (itemId, id) => {
    try {
      await handleWishlist(itemId);
      await removeItem(data?.id);
    } catch (error) {
      console.error("Error while moving item to wishlist:", error);
    }
  };
  return (
    <div
      className={` lg:mb-4 px-4 py-3 lg:p-4 lg:rounded border-b-8 lg:border border-gray-200 lg:border-neutral-200`}
    >
      <div className="flex space-x-3 ">
        <div className="flex-col-auto w-auto">
          <div
            className={`aspect-[490/625]  relative ${
              isSidebar ? "w-[84px]" : "w-[84px] md:w-[90px]"
            }`}
          >
            <Image
              src={data?.product_image}
              sizes="100vw"
              fill
              className="object-cover"
              alt={`${data?.product_name} image`}
            />
          </div>
        </div>
        <div className=" flex-1 w-full h-full relative">
          <button
            className={`absolute top-0 ${
              locale === "en" ? "right-0" : "left-0"
            }`}
            onClick={() => removeItem(data?.id)}
          >
            <MdClose />
          </button>
          <div className="">
            <div>
              <p className="text-neutral-400 text-xs font-medium mb-2 lg:mb-2">
                {t("SKU")}-{data?.product_id}
                {/* <span className="px-1 py-1 bg-red-50 ml-[10px]  rounded inline-block text-red-500 text-xs font-bold">
                  10% Off
                </span> */}
              </p>
              <h3 className=" text-stone-950 text-sm font-normal  leading-tight mb-2 lg:mb-3">
                {data?.product_name}
              </h3>
              {/* <RadioGroup
                className="flex items-center space-x-1 md:space-x-1 gap-1"
                defaultValue={data.variant}
                onValueChange={(e) => updateItem(data?.id, data?.quantity, e)}
              >
                {data.stock_list?.map((option) => (
                  <Label
                    key={option.id}
                    htmlFor={option.id}
                    className={`flex text-xs  cursor-pointer relative overflow-hidden items-center rounded-sm  border border-muted bg-popover [&:has([data-disabled])]:bg-zinc-100 py-2 px-3 hover:bg-accent hover:text-accent-foreground border-zinc-300 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-white [&:has([data-disabled])]:text-slate-500 `}
                  >
                    {option?.current_stock === 0 && (
                      <div className="w-16 bottom-0 left-0 h-px origin-bottom-left rotate-[-44.24deg] border border-zinc-300 absolute"></div>
                    )}
                    {option?.current_stock > 0 && option?.current_stock < 2 && (
                      <div className="w-1 h-1 top-[4px] right-[4px] bg-destructive rounded-full  absolute"></div>
                    )}
                    <RadioGroupItem
                      value={option.name}
                      id={option.variant_ids}
                      disabled={
                        option?.current_stock === 0 ||
                        option.name === data?.variant
                      }
                      className="sr-only "
                    />
                    <div className="flex-1 ">{option.name}</div>
                  </Label>
                ))}
              </RadioGroup> */}
              <p className=" mb-2 lg:mb-2 flex items-center">
                <span className="text-stone-950 text-sm">{t("Size")}:</span>
                <Select
                  defaultValue={data.variant}
                  onValueChange={(e) => updateItem(data?.id, data?.quantity, e)}
                  className="p-0"
                >
                  <SelectTrigger className="w-[50px]  focus:ring-0  h-auto outline-none py-0 px-0  ms-2 border-0">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.stock_list?.map((option, i) => (
                      <SelectItem
                        key={i}
                        value={option.name}
                        className={`${(option?.current_stock === 0 ||
                          option.name === data?.variant)&&"hidden"}`}
                        disabled={
                          option?.current_stock === 0 ||
                          option.name === data?.variant
                        }
                        id={option.variant_ids}
                      >
                        {option?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* <span className="text-stone-950 text-sm font-semibold">
                  {" "}
                  {data?.variant}
                </span> */}
              </p>
            </div>
            <div>
              <div className="flex items-end justify-between">
                <div className="flex items-center">
                  {width >= 992 && <Counter data={data} />}
                  <div className="lg:ml-3 text-zinc-800 text-sm lg:text-base font-semibold ">
                    {data?.formatted_sub_total / data?.quantity} {currency}
                    {!isSidebar && (
                      <span className="ml-1 text-gray-400 text-sm font-semibold line-through">
                        {data?.formatted_price} {currency}
                      </span>
                    )}
                  </div>
                </div>
                {width >= 992 && !isSidebar && (
                  <div>
                    <button
                      className="text-black text-xs font-semibold inline-flex items-center "
                      onClick={() => moveToWishlist(data?.product_id, data?.id)}
                    >
                      <span className="text-lg me-2">
                        <BsHeart />
                      </span>
                      {t("MoveToWishlist")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {width < 992 && (
        <div className="w-full flex mt-5">
          <Counter data={data} />
          {!isSidebar && (
            <button className="text-black w-full text-xs font-semibold inline-flex items-center justify-center">
              <span className="text-lg me-2">
                <BsHeart />
              </span>
              {t("MoveToWishlist")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

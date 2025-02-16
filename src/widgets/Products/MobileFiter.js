"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BsSliders } from "react-icons/bs";
import { useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { useLocale, useTranslations } from "next-intl";

export default function MobileFilter({
  data,
  handleClearAll,
  handleMobileFilterChange,
  applyMobileFilters,
  isFilterChecked,
}) {
  const t = useTranslations("Index");
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyPriceFilters = () => {
    applyMobileFilters(minPrice, maxPrice);
    setIsOpen(false);
  };
  const lang = useLocale();
  const [locale, country] = lang.split("-");
  return (
    <>
      <button
        className="w-full text-center text-sm font-medium py-2 inline-flex items-center justify-center border-e border-[#e4e4e4]"
        onClick={() => setIsOpen(true)}
      >
        <span className="inline-block me-3 text-base ">
          <BsSliders />
        </span>
        {t("Filter")}{" "}
      </button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side={"left"} className="px-0 h-full pt-0 w-full pb-0">
          <div className="w-full  bg-white shadow grid-cols-3 grid relative z-20 py-[14px] px-3 items-center">
            <button onClick={() => setIsOpen(false)} className="text-2xl">
            {locale === "ar" ? <MdArrowForward /> : <MdArrowBack />}
            </button>
            <div className=" text-stone-950 text-lg font-semibold text-center">
              {t("FILTERS")}
            </div>
            <div className="text-end text-neutral-500 text-base font-medium ">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleClearAll();
                }}
              >
                {t("ClearAll")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 absolute bottom-0 left-0 z-10 w-full bg-white shadow py-2 px-3 gap-3">
            <div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-black text-base font-semibold py-[10px] rounded border border-zinc-300 justify-center items-center inline-flex"
              >
                {t("Close")}
              </button>
            </div>
            <div>
              <button
                onClick={() => handleApplyPriceFilters()}
                className="w-full text-center text-white text-base font-semibold py-[10px] rounded border border-zinc-300 justify-center bg-black items-center inline-flex"
              >
                {t("Apply")}
              </button>
            </div>
          </div>

          <Tabs
            defaultValue="tab_sub"
            className="w-full flex h-full"
            orientation="vertical"
          >
            <TabsList className="flex flex-col justify-start h-auto w-[146px] flex-col-auto p-0 bg-stone-50">
              <TabsTrigger
                className="text-left rounded-none block w-full pl-4 pr-2 py-4 text-stone-950 text-sm font-normal shadow-none border-b border-gray-200 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-black"
                value={`tab_sub`}
              >
                {t("Categories")}
              </TabsTrigger>

              {data?.results?.attributes?.map((item, i) => {
                return (
                  <TabsTrigger
                    className="text-left rounded-none block w-full pl-4 pr-2 py-4 text-stone-950 text-sm font-normal shadow-none border-b border-gray-200 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-black"
                    value={`tab${i}`}
                    key={i}
                  >
                    {item?.title}
                  </TabsTrigger>
                );
              })}
              <TabsTrigger
                className="text-left rounded-none block w-full pl-4 pr-2 py-4 text-stone-950 text-sm font-normal shadow-none border-b border-gray-200 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-black"
                value="Price"
              >
                {t("Price")}
              </TabsTrigger>
            </TabsList>

            <div className="grow w-full px-3">
              {data?.results?.attributes?.map((item, i) => {
                return (
                  <TabsContent value={`tab${i}`} key={i}>
                    <div className="pt-5 pb-3">
                      {item?.attribute_value?.map((item1, i1) => {
                        return (
                          <div
                            className="flex items-center space-x-2 mb-[18px]"
                            key={i1}
                          >
                            <Checkbox
                              id={item1?.id}
                              defaultChecked={isFilterChecked(
                                "attribute_value_id",
                                item1?.id
                              )}
                              onCheckedChange={(e) =>
                                handleMobileFilterChange(
                                  "attribute_value_id",
                                  item1?.id
                                )
                              }
                            />
                            <label
                              htmlFor={item1?.id}
                              className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item1?.value}
                              {/* <span className="text-black opacity-50">
                                (64)
                              </span> */}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                );
              })}

              <TabsContent value="tab_sub">
                <div className="pt-5 pb-3">
                  {data?.results?.categories[0]?.child_category?.map(
                    (item1, i1) => {
                      return (
                        <div
                          className="flex items-center space-x-2 mb-[18px]"
                          key={i1}
                        >
                          <Checkbox
                            id={item1?.id}
                            defaultChecked={isFilterChecked(
                              "child_category",
                              item1?.id
                            )}
                            onCheckedChange={(e) =>
                              handleMobileFilterChange(
                                "child_category",
                                item1?.id
                              )
                            }
                          />
                          <label
                            htmlFor={item1?.id}
                            className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item1?.title}
                            <span className="text-black opacity-50">
                              ({item1?.total_products})
                            </span>
                          </label>
                        </div>
                      );
                    }
                  )}
                </div>
              </TabsContent>

              <TabsContent value="Price">
                <div className="pt-5 pb-3">
                <div className="flex justify-between items-center">
                    <input
                      type="number"
                      name="minPrice"
                      min={0}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="px-2.5 py-1.5 border border-neutral-300 text-neutral-700 text-xs font-medium w-[100px] text-center"
                      placeholder={t("MinPrice")}
                    />
                    <p className="opacity-50 font-semibold text-xs"> TO </p>
                    <input
                      type="number"
                      name="maxPrice"
                      min={0}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="px-2.5 py-1.5 border border-neutral-300 text-neutral-700 text-xs font-medium w-[100px] text-center"
                      placeholder={t("MaxPrice")}
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}

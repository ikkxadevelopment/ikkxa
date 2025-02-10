"use client"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState } from "react";
import { BsSortDown } from "react-icons/bs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";

export function MobileSort({ filters, handleSortMobile }) {
  const t = useTranslations("Index");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="w-full text-center text-sm font-medium py-2 inline-flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <span className="inline-block me-3  text-base">
          <BsSortDown />
        </span>
        {t('SortBy')}{" "}
      </button>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-stone-950 text-lg font-semibold text-left">
                {" "}
                {t('SortBy')}
              </DrawerTitle>
            </DrawerHeader>
            <div className="  px-3 pb-4">
              <RadioGroup
                value={filters.sort}
                onValueChange={(e)=>{handleSortMobile(e)
                    setIsOpen(false)
                }}
                className="flex flex-col space-y-2"
              >
                <label className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="newest" />
                  <span>{t('Newest')}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <RadioGroupItem value="oldest" id="oldest" />
                  <span>{t('Oldest')}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <RadioGroupItem value="top_selling" id="top_selling" />
                  <span>{t('TopSelling')}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <RadioGroupItem value="low_to_high" id="low_to_high" />
                  <span>{t('Price')}: {t('LowtoHigh')}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <RadioGroupItem value="high_to_low" id="high_to_low" />
                  <span>{t('Price')}: {t('HighToLow')}</span>
                </label>
              </RadioGroup>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

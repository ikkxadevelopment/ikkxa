import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "../Image/image";

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
import { useState } from "react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useHeader } from "./useHeader";
import { useLogout } from "@/hooks/useLogout";

export function LangSwitcher() {
  const { onSelectChange, params } = useHeader();
  const { handleLogOut } = useLogout();
  const lang = useLocale();
  const [locale, country] = lang.split("-");
  const [selectedCountry, setSelectedCountry] = useState(country); // Default selected value

  const countryArray = [
    { code: "SA", label: "Saudi", flag: "/images/saudi.png" },
    { code: "AE", label: "UAE", flag: "/images/uae-flag.png" },
  ];

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedCountry(value);
    document.cookie = `country=${value}; path=/; max-age=31536000`;
    onSelectChange(`${locale}-${value}`);
    handleLogOut()
  };
 
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="hidden lg:flex ">
          <button className="inline-flex items-center ps-2">
            <span className="w-8 h-5 block bg-black me-2 relative text-xs md:text-md ">
              <Image
                src={`${
                  selectedCountry === "AE"
                    ? "/images/uae-flag.png"
                    : "/images/saudi.png"
                }`}
                className="object-cover"
                fill
                alt="country flag"
              />
            </span>
            <span className="text-xs">
              {locale === "en" ? "En" : "العربية"}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <div className="self-stretch gap-1 flex mb-3">
            <button
              className={` text-xs font-medium  w-full px-3.5 py-2 ${
                locale === "en" ? "bg-black text-white" : "bg-gray-200"
              } rounded`}
              onClick={() => onSelectChange(`en-${selectedCountry}`)}
            >
              English
            </button>
            <button
              className={`text-xs font-medium  w-full px-3.5 py-2 ${
                locale === "ar" ? "bg-black text-white " : "bg-gray-200"
              } rounded`}
              onClick={() => onSelectChange(`ar-${selectedCountry}`)}
            >
              العربية
            </button>
          </div>
          {countryArray &&
            countryArray?.map((country) => (
              <DropdownMenuItem key={country.code}>
                <label className="flex items-center w-full cursor-pointer">
                  <input
                    type="radio"
                    name="country"
                    value={country.code}
                    checked={selectedCountry === country.code}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="flex items-center w-full">
                    <div className="border relative border-neutral-200 flex-col justify-start items-start gap-[8.76px] inline-flex w-[22.30px] h-[16.87px]">
                      <Image
                        className="object-cover"
                        fill
                        src={country.flag}
                        alt={country.label}
                      />
                    </div>
                    <div className="text-black text-sm font-medium ps-3">
                      {country.label}
                    </div>
                    <div className="w-4 h-4 rounded-full border border-orange-600 relative ml-auto">
                      {selectedCountry === country.code && (
                        <div className="w-full h-full top-0 left-0 absolute bg-orange-600 rounded-full scale-75" />
                      )}
                    </div>
                  </div>
                </label>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Drawer>
        <DrawerTrigger asChild className="lg:hidden">
          <button className="inline-flex items-center">
            <span className="w-8 h-5  block bg-black me-2 relative text-xs md:text-md ">
              <Image
                src={`${
                  selectedCountry === "AE"
                    ? "/images/uae-flag.png"
                    : "/images/saudi.png"
                }`}
                className="object-cover"
                fill
                alt="country flag"
              />
            </span>
            <span className="text-xs">
              {locale === "en" ? "En" : "العربية"}
            </span>
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-stone-950 text-lg font-semibold text-left">
                {" "}
                Select Country
              </DrawerTitle>
            </DrawerHeader>
            <div className="  px-3">
              <div className="">
                <div className="self-stretch gap-1 flex mb-3">
                  <button
                    className="text-white text-xs font-medium  w-full px-3.5 py-2 bg-black rounded"
                    onClick={() => onSelectChange(`en-${selectedCountry}`)}
                  >
                    English
                  </button>
                  <button
                    className="text-black text-xs font-medium w-full px-3.5 py-[9px] bg-gray-200 rounded"
                    onClick={() => onSelectChange(`ar-${selectedCountry}`)}
                  >
                    العربية
                  </button>
                </div>
                <div className="pb-6">
                  {countryArray &&
                    countryArray?.map((country) => (
                      <div
                        className="w-full relative flex items-center bg-neutral-50 rounded-[5px] border border-gray-200 px-3 py-2 mb-1"
                        key={country.code}
                      >
                        <label className="flex items-center w-full cursor-pointer">
                          <input
                            type="radio"
                            name="country"
                            value={country.code}
                            checked={selectedCountry === country.code}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div className="flex items-center w-full">
                            <div className="border relative border-neutral-200 flex-col justify-start items-start gap-[8.76px] inline-flex w-[22.30px] h-[16.87px]">
                              <Image
                                className="object-cover"
                                fill
                                src={country.flag}
                                alt={country.label}
                              />
                            </div>
                            <div className="text-black text-sm font-medium ps-3">
                              {country.label}
                            </div>
                            <div className="w-4 h-4 rounded-full border border-orange-600 relative ml-auto">
                              {selectedCountry === country.code && (
                                <div className="w-full h-full top-0 left-0 absolute bg-orange-600 rounded-full scale-75" />
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

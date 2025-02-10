"use client";
import { BiSearch } from "react-icons/bi";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "../Image/image";
import { IoClose } from "react-icons/io5";
import { useSearch } from "./useSearch";
import { CiSearch } from "react-icons/ci";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import getCurrency from "@/hooks/getCurrency";

export default function SearchMobile() {
  const t = useTranslations("Index");
  const currency=getCurrency()
  
  const {
    handleSubmit,
    inputValue,
    handleInputChange,
    suggestions,
    setSuggestions,
    setInputValue,
    isOpen, setIsOpen,
  } = useSearch();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <button className="text-2xl px-[10px]">
        <CiSearch />
        </button>
      </DialogTrigger>
      <DialogClose />
      <DialogContent className="h-svh flex flex-col md:h-auto sm:max-w-[640px] p-0   rounded-1 ">
        <DialogHeader className={"shadow py-4 px-4"}>
          <div className="flex items-center ">
            <form onSubmit={handleSubmit} className="relative w-full">
              <Input
                type="text"
                placeholder={t("searchPlaceHolder")}
                value={inputValue}
                onChange={handleInputChange}
                enterKeyHint="search"
                className="bg-gray-200 rounded text-[16px]  border  placeholder:text-neutral-400"
              />
              <button
              type="button"
                onClick={() => {
                  setInputValue("");
                  setSuggestions([]);
                }}
                className="absolute text-xs top-1/2 -translate-y-1/2 right-2 flex items-center justify-center  text-neutral-400 bg-zinc-300 w-4 h-4 rounded-full"
              >
                <IoClose />
              </button>

              {/* Suggestions dropdown */}
            </form>
            <button

              className="text-black text-sm font-medium leading-none inline-block py-2 pl-3"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </DialogHeader>
        <div className=" px-4 flex-grow max-h-svh  overflow-y-auto">
          {suggestions?.length > 0 && (
            <div className="">
              <h3 className="mb-4 font-semibold text-xs text-[#9a9a9a]">
                Suggestions
              </h3>

              <ul className="mb-3">
                <li className="mb-5 text-xs">
                  <Link
                    href="/search?q=jalabiya"
                    className="flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm me-2">
                      {" "}
                      <BiSearch />
                    </span>
                    Jalabiyas
                  </Link>
                </li>
                <li className="mb-5 text-xs">
                  <Link
                    href="/search?q=abaya"
                    className="flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm me-2">
                      {" "}
                      <BiSearch />
                    </span>
                    Abayas
                  </Link>
                </li>
                <li className="mb-5 text-xs">
                  <Link
                    href="/search?q=kid"
                    className="flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm me-2">
                      {" "}
                      <BiSearch />
                    </span>
                    Kids
                  </Link>
                </li>
                <li className="mb-5 text-xs">
                  <Link
                    href="/search?q=aba"
                    className="flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm me-2">
                      {" "}
                      <BiSearch />
                    </span>
                    Aba
                  </Link>
                </li>
              </ul>

              {/* onClick={() => {
                  setInputValue(suggestion);
                  setSuggestions([]);
                  router.push(`/search?q=${suggestion}`);
                }} */}
              <h3 className="mb-4 font-semibold text-xs text-[#9a9a9a]">
                Products
              </h3>
              <ul>
                {suggestions?.map((suggestion, index) => (
                  <li key={index}>
                    <Link
                      href={`/products/${suggestion?.slug}`}
                      onClick={() => {
                        setInputValue("");
                        setSuggestions([]);
                        // router.push(`/search?q=${suggestion}`);
                      }}
                      className="block mb-3"
                    >
                      <div className="flex space-x-3 items-center">
                        <div className="flex-col-auto w-auto">
                          <div className="aspect-[490/625]  relative w-[50px] md:w-[55px] rounded overflow-hidden">
                            <Image
                              src={`${suggestion?.image_190x230}`}
                              fill
                              className="object-cover"
                              alt={`${suggestion?.product_name} image`}
                            />
                          </div>
                        </div>
                        <div className=" flex-1 w-full h-full relative">
                          <div className="">
                            <div>
                              <h3 className=" text-stone-950 text-sm font-normal  leading-tight mb-2 lg:mb-2">
                                {suggestion?.product_name}
                              </h3>
                              <div className=" text-zinc-800 text-sm lg:text-sm font-semibold ">
                                {suggestion?.discount_percentage} {currency}
                                <span className="ml-1 text-gray-400 text-sm font-semibold line-through">
                                  {suggestion?.price} {currency}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

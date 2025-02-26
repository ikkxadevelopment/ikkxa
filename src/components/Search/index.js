"use client";
import { BiSearch } from "react-icons/bi";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "../Image/image";
import { useSearch } from "./useSearch";
import getCurrency from "@/hooks/getCurrency";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Search() {
  const t = useTranslations("Index");
  const currency = getCurrency();
  const pathname = usePathname();
  const {
    handleSubmit,
    inputValue,
    handleInputChange,
    suggestions,
    setSuggestions,
    setInputValue,
  } = useSearch();

  useEffect(() => {
    if (!pathname.startsWith('/search')) {
      setInputValue('');
      setSuggestions([]);
    }
  }, [pathname, setInputValue]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        type="text"
        placeholder={t("searchPlaceHolder")}
        value={inputValue}
        onChange={handleInputChange}
        className="pl-4 pr-10 bg-stone-50 border border-gray-200 placeholder:text-neutral-400"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
        <BiSearch />
      </div>

      {/* Suggestions dropdown */}
      {suggestions?.length > 0 && (
        <div className="absolute z-10 mt-2 w-full min-w-[500px] bg-white border border-gray-200 rounded-md shadow-md max-h-[450px] overflow-y-auto p-4">
          <h3 className="mb-4 font-semibold text-xs text-[#9a9a9a]">
            Suggestions
          </h3>

          <ul className="mb-3">
            <li className="mb-5 text-xs">
              <Link
                href="/search?q=jalabiya"
                onClick={() => {
                  setSuggestions([]);
                }}
                className="flex items-center"
              >
                <span className="text-sm me-2">
                  {" "}
                  <BiSearch />
                </span>
                Jalabiyas
              </Link>
            </li>
            <li className="mb-5 text-xs">
              <Link href="/search?q=abaya" className="flex items-center">
                <span className="text-sm me-2">
                  {" "}
                  <BiSearch />
                </span>
                Abayas
              </Link>
            </li>
            <li className="mb-5 text-xs">
              <Link href="/search?q=kid" className="flex items-center">
                <span className="text-sm me-2">
                  {" "}
                  <BiSearch />
                </span>
                Kids
              </Link>
            </li>
            <li className="mb-5 text-xs">
              <Link href="/search?q=aba" className="flex items-center">
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
                    setInputValue(suggestion);
                    setSuggestions([]);
                    // router.push(`/search?q=${suggestion}`);
                  }}
                  className="block mb-3"
                >
                  <div className="flex  items-center">
                    <div className="flex-col-auto w-auto me-3">
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
                              {suggestion?.price}  {currency}
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
      {suggestions?.length > 0 && (
        <div
          className="fixed hidden lg:block bottom-0 left-0 h-[calc(100vh-72px)] bg-black/30 w-full z-[9]"
          onClick={() => setSuggestions([])}
        ></div>
      )}
    </form>
  );
}

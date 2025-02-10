"use client";
// import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useHeader } from "./useHeader";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "../Image/image";
import { BsBag } from "react-icons/bs";
import { BsHeart } from "react-icons/bs";
import Search from "../Search";
import { LangSwitcher } from "./LangSwitcher";
import { BottomMenu } from "./BottomMenu";
import { BiSearch } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoginModal } from "../LoginModal";
import { useLocale, useTranslations } from "next-intl";
import { ProfileDropdown } from "./ProfileDropdown";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  loginIsOpen,
  cartCountState,
  cartState,
  userDetail,
  headerState,
} from "@/recoil/atoms";
import { useEffect, useRef, useState } from "react";
import { GET_CART } from "@/constants/apiRoutes";
import { fetcherWithToken } from "@/utils/fetcher";
import { useCartFetcher } from "./useCartFetcher";
import { Link } from "@/i18n/routing";
import {
  useSearchParams,
  useParams,
  usePathname,
  useRouter,
} from "next/navigation";
import SearchMobile from "../Search/SearchMobile";
import { useWishlistFetcher } from "./useWishlistFetcher";

export default function Header({ data, menu }) {
  const { main } = useHeader();
  const t = useTranslations("Index");
  const session = useSession();
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const authToken = session?.data?.accessToken;
  const isLogined = session?.status === "authenticated";
  const [cartCount, setCartCount] = useRecoilState(cartCountState);
  const [cartStateItem, setCartStateItem] = useRecoilState(cartState);
  const [isOpen, setIsOpen] = useRecoilState(loginIsOpen);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const hasFetchedCart = useRef(false);
  const { cartLength } = useCartFetcher();
  const { wishlistLength } = useWishlistFetcher();

  const [userDetails, setUserDetails] = useRecoilState(userDetail);
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  useEffect(() => {
    setUserDetails(session?.data?.user);
  }, [session]);

  const headerMenu = data?.message?.menu?.header_menu;

  const isInner = useRecoilValue(headerState);
  // useEffect(() => {
  //   const fetchCartData = async () => {
  //     if (isLogined && cartStateItem?.length === 0 && !hasFetchedCart.current) {
  //       hasFetchedCart.current = true;
  //     try {
  //       const data = await fetcherWithToken(`${GET_CART}?token=true`,{ token: authToken });
  //       setCartStateItem(data?.data?.carts);
  //       setCartCount(data?.data?.carts?.length);
  //     } catch (error) {
  //       console.error('Failed to fetch cart data:', error);
  //     }
  //   }};
  //   fetchCartData();
  // },[isLogined, authToken, cartStateItem ])

  return (
    <>
      <header
        className={`${
          isInner ? "hidden md:block" : ""
        }  fixed top-0 left-0 z-[48] w-full   dark:bg-gray-950 dark:text-gray-50`}
        ref={main}
      >
        <div className="shadow-sm bg-white z-50  relative py-3 md:py-2">
          <div className="container mx-auto flex justify-between items-center  px-4 md:px-6">
            <div className="flex">
              <Sheet>
                <SheetTrigger className="lg:hidden">
                  <span className="text-2xl">
                    <RxHamburgerMenu />
                  </span>
                </SheetTrigger>
                <SheetContent side={locale==="ar"?"right":"left"} className="px-0 h-full pt-0">
                  <div className="flex flex-col h-full">
                    {isLogined ? (
                      <SheetClose asChild>
                        <Link
                          href={"/account"}
                          className="py-4 px-3  rounded-md justify-start items-center gap-2.5 flex"
                        >
                          <div className="w-9 h-9 bg-zinc-100 rounded-[110px] justify-center items-center gap-2.5 flex" />
                          <div className="relative">
                            <div className=" text-neutral-950 text-base font-normal  capitalize leading-none tracking-tight mb-1">
                              {t("HiUsername")}{session?.data?.user?.first_name?session?.data?.user?.first_name:"User"}
                            </div>
                            <div className=" text-orange-400 text-xs font-medium capitalize leading-3">
                              {t("ViewProfile")}
                            </div>
                          </div>
                        </Link>
                      </SheetClose>
                    ) : (
                      <div className="px-2.5 py-10 relative overflow-hidden bg-gradient-to-br from-stone-200 to-amber-100 rounded-md justify-end items-start gap-[23px] inline-flex">
                        {/* <Image
                        className="w-[93px] left-6 absolute rounded-md shadow"
                        src="https://via.placeholder.com/93x241"
                        alt=""
                      /> */}
                        <div className="relative w-[50%] ml-auto">
                          <div className=" text-neutral-950 text-lg font-bold uppercase leading-[18px] mb-2">
                            {t("GRABYOUR_ITEM NOW")}
                            {/* <br />
                          {t('ITEMNOW')} */}
                          </div>
                          <div
                            onClick={() => setIsOpen(true)}
                            className=" text-orange-400 text-xs font-medium uppercase leading-3"
                          >
                            {t("SIGNUP")}/{t("LOGIN")}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="px-3 ">
                      <ul className="border-b border-zinc-100 pb-2">
                        {headerMenu?.map((item, i) => {
                          return (
                            <li key={i}>
                              <SheetClose asChild>
                                <Link
                                  href={`${item?.url}`}
                                  className="flex justify-between py-2 text-zinc-800 text-sm font-semibold "
                                >
                                  {item?.label}
                                </Link>
                              </SheetClose>
                            </li>
                          );
                        })}
                      </ul>
                      <ul className="border-b border-zinc-100 pb-2">
                        <li>
                          <SheetClose asChild>
                            <Link
                              href="/contact-us"
                              className="flex justify-between py-2 text-zinc-800 text-sm font-semibold "
                            >
                              {t("ContactUs")}
                            </Link>
                          </SheetClose>
                        </li>

                        <li>
                          <SheetClose asChild>
                            <Link
                              href="/contact-us"
                              className="flex justify-between py-2 text-zinc-800 text-sm font-semibold "
                            >
                              {t("Stores")}
                            </Link>
                          </SheetClose>
                        </li>
                        <li>
                          <SheetClose asChild>
                            <Link
                              href="/orders"
                              className="flex justify-between py-2 text-zinc-800 text-sm font-semibold "
                            >
                              {t("Orders")}
                            </Link>
                          </SheetClose>
                        </li>
                        <li>
                          <SheetClose asChild>
                            <Link
                              href="/manage-addresses"
                              className="flex justify-between py-2 text-zinc-800 text-sm font-semibold "
                            >
                              {t("Address")}
                            </Link>
                          </SheetClose>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-auto px-3">
                      <div className="flex-col justify-start items-start gap-2.5 flex">
                        <a
                          href="https://app.ikkxa.com"
                          target="_blank"
                          className="self-stretch px-[7px] py-[3px] bg-gradient-to-r from-orange-300 to-red-300 rounded-[9px] border-b border-zinc-100 justify-start items-center gap-2.5 inline-flex"
                        >
                          <div className="px-[7px] py-1 bg-white/90 rounded-[5px] justify-center items-start gap-[5px] flex">
                            <div className="aspect-1/1 w-[30px] relative">
                              <Image
                                src={"/images/favicon-144x144.png"}
                                fill
                                className="object-contain"
                                alt="logo"
                              />
                            </div>
                          </div>
                          <div className="grow shrink basis-0 py-2 flex-col justify-center items-start gap-[3px] inline-flex">
                            <div className="text-zinc-800 text-xs font-semibold ">
                              {t("DownloadIKKXAAppNow")}{" "}
                            </div>
                            <div className="text-black/40 text-[10px] font-normal ">
                              {t("GetExclusiveDeals")}
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Link href="/" className="flex items-center" prefetch={false}>
                <div className="aspect-[126/52] w-[84px] md:w-[126px] relative me-5">
                  <Image
                    src={"/images/logo.png"}
                    fill
                    className="object-fit-cover"
                    alt="logo"
                  />
                </div>
              </Link>
            </div>
            <div className="lg:hidden flex items-center">
              <LangSwitcher />
              <SearchMobile />

              <Link
                href={`/wishlist`}
                className="rounded-md px-1 py-2 text-lg text-center relative"
              >
                {/* { wishlistLength > 0 &&
                  <span className="absolute -top-[2px] text-white text-xs font-medium  px-1 bg-stone-900 rounded-2xl border border-white flex-col justify-center items-center gap-2 inline-flex">
                    {wishlistLength}
                  </span>
                } */}
                <span className="flex justify-center ">
                  <BsHeart />{" "}
                </span>
              </Link>
              <Link
                href={`/cart`}
                className="rounded-md px-[10px] py-2 text-xl text-center relative"
              >
                {cartLength > 0 && (
                  <span className="absolute -top-[2px] -right-[2px] text-white text-xs font-medium  px-1 bg-stone-900 rounded-2xl border border-white flex-col justify-center items-center gap-2 inline-flex">
                    {cartLength}
                  </span>
                )}
                <span className="flex justify-center ">
                  {" "}
                  <BsBag />
                </span>
              </Link>
            </div>
            <nav className="hidden space-x-2 lg:flex">
              {menu?.map((link, i) => {
                return (
                  <div key={i} className="relative group">
                    <Link
                      href={`${link?.url}`}
                      className="rounded-md text-nowrap px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
                      prefetch={false}
                    >
                      {link?.label}
                    </Link>
                    {link?.subcategories && link.subcategories.length > 0 && (
                      <div className="absolute left-0 hidden group-hover:block min-w-[500px] bg-white shadow-lg rounded-md mt-1 py-2 lg:p-5 
                        opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out transform group-hover:translate-y-0 translate-y-1">
                        <div className="grid grid-cols-2 gap-2">
                          {link.subcategories.map((subcat, j) => (
                            <Link
                              key={j}
                              href={subcat.url}
                              className="block px-4 py-2 text-sm hover:bg-gray-100"
                              prefetch={false}
                            >
                              {subcat.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <nav className="hidden space-x-5 lg:flex ms-auto align-middle items-center">
              <Search />
              <LangSwitcher />

              <Link
                href={`/wishlist`}
                className="rounded-md px-1 py-2 text-lg text-center relative"
              >
                {/* { wishlistLength > 0 &&
                  <span className="absolute -top-[2px] text-white text-xs font-medium  px-1 bg-stone-900 rounded-2xl border border-white flex-col justify-center items-center gap-2 inline-flex">
                    {wishlistLength}
                  </span>
                } */}
                <span className="flex justify-center mb-2">
                  {" "}
                  <BsHeart />{" "}
                </span>
                <span className="block text-xs leading-none font-semibold text-nowrap">
                  {t("Wishlist")}
                </span>
              </Link>
              <Link
                href={`/cart`}
                className="rounded-md px-1 py-2 text-lg text-center relative"
              >
                {cartLength > 0 && (
                  <span className="absolute -top-[2px] -right-[2px] text-white text-xs font-medium  px-1 bg-stone-900 rounded-2xl border border-white flex-col justify-center items-center gap-2 inline-flex">
                    {cartLength}
                  </span>
                )}
                <span className="flex justify-center mb-2">
                  {" "}
                  <BsBag />
                </span>
                <span className="block text-xs leading-none  font-semibold text-nowrap">
                  {/* Bag */}
                  {t("Bag")}
                </span>
              </Link>
              {isLogined ? (
                <ProfileDropdown />
              ) : (
                <button
                  className="btn btn-grad btn-lg text-nowrap"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  {" "}
                  {t("LOGIN")}{" "}
                </button>
              )}
              {/* <button onClick={signOut}>Logout</button> */}
            </nav>
          </div>
        </div>
        {session?.status === "unauthenticated" && isOpen && <LoginModal />}
      </header>
      {/* <BottomMenu/> */}
    </>
  );
}

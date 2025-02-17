"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductThumbSlider from "../ProductThumbSlider";
import Counter from "@/components/Counter";
import PaymetnIcons from "@/components/PaymentIcons";
import BuyNow from "@/components/BuyNow";
import AddToCart from "@/components/AddToCart";
import { VariantCheckbox } from "@/components/variant-checkbox";
import { IoCardOutline, IoShareSocialOutline } from "react-icons/io5";
import EmiComponent from "@/components/EmiComponent";
import Image from "@/components/Image";
import { useProductDetail } from "./useProductDetail";
import { useRecoilState } from "recoil";
import { errorMessageProductCard } from "@/recoil/atoms";
import DetailCounter from "@/components/DetailCounter";
import Slider from "@/components/Slider";
import { SwiperSlide } from "swiper/react";
import ProductCard from "@/components/ProductCard";
import useHeaderSecondary from "@/hooks/useHeaderSecondary";
import DetailBack from "@/components/DetailBack";
import { Link } from "@/i18n/routing";
import getCurrency from "@/hooks/getCurrency";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { useToast } from "@/hooks/use-toast";
import { Suspense, useEffect, useRef } from "react";
import useHeaderSecond from "@/hooks/useHeaderSecond";

export default function ProductDetail({ data,structuredData, isOutOfStock }) {
  const t = useTranslations("Index");
  // console.log(structuredData,data,"structuredData");

  useHeaderSecond();
  // useHeaderSecondary(true);
  const datas = data?.results;
  const currency = getCurrency();



  // const structuredData = {
  //   "@context": "https://schema.org/",
  //   "@type": "Product",
  //   name:  data?.results?.product?.product_meta_title,
  //   image: data?.results?.product?.gallery?.large,
  //   description:data?.results?.product?.short_description,
  //   sku: data?.results?.product?.product_stock?.sku,
  //   brand: {
  //     "@type": "Brand",
  //     name: "IKKXA",
  //   },
  //   offers: {
  //     "@type": "Offer",
  //     url: `https://ikkxa.com/en-SA/products/${data?.results?.product?.slug}`,
  //     priceCurrency: "SAR",
  //     price: data?.results?.product?.price,
  //     priceValidUntil: data?.results?.product?.special_discount_end,
  //     itemCondition: "https://schema.org/NewCondition",
  //     availability: "https://schema.org/InStock",
  //   },
  // };
 
  // console.log(data,"productproductproductproductproduct");
  // console.log(structuredData,"productproductproductproductproduct");
  const [errorMessages, setErrorMessages] = useRecoilState(
    errorMessageProductCard
  );
  const { productDetail, setProductDetail, count, setCount } = useProductDetail(
    { datas }
  );
  const customSettings = {
    spaceBetween: 15,
    slidesPerView: 1.7,
    pagination: false,
    // modules: [Navigation],
    breakpoints: {
      640: {
        spaceBetween: 2,
      },
      768: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 5,
      },
      1600: {
        slidesPerView: 6,
      },
    },
    navigation: {
      prevEl: `.swiper-button-prev`,
      nextEl: `.swiper-button-next`,
    },
  };

  const offerPerc =
    100 - Math.round((productDetail?.disPrice / productDetail?.price) * 100);

  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      description: t("LinkCopied")
    });
  };

  const handleWhatsAppShare = () => {
    const text = `${datas?.product?.language_product?.name}: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`
    );
  };


  const variantParentRef = useRef(null); // Create a ref for the variant parent div

  // Function to scroll to the variant parent div
  const scrollToVariantParent = () => {
    if (variantParentRef.current) {
      variantParentRef.current.scrollIntoView({
        behavior: "smooth",  // Smooth scrolling effect
        block: "start",      // Align to the top of the container
      });
    }
  };

  useEffect(() => {
    // Check if there's an error message for the current product and scroll to the variant section
    if (errorMessages[datas?.product.id]) {
      scrollToVariantParent();
    }
  }, [errorMessages, datas?.product.id]); // Run this effect when errorMessages or product ID changes


  return (
    <Suspense fallback={<p className="text-center py-10">Loading...</p>}>

      <section className="">
        {/* <DetailBack route={`/`} /> */}
        <div className="container px-0 md:px-3">
          <Breadcrumb className="mb-5 hidden lg:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t("Home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <li className="inline-flex items-center gap-1.5">
                <Link
                  className="transition-colors hover:text-foreground"
                  href={`/categories/${datas?.product?.category_slug}`}
                >
                  {datas?.product?.category_title}
                </Link>
              </li>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage> {datas?.product?.product_name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4  relative">
              <ProductThumbSlider data={datas?.product?.gallery} />
              <DropdownMenu>
                  <DropdownMenuTrigger className="text-xl w-9 h-9 rounded-full bg-white flex items-center z-10 justify-center absolute top-[60px] lg:top-4 right-[14px]">
                    <IoShareSocialOutline className="w-5 h-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleWhatsAppShare}>
                      <FaWhatsapp className="mr-2" /> WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <IoCopyOutline className="mr-2" /> {t("CopyLink")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleFacebookShare}>
                      <FaFacebook className="mr-2" /> Facebook
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="col-span-12 px-3 md:px-0 lg:col-span-5 lg:px-5">
              <div className="flex justify-between items-center mb-3">
                <h1 className="text-stone-950 text-xl font-semibold">
                  {datas?.product?.language_product?.name}
                </h1>
               
              </div>
              <div className="text-sm">SKU : {productDetail?.sku}</div>
              <div className="py-4 border-b border-gray-200">
                <p className="text-xl font-bold mb-2">
                  {productDetail?.disPrice} {currency}
                  {productDetail?.disPrice !== productDetail?.price && (
                    <>
                      {datas?.product?.special_discount_type === "flat" ? (
                        <span className=" ms-2 px-1.5 py-1 bg-red-50 rounded inline-block text-red-500 text-base font-bold">
                          {t("Save")}: {productDetail?.price - productDetail?.disPrice}{" "}
                          {currency}
                        </span>
                      ) : (
                        <span className=" ms-2 px-1.5 py-1 bg-red-50 rounded inline-block text-red-500 text-base font-bold">
                          {offerPerc}% Off
                        </span>
                      )}
                    </>
                  )}
                </p>
                {productDetail?.disPrice !== productDetail?.price && (
                  <p className="text-neutral-400 text-sm line-through">
                    {productDetail?.price} {currency}
                  </p>
                )}
{isOutOfStock && (
                  <p className="text-red-500 text-sm mt-2">
                    {t("Outofstock")}
                  </p>
                )}

              </div>
              {datas?.product?.related?.length > 0 && (
                <div className="py-3 lg:py-4 border-b border-gray-200">
                  <p className="text-stone-950 text-base font-semibold mb-3">
                    {t("AlsoAvailableIn")}:
                  </p>
                  <div className="grid grid-cols-12 gap-2">
                    {datas?.product?.also_available_in?.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className="block col-span-3 lg:col-span-2 relative"
                        >
                          {item?.current_stock === 0 ? (
                            <></>
                            // <div className="block ">
                            //   <div className="absolute flex items-center z-10 justify-center text-white bg-black/50 text-xs font-semibold w-full h-full">
                            //     No stock
                            //   </div>
                            //   <div className="aspect-[490/735] w-full relative">
                            //     <Image
                            //       src={item?.image_190x230}
                            //       fill
                            //       className="object-cover"
                            //       alt={item?.product_name}
                            //     />
                            //   </div>
                            // </div>
                          ) : (
                            <Link
                              href={`/products/${item?.slug}`}
                              className="block "
                            >
                              <div className="aspect-[490/735] w-full relative">
                                <Image
                                  src={item?.image_190x230}
                                  fill
                                  className="object-cover"
                                  alt={`${item?.product_name} image`}
                                />
                              </div>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="py-3 lg:py-4 border-b border-gray-200" ref={variantParentRef}>
                <div className="flex items-center gap-4">
                  <DetailCounter
                    data={productDetail}
                    count={count}
                    setCount={setCount}
                  />
                  <div className="text-orange-600 text-sm font-medium leading-tight">
                    {productDetail?.quantity &&
                      `${t("Only")} ${productDetail?.quantity} ${t("left")}`}
                  </div>
                </div>
              </div>

              <div className="py-3 lg:py-4 border-b border-gray-200" >
                <p className="text-stone-950 text-base font-semibold mb-3">
                  {t("Size")}: {productDetail?.size}
                </p>
                {datas?.product?.attribute_values && (
                  <VariantCheckbox
                    setProductDetail={setProductDetail}
                    stock={datas?.product?.stock}
                    data={datas?.product}
                    setCount={setCount}
                  />
                )}
                {/* {!productDetail?.size && 
                <p className="text-destructive font-semibold text-sm">Please select a size!</p>
              } */}
                {errorMessages[datas?.product.id] && (
                  <p className="text-xs text-red-500">
                    {errorMessages[datas?.product.id]}
                  </p>
                )}
              </div>

              <div className="py-3 lg:py-4 border-b border-gray-200">
                <h3 className=" text-base font-semibold mb-2">
                  {t("AboutThisProduct")}
                </h3>

                <p className="text-sm">
                  <div
                    className="prose prose-sm max-w-none "
                    dangerouslySetInnerHTML={{
                      __html: datas?.product?.language_product?.description,
                    }}
                  />
                </p>
              </div>

              {/* <div className="py-3 lg:py-4 border-b border-gray-200">
                <h3 className=" text-base font-semibold mb-2">
                  Material & Care
                </h3>

                <p className="text-sm ">
                  75% Cotton, 20% Polyester, 100% Cotton, Machine wash
                </p>
              </div> */}

              {/* <div className="py-3 lg:py-4 border-b border-gray-200">
                <h3 className=" text-base font-semibold mb-3">
                  Specifications
                </h3>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6 ">
                    <p className=" text-stone-500 text-sm mb-1">Colour</p>
                    <div className=" text-black text-sm font-medium ">
                      Green
                    </div>
                  </div>

                  <div className="col-span-6 ">
                    <p className=" text-stone-500 text-sm mb-1">Colour</p>
                    <div className=" text-black text-sm font-medium ">
                      Green
                    </div>
                  </div>

                  <div className="col-span-6 ">
                    <p className=" text-stone-500 text-sm mb-1">Colour</p>
                    <div className=" text-black text-sm font-medium ">
                      Green
                    </div>
                  </div>

                  <div className="col-span-6 ">
                    <p className=" text-stone-500 text-sm mb-1">Colour</p>
                    <div className=" text-black text-sm font-medium ">
                      Green
                    </div>
                  </div>

                  <div className="col-span-6 ">
                    <p className=" text-stone-500 text-sm mb-1">Colour</p>
                    <div className=" text-black text-sm font-medium ">
                      Green
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="col-span-12 px-3 md:px-0 lg:col-span-3 z-10">
              <div className="sticky top-24">
                <div className="fixed lg:static border-t lg:border-0 lg:mb-3  bottom-0 left-0 w-full bg-white z-50 grid grid-cols-2 lg:grid-cols-1 gap-3 px-3 lg:px-0 lg:pt-0 lg:pb-0  pt-2 pb-3 shadow-md lg:shadow-none">
                  <AddToCart size={"lg"} data={datas?.product} count={count} />
                  <BuyNow
                    data={datas?.product}
                    detail={productDetail}
                    count={count}
                  />
                </div>
                <div className="mb-3">
                  <PaymetnIcons />
                </div>
                <EmiComponent price={productDetail?.disPrice} type="tabby" />
                <EmiComponent price={productDetail?.disPrice} type="tamara" />

                <div className="justify-start items-center gap-3 inline-flex">
                  <div className="h-9 w-9 border-solid-neutral-200  rounded-full border flex items-center justify-center">
                    <IoCardOutline />
                  </div>

                  <div className="grow shrink basis-0 self-stretch text-black text-sm font-medium ">
                    {t("SecurePayments")}
                    <br />
                    {t("huntPercentage")} {t("SecurePayments")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-6 lg:py-10  `}>
        {/* ${flashSale && "bg-[#fbf4f4]"} */}
        <div className="container">
          <div className="grid grid-cols-2 mb-4">
            <div>
              <h2 className="text-lg lg:text-xl   font-semibold">
                {t("RelatedProducts")}
              </h2>
            </div>
          </div>

          <Slider className={""} customSettings={customSettings}>
            {Array.isArray(datas?.product?.related_products) ? (
              datas?.product?.related_products?.map((item, i) => {
                return (
                  <SwiperSlide key={i}>
                    {" "}
                    <ProductCard data={item} />{" "}
                  </SwiperSlide>
                );
              })
            ) : (
              <div>{t("NoItemsAvailable")}</div>
            )}
          </Slider>
        </div>
      </section>
    </Suspense>
  );
}

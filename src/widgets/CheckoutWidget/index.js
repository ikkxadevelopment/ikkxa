"use client";
import PaymetnIcons from "@/components/PaymentIcons";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import { useCartFetcher } from "@/components/Header/useCartFetcher";
import CheckoutSummary from "@/components/CheckoutSummary";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "@/components/Image/image";
import AppBack from "@/components/AppBack";
import { useRecoilState } from "recoil";
import { checkoutDataState } from "@/recoil/atoms";
import { useEffect, useState } from "react";
import useCheckout from "@/components/OrderSummary/useCheckout";
import { SelectAddressModal } from "@/components/SelectAddressModal";
import { fetcherWithToken } from "@/utils/fetcher";
import { getSession, useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import { APPLIED_COUPON, TABBY_CHECKOUT, TAMARA_CHECKOUT,NGENIUS_CHECKOUT } from "@/constants/apiRoutes";
import axios from "axios";
import OrderPending from "./OrderPending";
import OrderSuccess from "./OrderSuccess";
import { axiosPostWithToken } from "@/lib/getHome";
import { PiMoney } from "react-icons/pi";

// import Moyasar from "./Moyasar";
import dynamic from "next/dynamic";
import MoyasarPage from "./Moyasar";
import { useLocale, useTranslations } from "next-intl";
import getCurrency from "@/hooks/getCurrency";
import getBaseUrl from "@/hooks/getBaseUrl";
import { useRouter } from "@/i18n/routing";
// const Moyasar = dynamic(() => import('./Moyasar'));

const CheckoutWidget = () => {
  const t = useTranslations("Index");
  const { width } = useGetDeviceType();
  const currency=getCurrency()
  const { mutate } = useSWRConfig();
  const { isLoading, calculations } = useCartFetcher();
  const [checkoutData, setCheckoutData] = useRecoilState(checkoutDataState);
  const { handleCheckoutCod, loading, success } = useCheckout();
  const [address, setAddress] = useState(checkoutData?.shipping_address);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const router = useRouter();
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const baseUrl = getBaseUrl(country);
  const defaultAddress = checkoutData?.shipping_address;

  useEffect(() => {
    setAddress(defaultAddress);
  }, [defaultAddress]);

  const order_id = checkoutData?.id;
  console.log(checkoutData,"checkoutDatacheckoutDatacheckoutDatacheckoutData");
  const handleTamaraCheckout = async () => {
    // setLoading(true);
    // setError(null);

 

    const checkoutPayload = {
      payment_type: 0,
      sub_total: checkoutData?.sub_total,
      discount_offer: checkoutData?.discount,
      shipping_tax: checkoutData?.shipping_cost,
      tax: checkoutData?.total_tax,
      coupon_discount: checkoutData?.coupon_discount,
      total: checkoutData?.total_payable,
      trx_id: checkoutData?.trx_id,
      quantity: [
        {
          id: 3167,
          quantity: 1,
        },
      ],
      coupon_code: "",
      coupon: [],
      checkout_method: 2,
      shipping_address: address,
      billing_address: address,
      buy_now: 0,
    };

    try {
      const result = await axiosPostWithToken(
        `${TAMARA_CHECKOUT}/${order_id}`,
        checkoutPayload,
        lang
      );
      if (result.success) {
        // router.push('/checkout');
        
        router.push(result?.message);
        console.log(result?.message, "data?.defaultAddress");
      }
    } catch (error) {
      // setError(error);
      console.error("Checkout error:", error);
    } finally {
      // setLoading(false);
    }
  };

  const handleTabbyCheckout = async () => {
    try {
      const session = await getSession();
      const token = session?.accessToken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
          "Content-Type": "application/json", // Set content type
        },
      };

      const data = {
        payment_type: 0,
        sub_total: checkoutData?.sub_total,
        discount_offer: checkoutData?.discount,
        shipping_tax: checkoutData?.shipping_cost,
        tax: checkoutData?.total_tax,
        coupon_discount: checkoutData?.coupon_discount,
        total: checkoutData?.total_payable,
        trx_id: checkoutData?.trx_id,
        quantity: [
          {
            id: 3167,
            quantity: 1,
          },
        ],
        coupon_code: "",
        coupon: [],
        checkout_method: 2,
        shipping_address: address,
        billing_address: address,
        buy_now: 0,
      };

      

      const response = await axios.get(
        `${baseUrl}${TABBY_CHECKOUT}/${order_id}`,
        data,
        config
      );

      if (response?.data?.success) {
        router.push(response?.data?.message);
      }
    } catch (error) {
      // setError(error);
      console.error("Checkout error:", error);
    } finally {
      // setLoading(false);
    }
    // await mutate(wishlistKey);
    // return data;
  };

  const handleNgeniusCheckout = async () => {
    try {
      const session = await getSession();
      const token = session?.accessToken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
          "Content-Type": "application/json", // Set content type
        },
      };

      const data = {
        payment_type: 0,
        sub_total: checkoutData?.sub_total,
        discount_offer: checkoutData?.discount,
        shipping_tax: checkoutData?.shipping_cost,
        tax: checkoutData?.total_tax,
        coupon_discount: checkoutData?.coupon_discount,
        total: checkoutData?.total_payable,
        trx_id: checkoutData?.trx_id,
        quantity: [
          {
            id: 3167,
            quantity: 1,
          },
        ],
        coupon_code: "",
        coupon: [],
        checkout_method: 2,
        shipping_address: address,
        billing_address: address,
        buy_now: 0,
      };

      const response = await axios.get(
        `${baseUrl}${NGENIUS_CHECKOUT}/${order_id}`,
        data,
        config
      );

      if (response?.data?.success) {
        // Update to use redirect_url from the message object
        router.push(response.data.message.redirect_url);
      }
    } catch (error) {
      // setError(error);
      console.error("Checkout error:", error);
    } finally {
      // setLoading(false);
    }
    // await mutate(wishlistKey);
    // return data;
  };



  // if (loading) return <OrderPending address={address} />;
  // if (success) return <OrderSuccess address={address} />;
  if(success) {
    router.push(`/checkout/order-success?id=${order_id}`);
  }

  return (
    <section className="bg-stone-50 pt-4 lg:bg-white">
      <AppBack route={"/cart"} title={"Checkout"} />
      <div className="container lg:max-w-[992px]">
        {width >= 992 && (
          <>
            <div className=" justify-center items-center gap-1.5 lg:flex mb-5 hidden">
              <div className="p-2 justify-center items-center gap-2 flex">
                <div className="text-center text-black text-sm font-medium ">
                  {t('Cart')}
                </div>
              </div>
              <div className="w-20 h-px border border-stone-300"></div>
              <div className="p-2  justify-center items-center gap-2 flex">
                <div className="text-center text-black text-sm font-medium ">
                  {t('Checkout')}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="container lg:max-w-[1200px]">
        <div className="flex flex-wrap lg:-mx-4">
          <div className="flex-col-auto w-full lg:w-[72%] lg:px-4">
            <div className="flex justify-between  mb-4">
              <h2 className="text-black text-lg lg:text-xl font-semibold">
                {t('DeliveryAddress')}
              </h2>
              <SelectAddressModal setCheckoutData={setCheckoutData} />
              {/* <button className="text-teal-500  text-xs lg:text-sm font-semibold underline leading-none tracking-wide">Change address</button> */}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 md:p-6 rounded border border-gray-200 bg-white flex  mb-4">
                <div className="flex-col-auto w-auto">
                  <div className="w-5 h-5 rounded-full border p-[2px] border-black">
                    <div className="w-full h-full bg-black rounded-full"></div>
                  </div>
                </div>

                <div className="flex-1 w-full ms-2 md:ms-3">
                  <h3 className="text-black text-base font-semibold mb-3">
                    {address?.name}
                    <span className="ms-2 px-1 py-0.5 bg-neutral-200 rounded inline-block text-stone-500 text-xs font-medium ">
                      {t('Work')}
                    </span>
                  </h3>

                  <p className=" text-neutral-500 text-sm font-normal leading-tight mb-4">
                    {address?.building}, {address?.area}, {address?.city},{" "}
                    {address?.country}
                  </p>
                  <p className="text-neutral-500 text-sm font-normal  leading-tight mb-2">
                  <span>{t('Mobile')} </span>:
                    <span className="text-black text-sm font-medium leading-tight">
                      &nbsp;{address?.phone_no}
                    </span>
                  </p>
                  <p className="text-neutral-500 text-sm font-normal  leading-tight">
                    {t('Email')} :
                    <span className="text-black text-sm font-medium leading-tight">
                      &nbsp;{address?.email}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-black  text-lg lg:text-xl  font-semibold mb-4">
              {t('PaymentMethods')}
            </h2>

            <RadioGroup
              defaultValue=""
              // value={values.gender}
              onValueChange={(value) => setPaymentMethod(value)}
            >
              {country==="SA"&&
              <Label
                htmlFor="card"
                className="p-3 lg:p-6  mb-0 rounded border border-gray-200 bg-white"
              >
                <div className="flex items-center space-x-3 w-full ">
                  <RadioGroupItem value="card" id="card" />
                  <div className="flex items-center w-full justify-between">
                    <p className="text-black text-sm lg:text-base font-semibold mb-1">
                      {t('CreditCard')}/{t('debitCard')}
                    </p>

                    <div className="justify-start items-start gap-1 inline-flex">
                      {payments?.map((item, i) => {
                        return (
                          <div key={i} className=" relative w-12 h-6">
                            <Image src={item?.img} className="" fill alt="" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {paymentMethod === "card" && (
                  <div
                    className={`${
                      paymentMethod === "card" ? "block" : "hidden"
                    }`}
                  >
                    <MoyasarPage data={checkoutData} />
                  </div>
                )}
              </Label>}
{country === "AE" &&
              <Label
                htmlFor="Network"
                className="flex items-center space-x-3 w-full p-3 lg:p-6  rounded border border-gray-200 bg-white"
              >
                <RadioGroupItem value="Network" id="Network" />
                <div className="flex items-center w-full justify-between">
                <p className="text-black text-sm lg:text-base font-semibold mb-1">
                      {t('CreditCard')}/{t('debitCard')}
                    </p>

                    <div className="justify-start items-start gap-1 inline-flex">
                      {payments?.map((item, i) => {
                        return (
                          <div key={i} className=" relative w-12 h-6">
                            <Image src={item?.img} className="" fill alt="" />
                          </div>
                        );
                      })}
                    </div>
                </div>
              </Label>
              }

              <Label
                htmlFor="tabby"
                className="flex items-center space-x-3 w-full p-3 lg:p-6  mb-0 rounded border border-gray-200 bg-white"
              >
                <RadioGroupItem value="tabby" id="tabby" />
                <div className="flex items-center w-full justify-between">
                  <div>
                    <h5 className="text-black text-sm lg:text-base font-semibold mb-1">
                      {" "}
                      Tabby – {t('SplitIn4NoFees')}
                    </h5>
                    <p className="text-[#9e9e9e] text-xs">
                      {" "}
                      {t('SplitYourPayment')}
                    </p>
                  </div>

                  <div className="aspect-[46/17] w-12 relative">
                    <Image
                      src={"/images/tabby_logo.png"}
                      fill
                      className="object-contain"
                      alt="tabby logo"
                    />
                  </div>
                </div>
              </Label>

              <Label
                htmlFor="tamara"
                className="flex items-center space-x-3 w-full p-3 lg:p-6  rounded border border-gray-200 bg-white"
              >
                <RadioGroupItem value="tamara" id="tamara" />
                <div className="flex items-center w-full justify-between">
                  <div>
                    <h5 className="text-black text-sm lg:text-base font-semibold mb-1">
                      {" "}
                      Tamara – {t('SplitIn4NoFees')}
                    </h5>
                    <p className="text-[#9e9e9e] text-xs">
                      {" "}
                      {t('SplitYourPayment')}
                    </p>
                  </div>

                  <div className="aspect-[46/17] w-12 relative">
                    <Image
                      src={"/images/tamara_logo.png"}
                      fill
                      className="object-contain"
                      alt="tamara logo"
                    />
                  </div>
                </div>
              </Label>

              <Label
                htmlFor="cod"
                className="flex items-center space-x-3 w-full p-3 lg:p-6  rounded border border-gray-200 bg-white"
              >
                <RadioGroupItem value="cod" id="cod" />
                <div className="flex items-center w-full justify-between">
                  <div>
                    <h5 className="text-black text-sm lg:text-base font-semibold mb-1">
                      {" "}
                      {t('CashOnDelivery')}
                    </h5>
                    <p className="text-[#9e9e9e] text-xs">
                      {" "}
                      {t('ExtraChargeApplicable')}  {currency}
                    </p>
                  </div>

                  <div className="text-2xl relative">
                    <PiMoney />
                  </div>
                </div>
              </Label>
            </RadioGroup>
          </div>
          <div className="flex-col-auto w-full lg:w-[28%] lg:px-4">
            <div className="mb-3">
              <CheckoutSummary data={checkoutData} isCod={paymentMethod==="cod"}/>
            </div>
            <div className="fixed lg:static bottom-0 left-0 w-full z-10 bg-white py-3 lg:py-0 px-4 lg:px-0 lg:shadow-none shadow-sm">
              {paymentMethod === "tabby" && (
                <button
                  href={`${checkoutData?.tabby_checkout_url}`}
                  onClick={() => handleTabbyCheckout()}
                  className="flex justify-center w-full btn btn-grad btn-lg lg:mb-3 "
                >
                  {t('PlaceOrderWith')}{" "}
                  <div className="aspect-[46/17] w-12 relative ms-2">
                    <Image
                      src={"/images/tabby_logo.png"}
                      fill
                      className="object-contain"
                      alt="tabby logo"
                    />
                  </div>
                </button>
              )}
              {paymentMethod === "tamara" && (
                <button
                  href={`${checkoutData?.tabby_checkout_url}`}
                  onClick={() => handleTamaraCheckout()}
                  className="flex justify-center w-full btn btn-grad btn-lg lg:mb-3 "
                >
                  {t('PlaceOrderWith')}{" "}
                  <div className="aspect-[46/17] w-12 relative ms-2">
                    <Image
                      src={"/images/tamara_logo.png"}
                      fill
                      className="object-contain"
                      alt="tamara logo"
                    />
                  </div>
                </button>
              )}
              {paymentMethod === "cod" && (
                <button
                  className="w-full btn btn-grad btn-lg lg:mb-3 "
                  onClick={handleCheckoutCod}
                >
                  {t('PlaceOrder')}
                </button>
              )}
              {paymentMethod === "Network" && country === "AE" && (
                <button
                  href={`${checkoutData?.tabby_checkout_url}`}
                  onClick={() => handleNgeniusCheckout()}
                  className="flex justify-center w-full btn btn-grad btn-lg lg:mb-3 "
                >
                  {t('PlaceOrderWith')}{" "}
                  {/* <div className="aspect-[46/17] w-12 relative ms-2">
                    <Image
                      src={"/images/tabby_logo.png"}
                      fill
                      className="object-contain"
                      alt="tabby logo"
                    />
                  </div> */}
                </button>
              )}
              {/* <button className="w-full btn btn-grad btn-lg lg:mb-3 ">
                Place Order
              </button> */}
            </div>
            <PaymetnIcons />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutWidget;

const payments = [
  {
    img: "/images/icon-visa.png",
  },
  {
    img: "/images/icon-master.png",
  },
];

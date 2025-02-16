// import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GET_COUPONS } from "@/constants/apiRoutes";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { IoWalletSharp } from "react-icons/io5";
import { BiSolidOffer } from "react-icons/bi";
import { useTranslations } from "next-intl";
import getCurrency from "@/hooks/getCurrency";
import { useSession } from "next-auth/react";
import { LoginModal } from "../LoginModal";
import { useRecoilState } from "recoil";
import { loginIsOpen } from "@/recoil/atoms";

export function CouponListing({}) {
  const t = useTranslations("Index");
  const session = useSession();
  const currency=getCurrency()
  const [isOpen, setIsOpen] = useState(false);
  const [isLogined, setIsLogined] = useState(false);
  const { data, error } = useSWR(`${GET_COUPONS}`);
    const [isLoginOpen, setIsLoginOpen] = useRecoilState(loginIsOpen);

  return (
    <>
    <Dialog
      open={isOpen}
      className="bg-red-400"
      onOpenChange={(open) => {
        if (session?.status === "authenticated") {
          setIsOpen(open);
          //   formik.resetForm();
        } else {
          setIsLogined(true);
          setIsLoginOpen(true);

        }
      }}
    >
      <DialogTrigger asChild>
        <button className="btn bg-white border btn-sm w-full mb-4 text-start flex items-center">
      <span className="me-2">
      <BiSolidOffer />
      </span>
       
          {t('ViewAvailableOffers')}
        </button>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-[500px] p-3 rounded-none lg:rounded-none lg:p-5 ">
        <DialogHeader>
          <h3 className="text-black text-xl font-semibold mb-3">
            {t('AvailableOffers')}
          </h3>
          <div>
            {data?.results?.coupons?.data?.map((item, i) => {
              return <CouponItem key={i} data={item} />;
            })}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    {isLogined && !isLoginOpen && <LoginModal />}
    </>
  );
}

const CouponItem = ({ data }) => {
  const t = useTranslations("Index");
  const [copied, setCopied] = useState(false);
  const currency=getCurrency()
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data?.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className="border-2 border-[#e2e5f1] rounded-lg overflow-hidden mb-2">
      <div className="py-2 px-4 border-b-[1.5px] border-[#e2e5f1] bg-[#eff9ec] text-[#38ae04] text-sm font-semibold flex items-center">
        <span className="mr-2">
          <IoWalletSharp />
        </span>
        {data?.code}
      </div>
      <div>
        <div className="pt-2 px-4 pb-3  text-start">
          {/* <h5 className="text-sm font-semibold">{t('ExtraOff')} </h5> */}
          <p className="text-xs opacity-60">
            {t('onOrdersAbove')} {data?.minimum_shopping} {currency} {t('and')} {t('discountUpto')}{" "}
            {data?.maximum_discount} {currency}
          </p>
        </div>
        <div className="px-4 pb-3 flex justify-between items-end">
          <div className="px-3 py-2 font-semibold title-sm rounded-md text-[#38ae04] border border-[#38ae04] border-dashed  after:border-r after:border-[#38ae04]  after:border-dashed inline-block relative after:absolute after:content-[''] after:w-4 after:h-4 after:bg-white after:block after:-translate-x-1/2 after:-translate-y-1/2  after:top-1/2 after:left-0 after:rounded-full before:border-l before:border-[#38ae04]  before:border-dashed  before:absolute before:content-[''] before:w-4 before:h-4 before:bg-white before:block before:translate-x-1/2 before:-translate-y-1/2  before:top-1/2 before:right-0 before:rounded-full">
            {data?.code}
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleCopy}>
            {copied ? `${t('Copied')}!` : `${t("Copy")}`}
          </button>
        </div>
      </div>
    </div>
  );
};

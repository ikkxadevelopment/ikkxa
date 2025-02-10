import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BsSuitcaseLg } from "react-icons/bs";
import EnquireForm from ".";

export function EnquireModal({ data }) {
  const t = useTranslations("Index");
  const [isOpen, setIsOpen] = useState();
  return (
    <>
      <button
        className="justify-start items-center gap-5  inline-flex"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-[63.54px] h-[63.54px] relative rounded-full border-2 text-2xl border-neutral-200 flex items-center justify-center">
          <BsSuitcaseLg />
        </div>
        <div className="relative">
          <div className=" text-black text-sm    text-left">
            {t("B2BHelpcenter")}
          </div>
        </div>
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className=" rounded-1">
          <div className="px-4 py-5">
          <h2 className="text-sm font-semibold text-[#d29e82] mb-1">
            {t('ContactUs')}
          </h2>
          <h3 className="text-xl lg:text-2xl font-semibold  mb-4">
             {t('LovetoHere')}
          </h3>
       
            <EnquireForm />
          </div>
          {/* // } */}
        </DialogContent>
      </Dialog>
    </>
  );
}

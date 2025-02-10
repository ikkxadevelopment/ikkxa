import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useOrderItem } from "./useOrderItem";

export function OrderReturnModal({data}) {
  const t = useTranslations("Index");
  const { returnResponse,setIsOpen, isOpen, } = useOrderItem()

  return (
    <>
      <button className="text-teal-500 text-sm font-semibold inline-block underline leading-none tracking-wide text-nowrap" onClick={() => setIsOpen(true)}>
              {t('Return')}
            </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className=" rounded-1">
              <div className="">
                  <div className="">
                    <div className="mb-8">
                        <h3 className="text-black text-2xl font-semibold mb-1">
                          {t('ReturnOrder')} #{data?.order_code}
                        </h3>
                        <p className="text-zinc-500 text-base">
                          {t('AreYouSureYouWantToReturnThisOrder')}?
                        </p>
                    </div>
                    <div className="space-y-4">
                      <button className="btn btn-lg btn-primary w-full" onClick={() => setIsOpen(false)} >
                        {t('Cancel')}
                      </button>
                      <button className="btn btn-lg btn-primary w-full" onClick={()=>returnResponse(data?.id)} >
                        {t('Confirm')}
                      </button>
                    </div>
                  </div>
              </div>
          {/* // } */}
        </DialogContent>
      </Dialog>
    </>
  );
}

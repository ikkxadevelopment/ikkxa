import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useOrderItem } from "./useOrderItem";

export function OrderCancelModal({data}) {
  const t = useTranslations("Index");
  const { cancelResponse,setIsOpen, isOpen, } = useOrderItem()

  return (
    <>
      <button className="text-teal-500 text-sm font-semibold inline-block underline leading-none tracking-wide text-nowrap" onClick={() => setIsOpen(true)}>
                {t('CancelItem')} 
            </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className=" rounded-1">
              <div className="px-4 py-5">
                  <div className="">
                    <div className="mb-8">
                        <h3 className="text-black text-2xl font-semibold mb-1">
                          {t('CancelOrder')} #{data?.order_code}
                        </h3>
                        <p className="text-zinc-500 text-base">
                          {t('AreYouSureYouWantToCancelThisOrder')}?
                        </p>
                    </div>
                    <div className=" grid grid-cols-2 gap-3">
                      <button className="btn btn-lg btn-light w-full" onClick={() => setIsOpen(false)} >
                        {t('Cancel')}
                      </button>
                      <button className="btn btn-lg btn-grad w-full" onClick={()=>cancelResponse(data?.id)} >
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

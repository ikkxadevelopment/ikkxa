import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useAddressItem } from "./useAddressItem";
  
  export function AddressRemoveModal({data}) {
    const t = useTranslations("Index");
    const { removeHandler, isOpen, setIsOpen } = useAddressItem()
  
    return (
      <>
       <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setIsOpen(true)}>
       {t("Remove")}
              </button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="rounded-1">
                <div className="">
                    <div className="">
                      <div className="mb-8">
                          <h3 className="text-black text-2xl font-semibold mb-1">
                            Remove Address
                          </h3>
                          <p className="text-zinc-500 text-base">
                            Are you Sure, you want to Remove this address?
                          </p>
                      </div>
                      <div className="flex items-center">
                        <button className="btn btn-lg btn-outline-primary w-full" onClick={() => setIsOpen(false)} >
                          Cancel
                        </button>
                        <button className="btn btn-lg btn-primary w-full" onClick={()=>removeHandler(data?.id)} >
                          Confirm
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
  
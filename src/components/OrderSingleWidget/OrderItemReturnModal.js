import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useOrderItemCancelModal } from "./useOrderItemCancelModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
  
  export function OrderItemReturnModal({data, orderId, invNo}) {
    const t = useTranslations("Index");
    const { setIsOpen, isOpen, handleReturn, formikReturn } = useOrderItemCancelModal(data?.id, orderId, invNo)
    
    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger >
              <button className="text-teal-500 text-sm font-semibold inline-block underline leading-none tracking-wide text-nowrap" onClick={() => setIsOpen(true)}>
                  Return item 
              </button>
          </DialogTrigger>
          <DialogContent className=" rounded-1">
                <div className="">
                    <div className="">
                      <div className="mb-8">
                          <h3 className="text-black text-2xl font-semibold mb-1">
                            Return Item #{data?.product_name}
                          </h3>
                          <p className="text-zinc-500 text-base">
                            Are you Sure you want to Return this item?
                          </p>
                          <Label htmlFor="email" className="mb-0 mt-4">Add Return Reason</Label>
                          <Input
                            type="text"
                            id="return_reason"
                            value={formikReturn.values.return_reason || ""}
                            // value={`${data?.data?.email}`}
                            placeholder="Enter Return Reason"
                            onChange={(e) =>
                                handleReturn(e.target.value)
                            }
                          />
                          {formikReturn.touched.return_reason && formikReturn.errors.return_reason && (
                            <div className="text-red-600">{formikReturn.errors.return_reason}</div>
                          )}
                      </div>
                      <div className="space-y-4">
                        <button className="btn btn-lg btn-primary w-full" onClick={() => setIsOpen(false)} >
                          Cancel
                        </button>
                        {/* <button className="btn btn-lg btn-primary w-full" onClick={()=>cancelResponse(data?.id, orderId, invNo)} > */}
                        <button className="btn btn-lg btn-primary w-full" onClick={()=>formikReturn.handleSubmit()} >
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
  
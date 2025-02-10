import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useOrderItemCancelModal } from "./useOrderItemCancelModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
  
  export function OrderItemCancelModal({data, orderId, invNo}) {
    const t = useTranslations("Index");
    const { setIsOpen, isOpen, handleCancel, handleRemark, formik } = useOrderItemCancelModal(data?.id, orderId, invNo)

    const cancelReasons = [
      "Ordered Wrong Size",
      "Found a Better Price Elsewhere",
      "Changed My Mind",
      "Delay in Delivery",
    ];
    
    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger >
              <button className="text-teal-500 text-sm font-semibold inline-block underline leading-none tracking-wide text-nowrap" onClick={() => setIsOpen(true)}>
                  Cancel item 
              </button>
          </DialogTrigger>
          <DialogContent className=" rounded-1">
                <div className="">
                    <div className="">
                      <div className="mb-8 p-3 lg:p-4">
                          <h3 className="text-black text-2xl font-semibold mb-3">
                            Cancel Item #{data?.product_name}
                          </h3>
                          <p className="text-zinc-500 text-base mb-5 lg:mb-6">
                            Are you Sure you want to cancel this order?
                          </p>
                          <Label htmlFor="" className="mb-0 mt-4">Add Remark</Label>
                          <Input
                            type="text"
                            id="remark"
                            value={formik.values.remark || ""}
                            // value={`${data?.data?.email}`}
                            placeholder="Enter Remark here"
                            onChange={(e) =>
                              handleRemark(e.target.value)
                            }
                          />
                          {formik.touched.remark && formik.errors.remark && (
                            <div className="text-red-600">{formik.errors.remark}</div>
                          )}
                          <Label htmlFor="" className="mb-0 mt-4">Add Reason</Label>
                          {/* <Input
                            type="text"
                            id="cancel_reason"
                            value={formik.values.cancel_reason || ""}
                            // value={`${data?.data?.email}`}
                            placeholder="Enter Cancel Reason"
                            onChange={(e) =>
                              handleCancel(e.target.value)
                            }
                          /> */}

                          <Select
                            onValueChange={(e) => handleCancel(e)}
                            className="p-0"
                          >
                            <SelectTrigger >
                              <SelectValue placeholder="Select Cancel Reason" />
                            </SelectTrigger>
                            <SelectContent>
                              {cancelReasons?.map((option, i) => (
                                <SelectItem
                                  key={i}
                                  value={option}
                                  >
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {formik.touched.cancel_reason && formik.errors.cancel_reason && (
                            <div className="text-red-600">{formik.errors.cancel_reason}</div>
                          )}
                      </div>
                      <div className="grid grid-cols-2">
                        <button className="btn btn-lg btn-light w-full" onClick={() => setIsOpen(false)} >
                          Cancel
                        </button>
                        {/* <button className="btn btn-lg btn-primary w-full" onClick={()=>cancelResponse(data?.id, orderId, invNo)} > */}
                        <button className="btn btn-lg btn-grad w-full" onClick={()=>formik.handleSubmit()} >

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
  
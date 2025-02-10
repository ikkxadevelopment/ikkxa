"use client";
import Image from "@/components/Image/image";
import { CiLocationOn } from "react-icons/ci";
const OrderPending = ({address}) => {
  return (
    <section className="min-h-screen lg:min-h-[500px] py-12  flex items-center">
      <div className="container">
        <div className="aspect-[200/157] relative max-w-56 lg:max-w-64 mx-auto mb-6">
          <Image
            src={"/images/op_img.svg"}
            sizes="50vw"
            fill
            className="object-contain"
            alt={"no items in cart"}
          />
        </div>
        <div className="">
          <h3 className="text-center text-black text-xl lg:text-3xl font-semibold   mb-3 ">
          Order being placed..
          </h3>
          <p className="text-center text-zinc-500 text-sm  lg:text-lg leading-tight mb-7">
          Your order being placed right now.
          Please wait
          </p>

         

          <div className="p-4 md:p-6 rounded border border-gray-200 bg-white flex space-x-2 md:space-x-3  mt-4 max-w-[500px] mx-auto">
                <div className="flex-col-auto w-auto">
              <span className="text-2xl">
              <CiLocationOn />
              </span>
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-black text-base font-semibold mb-3">
                    {address?.name}
                    <span className="ms-2 px-1 py-0.5 bg-neutral-200 rounded inline-block text-stone-500 text-xs font-medium ">
                      Work
                    </span>
                  </h3>

                  <p className=" text-neutral-500 text-sm font-normal leading-tight mb-4">
                    {address?.building}, {address?.area}, {address?.city}, {address?.country}
                  </p>
                  <p className="text-neutral-500 text-sm font-normal  leading-tight mb-2">
                  <span>{t('Mobile')} </span>:
                    <span className="text-black text-sm font-medium leading-tight">
                      &nbsp;{address?.phone_no}
                    </span>
                  </p>
                  <p className="text-neutral-500 text-sm font-normal  leading-tight">
                    email :
                    <span className="text-black text-sm font-medium leading-tight">
                      &nbsp;{address?.email}
                    </span>
                  </p>
                </div>
              </div>
        </div>
      </div>
    </section>
  );
};

export default OrderPending;

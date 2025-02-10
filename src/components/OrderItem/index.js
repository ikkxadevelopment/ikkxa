import { Link } from "@/i18n/routing";
import Image from "../Image/image";
import { OrderCancelModal } from "./orderCancelModal";
import { OrderReturnModal } from "./orderReturnModal";
import { useOrderItem } from "./useOrderItem";
import { useTranslations } from "next-intl";

export default function OrderItem({ data }) {
  const t = useTranslations("Index");
  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return <span className="status pending text-[#f3ac30]">{t('Pending')}</span>;
      case "on_the_way":
        return <span className="status pending">{t('OnTheWay')}</span>;
      case "shipped":
        return <span className="status shipped">{t('Shipped')}</span>;
      case "delivered":
        return (
          <span className="status delivered text-[#38ae04]">{t('Delivered')}</span>
        );
        case "confirm":
        return (
          <span className="status delivered text-[#38ae04]">Confirmed</span>
        );
      case "canceled":
        return <span className="status cancelled text-[#dc2f2f]">{t('Cancelled')}</span>;
        case "picked_up":
          return <span className="status cancelled text-[#2f60dc]">{t('Returned')}</span>;
      case "return_requested":
        
        return <span className="status cancelled">{t('ReturnRequested')}</span>;
      default:
        return <span className="status unknown">{t('UnknownStatus')}</span>;
    }
  };



  return (
    <div className="relative">
      {data?.delivery_status === "delivered" ? (
        <div className="absolute top-4 right-4">
          <OrderReturnModal data={data} />
        </div>
      ) : data?.delivery_status !== "canceled" &&
        data?.delivery_status !== "return_requested" ? (
        <div className="absolute top-4 right-4">
          <OrderCancelModal data={data} />
        </div>
      ) : null}

      <Link
        href={`/orders/${data?.order_code}`}
        className="block w-full mb-4 p-4 rounded border border-neutral-200"
      >
        <span className="px-2 py-1 bg-zinc-100 rounded-sm text-black text-xs font-medium inline-block">
          {t('ORDERID')}: #{data?.order_code}
        </span>

        <div className="flex  space-x-3 ">
          {/*   <div className="flex-col-auto w-auto">
            <Link href={`/products/${data?.product?.slug}`} className="block aspect-[490/625] w-[90px]  relative">
              <Image
                src={data?.product?.image_190x230}
                fill
                className="object-cover"
                alt={data?.product?.product_name}
              />
            </Link> 
          </div>*/}
          <div className=" flex-1 w-full">
            <div className="flex space-x-3 items-end  h-full">
              <div className="flex-1 flex flex-col justify-between w-full">
                <div>
                  <h3 className=" text-stone-950 text-sm font-normal  leading-tight mb-2">
                    {data?.product?.product_name}
                  </h3>
                  <p className=" mb-2">
                    <span className="text-stone-950 text-base">
                      {" "}
                      {data?.no_of_items} {t('itemsInThisOrder')}
                    </span>
                  </p>
                  {/* <p className=" mb-2">
                    <span className="text-stone-950 text-sm">Qty: </span>
                    <span className="text-stone-950 text-sm font-semibold">
                      {data?.no_of_items}
                    </span>
                  </p> */}
                  <div className="items-center justify-between  flex mt-4">
                    {/* <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full me-2" /> */}
                    <div className=" text-zinc-600 text-xs font-medium leading-relaxed">
                      {t('OrderedOn')} : {data?.date}
                    </div>
                    <p className="text-xs">
                      {renderStatus(data?.delivery_status)}

                      {console.log(data?.delivery_status,"data?.delivery_status")}
                    </p>
                  </div>
                </div>
              </div>
              {/* <div>
                <button 
                  className=" text-teal-500 text-sm font-semibold inline-block underline leading-none tracking-wide text-nowrap"
                  onClick={()=>cancelResponse(data?.id)}
                >
                  Cancel item
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

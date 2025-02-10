import getCurrency from "@/hooks/getCurrency";
import { useTranslations } from "next-intl";

export default function CheckoutSummary({ data, isCod }) {
  const t = useTranslations("Index");
  const currency = getCurrency();
  return (
    <div className="p-6 bg-stone-50 md:rounded border border-gray-200 ">
      <h4 className=" text-black text-lg font-semibold mb-3">{t('OrderSummary')}</h4>
      {/* position: fixed;
    z-index: 1;
    background: #fff;
    top: 0;
    z-index: 11111111;
    left: 0;
    padding: 18px 16px;
    border-bottom: 1px solid #eee; */}

      <div className="py-5 border-t border-b">
        <div className="flex justify-between mb-2">
          <p className="text-black text-sm">
            {t('Subtotal')} ({data?.total_order_quantity} {t('items')})
          </p>
          <p className="text-black text-sm ">
            {" "}
            {data?.sub_total} {currency}
          </p>
        </div>


        <div className="flex justify-between mb-2">
          <p className="text-black text-sm">{t('Discount')}</p>
          <p className="text-sm text-[#00b553]">
            {" "}
            -{data?.discount} {currency}
          </p>
        </div>
        {data?.ikkxa_discount>0&&
        <div className="flex justify-between mb-2">
          <p className="text-black text-sm">IKKXA {t('Discount')}</p>
          <p className="text-sm text-[#00b553]">
            {" "}
            -{data?.ikkxa_discount} {currency}
          </p>
        </div>
}
      
        
        <div className="flex justify-between mb-2">
          <p className="text-black text-sm">{t('ShippingCharge')}</p>
          <p className="text-black text-sm ">
            {data?.shipping_cost === 0 ? (
              <span className="text-sm text-[#00b553]">{t("FREE")}</span>
            ) : (
              <span>
                {data?.shipping_cost} {currency}
              </span>
            )}
          </p>
        </div>

        <div className="flex justify-between mb-2">
          <p className="text-black text-sm">{t("VATInclusive")}</p>
          <p className="text-black text-sm ">
            {" "}
            {data?.total_tax} {currency}
          </p>
        </div>

        {isCod && (
          <div className="flex justify-between ">
            <p className="text-black text-sm">{t('Charge')}</p>
            <p className="text-black text-sm ">
              {" "}
              {data?.plus_cod_charge} {currency}
            </p>
          </div>
        )}
        {/* coupon_discount */}
      </div>
      <div className="flex justify-between pt-4 ">
        <p className="text-black text-base font-semibold">{t('Total')}</p>
        <p className="text-black text-base font-semibold">
          {" "}
          {isCod?(data?.total_payable+data?.plus_cod_charge):data?.total_payable} {currency}
        </p>
      </div>

      {/* {data?.formatted_shipping_cost !== "0" && (
        <div className="px-3 py-2 bg-green-100 rounded-sm border text-emerald-500 text-xs font-semibold">
          Get free shipping for purchases over 500 SAR!
        </div>
      )} */}
    </div>
  );
}

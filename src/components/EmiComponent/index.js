import { useTranslations } from "next-intl";
import Image from "../Image/image";

export default function EmiComponent({type, price}) {
  const t = useTranslations("Index");
  return (
    <>
    {type==="tabby"?
    <div className="px-3 py-4 rounded-sm border border-emerald-400 text-black text-xs mb-5 relative">
    <div className="aspect-[46/17] w-11 absolute top-0 left-3 -translate-y-1/2">
      <Image src={"/images/tabby_logo.png"} fill className="object-contain" alt="tabby logo" />
    </div>
    {t('tabyEmiTitle')} {price/4}.{t('LearnMore')}
  </div>:<div className="px-3 py-4 rounded-sm border border-red-400  text-black text-xs mb-5 relative">
    <div className="aspect-[46/17] w-11 absolute top-0 left-3 -translate-y-1/2">
      <Image src={"/images/tamara_logo.png"} fill className="object-contain" alt="tamara logo" />
    </div>
    {t('tabyEmiTitle')} {price/4}.{t('LearnMore')}
  </div>}
    </>
   

  
  );
}

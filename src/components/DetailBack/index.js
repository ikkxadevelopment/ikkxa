import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import { BsBag } from "react-icons/bs";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { LangSwitcher } from "../Header/LangSwitcher";

export default function DetailBack({ route }) {
  const lang = useLocale();
  const [locale, country] = lang.split("-");
  return (
    <div className=" w-full fixed top-0 left-0 py-[14px]  z-[49] block md:hidden">
      <div className="container items-center gap-3.5 flex justify-between">
        <Link
          href={route}
          className="text-2xl w-9 h-9 rounded-full bg-white flex items-center justify-center"
        >
     {locale==="ar"?<MdArrowForward />:<MdArrowBack />}
        </Link>
        <div className="flex space-x-2 ">
        <LangSwitcher/>
        
        <Link
          href={"/cart"}
          className="text-xl w-9 h-9 rounded-full bg-white flex items-center justify-center"
        >
          <BsBag />
        </Link>
        </div>
        {/* <div className="text-black text-xl font-semibold leading-relaxed  ">
        </div> */}
      </div>
    </div>
  );
}

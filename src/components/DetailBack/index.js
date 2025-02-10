import { Link } from "@/i18n/routing";
import Image from "next/image";
import { BsBag } from "react-icons/bs";
import { MdArrowBack } from "react-icons/md";

export default function DetailBack({ route }) {
  return (
    <div className=" w-full fixed top-0 left-0 py-[14px]  z-[49] block md:hidden">
      <div className="container items-center gap-3.5 flex justify-between">
        <Link
          href={route}
          className="text-2xl w-9 h-9 rounded-full bg-white flex items-center justify-center"
        >
          <MdArrowBack />
        </Link>
        <Link
          href={"/cart"}
          className="text-xl w-9 h-9 rounded-full bg-white flex items-center justify-center"
        >
          <BsBag />
        </Link>
        {/* <div className="text-black text-xl font-semibold leading-relaxed  ">
        </div> */}
      </div>
    </div>
  );
}

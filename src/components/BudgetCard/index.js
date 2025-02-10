import { Link } from "@/i18n/routing";
import Image from "../Image/image";

export default function BudgetCard({ data }) {
  return (
    <Link
      className="block p-5 lg:px-11  lg:py-9 bg-gradient-to-br from-stone-200 to-amber-100 rounded-md border border-amber-200"
      href={`${data?.url}`}
      // href={{
      //     pathname: `/categories/jalabiyas`,
      //     query: { priceMax: 325,priceMin: 2 },
      //   }}
    >
      <p className="text-black text-2xl md:text-4xl font-black uppercase md:leading-10 mb-2 md:mb-3 ">
        {data?.title}
      </p>
      <p className="text-orange-400  md:text-base font-semibold mb-3 lg:mb-5">
        {data?.sub_tile}
      </p>

      <span className="inline-block px-5 md:px-7 py-2 md:py-3.5 bg-white rounded text-black text-sm font-semibold">
        {data?.button}
      </span>
    </Link>
  );
}

import { Link } from "@/i18n/routing";
import Image from "../Image/image";

export default function CategoryCard({ data }) {
    return (
        <Link className="block" href={`/categories/${data?.slug}`}>
            <div className='aspect-1/1 relative bg-slate-50 overflow-hidden rounded-full'>
                <Image src={data?.popular_image} fill className="object-cover" alt={`${data?.title} image`} />
            </div>
            <div className='pt-2'>
                <p className='text-xs md:text-sm text-center line-clamp-2 font-semibold'>{data?.title}</p>
            </div>
        </Link>
    )
}
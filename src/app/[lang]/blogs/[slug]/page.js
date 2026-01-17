// import { getSingleMedia } from "@/lib/getPages";
import DetailWidget from "@/widgets/DetailWidget";
import { notFound } from "next/navigation";


export default async function LeaderSinglePage({ params: { slug, lang } }) {
    return (
        <main>
            <DetailWidget />
            Blog page
        </main>
    )
}


import {  getCms } from "@/lib/getHome";
import ContentPage from "@/widgets/ContentPage";
import { notFound } from "next/navigation";

export default async function CmsPage({ params: { cms, lang } }) {
    const [locale, country] = lang.split('-');
    const data = await getCms(cms, locale, country);
    console.log(data,"datadata");
    if (!data){
        notFound()
    }
    return (
        <main className="">
           <ContentPage data={data?.results?.page}/>
        </main>
    );
}
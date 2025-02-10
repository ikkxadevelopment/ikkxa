
import {  getCms } from "@/lib/getHome";
import ContentPage from "@/widgets/ContentPage";

export default async function CmsPage({ params: { cms, lang } }) {
    const [locale, country] = lang.split('-');
    const data = await getCms(cms, locale, country);
    return (
        <main className="">
           <ContentPage data={data?.results?.page}/>
        </main>
    );
}
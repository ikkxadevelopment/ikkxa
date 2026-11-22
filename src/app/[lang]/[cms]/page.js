import { cache } from "react";
import { getCms } from "@/lib/getHome";
import { htmlExcerpt, pageAlternates, SITE_URL } from "@/lib/seo";
import ContentPage from "@/widgets/ContentPage";
import { notFound } from "next/navigation";

// generateMetadata and the page both need the CMS page; fetch it once per request.
const loadCms = cache((cms, locale, country) => getCms(cms, locale, country));

// Some CMS "pages" are JSON data feeds for the app (e.g. store-list), not
// content. They must not be indexed.
const isDataPage = (content) => typeof content === "string" && /^\s*[\[{]/.test(content);

export async function generateMetadata({ params: { cms, lang } }) {
    const [locale, country] = lang.split("-");
    const page = (await loadCms(cms, locale, country))?.results?.page;
    if (!page) return {};

    const title = page.meta_title || (page.title ? `${page.title} | IKKXA` : "IKKXA");
    const description =
        page.meta_description ||
        (isDataPage(page.content) ? "" : htmlExcerpt(page.content)) ||
        undefined;

    return {
        title,
        description,
        metadataBase: new URL(SITE_URL),
        alternates: pageAlternates(lang, `/${cms}`),
        openGraph: { title, description, url: `${SITE_URL}/${lang}/${cms}` },
        robots: { index: !isDataPage(page.content), follow: true },
    };
}

export default async function CmsPage({ params: { cms, lang } }) {
    const [locale, country] = lang.split("-");
    const data = await loadCms(cms, locale, country);
    if (!data) {
        notFound();
    }
    return (
        <main className="">
           <ContentPage data={data?.results?.page}/>
        </main>
    );
}

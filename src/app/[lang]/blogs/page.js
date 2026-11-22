import BlogListing from "@/widgets/BlogListing";
import { pageAlternates, SITE_URL } from "@/lib/seo";

const COPY = {
    en: {
        title: "Blog | Abaya & Modest Fashion Style Guides - IKKXA",
        description:
            "Style tips, abaya and jalabiya guides, and the latest modest fashion trends from IKKXA.",
    },
    ar: {
        title: "المدونة | نصائح وأفكار لتنسيق العبايات والجلابيات - IKKXA",
        description:
            "نصائح الأناقة وأدلة اختيار العبايات والجلابيات وأحدث صيحات الأزياء المحتشمة من IKKXA.",
    },
};

export async function generateMetadata({ params: { lang } }) {
    const { title, description } = COPY[lang.split("-")[0]] || COPY.en;
    return {
        title,
        description,
        metadataBase: new URL(SITE_URL),
        alternates: pageAlternates(lang, "/blogs"),
        openGraph: { title, description, url: `${SITE_URL}/${lang}/blogs` },
        robots: { index: true, follow: true },
    };
}

export default async function BlogsPage() {
    return (
        <main className="min-h-screen pt-20">
           <BlogListing/>
        </main>
    )
}

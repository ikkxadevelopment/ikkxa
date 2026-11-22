import { getMetaData } from "@/lib/getHome";
import Products from "@/widgets/Products";
import { humanizeSlug } from "@/lib/seo";


export async function generateMetadata({ params: { lang, category } }) {
  const country = lang.split("-")[1];
  const seoData = await getMetaData(`${lang}/categories/${category}`);
  return {
    // Never fall back to the raw slug ("kids-party-wears") as the title.
    title: seoData?.message?.tittle || `${humanizeSlug(category)} | IKKXA`,
    description: seoData?.message ? seoData?.message?.desc : "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
    metadataBase: new URL('https://www.ikkxa.com'),
    alternates: {
      canonical:
        seoData?.message?.canonical_url ||
        `https://www.ikkxa.com/${lang}/categories/${category}`,
      languages: {
        [`en-${country}`]: `/en-${country}/categories/${category}`,
        [`ar-${country}`]: `/ar-${country}/categories/${category}`,
        "x-default": `/en-${country}/categories/${category}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}



export default async function CategorySingle({ params: { lang, category } }) {
  // Same fetch as generateMetadata — deduped by Next's fetch cache within the
  // request, so this does not cost a second network round-trip.
  const seoData = await getMetaData(`${lang}/categories/${category}`);
  const msg = seoData?.message || {};

  // SSR H1 — indexable, unique per category × locale (DEV-08).
  const heading = msg.h1 || msg.tittle || humanizeSlug(category);

  // 150–300-word intro copy. Prefer an authored rich-text/body field from the
  // SEO tool; fall back to the meta description so the block is never empty.
  const introHtml = msg.content || msg.intro || msg.long_description || "";
  const introText = introHtml ? "" : msg.desc || "";

  return (
    <main className="min-h-screen pt-[60px] lg:pt-20">
      <div className="container pt-4 mb-3">
        {heading ? (
          <h1 className="text-xl lg:text-2xl font-semibold">{heading}</h1>
        ) : null}
        {introHtml ? (
          <div
            className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 [&_a]:underline [&_p]:mb-2"
            dangerouslySetInnerHTML={{ __html: introHtml }}
          />
        ) : introText ? (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
            {introText}
          </p>
        ) : null}
      </div>
      <Products slug={category} />
    </main>
  );
}

import { getMetaData } from "@/lib/getHome";
import Products from "@/widgets/Products";

// Turn a slug ("open-abaya") into a readable heading ("Open Abaya") as a
// last-resort fallback when the SEO API has no authored title for the category.
function humanizeSlug(slug) {
  if (!slug || typeof slug !== "string") return "";
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export async function generateMetadata({ params: { lang, category } }) {
  const country = lang.split("-")[1];
  const seoData = await getMetaData(`${lang}/categories/${category}`);
  return {
    title: `${seoData?.message?.tittle ? seoData?.message?.tittle : category}`,
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

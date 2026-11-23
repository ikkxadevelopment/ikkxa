import { getCategoryProducts, getMetaData } from "@/lib/getHome";
import Products from "@/widgets/Products";
import { humanizeSlug, SITE_URL } from "@/lib/seo";

// Category title/description: the SEO tool's values when they are real
// (e.g. UAE Abayas had just "abayas"; many reuse one generic description),
// otherwise a descriptive, localized fallback.
const GENERIC_DESC = /search for jalabiyas, abayas/i;
function categorySeo(msg, category, lang) {
  const [locale, country] = lang.split("-");
  const name = humanizeSlug(category);
  const ar = locale === "ar";
  const region = ar ? (country === "AE" ? "الإمارات" : "السعودية") : country === "AE" ? "the UAE" : "Saudi Arabia";
  const delivery = ar
    ? country === "AE" ? "توصيل إلى دبي وأبوظبي وجميع الإمارات" : "توصيل إلى جميع مدن السعودية"
    : country === "AE" ? "Dubai & Abu Dhabi Delivery" : "Fast Delivery Across KSA";
  const tooShort = !msg?.tittle || msg.tittle.replace(/\s*[|-]\s*IKKXA\s*$/i, "").trim().length < 12;
  const title = tooShort
    ? ar ? `${name} أونلاين في ${region} | ${delivery} | IKKXA` : `${name} Online in ${region} | ${delivery} | IKKXA`
    : msg.tittle;
  const desc = msg?.desc && !GENERIC_DESC.test(msg.desc) && msg.desc.trim().length >= 50 ? msg.desc : null;
  const description =
    desc ||
    (ar
      ? `تسوقي ${name} من IKKXA في ${region}: أحدث التصاميم بأسعار مميزة، ${delivery} واستبدال سهل.`
      : `Shop ${name} at IKKXA in ${region}: the latest styles at great prices, with ${delivery.toLowerCase()} and easy exchanges.`);
  return { title, description };
}

const pageNumber = (searchParams) => Math.max(1, parseInt(searchParams?.page, 10) || 1);


export async function generateMetadata({ params: { lang, category }, searchParams }) {
  const page = pageNumber(searchParams);
  const country = lang.split("-")[1];
  const seoData = await getMetaData(`${lang}/categories/${category}`);
  const { title, description } = categorySeo(seoData?.message, category, lang);
  return {
    title: `${title}${page > 1 ? ` - ${lang.startsWith("ar") ? "صفحة" : "Page"} ${page}` : ""}`,
    description,
    metadataBase: new URL('https://www.ikkxa.com'),
    alternates: {
      canonical:
        // Each ?page=N is its own canonical page (it lists different products).
        page > 1
          ? `${SITE_URL}/${lang}/categories/${category}?page=${page}`
          : seoData?.message?.canonical_url || `${SITE_URL}/${lang}/categories/${category}`,
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



export default async function CategorySingle({ params: { lang, category }, searchParams }) {
  const [locale, country] = lang.split("-");
  const page = pageNumber(searchParams);
  // Filtered/sorted views are client-only (and disallowed in robots.txt);
  // only the default listing is server-rendered.
  const hasFilters = ["sort", "priceMin", "priceMax", "product_category", "sub_category", "type"].some(
    (k) => searchParams?.[k] !== undefined
  );
  const initialData = hasFilters
    ? undefined
    : await getCategoryProducts({ slug: category, lang: locale, country, page });
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

  const base = `${SITE_URL}/${lang}`;
  const listUrl = `${base}/categories/${category}${page > 1 ? `?page=${page}` : ""}`;
  const listed = initialData?.results?.products?.data || [];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: base },
        { "@type": "ListItem", position: 2, name: heading, item: `${base}/categories/${category}` },
      ],
    },
    ...(listed.length
      ? [{
          "@context": "https://schema.org",
          "@type": "ItemList",
          url: listUrl,
          numberOfItems: initialData?.results?.products?.total ?? listed.length,
          itemListElement: listed.map((p, i) => ({
            "@type": "ListItem",
            position: (page - 1) * 24 + i + 1,
            url: `${base}/products/${p?.slug}`,
            name: p?.product_name,
          })),
        }]
      : []),
  ];

  return (
    <main className="min-h-screen pt-[60px] lg:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
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
      <Products
        slug={category}
        initialData={initialData}
        initialPage={hasFilters ? 1 : page}
        basePath={`/${lang}/categories/${category}`}
      />
    </main>
  );
}

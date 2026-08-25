import { getTagProducts } from "@/lib/getHome";
import { getTagArchive, MIN_TAG_PRODUCTS } from "@/config/tagArchives";
import Products from "@/widgets/Products";
import Script from "next/script";
import { notFound } from "next/navigation";

// A tag archive is indexable only if it is on the curated allowlist AND has
// enough products — the DEV-00 guardrail (no backend indexable flag exists).
function isIndexable(archive, total) {
  return archive.allowlisted && (total ?? 0) >= MIN_TAG_PRODUCTS;
}

export async function generateMetadata({ params: { lang, tag } }) {
  const [locale, country] = lang.split("-");
  const archive = getTagArchive(tag);
  const data = await getTagProducts({ tag, lang: locale, country, paginate: 1 });
  const total = data?.results?.products?.total ?? 0;
  const index = isIndexable(archive, total);

  return {
    title: archive.title,
    description: archive.description,
    metadataBase: new URL("https://www.ikkxa.com"),
    alternates: {
      canonical: `https://www.ikkxa.com/${lang}/collections/${tag}`,
      languages: {
        [`en-${country}`]: `/en-${country}/collections/${tag}`,
        [`ar-${country}`]: `/ar-${country}/collections/${tag}`,
        "x-default": `/en-${country}/collections/${tag}`,
      },
    },
    robots: { index, follow: true },
  };
}

export default async function TagArchivePage({ params: { lang, tag } }) {
  const [locale, country] = lang.split("-");
  const archive = getTagArchive(tag);
  const data = await getTagProducts({ tag, lang: locale, country, paginate: 24 });
  const products = data?.results?.products?.data || [];
  const total = data?.results?.products?.total ?? 0;

  // Empty tag → 404 rather than a thin, empty archive.
  if (total === 0) return notFound();

  const base = `https://www.ikkxa.com/${lang}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      {
        "@type": "ListItem",
        position: 2,
        name: archive.name,
        item: `${base}/collections/${tag}`,
      },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: archive.name,
    url: `${base}/collections/${tag}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: products.slice(0, 24).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${base}/products/${p?.slug}`,
        name: p?.product_name,
      })),
    },
  };

  return (
    <main className="min-h-screen pt-[60px] lg:pt-20">
      <Script
        id="tag-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="tag-collection-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />

      <div className="container pt-4 mb-3">
        <h1 className="text-xl lg:text-2xl font-semibold">{archive.name}</h1>
        {archive.introHtml ? (
          <div
            className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 [&_a]:underline [&_p]:mb-2"
            dangerouslySetInnerHTML={{ __html: archive.introHtml }}
          />
        ) : (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
            {archive.description}
          </p>
        )}
      </div>

      <Products slug={tag} />
    </main>
  );
}

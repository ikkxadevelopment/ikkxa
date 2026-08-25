import { TAG_ARCHIVES, getTagArchive } from "@/config/tagArchives";
import { Link } from "@/i18n/routing";

export async function generateMetadata({ params: { lang } }) {
  const [locale, country] = lang.split("-");
  return {
    title: "Shop by Collection | IKKXA",
    description:
      "Browse IKKXA collections — abayas, jalabiyas and more, curated by style.",
    metadataBase: new URL("https://www.ikkxa.com"),
    alternates: {
      canonical: `https://www.ikkxa.com/${lang}/collections`,
      languages: {
        [`en-${country}`]: `/en-${country}/collections`,
        [`ar-${country}`]: `/ar-${country}/collections`,
        "x-default": `/en-${country}/collections`,
      },
    },
    robots: { index: true, follow: true },
  };
}

// Taxonomy hub (DEV-00 / DEV-10) — SSR list of every curated, indexable tag
// archive so crawlers and shoppers can reach them from one place.
export default function CollectionsHub() {
  const slugs = Object.keys(TAG_ARCHIVES);

  return (
    <main className="min-h-screen pt-[60px] lg:pt-20">
      <div className="container py-6">
        <h1 className="text-xl lg:text-2xl font-semibold mb-4">
          Shop by Collection
        </h1>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {slugs.map((slug) => {
            const archive = getTagArchive(slug);
            return (
              <li key={slug}>
                <Link
                  href={`/collections/${slug}`}
                  className="block rounded border px-4 py-3 text-sm hover:bg-slate-50"
                >
                  {archive.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

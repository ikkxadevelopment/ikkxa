// DEV-00 tag archives — curation + guardrail.
//
// There is no backend tag-meta endpoint, so this file IS the taxonomy: the
// allowlist of tags that are allowed to render an *indexable* archive page,
// with optional per-tag SEO overrides. Any tag not listed here still renders
// (so links never break) but is served `noindex` — this is the guardrail that
// stops SKUs, brand terms, misspellings and thin tags from spawning indexable
// pages.
//
// `slug` (the URL segment) is also the value sent as `?tag=` to
// filtered_products, so it must match what the backend matches tags against.
// Verify each slug returns a sensible, filtered product set before adding it.

// Minimum products a tag must have to be indexable (uses listing `total`).
export const MIN_TAG_PRODUCTS = 3;

// Curated, indexable tag archives.
// key = URL slug / ?tag= value.  Fields are optional — omit to derive from slug.
export const TAG_ARCHIVES = {
  "black-abaya": {
    name: "Black Abaya",
    title: "Black Abayas | Shop the Collection - IKKXA",
    description:
      "Shop premium black abayas at IKKXA — everyday, occasion and modern cuts. Free returns across the GCC.",
  },
  "open-abaya": { name: "Open Abaya" },
  "embroidered-abaya": { name: "Embroidered Abaya" },
  "jalabiya": { name: "Jalabiya" },
  "floral": { name: "Floral" },
  "eid-collection": { name: "Eid Collection" },
};

// Humanize a slug ("open-abaya") into a display name ("Open Abaya").
export function humanizeTag(slug) {
  if (!slug || typeof slug !== "string") return "";
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// Resolve the curated entry (or a derived fallback) for a tag slug.
export function getTagArchive(slug) {
  const entry = TAG_ARCHIVES[slug] || {};
  const name = entry.name || humanizeTag(slug);
  return {
    slug,
    name,
    allowlisted: Object.prototype.hasOwnProperty.call(TAG_ARCHIVES, slug),
    title: entry.title || `${name} | Shop Online - IKKXA`,
    description:
      entry.description ||
      `Shop ${name} at IKKXA. Discover the latest ${name} styles with fast delivery across Saudi Arabia and the UAE.`,
    introHtml: entry.introHtml || "",
  };
}

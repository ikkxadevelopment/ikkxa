// Shared SEO helpers for generateMetadata. www.ikkxa.com is the indexed host:
// canonicals and hreflang always point there, whichever host serves the page.
export const SITE_URL = "https://www.ikkxa.com";

// canonical + hreflang for a path under a locale, e.g. pageAlternates("ar-SA", "/about").
// hreflang stays within the same country, matching the product/category pages.
export function pageAlternates(lang, path = "") {
  const country = lang.split("-")[1];
  return {
    canonical: `${SITE_URL}/${lang}${path}`,
    languages: {
      [`en-${country}`]: `/en-${country}${path}`,
      [`ar-${country}`]: `/ar-${country}${path}`,
      "x-default": `/en-${country}${path}`,
    },
  };
}

// Plain-text excerpt of CMS HTML, cut on a word boundary, for meta descriptions.
export function htmlExcerpt(html, max = 155) {
  if (!html || typeof html !== "string") return "";
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : max)}…`;
}

// "kids-party-wears" → "Kids Party Wears", for titles that would otherwise be a raw slug.
export function humanizeSlug(slug) {
  if (!slug || typeof slug !== "string") return "";
  return decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

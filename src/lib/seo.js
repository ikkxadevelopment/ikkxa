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

const ARABIC = /[؀-ۿ]/;
export const hasArabic = (s) => typeof s === "string" && ARABIC.test(s);

// Is a backend-authored meta string usable for this locale? Arabic pages need
// Arabic text; English pages must not get Arabic. Too-short strings are useless.
const fitsLocale = (s, locale, min) =>
  typeof s === "string" &&
  s.trim().length >= min &&
  (locale === "ar" ? hasArabic(s) : !hasArabic(s));

// Product code (IK1725, AIK6032, CJ1061...) from the name or, failing that, the slug.
const productCode = (name, slug) => {
  const re = /\b(A?IK|CJ)[-\s]?\d{3,5}\b/i;
  const m = (name || "").match(re) || (slug || "").replace(/-/g, " ").match(re);
  return m ? m[0].replace(/[-\s]/, "").toUpperCase() : "";
};

// Title + description for a product page, per audit tasks 4–6:
// localized, descriptive, unique (name + code), never empty.
export function productSeo(product, locale, country) {
  const lp = product?.language_product || {};
  let name = (lp.name || product?.product_name || "").replace(/\s+/g, " ").trim();
  const code = productCode(name, product?.slug);
  // Names like "Jalabiya" are shared by hundreds of products: add the code.
  if (code && !name.toUpperCase().includes(code)) name = `${name} ${code}`;
  if (name.length < 20 && product?.category_title && !name.includes(product.category_title)) {
    name = `${name} - ${product.category_title}`;
  }

  // meta_title in the backend is often English on Arabic pages, or belongs to
  // another product entirely; only trust it when it fits the locale and names
  // this product's code.
  const metaTitle = lp.meta_title;
  const metaOk = fitsLocale(metaTitle, locale, 20) && (!code || metaTitle.toUpperCase().includes(code));
  const title = metaOk ? metaTitle : `${name} | IKKXA`;

  const price = product?.discount_percentage ?? product?.price;
  const currency = country === "AE" ? (locale === "ar" ? "درهم" : "AED") : (locale === "ar" ? "ريال" : "SAR");
  const region =
    locale === "ar" ? (country === "AE" ? "الإمارات" : "السعودية") : country === "AE" ? "the UAE" : "Saudi Arabia";
  const generated =
    locale === "ar"
      ? `تسوقي ${name} من IKKXA${price ? ` بسعر ${price} ${currency}` : ""}. توصيل سريع في ${region} واستبدال سهل.`
      : `Shop ${name} at IKKXA${price ? ` for ${currency} ${price}` : ""}. Fast delivery across ${region} and easy exchanges.`;
  const description = fitsLocale(lp.meta_description, locale, 70) ? lp.meta_description : generated;

  return { title, description, name };
}

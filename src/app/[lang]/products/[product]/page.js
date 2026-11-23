import { getSingleProduct } from "@/lib/getHome";
import ProductDetail from "@/widgets/ProductDetail";
import { notFound } from "next/navigation";
import { htmlExcerpt, productSeo, SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params: { product, lang } }) {
  const [locale, country] = lang.split("-");
  const data = await getSingleProduct(product, locale, country);
  if (!data?.results?.product) return {};
  const meta = data?.results?.product;
  const meta_base = data?.results?.product?.language_product;
  const openGraphImage = data?.results?.product?.product_meta_image
    ? [
      {
        url: data?.results?.product?.product_meta_image,
        alt: meta_base?.name,
      },
    ]
    : [];
  const canonicalUrl = `${SITE_URL}/${locale}-${country}/products/${meta?.slug}`;
  const { title, description } = productSeo(meta, locale, country);
  return {
    title,
    description,
    // keywords: data?.results?.product?.product_meta_keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [`en-${country}`]: `/en-${country}/products/${meta?.slug}`,
        [`ar-${country}`]: `/ar-${country}/products/${meta?.slug}`,
        "x-default": `/en-${country}/products/${meta?.slug}`,
      },
    },
    metadataBase: new URL('https://www.ikkxa.com'),

    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      images: openGraphImage,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: meta?.product_meta_image ? [{ url: meta.product_meta_image, alt: meta_base?.name }] : [],
    },
  };
}

export default async function ProductDetailPage({ params: { product, lang } }) {
  const [locale, country] = lang.split("-");

  const data = await getSingleProduct(product, locale, country);
  const productData = data?.results?.product;
  if (!productData) return notFound();
  const isOutOfStock = Array.isArray(productData.stock)
    ? productData.stock.every((item) => item.current_stock === 0)
    : false;

  // API field `discount_percentage` holds the discounted selling price
  // (mapped to `disPrice` in useProductDetail); `price` is the regular price.
  const sellingPrice = productData?.discount_percentage ?? productData?.price;
  const seo = productSeo(productData, locale, country);
  const base = `${SITE_URL}/${locale}-${country}`;
  const url = `${base}/products/${productData?.slug}`;

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: seo.name,
    image: productData?.gallery?.large,
    // short_description is usually empty; fall back so Product has a description.
    description:
      htmlExcerpt(productData?.short_description, 500) ||
      htmlExcerpt(productData?.language_product?.description, 500) ||
      seo.description,
    sku: productData?.product_stock?.sku,
    brand: {
      "@type": "Brand",
      name: "IKKXA",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: country === "AE" ? "AED" : "SAR",
      price: sellingPrice,
      priceValidUntil: productData?.special_discount_end,
      itemCondition: "https://schema.org/NewCondition",
      availability: `https://schema.org/${isOutOfStock ? "OutOfStock" : "InStock"}`,
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: base },
      ...(productData?.category_slug
        ? [{
            "@type": "ListItem",
            position: 2,
            name: productData.category_title || productData.category_slug,
            item: `${base}/categories/${productData.category_slug}`,
          }]
        : []),
      {
        "@type": "ListItem",
        position: productData?.category_slug ? 3 : 2,
        name: seo.name,
        item: url,
      },
    ],
  };

  return (
    <>
      <main className="min-h-screen  pt-[58px] md:pt-20">
        {/* Plain <script> so the JSON-LD is in the server HTML; next/script
            injects it only after hydration. */}
        <script
          id="structuredData"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <script
          id="breadcrumbData"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c") }}
        />
        <ProductDetail data={data} isOutOfStock={isOutOfStock} />
      </main>
    </>
  );
}

import { getSingleProduct } from "@/lib/getHome";
import ProductDetail from "@/widgets/ProductDetail";
import { notFound } from "next/navigation";
import { htmlExcerpt } from "@/lib/seo";

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
        alt: meta_base?.meta_title,
      },
    ]
    : [];
  const canonicalUrl = `https://www.ikkxa.com/${locale}-${country}/products/${meta?.slug}`;
  return {
    title: meta_base?.meta_title || data?.results?.product?.language_product?.name,
    description: meta_base?.meta_description || data?.results?.product?.short_description,
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
      images: openGraphImage,
      title: meta_base?.meta_title,
      description: meta_base?.meta_description,
      // url: header_url,
    },
    twitter: {
      card: "summary_large_image",
      title: meta_base?.meta_title,
      description: meta_base?.meta_description,
      images: {
        url: data?.results?.product?.product_meta_image,
        alt: meta_base?.meta_title,
      },
    },
  };
}

export default async function ProductDetailPage({ params: { product, lang } }) {
  const [locale, country] = lang.split("-");

  const data = await getSingleProduct(product, locale, country);
  const isOutOfStock = data?.results?.product?.stock.every(item => item.current_stock === 0);

  const productData = data?.results?.product;
  // API field `discount_percentage` holds the discounted selling price
  // (mapped to `disPrice` in useProductDetail); `price` is the regular price.
  const sellingPrice = productData?.discount_percentage ?? productData?.price;

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: productData?.language_product?.name,
    image: productData?.gallery?.large,
    // short_description is usually empty; fall back so Product has a description.
    description:
      htmlExcerpt(productData?.short_description, 500) ||
      productData?.language_product?.meta_description ||
      htmlExcerpt(productData?.language_product?.description, 500) ||
      productData?.language_product?.name,
    sku: productData?.product_stock?.sku,
    brand: {
      "@type": "Brand",
      name: "IKKXA",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.ikkxa.com/${locale}-${country}/products/${productData?.slug}`,
      priceCurrency: country === "AE" ? "AED" : "SAR",
      price: sellingPrice,
      priceValidUntil: productData?.special_discount_end,
      itemCondition: "https://schema.org/NewCondition",
      availability: `https://schema.org/${isOutOfStock ? "OutOfStock" : "InStock"}`,
    },
  };

  if (!data) return notFound();
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
        <ProductDetail data={data} isOutOfStock={isOutOfStock} />
      </main>
    </>
  );
}

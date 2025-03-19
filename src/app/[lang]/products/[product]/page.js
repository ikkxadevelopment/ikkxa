import { getSingleProduct } from "@/lib/getHome";
import ProductDetail from "@/widgets/ProductDetail";
import Head from "next/head";
import { notFound } from "next/navigation";
import Script from "next/script";

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
  const canonicalUrl = `https://ikkxa.com/en-SA/products/${meta?.slug}`;
  return {
    title: meta_base?.meta_title,
    description: meta_base?.meta_description,
    // keywords: data?.results?.product?.product_meta_keywords,
    alternates: {
      canonical: canonicalUrl,
    },
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
      card: meta_base?.meta_title,
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

  // const structuredData = {
  //   "@context": "https://schema.org/",
  //   "@type": "Product",
  //   name:  data?.results?.product?.language_product?.name,
  //   image: data?.results?.product?.gallery?.large,
  //   description:data?.results?.product?.short_description,
  //   sku: data?.results?.product?.product_stock?.sku,
  //   brand: {
  //     "@type": "Brand",
  //     name: "IKKXA",
  //   },
  //   offers: {
  //     "@type": "Offer",
  //     url: `https://ikkxa.com/${locale}-${country}/products/${data?.results?.product?.slug}`,
  //     priceCurrency: "SAR",
  //     price: data?.results?.product?.stock[0]?.product?.discount_percentage,
  //     priceValidUntil: data?.results?.product?.special_discount_end,
  //     itemCondition: "https://schema.org/NewCondition",
  //     availability: `https://schema.org/${isOutOfStock?"OutOfStock":"InStock"}`,
  //   },
  // };
  
  if (!data) return notFound();
  return (
    <>
      {/* <Head>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head> */}
      <main className="min-h-screen  pt-[58px] md:pt-20">
      {/* <Script
      id="structuredData"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        /> */}
        <ProductDetail data={data}  isOutOfStock={isOutOfStock}/>
      </main>
    </>
  );
}

import WidgetBlocks from "@/components/WidgetBlocks";
import { getCategories, getHomeProducts, getMetaData } from "@/lib/getHome";
import BannerSlider from "@/widgets/BannerSlider";
import BudgetWidget from "@/widgets/BudgetWidget";
import CategoriesSlider from "@/widgets/CategoriesSlider";
import OfferBanner from "@/widgets/OfferBanner";
import OfferCategoriesSlider from "@/widgets/OfferCategoriesSlider";
import ProductsSlider from "@/widgets/ProductsSlider";

// export async function generateMetadata() {
//   return {
//     title: "Home",
//     description:
//       "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
//     robots: {
//       index: true,
//       follow: true,
//     },
//   };
// }

export async function generateMetadata({ params: { lang } }) {
  const [locale, country] = lang.split("-");
  const seoData = await getMetaData(lang);
  console.log(seoData,"countrycountrycountry");
  let seoTitle 
  if(country==="SA") {
    seoTitle="Premium Abayas, Jalabiyas & Partywear Online | Shop Now - IKKXA"
  }

  if(country==="AE") {
    seoTitle="Premium Abayas, Jalabiyas & Partywear Online | Shop Now - IKKXA"
  }

  return {
    title: seoData?.message?.tittle || "Premium Abayas, Jalabiyas & Partywear Online | Shop Now - IKKXA",
    description:
      seoData?.message?.desc ||
      "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
    alternates: {
      canonical:
        seoData?.message?.canonical_url || `https://ikkxa.com/${lang}`,
    },
    openGraph: {
      images: seoData?.message?.image || [],
      title: seoData?.message?.tittle || "Premium Abayas, Jalabiyas & Partywear Online | Shop Now - IKKXA",
      description:
        seoData?.message?.desc ||
        "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
    },
    twitter: {
      card: seoData?.message?.tittle,
      title: seoData?.message?.tittle,
      description: seoData?.message?.desc,
      images: {
        url: seoData?.message?.image || "",
        alt: seoData?.message?.tittle,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Home({ params: { lang } }) {
  // const categories  =  await getCategories()
  const [locale, country] = lang.split("-");
  const products = await getHomeProducts(locale, country);

  return (
    <main className="min-h-screen pt-[58px] lg:pt-[70px]">
      {/* <OfferCategoriesSlider/> */}
      {/* <OfferCategoriesSlider/>
      <BannerSlider/>
      <CategoriesSlider data={""}/> */}
      {/* <ProductsSlider data={products?.components["flash_products-4"]} flashSale={true} /> */}
      {/* <OfferBanner/>
      <ProductsSlider />
      <BudgetWidget/> */}
      <WidgetBlocks widgets={products?.results?.components} />
      {/* <OfferBanner/> */}
    </main>
  );
}

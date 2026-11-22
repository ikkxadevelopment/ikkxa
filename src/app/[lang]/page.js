import WidgetBlocks from "@/components/WidgetBlocks";
import { getHomeProducts, getMetaData } from "@/lib/getHome";
import { SITE_URL } from "@/lib/seo";

const HOME_COPY = {
  SA: {
    en: {
      h1: "Abayas, Jalabiyas & Occasion Wear in Saudi Arabia",
      description:
        "Shop abayas, jalabiyas, party wear and kids' fashion at IKKXA, with fast delivery across Saudi Arabia, easy exchanges and Tabby instalments.",
    },
    ar: {
      h1: "عبايات وجلابيات وفساتين مناسبات في السعودية",
      description:
        "تسوقي العبايات والجلابيات وفساتين السهرة وأزياء الأطفال من IKKXA مع توصيل سريع في جميع أنحاء السعودية واستبدال سهل والتقسيط مع تابي.",
    },
  },
  AE: {
    en: {
      h1: "Abayas, Jalabiyas & Occasion Wear in the UAE",
      description:
        "Shop abayas, jalabiyas, party wear and kids' fashion at IKKXA, with fast delivery across Dubai, Abu Dhabi and the UAE, easy exchanges and Tabby instalments.",
    },
    ar: {
      h1: "عبايات وجلابيات وفساتين مناسبات في الإمارات",
      description:
        "تسوقي العبايات والجلابيات وفساتين السهرة وأزياء الأطفال من IKKXA مع توصيل سريع في دبي وأبوظبي وجميع أنحاء الإمارات واستبدال سهل والتقسيط مع تابي.",
    },
  },
};

const homeCopy = (lang) => {
  const [locale, country] = lang.split("-");
  return (HOME_COPY[country] || HOME_COPY.SA)[locale] || HOME_COPY.SA.en;
};

export async function generateMetadata({ params: { lang } }) {
  const seoData = await getMetaData(lang);
  const msg = seoData?.message || {};
  const copy = homeCopy(lang);
  const title = msg.tittle || "Premium Abayas, Jalabiyas & Partywear Online | Shop Now - IKKXA";
  // The SEO tool's description currently repeats the title; only use it when
  // it actually says something more.
  const description = msg.desc && msg.desc.trim() !== title.trim() ? msg.desc : copy.description;
  const image = msg.image || undefined;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: msg.canonical_url || `${SITE_URL}/${lang}`,
      languages: {
        "en-SA": `/en-SA`,
        "ar-SA": `/ar-SA`,
        "en-AE": `/en-AE`,
        "ar-AE": `/ar-AE`,
        "x-default": `/en-SA`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${lang}`,
      siteName: "IKKXA",
      images: image ? [image] : [],
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [{ url: image, alt: title }] : [],
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
      {/* The banner slider is the visual headline; this is its text equivalent. */}
      <h1 className="sr-only">{homeCopy(lang).h1}</h1>
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

import { getSearchProducts } from "@/lib/getHome";
import Products from "@/widgets/Products";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({ params: { searchParams } }) {
    const searchTerm = searchParams?.q || '';
  const canonicalUrl = searchTerm?`https://www.ikkxa.com/en-SA/search?q=${encodeURIComponent(searchTerm)}`:`https://www.ikkxa.com/en-SA/search`;
  return {
    title: "Online Shopping in GCC",
    description:
      "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({ params: { term } }) {
  // if (!term) return notFound();
  // const termToUse = decodeURI(term)

  // const data = await getSearchProducts(termToUse)

  return (
    <main className="min-h-screen  pt-[60px] lg:pt-20">
      {/* <h1>Welcome to Search :{termToUse}</h1> */}
      <Products />
    </main>
  );
}

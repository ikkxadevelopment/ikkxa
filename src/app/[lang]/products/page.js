
import Products from "@/widgets/Products";

export async function generateMetadata() {
  return {
    title: "All Products | Online Shopping in GCC",
    description:
      "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
    // alternates: {
    //   canonical: canonicalUrl,
    // },
    robots: {
      index: false,
      follow: true,
    },
  };
}




export default async function ProductsPage() {
    return (
        <main className="min-h-screen  pt-[60px] lg:pt-20">
            <Products />
        </main>
    );
}


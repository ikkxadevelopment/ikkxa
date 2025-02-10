import Products from "@/widgets/Products";


export async function generateMetadata({ params: { category } }) {
  return {
    title: `${category}`,
    description:
      "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
    robots: {
      index: true,
      follow: true,
    },
  };
}



export default async function CategorySingle({ params: { category } }) {
  return (
    <main className="min-h-screen pt-[60px] lg:pt-20">
      <Products slug={category} />
    </main>
  );
}


import CategoriesWidget from "@/components/CategoriesWidget";
import { getAllCategories, getMetaData } from "@/lib/getHome";


export async function generateMetadata({params: {lang}}) {
  const seoData = await getMetaData(`${lang}/categories`);
  console.log(seoData,"seoDataseoData");
  
    return {
      title: "Categories | IKKXA",
      description:
        "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
        
      robots: {
        index: true,
        follow: true,
      },
    };
  }
  

export default async function ProductsPage({params: {lang}}) {
    const [locale, country] = lang.split('-');
    const data = await getAllCategories(locale, country);
    return (
        <main className="py-16 lg:pt-[70px]">
           <CategoriesWidget data={data}/>
        </main>
    );
}
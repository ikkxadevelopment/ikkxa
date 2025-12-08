import { getGlobal, getStoreDetail } from "@/lib/getHome";
import ContactAddress from "@/widgets/ContactAddress";
import ContactBanner from "@/widgets/ContactBanner";
import ContactForm from "@/widgets/ContactForm";
import PartnersWidget from "@/widgets/PartnersWidget";
export async function generateMetadata() {
    return {
      title: "Contact Us",
      description:
        "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
      robots: {
        index: true,
        follow: true,
      },
    };
  }
  
  

export default async function ContactPage({params: {lang}}) {
  const [locale, country] = lang.split('-');
  // const data = await getGlobal(locale, country);
  // const dataAddress = await getStoreDetail(locale, country);
    return (
        <main  className=" pt-[60px] lg:pt-20">
          <PartnersWidget/>
        </main>
    )
}

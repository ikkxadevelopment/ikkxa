import { getGlobal, getStoreDetail } from "@/lib/getHome";
import ContactAddress from "@/widgets/ContactAddress";
import ContactBanner from "@/widgets/ContactBanner";
import ContactForm from "@/widgets/ContactForm";
import { pageAlternates, SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params: { lang } }) {
    const isAr = lang.startsWith("ar");
    return {
      title: isAr ? "اتصل بنا | IKKXA" : "Contact Us | IKKXA",
      description: isAr
        ? "تواصلي مع فريق IKKXA بخصوص الطلبات والتوصيل والاستبدال، أو زوري أحد متاجرنا."
        : "Get in touch with the IKKXA team about orders, delivery and exchanges, or visit one of our stores.",
      metadataBase: new URL(SITE_URL),
      alternates: pageAlternates(lang, "/contact-us"),
      robots: {
        index: true,
        follow: true,
      },
    };
  }
  
  

export default async function ContactPage({params: {lang}}) {
  const [locale, country] = lang.split('-');
  const data = await getGlobal(locale, country);
  const dataAddress = await getStoreDetail(locale, country);
    return (
        <main  className="min-h-screen  pt-[60px] lg:pt-20">
           {/* <ContactForm/> */}
            <ContactBanner data={data}/>
            <ContactAddress data={dataAddress}/>
           
        </main>
    )
}

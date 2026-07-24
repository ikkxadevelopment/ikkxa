import SocialWidget from "@/widgets/SocialWidget";
import { getSocialData } from "@/lib/getHome";

export async function generateMetadata() {
  return {
    title: "Social | IKKXA Community",
    description: "Join the IKKXA community. Share your style with #IKKXA and get featured.",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SocialPage({ params: { lang } }) {
  const [locale, country] = lang.split("-");
  const res = await getSocialData(locale, country);
  return (
    <main className="min-h-screen pt-[58px] lg:pt-[70px]">
      <SocialWidget data={res?.data ?? null} />
    </main>
  );
}

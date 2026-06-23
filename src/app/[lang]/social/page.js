import SocialWidget from "@/widgets/SocialWidget";

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

async function getSocialData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}system-data-app`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export default async function SocialPage() {
  const data = await getSocialData();
  return (
    <main className="min-h-screen pt-[58px] lg:pt-[70px]">
      <SocialWidget data={data} />
    </main>
  );
}

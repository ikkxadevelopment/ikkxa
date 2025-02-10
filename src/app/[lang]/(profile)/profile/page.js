import ProfileWidget from "@/components/ProfileWidget"

export async function generateMetadata() {
  return {
    title: "Profile",
    description:
      "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
    robots: {
      index: false,
      follow: true,
    },
  };
}



export default function ProfilePage() {
    return (
        <section>
<ProfileWidget/>
        </section>
    )
}

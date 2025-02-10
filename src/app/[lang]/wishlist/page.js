import WishlistWidget from "@/widgets/WishlistWidget";

export async function generateMetadata() {
  return {
    title: "Your Wishlist - Save Your Favorite Items for Later",
    description:
      "Explore your wishlist to view the products you love. Save and organize items for future purchases with ease.",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function WishlistPage() {
  return (
    <main className="pt-[72px]">
      <WishlistWidget />
    </main>
  );
}

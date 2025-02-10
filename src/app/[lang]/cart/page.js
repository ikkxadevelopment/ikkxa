import CartWidget from "@/widgets/CartWidget";

export async function generateMetadata() {
    return {
      title: "Your Shopping Cart - Review and Proceed to Checkout",
      description: "View the items in your shopping cart and ensure everything is perfect before proceeding to checkout. Make your shopping experience seamless.",
      robots: {
        index: false, 
        follow: true,
      },
    };
  }

export default function CartPage() {
    return (
        <main  className="min-h-screen pt-20">
            <CartWidget />
        </main>
    )
}

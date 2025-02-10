import CheckoutWidget from "@/widgets/CheckoutWidget";

export async function generateMetadata() {
    return {
      title: "Secure Checkout - Complete Your Purchase",
      description: "Finalize your order with our secure checkout process. Review your cart, apply discounts, and choose a payment method to complete your purchase.",
      robots: {
        index: false, 
        follow: false,
      },
    };
  }
  
export default function CartPage() {
    return (
        <main  className="min-h-screen pt-14 lg:pt-20">
            <CheckoutWidget/>
        </main>
    )
}

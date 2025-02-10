import CheckoutWidget from "@/widgets/CheckoutWidget";


export async function generateMetadata() {
    return {
      title: "Order Cancelled",
      description:
        "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  
  

export default function OrderCancelPage() {
    return (
        <main  className="min-h-screen pt-14 lg:pt-20">
            <CheckoutWidget/>
        </main>
    )
}

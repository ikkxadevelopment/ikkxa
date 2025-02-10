import OrderSuccess from "@/widgets/CheckoutWidget/OrderSuccess";


export async function generateMetadata() {
    return {
      title: "Order success",
      description:
        "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  
  

export default function OrderSuccessPage() {
    return (
        <main  className="min-h-screen pt-14 lg:pt-20">
            <OrderSuccess address={""}/>
        </main>
    )
}

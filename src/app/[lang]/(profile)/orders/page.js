import OrdersWidget from "@/components/OrdersWidget";

export async function generateMetadata() {
    return {
      title: "Orders",
      description:
        "Search for Jalabiyas, abayas, lehengas, baby products and more on ikkxa",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
  
  

export default function OrderPage() {
    return (
        <main>
            <OrdersWidget/>
        </main>
    )
}

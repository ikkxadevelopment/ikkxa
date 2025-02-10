import OrderSingleWidget from "@/components/OrderSingleWidget";



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
  
  

export default function Page({params:{orderId}}) {

    return (
        <main>
            <OrderSingleWidget slug={orderId}/>
        </main>
    )
}


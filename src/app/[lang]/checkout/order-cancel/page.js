import TabbyRedirectMessage from "@/widgets/CheckoutWidget/TabbyRedirectMessage";

export async function generateMetadata() {
    return {
        title: "Order Cancelled",
        description: "Your Tabby payment was cancelled.",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default function OrderCancelPage() {
    return (
        <main className="min-h-screen pt-14 lg:pt-20">
            <TabbyRedirectMessage type="cancel" />
        </main>
    );
}

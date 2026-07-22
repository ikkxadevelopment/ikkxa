import TabbyRedirectMessage from "@/widgets/CheckoutWidget/TabbyRedirectMessage";

export async function generateMetadata() {
    return {
        title: "Payment Failed",
        description: "Your Tabby payment could not be completed.",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default function OrderFailurePage() {
    return (
        <main className="min-h-screen pt-14 lg:pt-20">
            <TabbyRedirectMessage type="failure" />
        </main>
    );
}

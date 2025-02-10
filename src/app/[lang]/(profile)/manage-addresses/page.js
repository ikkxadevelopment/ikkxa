import { Suspense } from "react";
import AddressWidget from "@/components/AddressWidget";

export async function generateMetadata() {
  return {
    title: "Manage Your Addresses - Add, Edit, or Remove Locations",
    description: "Keep your delivery information up-to-date. Add, edit, or delete saved addresses for faster and more convenient checkouts.",
    robots: {
      index: false, 
      follow: true,
    },
  };
}

export default function ManagePayment() {
  return (
    <main>
      {/* <Suspense fallback={<p>Loading addresses...</p>}> */}
        <AddressWidget />
      {/* </Suspense> */}
    </main>
  );
}

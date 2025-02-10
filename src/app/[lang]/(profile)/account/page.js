import AccountResponsive from "@/widgets/AccountResponsive";


export async function generateMetadata() {
  return {
    title: "Your Profile - Manage Your Account Details",
    description: "Access and update your personal information, preferences, and order history from your profile page. Stay in control of your account.",
    robots: {
      index: false, 
      follow: true,
    },
  };
}

export default function ProfilePage() {
  return (
    <section>
      <AccountResponsive />
    </section>
  );
}

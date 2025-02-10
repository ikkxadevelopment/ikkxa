"use client";
import SidebarAccount from "@/components/AccountLayout/SidebarAccount";
import { usePathname } from "next/navigation";
import { PiUserList } from "react-icons/pi";
import { PiBoxArrowDown } from "react-icons/pi";
import { PiNoteDuotone } from "react-icons/pi";
import { PiSignOutFill } from "react-icons/pi";

const AccountResponsive = ({ }) => {
  const pathname = usePathname();

  return (
    <main className={`min-h-screen  bg-white lg:bg-stone-50`}>
      <SidebarAccount path={pathname} data={links} />
    </main>
  );
};

export default AccountResponsive;

const links = [
  {
    url: "/profile",
    title: "Profile",
    title_sm: "Profile",
    isActive: true,
    icon: <PiUserList />,
  },
  {
    url: "/orders",
    title: "Orders",
    title_sm: "Orders",
    icon: <PiBoxArrowDown />,
  },
  {
    url: "/manage-addresses",
    title: "Address",
    title_sm: "Addresses",
    icon: <PiNoteDuotone />,
  },
];

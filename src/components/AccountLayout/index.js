"use client";
import { usePathname } from "next/navigation";
import SidebarAccount from "./SidebarAccount";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PiUserList } from "react-icons/pi";
import { PiBoxArrowDown } from "react-icons/pi";
import { PiNoteDuotone } from "react-icons/pi";
import { PiSignOutFill } from "react-icons/pi";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

const AccountLayout = ({ children }) => {
  const t = useTranslations("Index");
  const pathname = usePathname();

  return (
    <main className={`min-h-screen pt-20 bg-white md:bg-stone-50`}>
      <div className="container ">
        <Breadcrumb className="mb-8 hidden lg:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{t('MyProfile')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className=" w-full max-w-5xl mx-auto ">
          <div className="flex col-span-12">
            <div className="flex-col-auto w-[280px] hidden me-5 lg:block">
              <SidebarAccount path={pathname} data={links} />
            </div>
            <div className="flex-1 flex flex-col w-full">
                {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountLayout;

const links = [
  {
    url: "/profile",
    title: "Profile",
    title_sm: "Profile",
    isActive: true,
    icon: <PiUserList />
  },
  {
    url: "/orders",
    title: "Orders",
    title_sm: "Orders",
    icon: <PiBoxArrowDown />
  },
  {
    url: "/manage-addresses",
    title: "Addresses",
    title_sm: "Addresses",
    icon: <PiNoteDuotone />
  },
];

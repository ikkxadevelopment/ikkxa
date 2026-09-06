"use client";
import { useRouter as useIntlRouter } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ProductDetail from "@/widgets/ProductDetail";
import useTabbyPopupScroll, { isInsideTabbyPopup } from "@/hooks/useTabbyPopup";

export default function ProductModal({ data, isOutOfStock }) {
  const router = useRouter(); // for back() on user-driven dismiss
  const intlRouter = useIntlRouter(); // locale-aware push for in-drawer links
  const [open, setOpen] = useState(true);

  // Tabby renders its popup into <body>, outside this drawer's portal.
  useTabbyPopupScroll();

  // Close the drawer first, then navigate once vaul's close animation has run,
  // so the body scroll-lock is released before the route changes.
  const handleNavigate = (href) => {
    setOpen(false);
    setTimeout(() => intlRouter.push(href), 300);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        // Fires only on user-driven close (overlay/escape/drag).
        if (!o) {
          setOpen(false);
          router.back();
        }
      }}
      shouldScaleBackground={false}
    >
      <DrawerContent
        className="h-[95vh] overflow-y-auto overflow-x-hidden p-0"
        onInteractOutside={(event) => {
          // The Tabby popup lives on <body>, so clicking it counts as an
          // interaction outside the drawer — keep the drawer open instead.
          if (isInsideTabbyPopup(event.detail?.originalEvent?.target)) {
            event.preventDefault();
          }
        }}
      >
        <ProductDetail
          data={data}
          isOutOfStock={isOutOfStock}
          onNavigate={handleNavigate}
        />
      </DrawerContent>
    </Drawer>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ProductDetail from "@/widgets/ProductDetail";

export default function ProductModal({ data, isOutOfStock }) {
  const router = useRouter();

  return (
    <Drawer open onOpenChange={() => router.back()} shouldScaleBackground={false}>
      <DrawerContent className="h-[95vh] overflow-y-auto overflow-x-hidden p-0">
        <ProductDetail data={data} isOutOfStock={isOutOfStock} />
      </DrawerContent>
    </Drawer>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductModalLoading() {
  const router = useRouter();
  return (
    <Drawer open onOpenChange={() => router.back()} shouldScaleBackground={false}>
      <DrawerContent className="h-[95vh] overflow-y-auto p-6">
        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-12 lg:col-span-4">
            <Skeleton className="w-full aspect-[4/5]" />
          </div>
          <div className="col-span-12 lg:col-span-5 space-y-4 px-3">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="col-span-12 lg:col-span-3 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

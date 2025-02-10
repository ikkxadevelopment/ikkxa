import { Skeleton } from "@/components/ui/skeleton";
import useGetDeviceType from "@/hooks/useGetDeviceType";

export function ProductSkeleton() {
  const { width } = useGetDeviceType();
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2 lg:gap-4 lg:px-4">
      {data?.map((item, i) => {
        return (
          <div key={i}>
            <div className="flex flex-col space-y-3">
              <Skeleton className="aspect-portrait w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const data = [{ title: "" }, { title: "" }, { title: "" }, { title: "" }, { title: "" }, { title: "" }, { title: "" }, { title: "" }];

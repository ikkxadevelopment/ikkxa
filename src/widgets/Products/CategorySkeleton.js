import { Skeleton } from "@/components/ui/skeleton";
import useGetDeviceType from "@/hooks/useGetDeviceType";

export function CategorySkeleton() {
  const { width } = useGetDeviceType();
  return (
    <div className="flex flex-nowrap lg:grid grid-cols-2  md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-9  gap-2 lg:gap-4 lg:px-4 mt-3">
      {data?.map((item, i) => {
        return (
          <div key={i} className="w-[25%] lg:w-full flex-col-auto">
            <div className="flex flex-col space-y-3">
              <Skeleton className="aspect-1/1 w-full rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80%] mx-auto" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const data = [{ title: "" }, { title: "" }, { title: "" }, { title: "" }, { title: "" }, { title: "" }, { title: "" }, { title: "" }, { title: "" }];

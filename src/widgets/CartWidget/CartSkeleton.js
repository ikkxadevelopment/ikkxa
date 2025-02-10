import { Skeleton } from "@/components/ui/skeleton";
import useGetDeviceType from "@/hooks/useGetDeviceType";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";

export function CartSkeleton() {
  const t = useTranslations("Index");
  const { width } = useGetDeviceType();
  return (
    <>
   <section className="pt-2 pb-10">
      <div className="container">
        <Breadcrumb className="mb-7 hidden lg:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('MyCart')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-black text-xl font-semibold mb-4">
          {t('YourCart')}{" "}
        
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-md-3 lg:grid-cols-md-4 xl:grid-cols-5 gap-4 py-4">
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
      </div>
    </section>

    </>
 
  );
}

const data = [{ title: "" }, { title: "" }, { title: "" }, { title: "" }, { title: "" }];

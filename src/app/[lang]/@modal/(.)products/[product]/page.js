import { getSingleProduct } from "@/lib/getHome";
import ProductModal from "@/components/ProductModal";
import { notFound } from "next/navigation";

export default async function ProductModalPage({ params: { product, lang } }) {
  const [locale, country] = lang.split("-");
  const data = await getSingleProduct(product, locale, country);

  if (!data) return notFound();

  const isOutOfStock = data?.results?.product?.stock.every(
    (item) => item.current_stock === 0
  );

  return <ProductModal data={data} isOutOfStock={isOutOfStock} />;
}

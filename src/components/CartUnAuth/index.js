"use client";
import { useCartFetcher } from "../Header/useCartFetcher";
import CartItem from "../CartItem";

export default function CartUnAth() {
  const { cart } = useCartFetcher();

  return (
    <>
        {cart &&
            cart?.map((item, i) => {
            return <CartItem isSidebar={true} data={item} key={i} />;
        })}  
    </>
  );
}

"use client";

import { useCartWidget } from "@/widgets/CartWidget/useCartWidget";
import { useState } from "react";

export default function Counter({data}) {
  
  const { updateItem, removeItem } = useCartWidget();
  const [count, setCount] = useState(data?.quantity);
  const checkStock=() => {
    return data?.stock_list?.some(item => item.current_stock <= count && item.name === data?.variant);
  }
  const increment = async () => {
    const increasedCount = count + 1
    const res = await updateItem(data?.id,increasedCount, data?.variant)
    if(res.success === true){
      setCount(count + 1);
    }
  };
  
  const decrement = async () => {
    const decreasedCount = count - 1
    if(decreasedCount === 0){
      removeItem(data?.id)
    // if(res.success === true){
    //   setCount(count - 1);
    // }
    } else {
      const res = await updateItem(data?.id, decreasedCount, data?.variant)
      if(res.success === true){
        setCount(count - 1);
      }
    }
  };
  return (
    <div className="inline-flex items-stretch">
      <button 
        className=" px-2  rounded-tl rounded-bl border bg-neutral-100"
        onClick={decrement}
      >
        <MinusIcon className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <div className="text-base border-t border-b border-zinc-300 font-medium  px-3 py-1">{count}</div>
      <button 
        className="px-2 rounded-tr  rounded-br border bg-neutral-100"
        onClick={increment}
        disabled={checkStock()}
      >
        <PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
}

function MinusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}


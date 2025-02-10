"use client";

export default function DetailCounter({data, count, setCount}) {

  const increment = () => {
    if (count < data.quantity) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <div className="inline-flex items-stretch">
      <button 
        className=" px-2  rounded-tl rounded-bl border bg-neutral-100"
        disabled={count === 1}
        onClick={decrement}
      >
        <MinusIcon className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <div className="text-base border-t border-b border-zinc-300 font-medium  px-3 py-1">{count}</div>
      <button 
        className="px-2 rounded-tr  rounded-br border bg-neutral-100"
        disabled={data.quantity === count}
        onClick={increment}
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


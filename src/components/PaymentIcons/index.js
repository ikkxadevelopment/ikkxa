import Image from "next/image";

export default function PaymetnIcons() {
  return (
    <div className="justify-start items-start gap-1 inline-flex">
      {payments?.map((item, i) => {
        return (
          <div
            key={i}
            className="rounded border border-zinc-300  relative w-12 h-6"
          >
            <Image src={item?.img} className="" fill alt=""/>
          </div>
        );
      })}
    </div>
  );
}

const payments = [
  {
    img: "/images/icon-visa.png",
  },
  {
    img: "/images/icon-master.png",
  },
];
// {
  //   img: "/images/icon-apple.png",
  // },
  // {
  //   img: "/images/icon-gpay.png",
  // },
  // {
  //   img: "/images/icon-samsung.png",
  // },
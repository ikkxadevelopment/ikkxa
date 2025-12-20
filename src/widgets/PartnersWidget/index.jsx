import Image from "@/components/Image/image";

export default function PartnersWidget() {
  const partners = [
    { id: 1, name: "6th Street", logo: "/images/partners/6th.png" },
    { id: 2, name: "Amazon", logo: "/images/partners/amazon.png" },
    { id: 3, name: "Boksha", logo: "/images/partners/boksha.jpg" },
    { id: 4, name: "Centrepoint", logo: "/images/partners/cp.png" },
    { id: 5, name: "eBay", logo: "/images/partners/ebay.png" },
    { id: 6, name: "Namshi", logo: "/images/partners/namshi.jpg" },
    { id: 7, name: "Noon", logo: "/images/partners/noon.webp" },
    { id: 8, name: "Trendyol", logo: "/images/partners/trendyol.png" },
    { id: 9, name: "Voga Closet", logo: "/images/partners/voga.png" },
  ];

  return (
    <section className="w-full py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title */}
      <h2 className="text-sm font-semibold text-[#d29e82] mb-1 text-center">
            Partners
          </h2>
          <h3 className="text-2xl lg:text-4xl font-semibold  mb-12 text-center">
          Our Partners
          </h3>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-center p-6 border rounded-xl shadow-sm hover:shadow-md transition"
            >
                <div className="aspect-[16/9] w-full relative">
                <Image
                src={item.logo}
                alt={item.name}
                fill
                className="object-contain"
              />
                </div>
                <p className="text-lg font-medium">{item.name}</p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

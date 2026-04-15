"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEALS = [
  { id: 1, name: "Cement Bag 50kg", store: "BuildCo", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80", price: 15.99, salePrice: 9.99, discount: -38, sold: 245, available: 500 },
  { id: 2, name: "Steel Rods 10mm", store: "Steel Plus", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", price: 520, salePrice: 380, discount: -27, sold: 120, available: 300 },
  { id: 3, name: "Floor Tiles Pack", store: "Tiles Master", image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&q=80", price: 120, salePrice: 84, discount: -30, sold: 450, available: 800 },
  { id: 4, name: "Paint 10L Bucket", store: "ColorPaint", image: "https://images.unsplash.com/photo-1564624655981-3c3f8b0e8b2f?w=300&q=80", price: 45, salePrice: 28, discount: -38, sold: 180, available: 250 },
  { id: 5, name: "Electrical Wire 100m", store: "ElectroHub", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&q=80", price: 85, salePrice: 52, discount: -39, sold: 340, available: 600 },
];

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 2, minutes: 45, seconds: 32 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/80">Ends in:</span>
      <div className="flex items-center gap-1">
        {[
          { val: String(time.hours).padStart(2, "0"), label: "H" },
          { val: String(time.minutes).padStart(2, "0"), label: "M" },
          { val: String(time.seconds).padStart(2, "0"), label: "S" },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-0.5">
            <div className="bg-white/20 rounded px-2 py-1 font-black text-white text-sm">{t.val}</div>
            {i < 2 && <span className="text-white font-bold">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KemetroFlashDeals() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left side */}
          <div className="text-white">
            <h2 className="text-4xl font-black mb-4">🔥 Flash Deals</h2>
            <CountdownTimer />
          </div>

          {/* Right side — Scrollable deals */}
          <div className="flex-1 relative">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {DEALS.map((deal) => (
                <div key={deal.id} className="flex-shrink-0 w-72 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative aspect-square bg-gray-100">
                    <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded">
                      {deal.discount}%
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400">{deal.store}</p>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mt-1">{deal.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-black text-red-500">${deal.salePrice}</span>
                      <span className="text-xs text-gray-400 line-through">${deal.price}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{deal.sold} sold</span>
                        <span>{deal.available} left</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(deal.sold / (deal.sold + deal.available)) * 100}%` }} />
                      </div>
                    </div>
                    <button className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-2 rounded-lg text-xs mt-3 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:shadow-lg transition-all"
            >
              <ChevronLeft size={18} className="text-gray-900" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:shadow-lg transition-all"
            >
              <ChevronRight size={18} className="text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
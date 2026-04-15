"use client";
// @ts-nocheck
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import KemetroProductCard from "./KemetroProductCard";

const PRODUCTS_BY_CATEGORY = {
  Construction: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80",
      name: "Premium Cement 50kg Bag",
      storeName: "BuildRight Materials",
      storeId: "store-1",
      rating: 4.5,
      reviewCount: 234,
      price: 8.75,
      priceUnit: "per bag",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&q=80",
      name: "Steel Reinforcement Rod 10mm",
      storeName: "Steel Direct",
      storeId: "store-3",
      rating: 4.6,
      reviewCount: 145,
      price: 450,
      priceUnit: "per ton",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&q=80",
      name: "Premium Wall Paint 20L",
      storeName: "ColorMax Paints",
      storeId: "store-4",
      rating: 4.7,
      reviewCount: 267,
      price: 59.5,
      priceUnit: "per bucket",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      name: "Ceramic Floor Tiles 60x60",
      storeName: "Tile Experts Co.",
      storeId: "store-2",
      rating: 4.8,
      reviewCount: 189,
      price: 31.5,
      priceUnit: "per sqm",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&q=80",
      name: "LED Smart Bulbs (Pack of 10)",
      storeName: "Bright Lights Ltd",
      storeId: "store-5",
      rating: 4.4,
      reviewCount: 312,
      price: 38.5,
      priceUnit: "per pack",
    },
  ],
  Furniture: [
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80",
      name: "Modern Sofa Set 3-Seater",
      storeName: "Furniture Plus",
      storeId: "store-6",
      rating: 4.9,
      reviewCount: 123,
      price: 450,
      priceUnit: "per set",
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80",
      name: "Bedroom Set Queen Size",
      storeName: "Sleep Well Co.",
      storeId: "store-7",
      rating: 4.5,
      reviewCount: 98,
      price: 520,
      priceUnit: "per set",
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=300&q=80",
      name: "Dining Table with 6 Chairs",
      storeName: "Table Masters",
      storeId: "store-8",
      rating: 4.6,
      reviewCount: 156,
      price: 280,
      priceUnit: "per set",
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80",
      name: "Sectional Sofa L-Shape",
      storeName: "Furniture Plus",
      storeId: "store-6",
      rating: 4.8,
      reviewCount: 145,
      price: 680,
      priceUnit: "per set",
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80",
      name: "Coffee Table Set",
      storeName: "Table Masters",
      storeId: "store-8",
      rating: 4.7,
      reviewCount: 89,
      price: 120,
      priceUnit: "per set",
    },
  ],
  Appliances: [
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&q=80",
      name: "Smart Air Conditioner 24000 BTU",
      storeName: "Cool Air Ltd",
      storeId: "store-9",
      rating: 4.6,
      reviewCount: 234,
      price: 420,
      priceUnit: "per unit",
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&q=80",
      name: "Energy Star Refrigerator",
      storeName: "Cool Appliances",
      storeId: "store-10",
      rating: 4.7,
      reviewCount: 189,
      price: 580,
      priceUnit: "per unit",
    },
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&q=80",
      name: "LED Smart TV 55 inch",
      storeName: "Electronics Hub",
      storeId: "store-11",
      rating: 4.8,
      reviewCount: 267,
      price: 380,
      priceUnit: "per unit",
    },
    {
      id: 14,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      name: "Washing Machine Front Load",
      storeName: "Cool Appliances",
      storeId: "store-10",
      rating: 4.5,
      reviewCount: 145,
      price: 520,
      priceUnit: "per unit",
    },
    {
      id: 15,
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80",
      name: "Microwave Oven Convection",
      storeName: "Electronics Hub",
      storeId: "store-11",
      rating: 4.4,
      reviewCount: 98,
      price: 180,
      priceUnit: "per unit",
    },
  ],
  Electrical: [
    {
      id: 16,
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&q=80",
      name: "LED Smart Bulbs (Pack of 10)",
      storeName: "Bright Lights Ltd",
      storeId: "store-5",
      rating: 4.4,
      reviewCount: 312,
      price: 38.5,
      priceUnit: "per pack",
    },
    {
      id: 17,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      name: "Electrical Socket 13A Safety",
      storeName: "SafeElec Co.",
      storeId: "store-12",
      rating: 4.7,
      reviewCount: 189,
      price: 12.5,
      priceUnit: "per socket",
    },
    {
      id: 18,
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80",
      name: "Circuit Breaker MCB 63A",
      storeName: "SafeElec Co.",
      storeId: "store-12",
      rating: 4.6,
      reviewCount: 156,
      price: 28,
      priceUnit: "per breaker",
    },
    {
      id: 19,
      image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&q=80",
      name: "Power Strip with USB Ports",
      storeName: "Bright Lights Ltd",
      storeId: "store-5",
      rating: 4.5,
      reviewCount: 123,
      price: 24.5,
      priceUnit: "per strip",
    },
    {
      id: 20,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      name: "Electric Cable 2.5mm Copper",
      storeName: "SafeElec Co.",
      storeId: "store-12",
      rating: 4.7,
      reviewCount: 234,
      price: 0.85,
      priceUnit: "per meter",
    },
  ],
  "Tiles & Flooring": [
    {
      id: 21,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      name: "Ceramic Floor Tiles 60x60",
      storeName: "Tile Experts Co.",
      storeId: "store-2",
      rating: 4.8,
      reviewCount: 189,
      price: 31.5,
      priceUnit: "per sqm",
    },
    {
      id: 22,
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80",
      name: "Porcelain Wall Tiles 30x90",
      storeName: "Tile Experts Co.",
      storeId: "store-2",
      rating: 4.7,
      reviewCount: 145,
      price: 42,
      priceUnit: "per sqm",
    },
    {
      id: 23,
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&q=80",
      name: "Marble Flooring Stone",
      storeName: "Stone & Tiles Co.",
      storeId: "store-13",
      rating: 4.9,
      reviewCount: 267,
      price: 125,
      priceUnit: "per sqm",
    },
    {
      id: 24,
      image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&q=80",
      name: "Vinyl Flooring Waterproof",
      storeName: "Tile Experts Co.",
      storeId: "store-2",
      rating: 4.6,
      reviewCount: 98,
      price: 28.5,
      priceUnit: "per sqm",
    },
    {
      id: 25,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      name: "Mosaic Tiles Decorative",
      storeName: "Stone & Tiles Co.",
      storeId: "store-13",
      rating: 4.7,
      reviewCount: 156,
      price: 65,
      priceUnit: "per sqm",
    },
  ],
};

const CATEGORIES = ["Construction", "Furniture", "Appliances", "Electrical", "Tiles & Flooring"];

export default function KemetroBestSellers() {
  const [activeCategory, setActiveCategory] = useState("Construction");
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -240 : 240,
        behavior: "smooth",
      });
    }
  };

  const products = PRODUCTS_BY_CATEGORY[activeCategory] || [];

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900">Best Sellers</h2>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeCategory === cat
                  ? "bg-[#FF6B00] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products carousel */}
        <div className="relative">
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {products.map((product) => (
              <div key={product.id} className="snap-start">
                <KemetroProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 hover:shadow-xl transition-all z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 hover:shadow-xl transition-all z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import KemetroProductCard from "./KemetroProductCard";

const NEW_PRODUCTS = [
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
    id: 3,
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
    id: 4,
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
];

export default function KemetroNewArrivals() {
  return (
    <section className="w-full bg-[#F8FAFC] py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-2">New Arrivals</h2>
          <div className="w-16 h-1 bg-[#0077B6] rounded-full mx-auto mt-3" />
          <p className="text-gray-500 text-sm mt-4">Just added to our marketplace</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {NEW_PRODUCTS.map((product) => (
            <div key={product.id} className="flex justify-center">
              <div className="w-full max-w-xs">
                <KemetroProductCard product={product} badge="NEW" badgeType="new" />
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center">
          <Link
            to="/kemetro/new-arrivals"
            className="inline-flex items-center gap-2 text-[#FF6B00] font-bold hover:underline"
          >
            View All New Arrivals <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
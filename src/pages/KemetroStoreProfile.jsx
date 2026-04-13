import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";
import KemetroStoreHeader from "@/components/kemetro/store/KemetroStoreHeader";
import KemetroStoreNav from "@/components/kemetro/store/KemetroStoreNav";
import KemetroStoreAllProducts from "@/components/kemetro/store/KemetroStoreAllProducts";
import KemetroStoreAbout from "@/components/kemetro/store/KemetroStoreAbout";
import KemetroStoreReviews from "@/components/kemetro/store/KemetroStoreReviews";

const MOCK_STORE = {
  id: "store-1",
  storeName: "BuildRight Materials",
  slug: "buildright-materials",
  logo: "https://images.unsplash.com/photo-1599788996426-3ddb18f10b49?w=200&q=80",
  coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  description: "Premium construction and finishing materials supplier serving contractors and builders across the region.",
  isVerified: true,
  rating: 4.8,
  totalReviews: 234,
  totalProducts: 156,
  totalSales: 2340,
  phone: "+966 11 1234 5678",
  country: "Saudi Arabia",
  city: "Riyadh",
  address: "King Fahd Road, Riyadh",
  shipsTo: 15,
  memberSince: 2018,
  responseTime: "< 2 hours",
  categories: [
    { id: "1", name: "Cement & Concrete", count: 24 },
    { id: "2", name: "Steel & Iron", count: 18 },
    { id: "3", name: "Paint & Coatings", count: 32 },
    { id: "4", name: "Tiles & Flooring", count: 28 },
    { id: "5", name: "Electrical", count: 54 },
  ],
};

const MOCK_PRODUCTS = [
  { id: "1", name: "Premium Cement 50kg", price: 8.75, salePrice: 7.5, rating: 4.8, reviews: 156, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80", storeId: "store-1" },
  { id: "2", name: "Steel Rods 10mm", price: 450, salePrice: 420, rating: 4.6, reviews: 89, image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&q=80", storeId: "store-1" },
  { id: "3", name: "Paint 20L Matte White", price: 59.5, salePrice: 49.99, rating: 4.9, reviews: 234, image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&q=80", storeId: "store-1" },
  { id: "4", name: "Ceramic Tiles 60x60", price: 31.5, salePrice: 28.5, rating: 4.7, reviews: 167, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", storeId: "store-1" },
  { id: "5", name: "Electrical Outlet", price: 2.5, salePrice: 2.0, rating: 4.5, reviews: 45, image: "https://images.unsplash.com/photo-1621905251271-48416bd8575a?w=300&q=80", storeId: "store-1" },
  { id: "6", name: "LED Bulb 60W", price: 5.0, salePrice: 3.99, rating: 4.8, reviews: 123, image: "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=300&q=80", storeId: "store-1" },
];

export default function KemetroStoreProfile() {
  const { slug } = useParams();
  const [currentTab, setCurrentTab] = useState("products");
  const [store] = useState(MOCK_STORE);
  const [products] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <KemetroHeader />
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FF6B00] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />
      <KemetroStoreHeader store={store} />
      <div className="max-w-[1400px] mx-auto px-4">
        <KemetroStoreNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <div className="py-8">
          {currentTab === "products" && <KemetroStoreAllProducts store={store} products={products} />}
          {currentTab === "about" && <KemetroStoreAbout store={store} />}
          {currentTab === "reviews" && <KemetroStoreReviews store={store} />}
        </div>
      </div>
      <KemetroFooter />
    </div>
  );
}
"use client";
import { useMarketplaceProducts } from "@/hooks/use-marketplace";
import { ShoppingBag } from "lucide-react";

export default function AdminKemetroProductsPage() {
  const { data, isLoading } = useMarketplaceProducts();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kemetro Products</h1>
        <p className="text-sm text-slate-500 mt-1">{data?.pagination?.total || 0} products in marketplace</p>
      </div>
      <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
        <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
        <p>Product management — categories, pricing, inventory, reviews</p>
      </div>
    </div>
  );
}

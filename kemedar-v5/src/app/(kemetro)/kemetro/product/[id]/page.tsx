"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { ShoppingCart, Phone, Star, ChevronLeft } from "lucide-react";
export default function KemetroProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: product, isLoading } = useQuery({ queryKey: ["kemetro-product", id], queryFn: () => apiClient.get<any>(`/api/v1/marketplace/products?id=${id}`) });
  if (isLoading) return <div className="container mx-auto max-w-5xl py-8 px-4"><div className="h-96 bg-slate-100 rounded-xl animate-pulse"/></div>;
  return (<div className="container mx-auto max-w-5xl py-8 px-4">
    <Link href="/kemetro/search" className="text-sm text-blue-600 flex items-center gap-1 mb-4"><ChevronLeft className="w-4 h-4"/>Back to Search</Link>
    <div className="bg-white border rounded-xl overflow-hidden"><div className="grid md:grid-cols-2 gap-6 p-6"><div className="bg-slate-100 rounded-xl h-80 flex items-center justify-center text-6xl">📦</div><div><h1 className="text-2xl font-bold mb-2">Product Details</h1><p className="text-slate-500 mb-4">Product ID: {id}</p><div className="text-3xl font-bold text-green-600 mb-4">Contact for Price</div><button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700"><ShoppingCart className="w-5 h-5"/>Add to Cart</button><button className="w-full border py-3 rounded-lg font-medium flex items-center justify-center gap-2 mt-2 hover:bg-slate-50"><Phone className="w-5 h-5"/>Contact Seller</button></div></div></div>
  </div>);
}

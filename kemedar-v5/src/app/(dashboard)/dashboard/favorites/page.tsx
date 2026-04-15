"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Maximize } from "lucide-react";

export default function FavoritesPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => apiClient.list<any>("/api/v1/favorites", { pageSize: 50 }),
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-xl overflow-hidden animate-pulse">
              <div className="h-40 bg-slate-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const favorites = data?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-xl">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
          <p className="text-slate-500 mb-4">Save properties you like to compare them later</p>
          <Link href="/search/properties" className="text-blue-600 font-medium hover:underline">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((prop: any) => (
            <Link key={prop.id} href={`/property/${prop.propertyId || prop.id}`} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition group">
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                {prop.imageUrl && <img src={prop.imageUrl} alt={prop.title} className="w-full h-full object-cover" />}
                <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500">
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm truncate group-hover:text-blue-600">{prop.title || "Property"}</h3>
                {prop.cityName && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{prop.cityName}</p>
                )}
                <p className="text-blue-600 font-bold text-sm mt-2">{formatPrice(prop.priceAmount)}</p>
                <div className="flex gap-3 mt-2 text-xs text-slate-500">
                  {prop.bedrooms != null && <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{prop.bedrooms}</span>}
                  {prop.bathrooms != null && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{prop.bathrooms}</span>}
                  {prop.areaSize != null && <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{prop.areaSize} m2</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

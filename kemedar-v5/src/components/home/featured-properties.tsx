"use client";
// @ts-nocheck

import { useProperties } from "@/hooks/use-properties";
import { useCurrency } from "@/lib/currency-context";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Maximize, Eye, Heart, Check } from "lucide-react";
import { useRef } from "react";

export function FeaturedProperties() {
  const { data, isLoading } = useProperties({ isFeatured: true, pageSize: 12 });
  const { formatPrice } = useCurrency();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold mb-6">Featured Properties</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const properties = data?.data || [];
  if (properties.length === 0) return null;

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Featured Properties</h2>
            <p className="text-slate-500 text-sm mt-1">Handpicked properties for you</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")} className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
          {properties.map((p: any) => (
            <Link
              key={p.id}
              href={`/property/${p.id}`}
              className="min-w-[280px] max-w-[300px] snap-start bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                {p.featuredImage ? (
                  <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-400">No Image</div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  {p.purpose?.name && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">{p.purpose.name}</span>
                  )}
                  {p.isVerified && (
                    <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white">
                  <Heart className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{p.title}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{p.city?.name || "Egypt"}</span>
                </div>
                <div className="text-lg font-bold text-blue-600 mt-2">
                  {p.isContactForPrice ? "Contact for Price" : formatPrice(p.priceAmount)}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" /> 3</span>
                  <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" /> 2</span>
                  <span className="flex items-center gap-0.5"><Maximize className="w-3 h-3" /> 150 m&sup2;</span>
                  <span className="flex items-center gap-0.5 ml-auto"><Eye className="w-3 h-3" /> {p.viewCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link href="/search/properties" className="text-blue-600 font-medium hover:underline">
            View All Properties &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

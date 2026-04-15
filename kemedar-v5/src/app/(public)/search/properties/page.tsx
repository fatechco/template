"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProperties, type PropertyFilters } from "@/hooks/use-properties";
import { useCurrency } from "@/lib/currency-context";
import Link from "next/link";
import {
  Search, SlidersHorizontal, Grid3X3, List, MapPin, Bed, Bath, Maximize,
  Eye, Heart, Check, ChevronDown, X, ArrowUpDown, Sparkles
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "priceAmount:asc", label: "Price: Low to High" },
  { value: "priceAmount:desc", label: "Price: High to Low" },
  { value: "viewCount:desc", label: "Most Viewed" },
];

export default function SearchPropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<PropertyFilters>({
    page: Number(searchParams.get("page")) || 1,
    pageSize: 12,
    search: searchParams.get("search") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    purposeId: searchParams.get("purposeId") || undefined,
    cityId: searchParams.get("cityId") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    isVerified: searchParams.get("isVerified") === "true" ? true : undefined,
    isFeatured: searchParams.get("isFeatured") === "true" ? true : undefined,
    isAuction: searchParams.get("isAuction") === "true" ? true : undefined,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  });

  const { data, isLoading, error } = useProperties(filters);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") params.set(key, String(val));
    });
    router.replace(`/search/properties?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, pageSize: 12, sortBy: "createdAt", sortOrder: "desc" });
  };

  const properties = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto max-w-7xl py-6 px-4">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Search Properties</h1>
          {pagination && <p className="text-sm text-slate-500 mt-1">{pagination.total.toLocaleString()} properties found</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/kemedar/ai-search" className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-100">
            <Sparkles className="w-4 h-4" /> AI Search
          </Link>
          <Link href="/kemedar/match" className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
            <Heart className="w-4 h-4" /> Match
          </Link>
        </div>
      </div>

      {/* Search + Controls */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, keyword, or property code..."
              defaultValue={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2.5 border rounded-lg text-sm font-medium ${showFilters ? "bg-blue-50 border-blue-300 text-blue-700" : "hover:bg-slate-50"}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <select
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(":");
                setFilters((f) => ({ ...f, sortBy, sortOrder: sortOrder as "asc" | "desc" }));
              }}
              className="border rounded-lg px-3 py-2.5 text-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="flex border rounded-lg overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2.5 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2.5 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t">
            <input type="number" placeholder="Min Price" value={filters.minPrice || ""} onChange={(e) => updateFilter("minPrice", Number(e.target.value) || undefined)} className="border rounded-lg px-3 py-2 text-sm" />
            <input type="number" placeholder="Max Price" value={filters.maxPrice || ""} onChange={(e) => updateFilter("maxPrice", Number(e.target.value) || undefined)} className="border rounded-lg px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!filters.isVerified} onChange={(e) => updateFilter("isVerified", e.target.checked || undefined)} className="rounded" />
              Verified Only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!filters.isAuction} onChange={(e) => updateFilter("isAuction", e.target.checked || undefined)} className="rounded" />
              Auctions
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!filters.isFracOffering} onChange={(e) => updateFilter("isFracOffering", e.target.checked || undefined)} className="rounded" />
              KemeFrac
            </label>
            <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading && (
        <div className={`grid ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""} gap-4`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`bg-slate-100 rounded-xl animate-pulse ${viewMode === "grid" ? "h-72" : "h-36"}`} />
          ))}
        </div>
      )}

      {error && <div className="text-center py-12 text-red-500">Error loading properties: {(error as Error).message}</div>}

      {!isLoading && properties.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No properties found</h3>
          <p className="text-slate-500 mb-4">Try adjusting your filters or search terms</p>
          <button onClick={clearFilters} className="text-blue-600 font-medium hover:underline">Clear all filters</button>
        </div>
      )}

      {!isLoading && properties.length > 0 && (
        <>
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {properties.map((p: any) => (
              viewMode === "grid" ? (
                <Link key={p.id} href={`/property/${p.id}`} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group">
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    {p.featuredImage ? (
                      <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-300 text-4xl">🏠</div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {p.purpose?.name && <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">{p.purpose.name}</span>}
                      {p.isVerified && <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-0.5"><Check className="w-3 h-3" /> Verified</span>}
                      {p.isAuction && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">Auction</span>}
                      {p.isFracOffering && <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded">KemeFrac</span>}
                    </div>
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white" onClick={(e) => { e.preventDefault(); }}>
                      <Heart className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{p.title}</h3>
                    <p className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {p.city?.name || "Egypt"} {p.category?.name ? `• ${p.category.name}` : ""}
                    </p>
                    <div className="text-xl font-bold text-blue-600 mt-2">
                      {p.isContactForPrice ? "Contact for Price" : formatPrice(p.priceAmount)}
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> 3 Beds</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> 2 Baths</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> 150 m²</span>
                      <span className="flex items-center gap-1 ml-auto"><Eye className="w-3.5 h-3.5" /> {p.viewCount || 0}</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link key={p.id} href={`/property/${p.id}`} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition flex">
                  <div className="w-1/3 min-h-[140px] bg-slate-100 relative overflow-hidden">
                    {p.featuredImage ? (
                      <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-4xl">🏠</div>
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold text-lg">{p.title}</h3>
                    <p className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {p.city?.name || "Egypt"}
                    </p>
                    <div className="text-xl font-bold text-blue-600 mt-2">
                      {p.isContactForPrice ? "Contact" : formatPrice(p.priceAmount)}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> 3</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> 2</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> 150 m²</span>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))}
                disabled={filters.page === 1}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilters((f) => ({ ...f, page: pageNum }))}
                    className={`w-10 h-10 rounded-lg text-sm font-medium ${pageNum === filters.page ? "bg-blue-600 text-white" : "border hover:bg-slate-50"}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {pagination.totalPages > 5 && <span className="px-2 text-slate-400">...</span>}
              <button
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
                disabled={filters.page === pagination.totalPages}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

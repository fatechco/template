"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";
import ProfileFilterBar from "./ProfileFilterBar";
import ProfileGrid from "./ProfileGrid";

const PER_PAGE = 12;

export default function ProfilePageBase({ title, subtitle, icon, type, mockData, fetchFn }) {
  const [allItems, setAllItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchFn()
      .then(data => {
        const items = data.length > 0 ? data : mockData;
        setAllItems(items);
        setFiltered(items);
      })
      .catch(() => {
        setAllItems(mockData);
        setFiltered(mockData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (filters) => {
    setActiveFilters(filters);
    setPage(1);
    let results = [...allItems];
    if (filters.name) {
      const q = filters.name.toLowerCase();
      results = results.filter(item =>
        (item.full_name || item.name || "").toLowerCase().includes(q)
      );
    }
    setFiltered(results);
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <ProfileFilterBar onSearch={handleSearch} />

      <div className="max-w-[1400px] mx-auto px-4 py-8 w-full flex-1">
        {/* Page title */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">{icon}</span>
              <h1 className="text-2xl xl:text-3xl font-black text-gray-900">{title}</h1>
            </div>
            {subtitle && <p className="text-sm text-gray-500 ml-12">{subtitle}</p>}
          </div>
          <div className="text-sm text-gray-400 bg-white border border-gray-200 rounded-full px-4 py-1.5 font-semibold">
            {loading ? "Loading..." : `${filtered.length} results`}
          </div>
        </div>

        {/* Grid */}
        <ProfileGrid type={type} items={paginated} loading={loading} />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p;
              if (totalPages <= 7) p = i + 1;
              else if (page <= 4) p = i + 1;
              else if (page >= totalPages - 3) p = totalPages - 6 + i;
              else p = page - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                    page === p ? "bg-[#FF6B00] text-white" : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <SuperFooter />
    </div>
  );
}
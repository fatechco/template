import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MaterialProductCard from "./MaterialProductCard";
import { Link } from "react-router-dom";

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 animate-pulse">
      <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="w-16 h-8 bg-gray-200 rounded-xl flex-shrink-0" />
    </div>
  );
}

export default function MaterialSearchSheet({ material, materialIndex, session, onClose, onAdded }) {
  const [query, setQuery] = useState(material?.kemetroSearchKeywords || material?.itemName || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (q) => {
    if (!q?.trim()) return;
    setLoading(true);
    try {
      const res = await base44.functions.invoke("searchKemetroForMaterial", {
        query: q,
        limit: 4,
      });
      const products = (res?.data?.results || []).map(p => ({ ...p, _searchKeywords: q }));
      setResults(products);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search(query);
  }, []);

  const handleAdded = (product) => {
    onAdded?.(materialIndex, product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} style={{ backdropFilter: "blur(2px)" }} />

      {/* Sheet */}
      <div
        className="relative bg-white w-full rounded-t-3xl z-10 flex flex-col"
        style={{ maxHeight: "70vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pb-3 flex-shrink-0">
          <div>
            <p className="text-[18px] font-black text-gray-900 leading-snug">
              {material?.itemName || "Find Part"}
            </p>
            <p className="text-[13px] text-gray-400 mt-0.5">
              Showing similar products on Kemetro
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Search input */}
        <div className="px-5 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search(query)}
              className="flex-1 px-3.5 py-2.5 text-sm bg-transparent outline-none text-gray-800"
              placeholder="Search for replacement part..."
            />
            <button
              onClick={() => search(query)}
              className="px-4 py-2.5 bg-blue-600 text-white flex-shrink-0"
            >
              <Search size={15} />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-5">
          {loading ? (
            <div className="space-y-1">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm">No results found. Try a different search.</p>
            </div>
          ) : (
            <div>
              {results.map((product) => (
                <MaterialProductCard
                  key={product.id}
                  product={product}
                  materialIndex={materialIndex}
                  session={session}
                  onAdded={handleAdded}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer link */}
        <div className="px-5 py-4 flex-shrink-0 border-t border-gray-100">
          <Link
            to={`/kemetro/search?q=${encodeURIComponent(query)}`}
            className="block text-center text-blue-600 font-bold text-[14px] hover:text-blue-700"
          >
            See all results on Kemetro →
          </Link>
        </div>
      </div>
    </div>
  );
}
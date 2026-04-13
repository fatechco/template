import { useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroSearchFilters from "@/components/kemetro/search/KemetroSearchFilters";
import KemetroSearchResults from "@/components/kemetro/search/KemetroSearchResults";
import SuperFooter from "@/components/layout/SuperFooter";

export default function KemetroSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const [filters, setFilters] = useState({
    category: slug || null,
    subcategories: [],
    priceMin: 0,
    priceMax: 10000,
    brands: [],
    sellers: [],
    rating: 0,
    inStockOnly: false,
    origin: [],
    unitType: [],
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />
      
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex gap-6">
          <KemetroSearchFilters filters={filters} setFilters={setFilters} />
          <KemetroSearchResults filters={filters} categorySlug={slug} searchQuery={searchParams.get("q")} />
        </div>
      </div>

      <SuperFooter />
    </div>
  );
}
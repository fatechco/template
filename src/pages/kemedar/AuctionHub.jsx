import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import AuctionHero from "@/components/auctions/AuctionHero";
import AuctionStatusTabs from "@/components/auctions/AuctionStatusTabs";
import AuctionFilterBar from "@/components/auctions/AuctionFilterBar";
import FeaturedAuctions from "@/components/auctions/FeaturedAuctions";
import AuctionCard from "@/components/auctions/AuctionCard";
import { Loader2 } from "lucide-react";

export default function AuctionHub() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("ending_soonest");

  useEffect(() => {
    Promise.all([
      base44.entities.PropertyAuction.list("-created_date", 100),
    ]).then(([auctionsData]) => {
      setAuctions(auctionsData || []);
      setLoading(false);
    });
  }, []);

  const getStatusCounts = () => {
    const now = new Date();
    const live = auctions.filter(a => a.status === "live" || a.status === "extended").length;
    const endingToday = auctions.filter(a => a.auctionEndAt && (new Date(a.auctionEndAt) - now < 24 * 60 * 60 * 1000)).length;
    const registration = auctions.filter(a => a.status === "registration").length;
    const upcoming = auctions.filter(a => a.status === "scheduled").length;

    return { live, endingToday, registration, upcoming };
  };

  const filteredAuctions = auctions.filter(auction => {
    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "live" && !["live", "extended"].includes(auction.status)) return false;
      if (statusFilter === "ending_soon") {
        const now = new Date();
        const hoursUntilEnd = (new Date(auction.auctionEndAt) - now) / (60 * 60 * 1000);
        if (hoursUntilEnd > 24) return false;
      }
      if (statusFilter === "upcoming" && auction.status !== "scheduled") return false;
      if (statusFilter === "registration" && auction.status !== "registration") return false;
    }

    // City filter
    if (cityFilter && !auction.auctionDescription?.includes(cityFilter)) return true; // Placeholder

    // Category filter
    if (categoryFilter && !auction.auctionType?.includes(categoryFilter)) return true; // Placeholder

    // Budget filter
    if (budgetFilter) {
      const startPrice = auction.startingPriceEGP;
      const ranges = {
        "under_1m": [0, 1000000],
        "1m_3m": [1000000, 3000000],
        "3m_5m": [3000000, 5000000],
        "5m_10m": [5000000, 10000000],
        "10m_plus": [10000000, Infinity],
      };
      const [min, max] = ranges[budgetFilter] || [0, Infinity];
      if (startPrice < min || startPrice > max) return false;
    }

    return true;
  });

  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (sortFilter) {
      case "ending_soonest":
        return new Date(a.auctionEndAt) - new Date(b.auctionEndAt);
      case "newest":
        return new Date(b.created_date) - new Date(a.created_date);
      case "highest_bid":
        return (b.currentHighestBidEGP || 0) - (a.currentHighestBidEGP || 0);
      case "most_bidders":
        return b.totalUniqueBidders - a.totalUniqueBidders;
      default:
        return 0;
    }
  });

  const featured = sortedAuctions.filter(a => a.featuredAuction).slice(0, 5);
  const counts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      
      <AuctionHero stats={counts} />

      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <AuctionStatusTabs 
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          counts={counts}
        />
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
        <AuctionFilterBar 
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          budgetFilter={budgetFilter}
          setBudgetFilter={setBudgetFilter}
          sortFilter={sortFilter}
          setSortFilter={setSortFilter}
        />

        {featured.length > 0 && (
          <FeaturedAuctions auctions={featured} />
        )}

        <div className="mt-12">
          <h2 className="text-xl font-black text-gray-900 mb-6">All Auctions</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={40} className="text-gray-400 animate-spin" />
            </div>
          ) : sortedAuctions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No auctions match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAuctions.map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
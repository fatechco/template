import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import BiddingAuctionCard from "@/components/auctions/BiddingAuctionCard";
import WonAuctionCard from "@/components/auctions/WonAuctionCard";

export default function AuctionsDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("bidding");

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: registrations = [] } = useQuery({
    queryKey: ["auctionRegistrations", user?.id],
    queryFn: () =>
      user
        ? base44.entities.AuctionRegistration.filter({
            bidderUserId: user.id,
            registrationStatus: { $in: ["active", "winner"] },
          })
        : [],
    enabled: !!user?.id,
  });

  const { data: auctions = [] } = useQuery({
    queryKey: ["auctions"],
    queryFn: () =>
      base44.entities.PropertyAuction.filter({ status: { $nin: ["draft", "cancelled"] } }),
  });

  const auctionMap = Object.fromEntries(auctions.map((a) => [a.id, a]));

  // Tab data
  const biddingAuctions = registrations
    .filter((r) => ["active", "pending_payment"].includes(r.registrationStatus))
    .map((r) => ({
      ...auctionMap[r.auctionId],
      registration: r,
    }))
    .filter((a) => a.id);

  const wonAuctions = registrations
    .filter((r) => ["winner", "refund_pending", "refunded", "forfeited"].includes(r.registrationStatus))
    .map((r) => ({
      ...auctionMap[r.auctionId],
      registration: r,
    }))
    .filter((a) => a.id);

  const watching = [];
  const registered = registrations.length;

  const tabCounts = {
    bidding: biddingAuctions.length,
    won: wonAuctions.length,
    watching: watching.length,
    registered,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            🔨 KemedarBid™
            <span className="text-gray-400 text-xl font-normal">My Auctions</span>
          </h1>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-gray-200">
            {[
              { id: "bidding", label: "🔴 Bidding", icon: "🔴" },
              { id: "won", label: "🏆 Won", icon: "🏆" },
              { id: "watching", label: "👁️ Watching", icon: "👁️" },
              { id: "registered", label: "📋 Registered", icon: "📋" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-black">
                  {tabCounts[tab.id]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* BIDDING */}
        {activeTab === "bidding" && (
          <div className="space-y-4">
            {biddingAuctions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">You're not currently bidding on any auctions.</p>
                <p className="text-gray-400 text-sm mt-1">
                  <a href="/auctions" className="text-red-600 hover:underline">
                    Browse active auctions →
                  </a>
                </p>
              </div>
            ) : (
              biddingAuctions.map((a) => (
                <BiddingAuctionCard key={a.id} auction={a} registration={a.registration} />
              ))
            )}
          </div>
        )}

        {/* WON */}
        {activeTab === "won" && (
          <div className="space-y-4">
            {wonAuctions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">You haven't won any auctions yet.</p>
              </div>
            ) : (
              wonAuctions.map((a) => (
                <WonAuctionCard key={a.id} auction={a} />
              ))
            )}
          </div>
        )}

        {/* WATCHING */}
        {activeTab === "watching" && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You're not watching any auctions yet.</p>
          </div>
        )}

        {/* REGISTERED */}
        {activeTab === "registered" && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Registered for {registered} auction(s)</p>
          </div>
        )}
      </div>
    </div>
  );
}
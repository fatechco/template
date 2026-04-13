import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, AlertTriangle, CheckCircle, MessageCircle, RotateCcw, XCircle } from "lucide-react";
import AuctionBidFeed from "@/components/auctions/AuctionBidFeed";
import SellerKPICards from "@/components/auctions/SellerKPICards";
import BidderRegistrationTable from "@/components/auctions/BidderRegistrationTable";
import AuctionAnalyticsCharts from "@/components/auctions/AuctionAnalyticsCharts";
import ReserveMeteIndicator from "@/components/auctions/ReserveMeteIndicator";

const Countdown = ({ endAt }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = new Date(endAt) - new Date();
      if (diff <= 0) { setTime("00:00:00"); return; }
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endAt]);
  return <span className="font-mono">{time}</span>;
};

export default function SellerAuctionMonitor() {
  const { auctionCode } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [relisting, setRelisting] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: auction } = useQuery({
    queryKey: ["auction", auctionCode],
    queryFn: () => base44.entities.PropertyAuction.filter({ auctionCode }).then(r => r[0]),
    enabled: !!auctionCode,
  });

  const { data: bids } = useQuery({
    queryKey: ["bids", auction?.id],
    queryFn: () => auction ? base44.entities.AuctionBid.filter({ auctionId: auction.id }, "-bidPlacedAt", 100) : [],
    enabled: !!auction?.id,
  });

  const { data: registrations } = useQuery({
    queryKey: ["registrations", auction?.id],
    queryFn: () => auction ? base44.entities.AuctionRegistration.filter({ auctionId: auction.id }, "-registeredAt", 100) : [],
    enabled: !!auction?.id,
  });

  if (!auction || user?.id !== auction.sellerUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold">Not authorized to view this auction</p>
        </div>
      </div>
    );
  }

  const handleCancelAuction = async () => {
    if (!confirm(`Cancelling forfeits your ${Number(auction.sellerDepositEGP).toLocaleString()} EGP seller deposit. All registered bidder deposits will be fully refunded. Continue?`)) return;
    setCancelling(true);
    await base44.functions.invoke("cancelAuction", { auctionId: auction.id }).catch(e => alert(e.message));
    setCancelling(false);
  };

  const handleAcceptOffer = async () => {
    if (!confirm(`Accept the highest bid of ${Number(auction.currentHighestBidEGP).toLocaleString()} EGP as final sale?`)) return;
    setAccepting(true);
    await base44.functions.invoke("acceptBidBelowReserve", { auctionId: auction.id }).catch(e => alert(e.message));
    setAccepting(false);
  };

  const handleRelist = async () => {
    if (!confirm("Create a new auction for this property with a lower reserve?")) return;
    setRelisting(true);
    await base44.functions.invoke("relistAuction", { auctionId: auction.id }).catch(e => alert(e.message));
    setRelisting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-black text-gray-900">
              🔨 Managing Auction: <span className="text-red-600">{auctionCode}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900">{auction.auctionTitle}</p>
              <p className="text-sm text-gray-500">{auction.property?.address || "Property Address"}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-bold text-white text-sm ${
              auction.status === "live" ? "bg-red-600" :
              auction.status === "ended" ? "bg-gray-500" :
              auction.status === "reserve_not_met" ? "bg-yellow-600" :
              auction.status === "awaiting_payment" ? "bg-orange-600" :
              auction.status === "payment_received" ? "bg-blue-600" :
              auction.status === "completed" ? "bg-green-600" :
              "bg-gray-400"
            }`}>
              {auction.status.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <SellerKPICards auction={auction} registrations={registrations} bids={bids} />

        {/* Live Bid Feed */}
        {(auction.status === "live" || auction.status === "extended") && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-black text-lg text-gray-900 mb-4">🔨 Live Bid Feed</h3>
            <AuctionBidFeed auction={auction} bids={bids} isSeller={true} />
          </div>
        )}

        {/* Registered Bidders Table */}
        <BidderRegistrationTable auction={auction} registrations={registrations} bids={bids} isSeller={true} />

        {/* Analytics Charts */}
        {bids && bids.length > 0 && (
          <AuctionAnalyticsCharts auction={auction} bids={bids} />
        )}

        {/* Reserve Met Indicator */}
        <ReserveMeteIndicator auction={auction} isSeller={true} />

        {/* Seller Controls */}
        <div className="space-y-4">
          {(auction.status === "scheduled" || auction.status === "registration") && (
            <button
              onClick={handleCancelAuction}
              disabled={cancelling}
              className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              ❌ Cancel Auction
            </button>
          )}

          {auction.status === "reserve_not_met" && (
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <p className="text-yellow-900 font-bold mb-1">Auction ended below reserve</p>
                <p className="text-sm text-yellow-800">Highest bid: {Number(auction.currentHighestBidEGP).toLocaleString()} EGP</p>
              </div>
              <button
                onClick={handleAcceptOffer}
                disabled={accepting}
                className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors"
              >
                ✅ Accept This Offer
              </button>
              <button
                onClick={handleRelist}
                disabled={relisting}
                className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60 font-bold rounded-xl transition-colors"
              >
                🔄 Re-list for New Auction
              </button>
            </div>
          )}

          {auction.status === "awaiting_payment" && (
            <button
              onClick={() => navigate(`/auctions/${auctionCode}/transfer`)}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              View Transfer Progress <ChevronRight size={18} />
            </button>
          )}

          {auction.status === "payment_received" && (
            <button
              onClick={() => navigate(`/auctions/${auctionCode}/transfer`)}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Legal Transfer in Progress <ChevronRight size={18} />
            </button>
          )}

          {auction.status === "completed" && (
            <button
              onClick={() => navigate(`/auctions/${auctionCode}/transfer`)}
              className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              View Completed Transfer <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
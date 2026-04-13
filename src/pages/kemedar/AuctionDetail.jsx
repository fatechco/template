import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import AuctionStatusBar from "@/components/auctions/AuctionStatusBar";
import AuctionImageGallery from "@/components/auctions/AuctionImageGallery";
import AuctionPropertyCard from "@/components/auctions/AuctionPropertyCard";
import AuctionDetailsCard from "@/components/auctions/AuctionDetailsCard";
import AuctionBidHistory from "@/components/auctions/AuctionBidHistory";
import AuctionBidPanel from "@/components/auctions/AuctionBidPanel";
import { Loader2 } from "lucide-react";

export default function AuctionDetail() {
  const { auctionCode } = useParams();
  const [auction, setAuction] = useState(null);
  const [property, setProperty] = useState(null);
  const [bids, setBids] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.PropertyAuction.filter({ auctionCode }),
      base44.auth.me().catch(() => null),
    ]).then(async ([auctionList, currentUser]) => {
      const auction = auctionList?.[0];
      if (!auction) {
        setLoading(false);
        return;
      }

      setAuction(auction);
      setUser(currentUser);

      // Fetch property and bids
      const [propertyData, bidsList] = await Promise.all([
        base44.entities.Property.get(auction.propertyId).catch(() => null),
        base44.entities.AuctionBid.filter({ auctionId: auction.id }, "-bidPlacedAt", 100),
      ]);

      setProperty(propertyData);
      setBids(bidsList || []);
      setLoading(false);
    });

    // Subscribe to real-time bid updates
    const unsubscribeBids = base44.entities.AuctionBid.subscribe((event) => {
      if (event.type === "create") {
        setBids(prev => [event.data, ...prev]);
      }
    });

    return unsubscribeBids;
  }, [auctionCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Auction not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      
      <AuctionStatusBar auction={auction} />

      <div className="max-w-[1400px] mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {property && (
              <>
                <AuctionImageGallery property={property} auction={auction} />
                <AuctionPropertyCard property={property} auction={auction} />
              </>
            )}

            <AuctionDetailsCard auction={auction} />

            <AuctionBidHistory bids={bids} auction={auction} />
          </div>

          {/* RIGHT COLUMN (STICKY) */}
          <div>
            <AuctionBidPanel auction={auction} bids={bids} user={user} />
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
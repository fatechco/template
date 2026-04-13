import AuctionCard from "./AuctionCard";

export default function FeaturedAuctions({ auctions }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
        ⭐ Featured Live Auctions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {auctions.map(auction => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
}
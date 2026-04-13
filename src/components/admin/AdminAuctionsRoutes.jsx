// Route wrapper for KemedarBid admin
import { useParams, useLocation } from "react-router-dom";
import AdminAuctionsOverview from "@/pages/admin/kemedar/auctions/AdminAuctionsOverview";
import AdminAuctionsPending from "@/pages/admin/kemedar/auctions/AdminAuctionsPending";
import AdminAuctionsAll from "@/pages/admin/kemedar/auctions/AdminAuctionsAll";
import AdminAuctionsTransfers from "@/pages/admin/kemedar/auctions/AdminAuctionsTransfers";
import AdminAuctionsDeposits from "@/pages/admin/kemedar/auctions/AdminAuctionsDeposits";
import AdminAuctionsSettings from "@/pages/admin/kemedar/auctions/AdminAuctionsSettings";

export default function AdminAuctionsRoutes() {
  const { pathname } = useLocation();

  if (pathname.endsWith("/pending")) return <AdminAuctionsPending />;
  if (pathname.endsWith("/all")) return <AdminAuctionsAll />;
  if (pathname.endsWith("/transfers")) return <AdminAuctionsTransfers />;
  if (pathname.endsWith("/deposits")) return <AdminAuctionsDeposits />;
  if (pathname.endsWith("/settings")) return <AdminAuctionsSettings />;
  return <AdminAuctionsOverview />;
}
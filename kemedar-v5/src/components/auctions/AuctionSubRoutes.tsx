// @ts-nocheck
// Thin wrapper to handle auction sub-routes without adding to AppRoutes
import { useParams, useLocation } from "next/link";
import SellerAuctionMonitor from "@/pages/kemedar/SellerAuctionMonitor";
import AuctionTransfer from "@/pages/kemedar/AuctionTransfer";

export default function AuctionSubRoutes() {
  const { auctionCode, subpage } = useParams();
  const pathname = usePathname();

  if (pathname.endsWith("/manage")) return <SellerAuctionMonitor />;
  if (pathname.endsWith("/transfer")) return <AuctionTransfer />;

  return null;
}
import SurplusESGDashboard from "@/pages/admin/kemetro/surplus/SurplusESGDashboard";
import SurplusListings from "@/pages/admin/kemetro/surplus/SurplusListings";
import SurplusTransactions from "@/pages/admin/kemetro/surplus/SurplusTransactions";
import SurplusShipments from "@/pages/admin/kemetro/surplus/SurplusShipments";
import SurplusEcoLeaderboard from "@/pages/admin/kemetro/surplus/SurplusEcoLeaderboard";
import SurplusSettings from "@/pages/admin/kemetro/surplus/SurplusSettings";

const PAGE_MAP = {
  dashboard: SurplusESGDashboard,
  listings: SurplusListings,
  transactions: SurplusTransactions,
  shipments: SurplusShipments,
  "eco-leaders": SurplusEcoLeaderboard,
  settings: SurplusSettings,
};

export default function AdminSurplusRoutes({ page = "dashboard" }) {
  const Component = PAGE_MAP[page] || SurplusESGDashboard;
  return <Component />;
}
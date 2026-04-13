import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SellerMobileDrawer from "@/components/seller/SellerMobileDrawer";
import SellerDashboardHome from "./SellerDashboardHome";
import SellerProductsMobile from "./SellerProductsMobile";
import SellerOrdersMobile from "./SellerOrdersMobile";
import SellerEarningsMobile from "./SellerEarningsMobile";
import SellerAnalyticsMobile from "./SellerAnalyticsMobile";
import SellerReviewsMobile from "./SellerReviewsMobile";
import SellerShipmentsMobile from "./SellerShipmentsMobile";
import SellerPromotionsMobile from "./SellerPromotionsMobile";
import SellerShippingSettingsMobile from "./SellerShippingSettingsMobile";
import SellerCouponsMobile from "./SellerCouponsMobile";
import SellerStoreSettingsMobile from "./SellerStoreSettingsMobile";
import SellerEditStoreMobile from "./SellerEditStoreMobile";

const NAV_TABS = [
  { icon: "⚙️", label: "Settings", path: "/m/settings" },
  { icon: "🔍", label: "Find", path: "/m/find/product" },
  { icon: "➕", label: "Add", path: "/m/add/product", fab: true },
  { icon: "🏷", label: "Buy", path: "/m/buy" },
  { icon: "👤", label: "Account", path: "/m/dashboard/profile" },
];

function PageContent({ path, onOpenDrawer }) {
  if (path.includes("seller-products")) return <SellerProductsMobile onOpenDrawer={onOpenDrawer} />;
  if (path.includes("seller-orders")) return <SellerOrdersMobile onOpenDrawer={onOpenDrawer} />;
  if (path.includes("seller-earnings")) return <SellerEarningsMobile onOpenDrawer={onOpenDrawer} />;
  if (path.includes("seller-analytics")) return <SellerAnalyticsMobile onOpenDrawer={onOpenDrawer} />;
  if (path.includes("seller-reviews")) return <SellerReviewsMobile onOpenDrawer={onOpenDrawer} />;
  if (path.includes("seller-shipments")) return <SellerShipmentsMobile onOpenDrawer={onOpenDrawer} />;
  if (path.includes("seller-promotions")) return <SellerPromotionsMobile onOpenDrawer={onOpenDrawer} />;
  if (path.includes("seller-shipping")) return <SellerShippingSettingsMobile onOpenDrawer={onOpenDrawer} />;
  if (path.includes("seller-coupons")) return <SellerCouponsMobile onOpenDrawer={onOpenDrawer} />;
  if (path.includes("seller-store-settings")) return <SellerStoreSettingsMobile onOpenDrawer={onOpenDrawer} />;
  if (path.includes("seller-edit-store")) return <SellerEditStoreMobile onOpenDrawer={onOpenDrawer} />;
  return <SellerDashboardHome onOpenDrawer={onOpenDrawer} />;
}

export default function SellerMobileShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  return (
    <div className="flex flex-col bg-[#F0F7FF] max-w-[480px] mx-auto relative" style={{ height: "100dvh" }}>
      <SellerMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={user} />

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto">
        <PageContent path={location.pathname} onOpenDrawer={() => setDrawerOpen(true)} />
      </div>

      {/* Bottom Nav */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 flex items-center" style={{ height: 64 }}>
        {NAV_TABS.map((tab, i) => {
          const isActive = location.pathname === tab.path;
          if (tab.fab) {
            return (
              <button key={i} onClick={() => navigate(tab.path)}
                className="flex-1 flex flex-col items-center justify-center relative">
                <div className="w-14 h-14 rounded-full text-white flex items-center justify-center text-2xl font-black shadow-lg -mt-6"
                  style={{ background: "#0077B6" }}>+</div>
              </button>
            );
          }
          return (
            <button key={i} onClick={() => navigate(tab.path)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2">
              <span className="text-xl">{tab.icon}</span>
              <span className={`text-[10px] font-bold ${isActive ? "text-[#0077B6]" : "text-gray-400"}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
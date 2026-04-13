import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Menu, X } from "lucide-react";
import SellerMobileDrawer from "@/components/seller/SellerMobileDrawer";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import KemetroSellerOverview from "@/components/kemetro/seller/KemetroSellerOverview";
import KemetroSellerProducts from "@/components/kemetro/seller/KemetroSellerProducts";
import KemetroSellerAddProduct from "@/components/kemetro/seller/KemetroSellerAddProduct";
import KemetroSellerOrders from "@/components/kemetro/seller/KemetroSellerOrders";
import KemetroSellerEarnings from "@/components/kemetro/seller/KemetroSellerEarnings";
import KemetroSellerReviews from "@/components/kemetro/seller/KemetroSellerReviews";
import KemetroSellerSettings from "@/components/kemetro/seller/KemetroSellerSettings";
import KemetroSellerSubscription from "@/components/kemetro/seller/KemetroSellerSubscription";
import KemetroSellerSupport from "@/components/kemetro/seller/KemetroSellerSupport";
import KemetroSellerAnalytics from "@/components/kemetro/seller/KemetroSellerAnalytics";
import KemetroSellerPromotions from "@/components/kemetro/seller/KemetroSellerPromotions";
import KemetroSellerShipping from "@/components/kemetro/seller/KemetroSellerShipping";
import KemetroSellerCoupons from "@/components/kemetro/seller/KemetroSellerCoupons";
import KemetroSellerShipmentsList from "@/components/kemetro/seller/shipments/KemetroSellerShipmentsList";
import KemetroShipmentCreate from "@/components/kemetro/seller/shipments/KemetroShipmentCreate";
import KemetroShipmentDetail from "@/components/kemetro/seller/shipments/KemetroShipmentDetail";

export default function KemetroSellerMobileDashboard() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authUser = await base44.auth.me();
        if (authUser?.id) {
          const stores = await base44.entities.KemetroStore.filter({ userId: authUser.id });
          if (stores?.length > 0) setStore(stores[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  const getPageTitle = () => {
    const p = pathname.replace(/\/$/, "");
    const basePath = p.startsWith("/m/kemetro/seller") ? "/m/kemetro/seller" : "/kemetro/seller";
    const seg = p.split(`${basePath}/`)[1] || "";
    const titles = {
      "products": "My Products", "products/add": "Add Product", "products/list": "My Products",
      "add-product": "Add Product", "orders": "Orders", "earnings": "Earnings",
      "reviews": "Reviews", "analytics": "Analytics", "promotions": "Promotions",
      "shipping": "Shipping", "coupons": "Coupons", "subscription": "Subscription",
      "settings": "Settings", "store-settings": "Store Settings", "store-profile": "Store Profile",
      "support": "Support", "shipments": "Shipments", "shipments/create": "New Shipment",
      "invoices": "Invoices", "payout": "Payout Settings", "payment-methods": "Payment Methods",
      "dashboard": "Seller Dashboard",
    };
    return titles[seg] || (seg.startsWith("shipments/") ? "Shipment Detail" : (seg.startsWith("orders/") ? "Order Detail" : "Seller Dashboard"));
  };

  const renderSection = () => {
    const p = pathname.replace(/\/$/, "");
    // Support both /m/kemetro/seller/* and /kemetro/seller/* (desktop)
    const basePath = p.startsWith("/m/kemetro/seller") ? "/m/kemetro/seller" : "/kemetro/seller";
    const seg = p.split(`${basePath}/`)[1] || "";

    if (seg === "products" || seg === "products/list") return <KemetroSellerProducts onAddProduct={() => navigate(`${basePath}/products/add`)} />;
    if (seg === "products/add" || seg === "add-product") return <KemetroSellerAddProduct onBack={() => navigate(`${basePath}/products`)} />;
    if (seg === "orders" || seg.startsWith("orders/")) return <KemetroSellerOrders />;
    if (seg === "earnings") return <KemetroSellerEarnings />;
    if (seg === "reviews") return <KemetroSellerReviews />;
    if (seg === "settings" || seg === "store-settings") return <KemetroSellerSettings />;
    if (seg === "store-profile") return <KemetroSellerSettings />;
    if (seg === "subscription") return <KemetroSellerSubscription />;
    if (seg === "support") return <KemetroSellerSupport />;
    if (seg === "analytics") return <KemetroSellerAnalytics />;
    if (seg === "promotions" || seg.startsWith("promotions/")) return <KemetroSellerPromotions />;
    if (seg === "shipping") return <KemetroSellerShipping />;
    if (seg === "coupons") return <KemetroSellerCoupons />;
    if (seg === "shipments") return <KemetroSellerShipmentsList onViewDetail={(id) => navigate(`${basePath}/shipments/${id}`)} />;
    if (seg === "shipments/create") return <KemetroShipmentCreate />;
    if (seg.startsWith("shipments/")) return <KemetroShipmentDetail onBack={() => navigate(`${basePath}/shipments`)} />;
    if (seg === "invoices") return <KemetroSellerEarnings />;
    if (seg === "payout" || seg === "payment-methods") return <KemetroSellerEarnings />;
    return <KemetroSellerOverview storeName={store?.storeName || "Your Store"} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8 flex items-start justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col relative">
        <SellerMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />
        <MobileTopBar
          title={getPageTitle()}
          showBack={pathname !== "/m/kemetro/seller/dashboard" && pathname !== "/kemetro/seller/dashboard"}
          rightAction={
            <button onClick={() => setDrawerOpen(true)} className="p-1">
              <Menu size={22} className="text-gray-700" />
            </button>
          }
        />
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
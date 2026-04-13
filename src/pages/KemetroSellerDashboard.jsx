import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import KemetroSellerSidebar from "@/components/kemetro/seller/KemetroSellerSidebar";
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

export default function KemetroSellerDashboard() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const renderSection = () => {
    // Support both /kemetro/seller/* and /dashboard/* routes
    const isProductsPath = pathname === "/kemetro/seller/products" || pathname === "/dashboard/seller-products";
    const isAddProductPath = pathname === "/kemetro/seller/add-product" || pathname === "/dashboard/add-product";
    const isOrdersPath = pathname === "/kemetro/seller/orders" || pathname === "/dashboard/seller-orders";
    const isEarningsPath = pathname === "/kemetro/seller/earnings" || pathname === "/dashboard/seller-earnings";
    const isReviewsPath = pathname === "/kemetro/seller/reviews" || pathname === "/dashboard/seller-reviews";
    const isSettingsPath = pathname === "/kemetro/seller/settings" || pathname === "/dashboard/seller-settings";
    const isSubscriptionPath = pathname === "/kemetro/seller/subscription" || pathname === "/dashboard/seller-subscription";
    const isSupportPath = pathname === "/kemetro/seller/support" || pathname === "/dashboard/seller-support";
    const isAnalyticsPath = pathname === "/kemetro/seller/analytics" || pathname === "/dashboard/seller-analytics";
    const isPromotionsPath = pathname === "/kemetro/seller/promotions" || pathname === "/dashboard/seller-promotions";
    const isShippingPath = pathname === "/kemetro/seller/shipping" || pathname === "/dashboard/shipping-settings";
    const isCouponsPath = pathname === "/kemetro/seller/coupons" || pathname === "/dashboard/seller-coupons";

    if (isProductsPath) return <KemetroSellerProducts onAddProduct={() => navigate(pathname.startsWith("/dashboard") ? "/dashboard/add-product" : "/kemetro/seller/add-product")} />;
    if (isAddProductPath) return <KemetroSellerAddProduct onBack={() => navigate(pathname.startsWith("/dashboard") ? "/dashboard/seller-products" : "/kemetro/seller/products")} />;
    if (isOrdersPath) return <KemetroSellerOrders />;
    if (isEarningsPath) return <KemetroSellerEarnings />;
    if (isReviewsPath) return <KemetroSellerReviews />;
    if (isSettingsPath) return <KemetroSellerSettings />;
    if (isSubscriptionPath) return <KemetroSellerSubscription />;
    if (isSupportPath) return <KemetroSellerSupport />;
    if (isAnalyticsPath) return <KemetroSellerAnalytics />;
    if (isPromotionsPath) return <KemetroSellerPromotions />;
    if (isShippingPath) return <KemetroSellerShipping />;
    if (isCouponsPath) return <KemetroSellerCoupons />;
    if (pathname === "/kemetro/seller/shipments" || pathname === "/dashboard/seller-shipments") return <KemetroSellerShipmentsList onViewDetail={(id) => navigate(pathname.startsWith("/dashboard") ? `/dashboard/seller-shipments/${id}` : `/kemetro/seller/shipments/${id}`)} />;
    if (pathname === "/kemetro/seller/shipments/create" || pathname === "/dashboard/seller-shipments/create") return <KemetroShipmentCreate />;
    if (pathname.startsWith("/kemetro/seller/shipments/") || pathname.startsWith("/dashboard/seller-shipments/")) return <KemetroShipmentDetail onBack={() => navigate(pathname.startsWith("/dashboard") ? "/dashboard/seller-shipments" : "/kemetro/seller/shipments")} />;
    return <KemetroSellerOverview storeName={store?.storeName || "Your Store"} />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <KemetroSellerSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
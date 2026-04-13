import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Menu } from "lucide-react";
import ShipperMobileDrawer from "@/components/kemetro/shipper/mobile/ShipperMobileDrawer";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import ShipperMobileOverview from "@/components/kemetro/shipper/mobile/ShipperMobileOverview";
import ShipperMobileActiveShipments from "@/components/kemetro/shipper/mobile/ShipperMobileActiveShipments";
import ShipperMobileRequests from "@/components/kemetro/shipper/mobile/ShipperMobileRequests";
import ShipperMobileCompleted from "@/components/kemetro/shipper/mobile/ShipperMobileCompleted";
import ShipperMobileEarnings from "@/components/kemetro/shipper/mobile/ShipperMobileEarnings";
import ShipperMobilePayout from "@/components/kemetro/shipper/mobile/ShipperMobilePayout";
import ShipperMobileSetup from "@/pages/m/kemetro/shipper/ShipperSetupMobile";
import ShipperMobileDocuments from "@/components/kemetro/shipper/mobile/ShipperMobileDocuments";
import ShipperMobileReviews from "@/components/kemetro/shipper/mobile/ShipperMobileReviews";

export default function KemetroShipperMobileDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authUser = await base44.auth.me();
        if (authUser?.id) {
          setUser(authUser);
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
        <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  const getPageTitle = () => {
    if (pathname.includes("/active")) return "Active Shipments";
    if (pathname.includes("/requests")) return "Shipment Requests";
    if (pathname.includes("/completed")) return "Completed";
    if (pathname.includes("/earnings")) return "Earnings";
    if (pathname.includes("/payout")) return "Payouts";
    if (pathname.includes("/setup")) return "Shipper Setup";
    if (pathname.includes("/documents")) return "Documents";
    if (pathname.includes("/reviews")) return "Reviews";
    return "Shipper Dashboard";
  };

  const renderSection = () => {
    const basePath = "/m/kemetro/shipper";
    
    if (pathname === `${basePath}/dashboard` || pathname === basePath) return <ShipperMobileOverview />;
    if (pathname === `${basePath}/active`) return <ShipperMobileActiveShipments />;
    if (pathname === `${basePath}/requests`) return <ShipperMobileRequests />;
    if (pathname === `${basePath}/completed`) return <ShipperMobileCompleted />;
    if (pathname === `${basePath}/earnings`) return <ShipperMobileEarnings />;
    if (pathname === `${basePath}/payout`) return <ShipperMobilePayout />;
    if (pathname === `${basePath}/setup`) return <ShipperMobileSetup />;
    if (pathname === `${basePath}/documents`) return <ShipperMobileDocuments />;
    if (pathname === `${basePath}/reviews`) return <ShipperMobileReviews />;
    
    return <ShipperMobileOverview />;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8 flex items-start justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col relative">
        <ShipperMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={user} />
        <MobileTopBar
          title={getPageTitle()}
          showBack={pathname !== "/m/kemetro/shipper/dashboard"}
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
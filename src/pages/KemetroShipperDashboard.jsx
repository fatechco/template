import { useState } from "react";
import KemetroShipperSidebar from "@/components/kemetro/shipper/KemetroShipperSidebar";
import KemetroShipperOverview from "@/components/kemetro/shipper/KemetroShipperOverview";
import KemetroShipperRequests from "@/components/kemetro/shipper/KemetroShipperRequests";
import KemetroShipperActiveShipments from "@/components/kemetro/shipper/KemetroShipperActiveShipments";
import KemetroShipperCompleted from "@/components/kemetro/shipper/KemetroShipperCompleted";
import KemetroShipperEarnings from "@/components/kemetro/shipper/KemetroShipperEarnings";
import KemetroShipperReviews from "@/components/kemetro/shipper/KemetroShipperReviews";
import KemetroShipperSetup from "@/pages/dashboard/kemetro-seller/ShipperSetupDesktop";
import KemetroShipperDocuments from "@/components/kemetro/shipper/KemetroShipperDocuments";
import KemetroShipperPayout from "@/components/kemetro/shipper/KemetroShipperPayout";

const SECTIONS = {
  overview: KemetroShipperOverview,
  requests: KemetroShipperRequests,
  active: KemetroShipperActiveShipments,
  completed: KemetroShipperCompleted,
  earnings: KemetroShipperEarnings,
  reviews: KemetroShipperReviews,
  setup: KemetroShipperSetup,
  documents: KemetroShipperDocuments,
  payout: KemetroShipperPayout,
};

export default function KemetroShipperDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const SectionComponent = SECTIONS[activeSection] || KemetroShipperOverview;

  return (
    <div className="flex h-screen bg-gray-50">
      <KemetroShipperSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <SectionComponent />
        </div>
      </main>
    </div>
  );
}
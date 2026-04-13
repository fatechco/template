import { useState } from "react";
import KemetroAdminSidebar from "@/components/kemetro/admin/KemetroAdminSidebar";
import KemetroAdminOverview from "@/components/kemetro/admin/KemetroAdminOverview";
import KemetroAdminSellers from "@/components/kemetro/admin/KemetroAdminSellers";
import KemetroAdminProducts from "@/components/kemetro/admin/KemetroAdminProducts";
import KemetroAdminCommissions from "@/components/kemetro/admin/KemetroAdminCommissions";
import KemetroAdminOrders from "@/components/kemetro/admin/KemetroAdminOrders";
import KemetroAdminCategories from "@/components/kemetro/admin/KemetroAdminCategories";
import KemetroAdminReviews from "@/components/kemetro/admin/KemetroAdminReviews";
import KemetroAdminPromotions from "@/components/kemetro/admin/KemetroAdminPromotions";
import KemetroAdminPackagesOrders from "@/components/kemetro/admin/KemetroAdminPackagesOrders";
import KemetroAdminShipping from "@/components/kemetro/admin/KemetroAdminShipping";

export default function KemetroAdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="flex h-screen bg-gray-50">
      <KemetroAdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === "overview" && <KemetroAdminOverview />}
          {activeSection === "sellers" && <KemetroAdminSellers />}
          {activeSection === "products" && <KemetroAdminProducts />}
          {activeSection === "commissions" && <KemetroAdminCommissions />}
          {activeSection === "orders" && <KemetroAdminOrders />}
          {activeSection === "categories" && <KemetroAdminCategories />}
          {activeSection === "reviews" && <KemetroAdminReviews />}
          {activeSection === "promotions" && <KemetroAdminPromotions />}
          {activeSection === "packages" && <KemetroAdminPackagesOrders />}
          {activeSection === "shipping" && <KemetroAdminShipping />}
        </div>
      </main>
    </div>
  );
}
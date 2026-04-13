import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";
import KemetroSellerHero from "@/components/kemetro/seller/KemetroSellerHero";
import KemetroSellerSteps from "@/components/kemetro/seller/KemetroSellerSteps";
import KemetroSellerPlans from "@/components/kemetro/seller/KemetroSellerPlans";
import KemetroSellerRegistration from "@/components/kemetro/seller/KemetroSellerRegistration";

export default function KemetroSellerRegister() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    base44.entities.KemetroCategory.filter({ isActive: true, parentId: null })
      .then((data) => setCategories(data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />
      <KemetroSellerHero />
      <KemetroSellerSteps />
      <KemetroSellerPlans />
      <section className="w-full bg-white py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <KemetroSellerRegistration categories={categories} />
        </div>
      </section>
      <KemetroFooter />
    </div>
  );
}
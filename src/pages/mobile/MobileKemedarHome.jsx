import { useOutletContext } from "react-router-dom";
import MobileHeroSlider from "@/components/mobile/kemedar/MobileHeroSlider";
import MobileSearchBar from "@/components/mobile/kemedar/MobileSearchBar";
import MobileFeaturedProperties from "@/components/mobile/kemedar/MobileFeaturedProperties";
import MobileFeaturedProjects from "@/components/mobile/kemedar/MobileFeaturedProjects";
import MobileFeaturedAgents from "@/components/mobile/kemedar/MobileFeaturedAgents";
import MobileFeaturedAgencies from "@/components/mobile/kemedar/MobileFeaturedAgencies";
import MobileCTASection from "@/components/mobile/kemedar/MobileCTASection";
import MobileCategoryGrid from "@/components/mobile/kemedar/MobileCategoryGrid";
import MobileFindFranchise from "@/components/mobile/kemedar/MobileFindFranchise";

export default function MobileKemedarHome() {
  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <MobileHeroSlider />
      <MobileSearchBar />
      <MobileFeaturedProperties />
      <MobileFeaturedProjects />
      <MobileFeaturedAgents />
      <MobileFeaturedAgencies />
      <MobileCTASection />
      <MobileCategoryGrid />
      <MobileFindFranchise />
      <div style={{ height: 80 }} />
    </div>
  );
}
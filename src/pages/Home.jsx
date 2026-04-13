import SiteHeader from "@/components/header/SiteHeader";
import HeroBanner from "@/components/hero/HeroBanner";
import KemedarAISlider from "@/components/home/KemedarAISlider";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import FeaturedAgents from "@/components/home/FeaturedAgents";
import FeaturedAgencies from "@/components/home/FeaturedAgencies";
import FeaturedDevelopers from "@/components/home/FeaturedDevelopers";
import FranchiseBanner from "@/components/home/FranchiseBanner";
import CallToAction from "@/components/home/CallToAction";
import SuperFooter from "@/components/layout/SuperFooter";
import { useModules } from "@/lib/ModuleContext";

export default function Home() {
  const { isModuleActive } = useModules();
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <HeroBanner />
      <KemedarAISlider />
      <FeaturedProperties />
      <CallToAction />
      <FeaturedProjects />
      {isModuleActive('kemedar') && <FeaturedAgents />}
      {isModuleActive('kemedar') && <FeaturedAgencies />}
      {isModuleActive('kemedar') && <FeaturedDevelopers />}
      {isModuleActive('kemedar') && <FranchiseBanner />}
      <SuperFooter />
    </div>
  );
}
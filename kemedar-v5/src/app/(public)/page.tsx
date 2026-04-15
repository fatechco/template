"use client";

import HeroBanner from "@/components/hero/HeroBanner";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import KemedarAISlider from "@/components/home/KemedarAISlider";
import CallToAction from "@/components/home/CallToAction";
import FeaturedAgents from "@/components/home/FeaturedAgents";
import FeaturedAgencies from "@/components/home/FeaturedAgencies";
import FeaturedDevelopers from "@/components/home/FeaturedDevelopers";
import FranchiseBanner from "@/components/home/FranchiseBanner";
import { useModules } from "@/lib/module-context";

export default function HomePage() {
  const { isModuleEnabled } = useModules();

  return (
    <>
      <HeroBanner />
      <KemedarAISlider />
      <FeaturedProperties />
      <CallToAction />
      <FeaturedProjects />
      {isModuleEnabled("kemedar") && (
        <>
          <FeaturedAgents />
          <FeaturedAgencies />
          <FeaturedDevelopers />
          <FranchiseBanner />
        </>
      )}
    </>
  );
}

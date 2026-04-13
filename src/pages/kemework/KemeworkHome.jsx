import KWHero from "@/components/kemework/home/KWHero.jsx";
import KWSearchBar from "@/components/kemework/home/KWSearchBar.jsx";
import KWHowItWorks from "@/components/kemework/home/KWHowItWorks.jsx";
import KWCategories from "@/components/kemework/home/KWCategories.jsx";
import KWFeaturedProfessionals from "@/components/kemework/home/KWFeaturedProfessionals.jsx";
import KWFeaturedServices from "@/components/kemework/home/KWFeaturedServices.jsx";
import KWPreferredProgram from "@/components/kemework/home/KWPreferredProgram.jsx";
import KWRecentTasks from "@/components/kemework/home/KWRecentTasks.jsx";
import KWStats from "@/components/kemework/home/KWStats.jsx";
import KWTestimonials from "@/components/kemework/home/KWTestimonials.jsx";
import KWBottomCTA from "@/components/kemework/home/KWBottomCTA.jsx";
import SnapAndFixEntryCards from "@/components/snap-and-fix/SnapAndFixEntryCards";
import KemeworkAISlider from "@/components/home/KemeworkAISlider";

export default function KemeworkHome() {
  return (
    <div>
      <KWHero />
      <KemeworkAISlider />
      <SnapAndFixEntryCards />
      <KWSearchBar />
      <KWHowItWorks />
      <KWCategories />
      <KWFeaturedProfessionals />
      <KWFeaturedServices />
      <KWPreferredProgram />
      <KWRecentTasks />
      <KWStats />
      <KWTestimonials />
      <KWBottomCTA />
    </div>
  );
}
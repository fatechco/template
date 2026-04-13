import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import FOHero from "@/components/franchise-area/FOHero";
import FOWhatIs from "@/components/franchise-area/FOWhatIs";
import FORevenueStreams from "@/components/franchise-area/FORevenueStreams";
import FOWhatYouGet from "@/components/franchise-area/FOWhatYouGet";
import FOWhoIsItFor from "@/components/franchise-area/FOWhoIsItFor";
import FOHowItWorks from "@/components/franchise-area/FOHowItWorks";
import FOPackages from "@/components/franchise-area/FOPackages";
import FOTestimonials from "@/components/franchise-area/FOTestimonials";
import FOFAQ from "@/components/franchise-area/FOFAQ";
import FOFinalCTA from "@/components/franchise-area/FOFinalCTA";
import FOApplicationForm from "@/components/franchise-area/FOApplicationForm";

export default function FranchiseOwnerArea() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />
      <FOHero />
      <FOWhatIs />
      <FORevenueStreams />
      <FOWhatYouGet />
      <FOWhoIsItFor />
      <FOHowItWorks />
      <FOPackages />
      <FOTestimonials />
      <FOFAQ />
      <FOFinalCTA />
      <FOApplicationForm />
      <SiteFooter />
    </div>
  );
}
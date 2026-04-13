import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroHeroSlider from "@/components/kemetro/home/KemetroHeroSlider";
import KemetroValueProps from "@/components/kemetro/home/KemetroValueProps";
import KemetroAISlider from "@/components/home/KemetroAISlider";
import KemetroCategoryShop from "@/components/kemetro/home/KemetroCategoryShop";
import KemetroFlashDeals from "@/components/kemetro/home/KemetroFlashDeals";
import KemetroFeaturedProducts from "@/components/kemetro/home/KemetroFeaturedProducts";
import KemetroFeaturedStores from "@/components/kemetro/home/KemetroFeaturedStores";
import KemetroShopByRoom from "@/components/kemetro/home/KemetroShopByRoom";
import KemetroNewArrivals from "@/components/kemetro/home/KemetroNewArrivals";
import KemetroBestSellers from "@/components/kemetro/home/KemetroBestSellers";
import KemetroBecomeSeller from "@/components/kemetro/home/KemetroBecomeSeller";
import KemetroTopBrands from "@/components/kemetro/home/KemetroTopBrands";
import KemeKitsBanner from "@/components/kemetro/home/KemeKitsBanner";
import KemetroWhyChoose from "@/components/kemetro/home/KemetroWhyChoose";
import KemetroRecentlyViewed from "@/components/kemetro/home/KemetroRecentlyViewed";
import SuperFooter from "@/components/layout/SuperFooter";

export default function KemetroHome() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />
      <KemetroHeroSlider />
      <KemetroAISlider />
      <KemetroValueProps />
      <KemeKitsBanner />
      <KemetroCategoryShop />
      <KemetroFlashDeals />
      <KemetroFeaturedProducts />
      <KemetroFeaturedStores />
      <KemetroShopByRoom />
      <KemetroNewArrivals />
      <KemetroBestSellers />
      <KemetroTopBrands />
      <KemetroWhyChoose />
      <KemetroRecentlyViewed />
      <KemetroBecomeSeller />
      <SuperFooter />
    </div>
  );
}
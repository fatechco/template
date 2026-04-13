import AIFeaturesSlider from "./AIFeaturesSlider";

const CARDS = [
  { icon: "📐", name: "KemeKits™", tagline: "ROOM-IN-A-BOX CALCULATOR", description: "Enter your room size. Get exact tiles, paint and fixtures — in one cart click.", link: "/kemetro/kemekits" },
  { icon: "♻️", name: "Surplus & Salvage", tagline: "ECO MATERIALS MARKET", description: "Buy leftover building materials at up to 80% off from nearby sellers.", link: "/kemetro/surplus" },
  { icon: "✨", name: "Shop the Look™", tagline: "SHOPPABLE PROPERTY PHOTOS", description: "Tap any furniture in a property photo to find and buy it on Kemetro.", link: "/kemedar/vision/landing" },
  { icon: "🏗️", name: "Kemetro Build™", tagline: "AI BOQ GENERATOR", description: "Upload a floor plan. AI calculates every material needed with zero waste.", link: "/kemetro/build" },
  { icon: "⚡", name: "Kemetro Flash™", tagline: "GROUP BUYING DEALS", description: "Join a group purchase and unlock wholesale prices on premium materials.", link: "/kemetro/flash" },
  { icon: "🤖", name: "AI Price Match", tagline: "SMART PRICE COMPARISON", description: "AI scans all sellers and surfaces the best price for every product instantly.", link: "/kemetro/search" },
  { icon: "🌍", name: "ESG Impact Tracker", tagline: "SUSTAINABILITY SCORE", description: "Track the carbon footprint saved by every surplus purchase you make.", link: "/kemetro/surplus" },
];

export default function KemetroAISlider() {
  return (
    <AIFeaturesSlider
      accentColor="#0A6EBD"
      title="ThinkDar™ for Materials — AI That Builds Smarter"
      subtitle="From calculating exact material quantities to finding the best surplus deal nearby — AI makes every purchase more precise."
      cards={CARDS}
      exploreLink="/thinkdar"
    />
  );
}
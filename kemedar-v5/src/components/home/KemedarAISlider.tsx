// @ts-nocheck
import AIFeaturesSlider from "./AIFeaturesSlider";

const CARDS = [
  { icon: "🧠", name: "Kemedar Predict™", tagline: "AI MARKET FORECASTING", description: "See where property prices are headed in 6, 12 and 36 months — before you buy.", link: "/kemedar/predict" },
  { icon: "🏘️", name: "Kemedar Match™", tagline: "SWIPE TO FIND YOUR HOME", description: "Tinder-style property discovery. Swipe right on homes you love.", link: "/kemedar/match" },
  { icon: "🤖", name: "Kemedar Coach™", tagline: "YOUR PERSONAL PROPERTY GUIDE", description: "A personal AI guide through every step of your buying or selling journey.", link: "/kemedar/coach" },
  { icon: "👁️", name: "Kemedar Vision™", tagline: "AI PHOTO ANALYZER", description: "AI scores your listing photos and suggests improvements to sell faster.", link: "/kemedar/vision/landing" },
  { icon: "📊", name: "Life Score™", tagline: "NEIGHBORHOOD INTELLIGENCE", description: "7 lifestyle scores for every area — safety, schools, walkability and more.", link: "/kemedar/life-score" },
  { icon: "🤝", name: "Kemedar Negotiate™", tagline: "AI NEGOTIATION COACH", description: "Know exactly what to offer and how to argue it — before you call.", link: "/kemedar/negotiate/landing" },
  { icon: "🤖", name: "Kemedar Advisor™", tagline: "BUYER PROFILE MATCHING", description: "Tell us what you need once. AI finds your perfect matches forever.", link: "/kemedar/advisor" },
  { icon: "🔐", name: "Verify Pro™", tagline: "BLOCKCHAIN VERIFICATION", description: "5-level blockchain certificate proving every property is real and legal.", link: "/kemedar/verify-pro" },
  { icon: "🔄", name: "Kemedar Swap™", tagline: "AI PROPERTY MATCHMAKER", description: "Trade your property directly with another owner. No cash sale needed.", link: "/dashboard/swap" },
  { icon: "🔨", name: "KemedarBid™", tagline: "LIVE PROPERTY AUCTIONS", description: "Bid on exclusive properties in real-time. Secure. Transparent. Live.", link: "/auctions" },
  { icon: "🔷", name: "KemeFrac™", tagline: "FRACTIONAL INVESTING ON NEAR", description: "Buy fractions of premium properties and earn rental returns from day one.", link: "/kemefrac" },
  { icon: "🧬", name: "Kemedar DNA™", tagline: "PERSONALIZATION ENGINE", description: "The platform learns what you love and gets smarter with every visit.", link: "/kemedar/dna/landing" },
];

export default function KemedarAISlider() {
  return (
    <AIFeaturesSlider
      exploreLink="/thinkdar"
      accentColor="#FF6B00"
      title="ThinkDar™ Intelligence — AI Built for Real Estate"
      subtitle="20 AI-powered features designed to make buying, selling, and investing in Egyptian real estate smarter than ever before."
      cards={CARDS}
      exploreLink="/thinkdar"
    />
  );
}
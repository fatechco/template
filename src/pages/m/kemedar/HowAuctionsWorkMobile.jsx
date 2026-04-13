import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const SELLER_STEPS = [
  { num: 1, icon: "📋", title: "List Your Property for Auction", body: 'Mark your property "For Auction" when listing. Set your starting price, reserve price (kept hidden), bidding duration, and buyer requirements.' },
  { num: 2, icon: "✅", title: "Admin Reviews Your Auction", body: "Our team reviews your listing within 24–48 hours to ensure it meets platform quality standards." },
  { num: 3, icon: "🔐", title: "Pay Seller Deposit to Activate", body: "Pay a small refundable deposit (0.5% of starting price) to confirm your commitment. Fully returned on successful sale." },
  { num: 4, icon: "🔴", title: "Watch the Live Bidding", body: "Monitor your auction dashboard in real-time. Watch bids climb, track your reserve status, and see the competition heat up." },
  { num: 5, icon: "🏆", title: "Receive Your Winner", body: "When the auction ends, the winner has 48 hours to complete payment. If they fail, you keep 50% of their deposit." },
  { num: 6, icon: "💰", title: "Get Paid via Escrow", body: "Once the winner pays, funds go into XeedWallet Escrow. Released to you when the title deed is officially transferred." },
];

const BUYER_STEPS = [
  { num: 1, icon: "👁️", title: "Browse Auctions", body: "Find live and upcoming property auctions. Filter by city, property type, and budget." },
  { num: 2, icon: "📋", title: "Register + Pay Deposit", body: "Register to bid by paying a refundable deposit. Complete KYC identity verification first. Your deposit is 100% returned if you don't win." },
  { num: 3, icon: "🔨", title: "Place Your Bids", body: "Bid manually or set an automatic maximum bid. The system outbids competitors on your behalf, up to your limit." },
  { num: 4, icon: "⏰", title: "Stay Alert to Extensions", body: "A bid placed in the final minutes may extend the auction. Last-minute excitement is part of the process — keep watching!" },
  { num: 5, icon: "🏆", title: "Win — Then Pay Within 48 Hours", body: "If you win, complete full payment within 48 hours. Your deposit counts toward your total. Failure to pay forfeits your deposit." },
  { num: 6, icon: "⚖️", title: "Legal Transfer — Keys Are Yours", body: "A Kemework lawyer handles the title transfer. Funds sit safely in escrow until the deed is in your name." },
];

const FAQS = [
  { q: "Can I cancel a bid after placing it?", a: "No. All bids are legally binding. Bid carefully." },
  { q: "What happens if the reserve price is not met?", a: "Seller can accept the highest offer or re-list." },
  { q: "Is the reserve price ever revealed?", a: "Never. Only whether it has been met or not." },
  { q: "What if I win but cannot complete payment?", a: "Your deposit is forfeited. Seller receives 50%." },
  { q: "Is my deposit safe?", a: "Yes — held in XeedWallet Escrow at all times." },
  { q: "Are there bidding fees?", a: "No fees to register or bid. Platform commission is 2% on the final sale price, paid by seller." },
];

export default function HowAuctionsWorkMobile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sellers");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const steps = activeTab === "sellers" ? SELLER_STEPS : BUYER_STEPS;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Navbar */}
      <div style={{ background: "#1a1a2e", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between border-b border-white/10">
        <button
          onClick={() => { if (window.history.length > 1) navigate(-1); else navigate("/m/auctions"); }}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">How KemedarBid™ Works</p>
        <div style={{ width: 36 }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Hero */}
        <div className="px-5 pt-8 pb-8 text-white text-center"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0d0d1a 100%)" }}>
          <div className="text-5xl mb-3">🔨</div>
          <h1 className="text-2xl font-black mb-2">How KemedarBid™ Works</h1>
          <p className="text-gray-300 text-sm leading-relaxed">
            Transparent, fair, and legally secure property auctions on Kemedar.
          </p>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex">
          {["sellers", "buyers"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                activeTab === tab
                  ? "border-b-2 text-[#C41230]"
                  : "text-gray-500"
              }`}
              style={activeTab === tab ? { borderColor: "#C41230" } : {}}>
              For {tab === "sellers" ? "Sellers" : "Buyers"}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="px-4 py-5 space-y-3">
          {steps.map(step => (
            <div key={step.num} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "#C4123015" }}>
                  {step.icon}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full mb-1 inline-block"
                  style={{ background: "#C4123015", color: "#C41230" }}>
                  Step {step.num}
                </span>
                <h3 className="font-black text-gray-900 text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="px-4 py-5">
          <h2 className="font-black text-gray-900 text-base mb-3">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <button key={i} onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-gray-900 text-xs">{faq.q}</p>
                  <ChevronDown size={16}
                    className={`flex-shrink-0 text-gray-400 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                </div>
                {expandedFaq === i && (
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">{faq.a}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-4 mb-6 rounded-2xl p-5 text-white text-center"
          style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
          <p className="font-black text-base mb-1">Ready to get started?</p>
          <p className="text-gray-400 text-xs mb-4">Start buying or selling properties with KemedarBid™ today.</p>
          <div className="flex gap-2 justify-center">
            <Link to="/m/auctions"
              className="inline-block font-black text-sm px-5 py-2.5 rounded-xl text-white"
              style={{ background: "#C41230" }}>
              🔨 Browse Auctions
            </Link>
            <Link to="/m/add/property/"
              className="inline-block font-black text-sm px-5 py-2.5 rounded-xl text-white"
              style={{ background: "#FF6B00" }}>
              🏠 List Property
            </Link>
          </div>
        </div>

        <div className="h-20" />
      </div>

      <MobileBottomNav />
    </div>
  );
}
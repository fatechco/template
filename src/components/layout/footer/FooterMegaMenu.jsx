import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";

// ─── Shared helpers ─────────────────────────────────────────────────────────

const NEW = (
  <span style={{ display: "inline-block", background: "rgba(255,107,0,0.1)", border: "1px solid #FF6B00", color: "#FF6B00", fontSize: 9, fontWeight: 700, textTransform: "uppercase", borderRadius: 4, padding: "1px 5px", marginLeft: 6 }}>
    NEW
  </span>
);

function SubHead({ children }) {
  return (
    <p style={{ color: "#6B7280", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #F3F4F6", paddingBottom: 6, marginBottom: 10, marginTop: 20 }}>
      {children}
    </p>
  );
}

function MLink({ to, children, isNew, color = "#6B7280" }) {
  return (
    <Link
      to={to || "/"}
      className="flex items-center rounded-lg transition-all"
      style={{ fontSize: 14, color: "#374151", padding: "7px 8px", textDecoration: "none", gap: 8 }}
      onMouseEnter={e => { e.currentTarget.style.background = "#FFF7ED"; e.currentTarget.style.color = "#FF6B00"; e.currentTarget.style.paddingLeft = "12px"; }}
      onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#374151"; e.currentTarget.style.paddingLeft = "8px"; }}
    >
      {children}{isNew && NEW}
    </Link>
  );
}

// ─── Menu content definitions ────────────────────────────────────────────────

function MenuFind() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
      <div>
        <SubHead>🏠 Real Estate</SubHead>
        <MLink to="/search-properties">🏠 Properties</MLink>
        <MLink to="/search-projects">🏗️ Projects</MLink>
        <MLink to="/find-profile/real-estate-agents">🤝 Agents</MLink>
        <MLink to="/find-profile/agency">🏢 Agencies</MLink>
        <MLink to="/find-profile/developer">👷 Developers</MLink>
        <MLink to="/find-profile/franchise-owner">🗺️ Franchise Owners</MLink>
        <MLink to="/kemedar/buy-requests">📋 Buy Requests</MLink>
      </div>
      <div>
        <SubHead>🔧 Services</SubHead>
        <MLink to="/kemework/find-professionals">🔧 Professionals</MLink>
        <MLink to="/kemework/tasks">📋 Tasks</MLink>
        <MLink to="/kemetro/search">🛒 Products</MLink>
        <MLink to="/kemetro/search">🏪 Stores</MLink>
        <MLink to="/kemetro/buyer/rfqs/create">📝 Post an RFQ</MLink>
        <MLink to="/kemetro/surplus">♻️ Surplus Materials</MLink>
      </div>
      <div>
        <SubHead>🧠 ThinkDar™ Powered</SubHead>
        <MLink to="/kemedar/match">🏘️ Match™ Swipe</MLink>
        <MLink to="/kemedar/predict">📊 Predict™ Forecast</MLink>
        <MLink to="/search-properties">🏆 Verified Properties</MLink>
        <MLink to="/auctions">🔨 Live Auctions</MLink>
        <MLink to="/dashboard/swap">🔄 Swap Matches</MLink>
        <MLink to="/kemefrac">🔷 KemeFrac™ Offerings</MLink>
      </div>
    </div>
  );
}

function MenuCreate() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
      <div>
        <SubHead>🏠 Real Estate</SubHead>
        <MLink to="/create/property">🏠 Property</MLink>
        <MLink to="/create/project">🏗️ Project</MLink>
        <MLink to="/create/buy-request">📋 Buy Request</MLink>
        <MLink to="/kemedar/add/property/ai">📸 AI Property Listing</MLink>
      </div>
      <div>
        <SubHead>🔧 Services & Products</SubHead>
        <MLink to="/kemework/post-task">📋 Post a Task</MLink>
        <MLink to="/kemework/add-service">🔧 Add a Service</MLink>
        <MLink to="/kemetro/seller/add-product">📦 Add a Product</MLink>
        <MLink to="/kemetro/buyer/rfqs/create">📝 Post an RFQ</MLink>
        <MLink to="/kemetro/surplus/add" isNew>♻️ Sell Surplus</MLink>
      </div>
      <div>
        <SubHead>💰 Investment & Premium</SubHead>
        <MLink to="/create/property">🔨 List for Auction</MLink>
        <MLink to="/create/property">🔄 List for Swap</MLink>
        <MLink to="/create/property">🔷 Offer KemeFrac™</MLink>
        <MLink to="/kemework/pro/kemekits/create" isNew>🎨 Create KemeKit™</MLink>
        <MLink to="/kemework/snap" isNew>📷 Snap & Fix™</MLink>
      </div>
    </div>
  );
}

function MenuInvest() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
      <div>
        <SubHead>🔷 Property Investment</SubHead>
        <MLink to="/kemefrac" isNew>🔷 KemeFrac™ Investing</MLink>
        <MLink to="/auctions" isNew>🔨 KemedarBid™ Auctions</MLink>
        <MLink to="/kemefrac">📊 Browse Offerings</MLink>
        <MLink to="/search-properties">🏆 Investment Grade Properties</MLink>
        <MLink to="/kemedar/predict">🔮 Predict™ Forecasts</MLink>
      </div>
      <div>
        <SubHead>🔄 Smart Strategies</SubHead>
        <MLink to="/dashboard/swap" isNew>🔄 Kemedar Swap™</MLink>
        <MLink to="/kemedar/twin-cities">🌍 Twin Cities™</MLink>
        <MLink to="/kemedar/rent2own/landing">🏡 Rent2Own™</MLink>
        <MLink to="/kemedar/life-score">📊 Life Score™ Areas</MLink>
        <MLink to="/kemedar/expat">🌍 Kemedar Expat™</MLink>
      </div>
      <div>
        <SubHead>🧠 AI Investment Tools</SubHead>
        <MLink to="/kemedar/advisor">📈 Kemedar Advisor™</MLink>
        <MLink to="/kemedar/predict">📊 Market Signals</MLink>
        <MLink to="/kemedar/score/landing">⭐ Kemedar Score™</MLink>
        <MLink to="/verify/my-property">🔐 Verify Pro™</MLink>
        <MLink to="/kemedar/escrow/landing">🏦 Kemedar Escrow™</MLink>
      </div>
    </div>
  );
}

function MenuAITools() {
  return (
    <div>
      {/* Banner */}
      <div className="flex items-center gap-4 rounded-xl" style={{ background: "#1E1B4B", padding: "14px 20px", marginBottom: 24 }}>
        <span style={{ fontSize: 28 }}>🧠</span>
        <div className="flex-1">
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>ThinkDar™ — The First AI Model Built Exclusively for Real Estate</p>
          <p style={{ color: "#9CA3AF", fontSize: 12 }}>Powered by Kemedar®</p>
        </div>
        <Link to="/thinkdar" className="border rounded-lg px-3 py-1.5 text-xs font-bold transition-colors hover:bg-indigo-600 hover:text-white" style={{ borderColor: "#6366F1", color: "#6366F1" }}>
          Explore API →
        </Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40 }}>
        <div>
          <SubHead>🏠 Kemedar Core AI</SubHead>
          <MLink to="/kemedar/predict">Kemedar Predict™</MLink>
          <MLink to="/kemedar/match">Kemedar Match™</MLink>
          <MLink to="/kemedar/vision/landing">Kemedar Vision™</MLink>
          <MLink to="/kemedar/life-score">Life Score™</MLink>
          <MLink to="/kemedar/coach">Kemedar Coach™</MLink>
          <MLink to="/kemedar/advisor">Kemedar Advisor™</MLink>
        </div>
        <div>
          <SubHead>🏠 Kemedar Advanced</SubHead>
          <MLink to="/kemedar/negotiate/landing">Kemedar Negotiate™</MLink>
          <MLink to="/kemedar/score/landing">Kemedar Score™</MLink>
          <MLink to="/kemedar/dna/landing">Kemedar DNA™</MLink>
          <MLink to="/kemedar/expat">Kemedar Expat™</MLink>
          <MLink to="/kemedar/finish">Kemedar Finish™</MLink>
          <MLink to="/verify/my-property">Verify Pro™</MLink>
        </div>
        <div>
          <SubHead>🔧 Kemework AI</SubHead>
          <MLink to="/kemework/snap" isNew>Snap & Fix™</MLink>
          <MLink to="/kemework/find-professionals">AI Pro Matching</MLink>
          <MLink to="/dashboard/concierge" isNew>Move-In Concierge</MLink>
          <MLink to="/kemework/pro/kemekits/create">KemeKit Creator™</MLink>
        </div>
        <div>
          <SubHead>🛒 Kemetro AI</SubHead>
          <MLink to="/kemetro/kemekits" isNew>KemeKits™ Calculator</MLink>
          <MLink to="/kemetro/build" isNew>Kemetro Build™ BOQ</MLink>
          <MLink to="/kemetro/surplus/add" isNew>Surplus Scanner</MLink>
          <MLink to="/kemetro/flash">Kemetro Flash™</MLink>
          <MLink to="/kemetro/search">AI Price Match</MLink>
        </div>
      </div>
    </div>
  );
}

function MenuBenefits() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
        <div>
          <SubHead>🏠 Real Estate</SubHead>
          <MLink to="/user-benefits/property-seller">🏠 Property Owner</MLink>
          <MLink to="/user-benefits/property-buyer">🔍 Property Buyer</MLink>
          <MLink to="/user-benefits/real-estate-agent">🤝 Real Estate Agent</MLink>
          <MLink to="/user-benefits/real-estate-developer">🏗️ Developer</MLink>
        </div>
        <div>
          <SubHead>💰 Investment & Franchise</SubHead>
          <MLink to="/user-benefits/investor">💰 Investor</MLink>
          <MLink to="/user-benefits/franchise-owner-area">🗺️ Franchise Owner</MLink>
          <MLink to="/user-benefits/handyman-or-technician">🔧 Kemework Professional</MLink>
          <MLink to="/kemefrac/kyc">🔷 KemeFrac™ Investor</MLink>
        </div>
        <div>
          <SubHead>🛒 Marketplace</SubHead>
          <MLink to="/user-benefits/product-seller">🏪 Product Seller</MLink>
          <MLink to="/user-benefits/product-buyer">🛒 Product Buyer</MLink>
          <MLink to="/kemetro/shipper/register">🚚 Kemetro Shipper</MLink>
          <MLink to="/kemework/pro/kemekits/create">🎨 KemeKit Designer</MLink>
        </div>
      </div>
      {/* Bottom CTA */}
      <div className="flex items-center justify-center rounded-xl mt-6" style={{ background: "#FF6B00", padding: "14px 20px" }}>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginRight: 16 }}>Ready to join? It's free →</p>
        <Link to="/auth/register" className="transition-colors hover:bg-orange-100" style={{ background: "#fff", color: "#FF6B00", borderRadius: 8, padding: "8px 20px", fontWeight: 700, fontSize: 13 }}>
          Sign Up Now
        </Link>
      </div>
    </div>
  );
}

function MenuServices() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
      <div>
        <SubHead>🏠 Property Services</SubHead>
        <MLink to="/buy">Subscription Packages</MLink>
        <MLink to="/buy">Verification Services</MLink>
        <MLink to="/buy">Listing Service</MLink>
        <MLink to="/buy">Boost & Promote</MLink>
        <MLink to="/buy">Key With Kemedar</MLink>
        <MLink to="/buy">Marketing Campaigns</MLink>
      </div>
      <div>
        <SubHead>🔨 Transaction Services</SubHead>
        <MLink to="/auctions" isNew>KemedarBid™ Auctions</MLink>
        <MLink to="/dashboard/swap" isNew>Kemedar Swap™</MLink>
        <MLink to="/kemedar/escrow/landing">Escrow™ Protection</MLink>
        <MLink to="/verify/my-property">Verify Pro™ Certification</MLink>
        <MLink to="/kemedar/expat">Kemedar Expat™</MLink>
        <MLink to="/kemefrac">KemeFrac™ Tokenization</MLink>
      </div>
      <div>
        <SubHead>🧠 AI & Enterprise</SubHead>
        <MLink to="/thinkdar" isNew>ThinkDar™ API</MLink>
        <MLink to="/kemedar/valuation">Valuation Reports</MLink>
        <MLink to="/kemedar/predict">Market Intelligence</MLink>
        <MLink to="/thinkdar">Developer Tools</MLink>
        <MLink to="/thinkdar">White Label Solutions</MLink>
        <MLink to="/thinkdar">Enterprise Plans</MLink>
      </div>
    </div>
  );
}

function MenuConnect() {
  const SOCIALS = [
    { label: "Facebook", href: "https://www.facebook.com/kemedarglobal", bg: "#1877F2" },
    { label: "Instagram", href: "https://www.instagram.com/kemedar/", bg: "#E1306C" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/kemedar-com/", bg: "#0077B5" },
    { label: "YouTube", href: "https://www.youtube.com/@kemedar", bg: "#FF0000" },
    { label: "WhatsApp", href: "https://wa.me/201001234567", bg: "#25D366" },
    { label: "X", href: "https://x.com/InfoMisr", bg: "#000" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
      <div>
        <SubHead>👥 Community</SubHead>
        <MLink to="/kemedar/community">🏘️ Kemedar Community™</MLink>
        <MLink to="/kemedar/live">📺 Kemedar Live™</MLink>
      </div>
      <div>
        <SubHead>🤝 Partners</SubHead>
        <MLink to="/user-benefits/franchise-owner-area">Franchise Owner Network</MLink>
        <MLink to="/auth/register">Join as Agent</MLink>
        <MLink to="/auth/register">Join as Developer</MLink>
        <MLink to="/thinkdar">API Partners</MLink>
        <MLink to="/kemefrac">Investment Partners</MLink>
      </div>
      <div>
        <SubHead>📲 Social & App</SubHead>
        <div className="flex flex-wrap gap-2 mb-4">
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-white text-xs font-bold rounded-full px-3 py-1.5"
              style={{ background: s.bg }}>
              {s.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <a href="/m" className="flex items-center gap-2 w-full rounded-lg text-white text-sm font-semibold px-3 py-2 transition-colors hover:opacity-80" style={{ background: "#1a1a2e" }}>
            🍎 App Store
          </a>
          <a href="/m" className="flex items-center gap-2 w-full rounded-lg text-white text-sm font-semibold px-3 py-2 transition-colors hover:opacity-80" style={{ background: "#1a1a2e" }}>
            🤖 Google Play
          </a>
        </div>
      </div>
    </div>
  );
}

function MenuManage() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40 }}>
      <div>
        <SubHead>🏠 Real Estate</SubHead>
        <MLink to="/cp/user/my-properties">My Properties</MLink>
        <MLink to="/cp/developer/my-projects">My Projects</MLink>
        <MLink to="/cp/user/buyer-organizer">Buyer Organizer</MLink>
        <MLink to="/cp/user/seller-organizer">Seller Organizer</MLink>
        <MLink to="/dashboard/auctions">My Auctions</MLink>
        <MLink to="/dashboard/swap">My Swap Matches</MLink>
      </div>
      <div>
        <SubHead>🔧 Services & Products</SubHead>
        <MLink to="/cp/user/kemework-orders">My Tasks</MLink>
        <MLink to="/cp/user/kemetro-orders">My Orders</MLink>
        <MLink to="/kemetro/seller/dashboard">My Store</MLink>
        <MLink to="/kemetro/seller/products">My Products</MLink>
        <MLink to="/kemetro/shipper/dashboard">My Shipments</MLink>
      </div>
      <div>
        <SubHead>💰 Investments</SubHead>
        <MLink to="/kemefrac/portfolio">KemeFrac™ Portfolio</MLink>
        <MLink to="/kemetro/surplus/my-listings">My Surplus Listings</MLink>
        <MLink to="/kemetro/kemekits/my-calculations">My KemeKits™</MLink>
        <MLink to="/kemedar/escrow/landing">My Escrow Deals</MLink>
        <MLink to="/dashboard/auctions">My Auctions</MLink>
      </div>
      <div>
        <SubHead>⚙️ Account</SubHead>
        <MLink to="/cp/user/profile">My Profile</MLink>
        <MLink to="/cp/user/wallet">My Wallet</MLink>
        <MLink to="/cp/user/messages">Messages</MLink>
        <MLink to="/cp/user/notifications">Notifications</MLink>
        <MLink to="/cp/user/subscription">Subscription</MLink>
        <MLink to="/cp/user/score">Kemedar Score™</MLink>
        <MLink to="/dashboard/my-dna">My DNA Profile</MLink>
        <MLink to="/cp/user/tickets">Support Tickets</MLink>
      </div>
    </div>
  );
}

function MenuUsefulLinks() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
      <div>
        <SubHead>🏢 Company</SubHead>
        <MLink to="/about">About Us</MLink>
        <MLink to="/careers">Careers</MLink>
        <MLink to="/advertise">Advertise</MLink>
        <MLink to="/contact">Contact Us</MLink>
        <MLink to="/user-benefits/franchise-owner-area">Franchise Network</MLink>
        <MLink to="/about">Press & Media</MLink>
      </div>
      <div>
        <SubHead>📚 Resources</SubHead>
        <MLink to="/sitemap">Sitemap</MLink>
        <MLink to="/kemework/how-it-works">How It Works</MLink>
        <MLink to="/kemetro/fees">Fees & Pricing</MLink>
        <MLink to="/thinkdar">API Documentation</MLink>
        <MLink to="/kemetro/kemecoin">Kemecoins</MLink>
        <MLink to="/kemetro/export">Export Services</MLink>
        <MLink to="/cp/user/knowledge">Help Center</MLink>
      </div>
      <div>
        <SubHead>⚖️ Legal</SubHead>
        <MLink to="/terms">Terms & Policies</MLink>
        <MLink to="/terms">Privacy Policy</MLink>
        <MLink to="/terms">Cookie Policy</MLink>
        <MLink to="/thinkdar">API Terms</MLink>
      </div>
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "find",      label: "Find",       icon: "🔍", title: "🔍 Find",         Content: MenuFind },
  { id: "create",    label: "Create",     icon: "➕", title: "➕ Create",       Content: MenuCreate },
  { id: "invest",    label: "Invest",     icon: "💰", title: "💰 Invest",       Content: MenuInvest },
  { id: "ai",        label: "AI Tools",   icon: "🧠", title: "🧠 ThinkDar™ AI", Content: MenuAITools },
  { id: "benefits",  label: "Benefits",   icon: "🏆", title: "🏆 User Benefits", Content: MenuBenefits },
  { id: "services",  label: "Services",   icon: "⚡", title: "⚡ Services",     Content: MenuServices },
  { id: "connect",   label: "Connect",    icon: "🌍", title: "🌍 Connect",      Content: MenuConnect },
  { id: "manage",    label: "Manage",     icon: "⚙️", title: "⚙️ Manage",      Content: MenuManage },
  { id: "links",     label: "Useful Links", icon: "📋", title: "📋 Useful Links", Content: MenuUsefulLinks },
];

// ─── Main MegaMenu component ─────────────────────────────────────────────────

export default function FooterMegaMenu() {
  const [activeTab, setActiveTab] = useState(null);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveTab(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = TABS.find(t => t.id === activeTab);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      {/* Popup */}
      {active && (
        <div
          style={{
            position: "fixed",
            bottom: 52,
            left: 0,
            right: 0,
            width: "100vw",
            background: "#fff",
            borderRadius: "20px 20px 0 0",
            boxShadow: "0 -12px 60px rgba(0,0,0,0.2)",
            padding: "36px 80px 40px",
            maxHeight: "70vh",
            overflowY: "auto",
            zIndex: 1000,
            animation: "megaMenuIn 0.2s ease-out",
          }}
        >
          {/* Title */}
          <div className="text-center mb-7 relative">
            <button
              onClick={() => setActiveTab(null)}
              className="absolute right-0 top-0 text-gray-400 hover:text-gray-700 transition-colors"
              style={{ fontSize: 18, background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={18} />
            </button>
            <h2 style={{ color: "#1F2937", fontWeight: 700, fontSize: 22, marginBottom: 6 }}>{active.title}</h2>
            <div style={{ width: 40, height: 3, background: "#FF6B00", margin: "0 auto" }} />
          </div>
          <active.Content />
        </div>
      )}

      {/* Tab strip */}
      <div
        className="flex items-center border-t w-full overflow-x-auto"
        style={{ background: "#060D1A", borderColor: "#1E3A5F", height: 52 }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
            className="flex items-center justify-center gap-1.5 font-bold transition-all flex-1 h-full whitespace-nowrap"
            style={{
              minWidth: 90,
              fontSize: 13,
              color: activeTab === tab.id ? "#fff" : "#9CA3AF",
              borderBottom: activeTab === tab.id ? "2px solid #FF6B00" : "2px solid transparent",
              background: activeTab === tab.id ? "rgba(255,255,255,0.03)" : "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #FF6B00" : "2px solid transparent",
              cursor: "pointer",
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderBottomColor = "#FF6B00"; } }}
            onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.color = "#9CA3AF"; e.currentTarget.style.borderBottomColor = "transparent"; } }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes megaMenuIn {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
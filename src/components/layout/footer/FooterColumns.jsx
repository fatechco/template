import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const NEW = null;

function ColHeader({ children }) {
  return (
    <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
      {children}
    </p>
  );
}

function SubHead({ children }) {
  return (
    <p style={{ color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid #1E3A5F", paddingBottom: 6, marginBottom: 12, marginTop: 20 }}>
      {children}
    </p>
  );
}

function FLink({ to, children, isNew, href }) {
  const style = { color: "#9CA3AF", fontSize: 13, lineHeight: 1.95, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 };
  const enter = e => { e.currentTarget.style.color = "#fff"; };
  const leave = e => { e.currentTarget.style.color = "#9CA3AF"; };

  if (href) {
    return (
      <a href={href} style={style} onMouseEnter={enter} onMouseLeave={leave}>
        {children}{isNew && NEW}
      </a>
    );
  }
  return (
    <Link to={to || "#"} style={style} onMouseEnter={enter} onMouseLeave={leave}>
      {children}{isNew && NEW}
    </Link>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #1E3A5F", margin: "16px 0" }} />;
}

export function FooterPlatformsServices() {
  return (
    <div className="flex flex-col">
      <ColHeader>Platforms & Generic Services.</ColHeader>
      <SubHead>Our Platforms & Services</SubHead>
      <FLink to="/">🏠 Kemedar™ Real Estate</FLink>
      <FLink to="/kemework">✏️ Kemework® Services</FLink>
      <FLink to="/kemetro">🛒 Kemetro® Materials</FLink>
      <FLink to="/kemefrac" isNew>🔷 KemeFrac™ Investing</FLink>
      <FLink to="/auctions" isNew>🔨 KemedarBid™ Auctions</FLink>
      <FLink to="/dashboard/swap" isNew>🔄 Kemedar Swap™</FLink>
      <FLink to="/thinkdar" isNew>🧠 ThinkDar™ AI</FLink>
      <Divider />
      <FLink to="/buy">📦 Subscription Packages</FLink>
      <FLink to="/buy">✅ Verification Services</FLink>
      <FLink to="/buy">📋 Listing Service</FLink>
      <FLink to="/kemedar/escrow/landing">🛡️ Escrow™ Protection</FLink>
      <FLink to="/thinkdar">🧠 ThinkDar™ API</FLink>
    </div>
  );
}

export function FooterKemedarRealEstate() {
  return (
    <div className="flex flex-col">
      <ColHeader>Kemedar Real Estate.</ColHeader>
      <SubHead>Kemedar Real Estate.</SubHead>
      <FLink to="/search-properties">🏠 Search Properties</FLink>
      <FLink to="/search-projects">🏗️ Search Projects</FLink>
      <FLink to="/find-profile/real-estate-agents">🤝 Find Agents</FLink>
      <FLink to="/find-profile/agency">🏢 Find Agencies</FLink>
      <FLink to="/find-profile/developer">👷 Find Developers</FLink>
      <FLink to="/find-profile/franchise-owner">🗺️ Find Franchise Owners</FLink>
      <FLink to="/kemedar/buy-requests">📋 Buy Requests</FLink>
      <Divider />
      <FLink to="/create/property">🏠 List a Property</FLink>
      <FLink to="/create/project">🏗️ Add a Project</FLink>
      <FLink to="/create/buy-request">📋 Post a Buy Request</FLink>
      <FLink to="/kemefrac">🔷 Start Investing</FLink>
      <FLink to="/auctions">🔨 Join a Live Auction</FLink>
      <FLink to="/dashboard/swap">🔄 Find My Match</FLink>
    </div>
  );
}

export function FooterKemedarAI() {
  return (
    <div className="flex flex-col">
      <ColHeader>Innovation — Kemedar AI.</ColHeader>
      <SubHead>Kemedar AI Innovations.</SubHead>
      <FLink to="/kemedar/predict">📊 Predict™</FLink>
      <FLink to="/kemedar/vision/landing">👁️ Vision™</FLink>
      <FLink to="/kemedar/life-score">🌍 Life Score™</FLink>
      <FLink to="/kemedar/negotiate/landing">🤝 Negotiate™</FLink>
      <FLink to="/kemedar/coach">🤖 Coach™</FLink>
      <FLink to="/kemedar/advisor">🧑‍💼 Advisor™</FLink>
      <FLink to="/kemedar/match">🏘️ Match™</FLink>
      <FLink to="/kemedar/score/landing">⭐ Score™</FLink>
      <FLink to="/kemedar/dna/landing">🧬 DNA™</FLink>
      <FLink to="/kemedar/expat">✈️ Expat™</FLink>
      <FLink to="/verify/my-property">🔐 Verify Pro™</FLink>
      <FLink to="/kemedar/escrow/landing">🏦 Kemedar Escrow™</FLink>
    </div>
  );
}

export function FooterKemework() {
  return (
    <div className="flex flex-col">
      <ColHeader>Kemework</ColHeader>
      <SubHead>Services</SubHead>
      <FLink to="/kemework/services">🔧 Browse Services</FLink>
      <FLink to="/kemework/tasks">📋 Browse Tasks</FLink>
      <FLink to="/kemework/post-task">📢 Post a Task</FLink>
      <FLink to="/kemework/find-professionals">👷 Find Professionals</FLink>
      <FLink to="/kemework/preferred-professional-program">🏅 Preferred Pro Program</FLink>
      <SubHead>Kemework AI Innovations</SubHead>
      <FLink to="/dashboard/concierge">🏠 Move-in Concierge</FLink>
      <FLink to="/kemework/find-professionals">🤖 AI Pro Matching</FLink>
      <FLink to="/kemework/find-professionals">🛡️ Kemework Guarantee™</FLink>
      <FLink to="/kemetro/kemekits">🎨 KemeKits™</FLink>
      <FLink to="/kemework/snap">📷 Snap & Fix™</FLink>
      <FLink to="/kemedar/finish">🏗️ Kemedar Finish™</FLink>
    </div>
  );
}

export function FooterKemetro() {
  return (
    <div className="flex flex-col">
      <ColHeader>Kemetro</ColHeader>
      <SubHead>Marketplace</SubHead>
      <FLink to="/kemetro/search">🛒 Search Products</FLink>
      <FLink to="/kemetro/flash">⚡ Flash Deals</FLink>
      <FLink to="/kemetro/seller/register">🏪 Register as Seller</FLink>
      <FLink to="/kemetro/shipper/register">🚚 Register as Shipper</FLink>
      <FLink to="/kemetro/buyer/rfqs/create">📝 Post an RFQ</FLink>
      <SubHead>Kemetro AI</SubHead>
      <FLink to="/kemetro/build">🏗️ Kemetro Build™ BOQ</FLink>
      <FLink to="/kemetro/search">✨ Shop the Look ✨</FLink>
      <FLink to="/kemetro/search">🤖 AI Price Match</FLink>
      <FLink to="/kemetro/surplus">📊 ESG Impact Tracker</FLink>
      <FLink to="/kemetro/surplus">♻️ Surplus & Salvage</FLink>
    </div>
  );
}

// Mobile accordion wrapper
export function MobileAccordionCol({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #1E3A5F" }}>
      <button
        className="w-full flex items-center justify-between"
        style={{ padding: "14px 0", background: "none", border: "none", cursor: "pointer" }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</span>
        <ChevronDown size={18} color="#fff" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && <div style={{ paddingBottom: 16 }}>{children}</div>}
    </div>
  );
}

// Keep legacy exports for backward compat
export function FooterQuickLinks() { return null; }
export function FooterPlatforms() { return null; }
export function FooterPlatformsOnly() { return null; }
export function FooterAIFeatures() { return null; }
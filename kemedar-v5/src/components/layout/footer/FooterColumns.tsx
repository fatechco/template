"use client";
// @ts-nocheck
import Link from "next/link";
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
    <Link href={to || "#"} style={style} onMouseEnter={enter} onMouseLeave={leave}>
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
      <FLink href="/">🏠 Kemedar™ Real Estate</FLink>
      <FLink href="/kemework">✏️ Kemework® Services</FLink>
      <FLink href="/kemetro">🛒 Kemetro® Materials</FLink>
      <FLink href="/kemefrac" isNew>🔷 KemeFrac™ Investing</FLink>
      <FLink href="/auctions" isNew>🔨 KemedarBid™ Auctions</FLink>
      <FLink href="/dashboard/swap" isNew>🔄 Kemedar Swap™</FLink>
      <FLink href="/thinkdar" isNew>🧠 ThinkDar™ AI</FLink>
      <Divider />
      <FLink href="/buy">📦 Subscription Packages</FLink>
      <FLink href="/buy">✅ Verification Services</FLink>
      <FLink href="/buy">📋 Listing Service</FLink>
      <FLink href="/kemedar/escrow/landing">🛡️ Escrow™ Protection</FLink>
      <FLink href="/thinkdar">🧠 ThinkDar™ API</FLink>
    </div>
  );
}

export function FooterKemedarRealEstate() {
  return (
    <div className="flex flex-col">
      <ColHeader>Kemedar Real Estate.</ColHeader>
      <SubHead>Kemedar Real Estate.</SubHead>
      <FLink href="/search-properties">🏠 Search Properties</FLink>
      <FLink href="/search-projects">🏗️ Search Projects</FLink>
      <FLink href="/find-profile/real-estate-agents">🤝 Find Agents</FLink>
      <FLink href="/find-profile/agency">🏢 Find Agencies</FLink>
      <FLink href="/find-profile/developer">👷 Find Developers</FLink>
      <FLink href="/find-profile/franchise-owner">🗺️ Find Franchise Owners</FLink>
      <FLink href="/kemedar/buy-requests">📋 Buy Requests</FLink>
      <Divider />
      <FLink href="/create/property">🏠 List a Property</FLink>
      <FLink href="/create/project">🏗️ Add a Project</FLink>
      <FLink href="/create/buy-request">📋 Post a Buy Request</FLink>
      <FLink href="/kemefrac">🔷 Start Investing</FLink>
      <FLink href="/auctions">🔨 Join a Live Auction</FLink>
      <FLink href="/dashboard/swap">🔄 Find My Match</FLink>
    </div>
  );
}

export function FooterKemedarAI() {
  return (
    <div className="flex flex-col">
      <ColHeader>Innovation — Kemedar AI.</ColHeader>
      <SubHead>Kemedar AI Innovations.</SubHead>
      <FLink href="/kemedar/predict">📊 Predict™</FLink>
      <FLink href="/kemedar/vision/landing">👁️ Vision™</FLink>
      <FLink href="/kemedar/life-score">🌍 Life Score™</FLink>
      <FLink href="/kemedar/negotiate/landing">🤝 Negotiate™</FLink>
      <FLink href="/kemedar/coach">🤖 Coach™</FLink>
      <FLink href="/kemedar/advisor">🧑‍💼 Advisor™</FLink>
      <FLink href="/kemedar/match">🏘️ Match™</FLink>
      <FLink href="/kemedar/score/landing">⭐ Score™</FLink>
      <FLink href="/kemedar/dna/landing">🧬 DNA™</FLink>
      <FLink href="/kemedar/expat">✈️ Expat™</FLink>
      <FLink href="/verify/my-property">🔐 Verify Pro™</FLink>
      <FLink href="/kemedar/escrow/landing">🏦 Kemedar Escrow™</FLink>
    </div>
  );
}

export function FooterKemework() {
  return (
    <div className="flex flex-col">
      <ColHeader>Kemework</ColHeader>
      <SubHead>Services</SubHead>
      <FLink href="/kemework/services">🔧 Browse Services</FLink>
      <FLink href="/kemework/tasks">📋 Browse Tasks</FLink>
      <FLink href="/kemework/post-task">📢 Post a Task</FLink>
      <FLink href="/kemework/find-professionals">👷 Find Professionals</FLink>
      <FLink href="/kemework/preferred-professional-program">🏅 Preferred Pro Program</FLink>
      <SubHead>Kemework AI Innovations</SubHead>
      <FLink href="/dashboard/concierge">🏠 Move-in Concierge</FLink>
      <FLink href="/kemework/find-professionals">🤖 AI Pro Matching</FLink>
      <FLink href="/kemework/find-professionals">🛡️ Kemework Guarantee™</FLink>
      <FLink href="/kemetro/kemekits">🎨 KemeKits™</FLink>
      <FLink href="/kemework/snap">📷 Snap & Fix™</FLink>
      <FLink href="/kemedar/finish">🏗️ Kemedar Finish™</FLink>
    </div>
  );
}

export function FooterKemetro() {
  return (
    <div className="flex flex-col">
      <ColHeader>Kemetro</ColHeader>
      <SubHead>Marketplace</SubHead>
      <FLink href="/kemetro/search">🛒 Search Products</FLink>
      <FLink href="/kemetro/flash">⚡ Flash Deals</FLink>
      <FLink href="/kemetro/seller/register">🏪 Register as Seller</FLink>
      <FLink href="/kemetro/shipper/register">🚚 Register as Shipper</FLink>
      <FLink href="/kemetro/buyer/rfqs/create">📝 Post an RFQ</FLink>
      <SubHead>Kemetro AI</SubHead>
      <FLink href="/kemetro/build">🏗️ Kemetro Build™ BOQ</FLink>
      <FLink href="/kemetro/search">✨ Shop the Look ✨</FLink>
      <FLink href="/kemetro/search">🤖 AI Price Match</FLink>
      <FLink href="/kemetro/surplus">📊 ESG Impact Tracker</FLink>
      <FLink href="/kemetro/surplus">♻️ Surplus & Salvage</FLink>
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
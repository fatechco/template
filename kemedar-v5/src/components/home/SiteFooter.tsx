"use client";
// @ts-nocheck
// DEPRECATED — use SuperFooter from components/layout/SuperFooter instead
import Link from "next/link";
import { Facebook, Linkedin, Twitter, Youtube, MessageCircle, ChevronDown } from "lucide-react";
import { useModules } from "@/lib/module-context";
import EcoTickerStrip from "@/components/surplus/EcoTickerStrip";
import { useState } from "react";

const COLUMNS = [
  {
    title: "🔍 Find",
    sections: [
      {
        name: "Kemedar",
        links: [
          { label: "Property", to: "/search-properties" },
          { label: "Project", to: "/search-projects" },
          { label: "Agent", to: "/find-profile/real-estate-agents" },
          { label: "Agency", to: "/find-profile/agency" },
          { label: "Developer", to: "/find-profile/developer" },
          { label: "Franchise Owner", to: "/find-profile/franchise-owner" },
          { label: "Professional", to: "/kemework/find-professionals" },
          { label: "Property Buy Request", to: "/search-properties" },
          { label: "🆕 Building Materials", to: "/kemetro/search" },
          { label: "🆕 KemeKits™ Designs", to: "/kemetro/kemekits" },
          { label: "🆕 Surplus Materials ♻️", to: "/kemetro/surplus" },
        ],
      },
    ],
  },
  {
    title: "➕ Add",
    sections: [
      {
        name: "Kemedar",
        links: [
          { label: "Property", to: "/create/property" },
          { label: "Project", to: "/create/project" },
          { label: "Buy Request", to: "/create/buy-request" },
          { label: "🆕 Post a Task", to: "/kemework/post-task" },
          { label: "🆕 Add a Service", to: "/kemework/add-service" },
          { label: "🆕 Sell a Product", to: "/kemetro/seller/register" },
          { label: "🆕 Sell Surplus ♻️", to: "/kemetro/surplus/add" },
        ],
      },
    ],
  },
  {
    title: "👤 Register As",
    links: [
      { label: "Common User", to: "/register" },
      { label: "Agent", to: "/register" },
      { label: "Agency", to: "/register" },
      { label: "Developer", to: "/register" },
      { label: "Franchise Owner", to: "/user-benefits/franchise-owner-area" },
      { label: "🆕 Kemework Professional", to: "/kemework/find-professionals" },
      { label: "🆕 Kemetro Seller", to: "/kemetro/seller/register" },
      { label: "🆕 Kemetro Shipper", to: "/kemetro/shipper/register" },
      { label: "🆕 KemeFrac™ Investor", to: "/kemefrac/kyc" },
    ],
  },
  {
    title: "🧠 ThinkDar™ AI",
    subtitle: "20 AI Features",
    links: [
      { label: "Kemedar Predict™", to: "/kemedar/predict" },
      { label: "Kemedar Match™", to: "/kemedar/match" },
      { label: "Kemedar Vision™", to: "/kemedar/vision/landing" },
      { label: "Life Score™", to: "/kemedar/life-score" },
      { label: "Kemedar Negotiate™", to: "/kemedar/negotiate/landing" },
      { label: "Kemedar Advisor™", to: "/kemedar/advisor" },
      { label: "Verify Pro™", to: "/verify/my-property" },
      { label: "Kemedar DNA™", to: "/kemedar/dna/landing" },
      { label: "Kemedar Finish™", to: "/kemedar/finish" },
      { label: "Kemedar Expat™", to: "/kemedar/expat" },
      { label: "Snap & Fix™", to: "/kemework/snap" },
      { label: "KemeKits™", to: "/kemetro/kemekits" },
    ],
    cta: { label: "Explore All AI →", to: "/thinkdar" },
  },
  {
    title: "🏠 Our Platforms",
    sections: [
      {
        name: "KEMEDAR® — Real Estate",
        links: [
          { label: "Search Properties", to: "/search-properties" },
          { label: "Search Projects", to: "/search-projects" },
          { label: "🆕 KemedarBid™ Auctions", to: "/auctions" },
          { label: "🆕 Kemedar Swap™", to: "/dashboard/swap" },
          { label: "🆕 KemeFrac™ Investing", to: "/kemefrac" },
        ],
      },
      {
        name: "KEMEWORK® — Services",
        links: [
          { label: "Browse Services", to: "/kemework/services" },
          { label: "Browse Tasks", to: "/kemework/tasks" },
          { label: "Preferred Pros Program", to: "/kemework/preferred-professional-program" },
        ],
      },
      {
        name: "KEMETRO® — Materials",
        links: [
          { label: "Search Products", to: "/kemetro/search" },
          { label: "🆕 Flash Deals ⚡", to: "/kemetro/flash" },
          { label: "🆕 Surplus & Salvage ♻️", to: "/kemetro/surplus" },
          { label: "🆕 Kemetro Build™", to: "/kemetro/build" },
        ],
      },
    ],
  },
  {
    title: "💎 User Benefits & Services",
    sections: [
      {
        name: "User Benefits",
        links: [
          { label: "Property Owner", to: "/user-benefits/property-seller" },
          { label: "Property Buyer", to: "/user-benefits/property-buyer" },
          { label: "Real Estate Agent", to: "/user-benefits/real-estate-agent" },
          { label: "Developer", to: "/user-benefits/real-estate-developer" },
          { label: "Investor", to: "/user-benefits/investor" },
          { label: "Franchise Owner", to: "/user-benefits/franchise-owner-area" },
          { label: "Professional", to: "/user-benefits/handyman-or-technician" },
          { label: "Product Seller", to: "/user-benefits/product-seller" },
          { label: "Product Buyer", to: "/user-benefits/product-buyer" },
        ],
      },
      {
        name: "Services",
        links: [
          { label: "Subscription Packages", to: "/advertise" },
          { label: "Verification Services", to: "/advertise" },
          { label: "Listing Service", to: "/advertise" },
          { label: "🆕 KemedarBid™ Auctions", to: "/auctions" },
          { label: "🆕 Kemedar Swap™", to: "/dashboard/swap" },
          { label: "🆕 KemeFrac™ Investing", to: "/kemefrac" },
          { label: "🆕 Escrow™ Protection", to: "/kemedar/escrow/landing" },
          { label: "🆕 ThinkDar™ API", to: "/thinkdar" },
        ],
      },
    ],
  },
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/kemedarglobal" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/kemedar-com/" },
  { icon: MessageCircle, label: "TikTok", href: "https://www.tiktok.com/@kemedar" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@kemedar" },
  { icon: Twitter, label: "X / Twitter", href: "https://x.com/InfoMisr" },
];

function KemedarLogoWhite() {
  return (
    <div className="select-none">
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/0687980a4_kemedar-Logo-ar-6000.png"
        alt="Kemedar"
        className="h-10 w-auto object-contain brightness-0 invert"
      />
    </div>
  );
}

function FooterColumn({ col }) {
  const [expanded, setExpanded] = useState(true);

  // For mobile, only ThinkDar AI is expanded by default
  const isThinkDarColumn = col.title.includes("🧠");

  return (
    <div className="flex flex-col gap-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="lg:pointer-events-none flex items-center justify-between lg:justify-start gap-2 py-3 lg:py-0 border-b lg:border-b-0 border-gray-700 lg:border-none"
      >
        <div className="flex flex-col gap-1 flex-1">
          <h4 className="font-bold text-sm text-white text-left pb-2">{col.title}</h4>
          {col.subtitle && <p className="text-[11px] text-indigo-400">{col.subtitle}</p>}
          <div className="w-8 h-0.5 bg-[#FF6B00]"></div>
        </div>
        <ChevronDown
          size={18}
          className={`lg:hidden text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {(expanded || typeof window === "undefined" || window.innerWidth >= 1024) && (
        <div className="flex flex-col gap-4 mt-3 lg:mt-3">
          {col.sections ? (
            col.sections.map((section) => (
              <div key={section.name} className="flex flex-col gap-2">
                <p className="text-gray-300 text-[11px] uppercase tracking-wide font-semibold">
                  {section.name}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.to}
                        className="text-gray-400 hover:text-[#FF6B00] text-[13px] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              <ul className="flex flex-col gap-1.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.to}
                      className="text-gray-400 hover:text-[#FF6B00] text-[13px] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {col.cta && (
                <Link
                  href={col.cta.to}
                  className="mt-2 inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit transition-colors"
                >
                  {col.cta.label}
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function SiteFooter() {
  const { isModuleActive } = useModules();
  const [expandedMobile, setExpandedMobile] = useState({ "🧠 ThinkDar™ AI": true });

  // Filter columns based on active modules
  const filteredColumns = COLUMNS.map(col => {
    if (!col.sections) return col;
    const filteredSections = col.sections.filter(section => {
      if (section.name && (section.name.includes("Kemetro") || section.name.includes("KEMETRO"))) {
        return isModuleActive("kemetro");
      }
      if (section.name && (section.name.includes("Kemework") || section.name.includes("KEMEWORK"))) {
        return isModuleActive("kemework");
      }
      return true;
    });
    return { ...col, sections: filteredSections.length > 0 ? filteredSections : col.sections };
  });

  return (
    <footer className="bg-[#0A1628] text-white">
      <EcoTickerStrip />

      {/* Main footer grid */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-6">
          {/* Column 1: Logo + description + social + app */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-4">
            <KemedarLogoWhite />
            <p className="text-gray-400 text-xs leading-relaxed">
              The region's #1 PropTech Super App. Real estate, home services, building materials, and AI — all in one platform.
            </p>

            {/* ThinkDar Badge */}
            <div className="border border-indigo-500/30 bg-indigo-950/20 rounded-lg p-2.5 mt-1">
              <p className="text-[11px] text-white mb-1">
                <span className="font-black">🧠 Powered by ThinkDar™</span>
              </p>
              <p className="text-[10px] text-indigo-300">
                The First AI Model Built for Real Estate
              </p>
              <Link href="/thinkdar" className="text-indigo-400 hover:text-indigo-300 text-[10px] font-semibold mt-1 block">
                Learn more →
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2 mt-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#FF6B00] flex items-center justify-center transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>

            {/* Install App */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-xs font-bold text-gray-300">📱 Install Our App</p>
              <div className="flex flex-col gap-1.5">
                <a href="/m" className="flex items-center gap-2 bg-white/10 hover:bg-[#FF6B00] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                  🍎 For iOS
                </a>
                <a href="/m" className="flex items-center gap-2 bg-white/10 hover:bg-[#FF6B00] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                  🤖 For Android
                </a>
              </div>
              <Link
                href="/thinkdar"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
              >
                🧠 ThinkDar™ API
              </Link>
            </div>
          </div>

          {/* Columns 2-7: Dynamic footer columns */}
          {filteredColumns.map((col) => (
            <FooterColumn key={col.title} col={col} />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Kemedar®. All rights reserved. Powered by ThinkDar™ AI
          </p>

          {/* Center: Legal links */}
          <div className="flex items-center gap-3 text-gray-500 text-xs flex-wrap justify-center">
            <Link href="/sitemap" className="hover:text-[#FF6B00] transition-colors font-semibold">Sitemap</Link>
            <span className="text-gray-600">·</span>
            <Link href="/terms" className="hover:text-[#FF6B00] transition-colors">Terms & Policies</Link>
            <span className="text-gray-600">·</span>
            <a href="/cookies" className="hover:text-[#FF6B00] transition-colors">Cookie Policy</a>
            <span className="text-gray-600">·</span>
            <Link href="/thinkdar" className="hover:text-[#FF6B00] transition-colors">API Terms</Link>
          </div>

          {/* Right: Badges */}
          <div className="flex items-center gap-2">
            <span className="inline-block bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2 py-1 rounded">
              🧠 ThinkDar™
            </span>
            <span className="inline-block bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[10px] font-bold px-2 py-1 rounded">
              🔷 NEAR Protocol
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
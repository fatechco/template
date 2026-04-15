// @ts-nocheck
import Link from "next/link";
import { Building2, Hammer, ShoppingBag, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Kemedar",
    links: [
      { label: "Buy Property", href: "/search/properties?purpose=sale" },
      { label: "Rent Property", href: "/search/properties?purpose=rent" },
      { label: "New Projects", href: "/search/projects" },
      { label: "Find Agents", href: "/find/agents" },
      { label: "Find Agencies", href: "/find/agencies" },
      { label: "Find Developers", href: "/find/developers" },
      { label: "Property Auctions", href: "/kemedar/auctions" },
      { label: "KemeFrac", href: "/kemefrac" },
    ],
  },
  {
    title: "AI & Innovation",
    links: [
      { label: "AI Property Search", href: "/kemedar/ai-search" },
      { label: "Price Prediction", href: "/kemedar/predict" },
      { label: "Property Match", href: "/kemedar/match" },
      { label: "Life Score", href: "/kemedar/life-score" },
      { label: "KemeAdvisor", href: "/kemedar/advisor" },
      { label: "Vision Analysis", href: "/kemedar/vision" },
      { label: "Property DNA", href: "/kemedar/dna" },
    ],
  },
  {
    title: "Kemework",
    links: [
      { label: "Find Professionals", href: "/kemework/professionals" },
      { label: "Post a Task", href: "/kemework/post-task" },
      { label: "Snap & Fix", href: "/kemework/snap-fix" },
      { label: "Finishing Projects", href: "/kemedar/finish" },
      { label: "Become a Pro", href: "/kemework/pro-benefits" },
    ],
  },
  {
    title: "Kemetro",
    links: [
      { label: "Building Materials", href: "/kemetro" },
      { label: "Flash Deals", href: "/kemetro/flash" },
      { label: "KemeKits", href: "/kemetro/kemekits" },
      { label: "Surplus Market", href: "/kemetro/surplus" },
      { label: "Become a Seller", href: "/kemetro/seller/register" },
      { label: "Shipper Program", href: "/kemetro/shipper/register" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Advertise", href: "/advertise" },
      { label: "Franchise", href: "/franchise" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Stats Ticker */}
      <div className="border-b border-slate-700 py-3 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 flex items-center gap-8 text-sm text-slate-400">
          <span>10,000+ Properties</span>
          <span>50,000+ Users</span>
          <span>500+ Projects</span>
          <span>15+ Cities</span>
          <span>2,000+ Surplus Items Saved</span>
        </div>
      </div>

      {/* Footer Columns */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold text-white mb-4">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="container mx-auto max-w-7xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
            <span className="font-bold">Kemedar</span>
            <span className="text-sm text-slate-400 ml-2">&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.label} href={social.href} className="text-slate-400 hover:text-white transition" aria-label={social.label}>
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

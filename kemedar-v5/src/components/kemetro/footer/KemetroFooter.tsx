// @ts-nocheck
// DEPRECATED — use SuperFooter from components/layout/SuperFooter instead
import Link from "next/link";
import { Facebook, Linkedin, Youtube, Twitter, MessageCircle } from "lucide-react";
import EcoTickerStrip from "@/components/surplus/EcoTickerStrip";

const FOOTER_COLUMNS = [
  {
    title: "For Sellers",
    links: [
      { label: "Seller Benefits", to: "/user-benefits/product-seller" },
      { label: "Fees & Pricing", to: "/kemetro/fees" },
      { label: "Open a Store", to: "/kemetro/seller/register" },
      { label: "Store Coordinator Program", to: "/kemetro/store-coordinator" },
      { label: "Export Module", to: "/kemetro/export" },
      { label: "Kemecoin Rewards", to: "/kemetro/kemecoin" },
      { label: "Seller Dashboard", to: "/kemetro/seller/dashboard" },
      { label: "Seller Guidelines", to: "/kemetro/seller-guidelines" },
    ],
  },
  {
    title: "For Buyers",
    links: [
      { label: "Buyer Benefits", to: "/user-benefits/product-buyer" },
      { label: "How It Works", to: "/kemetro/how-it-works" },
      { label: "Browse Categories", to: "/kemetro/categories" },
      { label: "Flash Deals", to: "/kemetro/deals" },
      { label: "My Orders", to: "/kemetro/orders" },
      { label: "Track My Order", to: "/kemetro/track" },
      { label: "Returns & Refunds", to: "/kemetro/returns" },
      { label: "FAQ", to: "/kemetro/faq" },
    ],
  },
  {
    title: "Delivery & Shipping",
    links: [
      { label: "Shipping Info", to: "/kemetro/shipping" },
      { label: "Become a Shipper", to: "/kemetro/shipper/register" },
      { label: "Shipper Login", to: "/kemetro/shipper/login" },
      { label: "Shipping Rates", to: "/kemetro/shipping-rates" },
      { label: "International Shipping", to: "/kemetro/export" },
      { label: "Track Shipment", to: "/kemetro/track" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Kemetro", to: "/kemetro/about" },
      { label: "Kemedar Ecosystem", to: "/" },
      { label: "Contact Us", to: "/kemetro/contact" },
      { label: "Advertise With Us", to: "/kemetro/advertise" },
      { label: "Careers", to: "/careers" },
      { label: "Terms & Conditions", to: "/kemetro/terms" },
      { label: "Privacy Policy", to: "/kemetro/privacy" },
      { label: "Cookie Policy", to: "/kemetro/cookies" },
    ],
  },
];

const PAYMENT_METHODS = [
  { icon: "💳", label: "Visa" },
  { icon: "🏦", label: "Mastercard" },
  { icon: "🌐", label: "PayPal" },
  { icon: "🏛️", label: "Bank Transfer" },
  { icon: "💵", label: "Cash on Delivery" },
];

function KemetroLogoWhite() {
  return (
    <div className="select-none">
      <img
        src="https://media.base44.com/images/public/69b5eafc884b1597fb3ea66e/54d638672_kemetro-final.png"
        alt="Kemetro"
        className="h-10 w-auto object-contain brightness-0 invert"
      />
    </div>
  );
}

export default function KemetroFooter() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      <EcoTickerStrip />
      {/* Main footer content */}
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Column 1: Logo + About */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <KemetroLogoWhite />
            <p className="text-gray-400 text-sm leading-relaxed">
              Your dedicated multi-seller marketplace for home building and finishing products.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1EMrJEGmvV/" },
                { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/kemedar-com/" },
                { Icon: Youtube, label: "YouTube", href: "https://youtube.com/@kemedar?si=SsSARyIiid1UpDns" },
                { Icon: Twitter, label: "X / Twitter", href: "https://x.com/InfoMisr" },
                { Icon: MessageCircle, label: "TikTok", href: "https://www.tiktok.com/@kemedar?_r=1&_t=ZS-94u93BhfsOa" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#0077B6] flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            {/* Install App (PWA) */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-xs font-bold text-gray-300">📱 Install Our App</p>
              <div className="flex flex-col gap-1.5">
                <a href="/m" className="flex items-center gap-2 bg-white/10 hover:bg-[#0077B6] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                  🍎 For iOS (Add to Home Screen)
                </a>
                <a href="/m" className="flex items-center gap-2 bg-white/10 hover:bg-[#0077B6] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                  🤖 For Android (Install App)
                </a>
              </div>
            </div>
          </div>

          {/* Columns 2-5: Navigation */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h4 className="font-black text-sm text-white border-b border-white/10 pb-2">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.to} className="text-gray-400 hover:text-[#0077B6] text-xs transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            {/* Left */}
            <p>© 2025 Kemetro® — Part of Kemedar Ecosystem</p>

            {/* Center - Payment Methods */}
            <div className="flex items-center gap-3">
              {PAYMENT_METHODS.map((method) => (
                <span key={method.label} className="text-lg" title={method.label}>
                  {method.icon}
                </span>
              ))}
            </div>

            {/* Right */}
            <p className="flex items-center gap-1">
              <span>🔒</span>
              Secure Shopping Guaranteed
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
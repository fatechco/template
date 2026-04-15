// @ts-nocheck
import Link from "next/link";

const OTHER_ITEMS = [
  { label: "Property Valuation", icon: "📊", to: "/kemedar/valuation" },
  { label: "User Benefits", icon: "🎯", to: "/user-benefits" },
  { label: "About Us", icon: "ℹ️", to: "/about" },
  { label: "Paid Services", icon: "💳", to: "/advertise" },
  { label: "Join Our Team", icon: "🤝", to: "/careers" },
  { label: "Join Our Franchise Network", icon: "🌐", to: "/find-profile/franchise-owner" },
  { label: "Terms & Policies", icon: "📄", to: "/terms" },
  { label: "Contact Us", icon: "📞", to: "/contact" },
];

export default function OtherMenu() {
  return (
    <div className="absolute top-full right-0 mt-0 bg-white rounded-b-xl shadow-2xl border border-gray-100 z-[150] w-[260px]">
      <div className="py-3 px-3">
        {OTHER_ITEMS.map((item) => (
          <Link key={item.label} href={item.to || "#"} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-orange-50 hover:text-[#FF6B00] text-gray-700 text-sm transition-colors">
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
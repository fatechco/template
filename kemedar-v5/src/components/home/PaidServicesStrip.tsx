// @ts-nocheck
import Link from "next/link";
import { ClipboardList, Rocket, Key, Megaphone, Shield, ArrowRight, Check } from "lucide-react";

const SERVICES = [
  {
    accent: "#22C55E",
    accentBg: "#F0FDF4",
    Icon: ClipboardList,
    label: "KEMEDAR® LIST SERVICE",
    title: "Professional Property Listing",
    description:
      "We arrange a Kemedar representative to visit the property site, take professional photos, and add all the details of the property to get the best property page — including all details about the property in a professional way.",
    priceLabel: "Professional Visit + Photos + Full Listing",
    price: "$50",
    badge: null,
    features: null,
    note: null,
    btnLabel: "Book Now",
    btnTo: "/advertise",
  },
  {
    accent: "#FF6B00",
    accentBg: "#FFF7ED",
    Icon: Rocket,
    label: "KEMEDAR® UP SERVICE",
    title: "Boost to Top of Search",
    description:
      "By using this service in your real estate area, your property will appear first in the search results, which greatly increases its chances of being sold quickly.",
    priceLabel: "Featured Placement in Your Area",
    price: "$50 / month",
    badge: "🔝 Always Appears First in Results",
    features: null,
    note: null,
    btnLabel: "Boost My Property",
    btnTo: "/advertise",
  },
  {
    accent: "#6366F1",
    accentBg: "#EEF2FF",
    Icon: Key,
    label: "KEY WITH KEMEDAR® SERVICE",
    title: "Let Kemedar Show Your Property",
    description:
      "In exchange for a specific amount per visit or a monthly fee, Kemedar receives the key of the property and accompanies buyers during inspections. Using this service, we will add the 'Always Ready for Showing' label to your property page, increasing the chance of a quick sale.",
    priceLabel: "Per Visit or Monthly Fee",
    price: "Custom",
    badge: "✅ Always Ready for Showing — Label Added to Your Listing",
    features: null,
    note: null,
    btnLabel: "Get Started",
    btnTo: "/advertise",
  },
  {
    accent: "#EF4444",
    accentBg: "#FEF2F2",
    Icon: Megaphone,
    label: "KEMEDAR® PROMO SERVICE",
    title: "Targeted Marketing Campaign",
    description:
      "Kemedar leverages the largest real estate database in the market to target buyers specifically interested in your property type and location. We send you a customized offer through your regional representative.",
    priceLabel: null,
    price: "Custom Offer",
    badge: null,
    features: [
      "Email Campaigns",
      "WhatsApp Campaigns",
      "SMS Campaigns",
      "Messenger Campaigns",
      "Negotiated Terms & Strategy",
    ],
    note: "All terms and promotion methods are agreed upon before the campaign begins.",
    btnLabel: "Request a Custom Offer",
    btnTo: "/advertise",
  },
];

function ServiceCard({ service }) {
  const { accent, accentBg, Icon, label, title, description, priceLabel, price, badge, features, note, btnLabel, btnTo } = service;

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-200 shadow-md flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
      style={{ "--accent": accent }}
    >
      {/* Icon area */}
      <div className="p-5 pb-0 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: accentBg }}>
          <Icon size={22} style={{ color: accent }} />
        </div>
        <div className="pt-1">
          <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: accent }}>{label}</p>
          <h3 className="text-base font-black text-gray-900 leading-tight mt-0.5">{title}</h3>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 mt-4 border-t border-gray-100" />

      {/* Body */}
      <div className="p-5 pt-4 flex flex-col flex-1 gap-3">
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>

        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-semibold w-fit" style={{ borderColor: accent, color: accent }}>
            {badge}
          </div>
        )}

        {/* Features list */}
        {features && (
          <ul className="flex flex-col gap-1.5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                <Check size={13} style={{ color: accent }} className="flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Note */}
        {note && <p className="text-xs italic text-gray-400">{note}</p>}

        {/* Spacer pushes price + button to bottom */}
        <div className="flex-1" />

        {/* Price row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {priceLabel && <p className="text-xs text-gray-400 leading-tight max-w-[55%]">{priceLabel}</p>}
          <p className="text-xl font-black ml-auto" style={{ color: accent }}>{price}</p>
        </div>

        {/* CTA Button */}
        <Link
          href={btnTo}
          className="w-full text-center text-sm font-bold py-3 rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: accent }}
        >
          {btnLabel}
        </Link>
      </div>
    </div>
  );
}

export default function PaidServicesStrip() {
  return (
    <section className="w-full py-16 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl xl:text-4xl font-black text-gray-900">Our Premium Services</h2>
          <div className="w-16 h-1 bg-[#FF6B00] rounded-full mx-auto mt-3 mb-4" />
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Professional services designed to help you sell faster and smarter
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {SERVICES.map((s) => (
            <ServiceCard key={s.label} service={s} />
          ))}
        </div>

        {/* Bottom trust banner */}
        <div className="mt-10 bg-white border border-gray-200 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield size={20} className="text-[#FF6B00] flex-shrink-0" />
            <span>
              All Kemedar services are managed by certified regional representatives and backed by Kemedar's global network.
            </span>
          </div>
          <Link href="/advertise" className="flex items-center gap-1 text-[#FF6B00] font-semibold text-sm whitespace-nowrap hover:underline">
            Learn More <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
"use client";
// @ts-nocheck
import { useState } from "react";
import { ExternalLink, Plus, CheckCircle, Pencil, Home, Building2, Package, Wrench, ShoppingCart } from "lucide-react";

const SECTIONS = {
  properties: {
    icon: "🏠", label: "Properties",
    items: [
      { id: "p1", title: "Apartment in New Cairo — 3BR", status: "Active", updated: "2 days ago", meta: "EGP 2.5M · Listed" },
      { id: "p2", title: "Studio in Maadi", status: "Pending", updated: "1 week ago", meta: "EGP 750K · Draft" },
      { id: "p3", title: "Villa in Sheikh Zayed", status: "Expired", updated: "2 months ago", meta: "EGP 8.2M" },
    ],
    linkPrefix: "/admin/properties"
  },
  projects: {
    icon: "🏗", label: "Projects",
    items: [
      { id: "pr1", title: "Green Oasis Compound", status: "Active", updated: "1 week ago", meta: "80 units remaining" },
    ],
    linkPrefix: "/admin/projects"
  },
  services: {
    icon: "🔧", label: "Services (Kemework)",
    items: [
      { id: "s1", title: "Electrical Wiring — Full Package", status: "Active", updated: "3 days ago", meta: "4.8★ · 28 orders" },
    ],
    linkPrefix: "/admin/kemework/services"
  },
  products: {
    icon: "📦", label: "Products (Kemetro)",
    items: [],
    linkPrefix: "/admin/kemetro"
  },
  orders: {
    icon: "🛒", label: "Orders",
    items: [
      { id: "ord1", title: "Pro Plan — Annual", status: "Paid", updated: "Mar 1, 2026", meta: "EGP 1,200" },
      { id: "ord2", title: "Featured Listing Boost", status: "Paid", updated: "Feb 15, 2026", meta: "EGP 200" },
    ],
    linkPrefix: "/admin"
  },
  subscriptions: {
    icon: "💳", label: "Subscriptions",
    items: [
      { id: "sub1", title: "Kemedar Pro Plan", status: "Active", updated: "Mar 1, 2026", meta: "Expires May 1, 2026" },
    ],
    linkPrefix: "/admin"
  },
  inquiries: {
    icon: "📋", label: "Buy Requests / Inquiries",
    items: [
      { id: "inq1", title: "Buy Request — 3BR New Cairo", status: "Open", updated: "1 week ago", meta: "Budget: EGP 2–3M" },
    ],
    linkPrefix: "/admin/buy-requests"
  },
};

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Paid: "bg-green-100 text-green-700",
  Open: "bg-blue-100 text-blue-700",
  Pending: "bg-orange-100 text-orange-700",
  Expired: "bg-red-100 text-red-600",
  Draft: "bg-gray-100 text-gray-600",
};

function RelatedSection({ sectionKey, section }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-base">{section.icon}</span>
          <span className="text-sm font-black text-gray-900">{section.label}</span>
          <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded-full">{section.items.length}</span>
        </div>
        <span className="text-gray-400 text-xs">{collapsed ? "▼" : "▲"}</span>
      </button>

      {!collapsed && (
        <div className="border-t border-gray-100">
          {section.items.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No {section.label.toLowerCase()} linked</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {section.items.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-600"}`}>{item.status}</span>
                      <span className="text-[10px] text-gray-400">{item.meta}</span>
                      <span className="text-[10px] text-gray-300">· {item.updated}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="p-1.5 hover:bg-teal-50 rounded-lg text-teal-600" title="Add note"><Pencil size={11} /></button>
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600" title="Create task"><CheckCircle size={11} /></button>
                    <a href={`${section.linkPrefix}/${item.id}`} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 hover:bg-violet-50 rounded-lg text-violet-600" title="Open in module">
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ContactRelatedTab({ contact }) {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
        <strong>Read-only CRM view.</strong> Use "Open in module" to make changes in the source module. You can create CRM tasks or notes from here.
      </div>
      {Object.entries(SECTIONS).map(([key, section]) => (
        <RelatedSection key={key} sectionKey={key} section={section} />
      ))}
    </div>
  );
}
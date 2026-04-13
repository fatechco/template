import { BarChart3, ClipboardList, Package, CheckCircle, DollarSign, Star, Settings, FileText, CreditCard, LogOut, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { id: "overview", icon: BarChart3, label: "Overview" },
  { id: "requests", icon: ClipboardList, label: "Available Requests" },
  { id: "active", icon: Package, label: "My Active Shipments" },
  { id: "completed", icon: CheckCircle, label: "Completed Deliveries" },
  { id: "earnings", icon: DollarSign, label: "Earnings" },
  { id: "reviews", icon: Star, label: "My Reviews" },
  { id: "setup", icon: Settings, label: "Setup" },
  { id: "documents", icon: FileText, label: "Documents" },
  { id: "payout", icon: CreditCard, label: "Payout Settings" },
];

export default function KemetroShipperSidebar({ activeSection, setActiveSection }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto flex flex-col">
      <div className="p-6 border-b">
        <Link to="/kemetro" className="block mb-1">
          <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/1399bb5cd_KEMETRO-rect-trans.png" alt="Kemetro" className="h-7 w-auto object-contain" />
        </Link>
        <p className="text-xs text-gray-400 mt-2 font-semibold">SHIPPER CENTER</p>
      </div>
      <nav className="px-3 py-4 space-y-1 flex-1">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${activeSection === id ? "bg-teal-100 text-teal-700" : "text-gray-700 hover:bg-gray-100"}`}>
            <Icon size={18} /> {label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t">
        <button className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 font-semibold text-sm py-2 transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
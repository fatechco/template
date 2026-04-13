import { useState } from "react";
import { Download, FileText, BarChart2, DollarSign, TrendingUp, MapPin, Users, ChevronDown } from "lucide-react";

const REPORTS = [
  {
    id: "users",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    title: "Users Report",
    desc: "Users by role, registration date, country, and verification status",
    filters: ["date_from", "date_to", "role", "country"],
    preview: [
      { name: "Ahmed Hassan", role: "Agent", country: "Egypt", date: "2026-03-10", status: "Verified" },
      { name: "Fatima Mohamed", role: "Agency", country: "Egypt", date: "2026-03-08", status: "Pending" },
      { name: "Omar Rashid", role: "Developer", country: "UAE", date: "2026-03-05", status: "Verified" },
    ],
    headers: ["Name", "Role", "Country", "Date", "Status"],
    keys: ["name", "role", "country", "date", "status"],
  },
  {
    id: "properties",
    icon: FileText,
    color: "bg-purple-50 text-purple-600",
    title: "Properties Report",
    desc: "Listings by category, purpose, country, status, and date range",
    filters: ["date_from", "date_to", "category", "purpose", "country", "status"],
    preview: [
      { title: "Villa Sheikh Zayed", category: "Villa", purpose: "For Sale", country: "Egypt", date: "2026-03-12", status: "Active" },
      { title: "Studio Maadi", category: "Studio", purpose: "For Rent", country: "Egypt", date: "2026-03-10", status: "Active" },
      { title: "Office Downtown", category: "Office", purpose: "For Rent", country: "Egypt", date: "2026-03-08", status: "Pending" },
    ],
    headers: ["Title", "Category", "Purpose", "Country", "Date", "Status"],
    keys: ["title", "category", "purpose", "country", "date", "status"],
  },
  {
    id: "revenue",
    icon: DollarSign,
    color: "bg-green-50 text-green-600",
    title: "Revenue Report",
    desc: "Subscription revenue, plan types, renewals, and cancellations",
    filters: ["date_from", "date_to", "plan"],
    preview: [
      { plan: "Professional", amount: "$199", period: "Monthly", date: "2026-03-15", status: "Paid" },
      { plan: "Starter", amount: "$49", period: "Monthly", date: "2026-03-14", status: "Paid" },
      { plan: "Enterprise", amount: "$599", period: "Annual", date: "2026-03-12", status: "Paid" },
    ],
    headers: ["Plan", "Amount", "Period", "Date", "Status"],
    keys: ["plan", "amount", "period", "date", "status"],
  },
  {
    id: "activity",
    icon: TrendingUp,
    color: "bg-orange-50 text-orange-600",
    title: "Activity Report",
    desc: "Views, contacts, searches, and page traffic by date range",
    filters: ["date_from", "date_to"],
    preview: [
      { date: "2026-03-15", views: 12450, contacts: 340, searches: 2890 },
      { date: "2026-03-14", views: 11200, contacts: 290, searches: 2650 },
      { date: "2026-03-13", views: 13100, contacts: 410, searches: 3100 },
    ],
    headers: ["Date", "Views", "Contacts", "Searches"],
    keys: ["date", "views", "contacts", "searches"],
  },
  {
    id: "locations",
    icon: MapPin,
    color: "bg-teal-50 text-teal-600",
    title: "Locations Report",
    desc: "Properties per city, district, and country",
    filters: ["country"],
    preview: [
      { city: "New Cairo", country: "Egypt", properties: 1842, agents: 124 },
      { city: "Sheikh Zayed", country: "Egypt", properties: 934, agents: 87 },
      { city: "Maadi", country: "Egypt", properties: 712, agents: 65 },
    ],
    headers: ["City", "Country", "Properties", "Agents"],
    keys: ["city", "country", "properties", "agents"],
  },
];

function ReportCard({ report }) {
  const [open, setOpen] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [filters, setFilters] = useState({});
  const Icon = report.icon;

  const ROLE_OPTIONS = ["agent", "agency", "developer", "franchise_owner", "user", "admin"];
  const PURPOSE_OPTIONS = ["For Sale", "For Rent", "For Daily Booking", "For Investment", "In Auction"];
  const STATUS_OPTIONS = ["Active", "Pending", "Expired", "Draft"];
  const CATEGORY_OPTIONS = ["Apartment", "Villa", "Studio", "Office", "Land", "Penthouse"];
  const PLAN_OPTIONS = ["Starter", "Professional", "Enterprise", "Free"];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors text-left">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${report.color}`}>
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <p className="font-black text-gray-900">{report.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{report.desc}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-gray-100 p-5 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {report.filters.map((f) => (
              <div key={f}>
                {(f === "date_from" || f === "date_to") && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">{f === "date_from" ? "From" : "To"}</label>
                    <input type="date" value={filters[f] || ""} onChange={(e) => setFilters((prev) => ({ ...prev, [f]: e.target.value }))}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                )}
                {f === "role" && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">Role</label>
                    <select onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none cursor-pointer">
                      <option value="">All Roles</option>
                      {ROLE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                )}
                {f === "purpose" && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">Purpose</label>
                    <select onChange={(e) => setFilters((p) => ({ ...p, purpose: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none cursor-pointer">
                      <option value="">All</option>
                      {PURPOSE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                )}
                {f === "status" && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">Status</label>
                    <select onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none cursor-pointer">
                      <option value="">All</option>
                      {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                )}
                {f === "category" && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">Category</label>
                    <select onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none cursor-pointer">
                      <option value="">All</option>
                      {CATEGORY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                )}
                {f === "country" && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">Country</label>
                    <select onChange={(e) => setFilters((p) => ({ ...p, country: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none cursor-pointer">
                      <option value="">All</option>
                      <option>Egypt</option><option>UAE</option><option>Saudi Arabia</option>
                    </select>
                  </div>
                )}
                {f === "plan" && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">Plan</label>
                    <select onChange={(e) => setFilters((p) => ({ ...p, plan: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none cursor-pointer">
                      <option value="">All Plans</option>
                      {PLAN_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                )}
              </div>
            ))}
            <div className="self-end">
              <button onClick={() => setGenerated(true)} className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 py-1.5 rounded-lg text-sm transition-colors">
                Generate Report
              </button>
            </div>
          </div>

          {/* Preview */}
          {generated && (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {report.headers.map((h) => <th key={h} className="px-3 py-2 text-left font-bold text-gray-600">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {report.preview.map((row, i) => (
                      <tr key={i} className={`border-b border-gray-50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                        {report.keys.map((k) => <td key={k} className="px-3 py-2 text-gray-700">{typeof row[k] === "number" ? row[k].toLocaleString() : row[k]}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors">
                  <Download size={13} /> Download CSV
                </button>
                <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors">
                  <Download size={13} /> Download PDF
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminReports() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Reports</h1>
        <p className="text-gray-500 text-sm">Generate and export platform reports</p>
      </div>
      <div className="space-y-3">
        {REPORTS.map((r) => <ReportCard key={r.id} report={r} />)}
      </div>
    </div>
  );
}
import { useState } from "react";
import { CheckCircle, XCircle, Eye, Ban } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const MOCK_SHIPPERS = [
  { id: "s1", name: "FastDeliver Co.", type: "Company", coverage: "Cairo, Alexandria, Giza", verified: true, active: true, rating: 4.8, deliveries: 1240 },
  { id: "s2", name: "Ahmed Transport", type: "Individual", coverage: "Cairo, Giza", verified: true, active: true, rating: 4.6, deliveries: 420 },
  { id: "s3", name: "EgyptFreight Ltd.", type: "Freight Company", coverage: "Cairo, Alexandria, Luxor, Aswan", verified: true, active: true, rating: 4.9, deliveries: 2100 },
  { id: "s4", name: "City Riders", type: "Individual", coverage: "Cairo", verified: false, active: true, rating: 4.2, deliveries: 180 },
  { id: "s5", name: "NileShip", type: "Company", coverage: "Cairo, Giza, Luxor", verified: false, active: false, rating: 4.7, deliveries: 890 },
];

const MOCK_SHIPMENTS = [
  { id: "SHP-001", store: "Tile Experts", route: "Cairo → Alexandria", weight: "250 kg", status: "In_Transit", shipper: "FastDeliver Co.", price: "$85", date: "2026-03-17" },
  { id: "SHP-002", store: "BuildRight", route: "Giza → Cairo", weight: "80 kg", status: "Delivered", shipper: "Ahmed Transport", price: "$30", date: "2026-03-16" },
  { id: "SHP-003", store: "Paint Hub", route: "Cairo → Luxor", weight: "150 kg", status: "Posted", shipper: "—", price: "—", date: "2026-03-17" },
  { id: "SHP-004", store: "Steel Direct", route: "Alexandria → Cairo", weight: "300 kg", status: "Assigned", shipper: "EgyptFreight", price: "$200", date: "2026-03-15" },
];

const MOCK_PENDING = [
  { id: "s4", name: "City Riders", type: "Individual", submitted: "2026-03-15", docs: 2 },
  { id: "s5", name: "NileShip", type: "Company", submitted: "2026-03-16", docs: 4 },
];

const CITY_DATA = [
  { city: "Cairo", shipments: 142 }, { city: "Alexandria", shipments: 98 }, { city: "Giza", shipments: 76 },
  { city: "Luxor", shipments: 34 }, { city: "Aswan", shipments: 22 }, { city: "Other", shipments: 45 },
];
const SUCCESS_DATA = [
  { name: "Delivered", value: 78, color: "#22c55e" },
  { name: "In Progress", value: 14, color: "#f97316" },
  { name: "Failed/Returned", value: 8, color: "#ef4444" },
];
const MONTHLY_DATA = [
  { month: "Oct", shipments: 89 }, { month: "Nov", shipments: 124 }, { month: "Dec", shipments: 167 },
  { month: "Jan", shipments: 198 }, { month: "Feb", shipments: 231 }, { month: "Mar", shipments: 287 },
];

const STATUS_STYLES = {
  Draft: "bg-gray-100 text-gray-600", Posted: "bg-blue-100 text-blue-700", Assigned: "bg-purple-100 text-purple-700",
  In_Transit: "bg-orange-100 text-orange-700", Delivered: "bg-green-100 text-green-700", Failed: "bg-red-100 text-red-700",
};

const TABS = ["Shippers", "All Shipments", "Pending Verifications", "Analytics"];

export default function KemetroAdminShipping() {
  const [tab, setTab] = useState("Shippers");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredShipments = MOCK_SHIPMENTS.filter(s => statusFilter === "all" || s.status === statusFilter);

  const exportCSV = () => {
    const rows = [["Shipment#", "Store", "Route", "Weight", "Status", "Shipper", "Price", "Date"],
      ...MOCK_SHIPMENTS.map(s => [s.id, s.store, s.route, s.weight, s.status, s.shipper, s.price, s.date])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "shipments.csv"; a.click();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-gray-900">Shipping Management</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* SHIPPERS LIST */}
      {tab === "Shippers" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Name", "Type", "Coverage", "Verified", "Active", "Rating", "Deliveries", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_SHIPPERS.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-4 py-3 font-bold text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{s.type}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-32 truncate">{s.coverage}</td>
                    <td className="px-4 py-3">{s.verified ? <span className="text-green-600 font-bold text-xs">✅ Yes</span> : <span className="text-gray-400 text-xs">—</span>}</td>
                    <td className="px-4 py-3">{s.active ? <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Active</span> : <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">Suspended</span>}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">⭐ {s.rating}</td>
                    <td className="px-4 py-3 text-gray-700">{s.deliveries.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="text-blue-600 hover:text-blue-700 p-1 rounded" title="View"><Eye size={14} /></button>
                        {!s.verified && <button className="text-green-600 hover:text-green-700 p-1 rounded" title="Verify"><CheckCircle size={14} /></button>}
                        <button className="text-red-500 hover:text-red-600 p-1 rounded" title="Suspend"><Ban size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ALL SHIPMENTS */}
      {tab === "All Shipments" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="all">All Statuses</option>
              {Object.keys(STATUS_STYLES).map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
            <button onClick={exportCSV} className="ml-auto flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
              📥 Export CSV
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {["Shipment#", "Store", "Route", "Weight", "Status", "Shipper", "Price", "Date", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((s, i) => (
                    <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-4 py-3 font-mono text-xs font-black">{s.id}</td>
                      <td className="px-4 py-3 text-gray-700">{s.store}</td>
                      <td className="px-4 py-3 text-gray-700">{s.route}</td>
                      <td className="px-4 py-3 text-gray-600">{s.weight}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[s.status]}`}>{s.status.replace("_", " ")}</span></td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{s.shipper}</td>
                      <td className="px-4 py-3 font-bold">{s.price}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{s.date}</td>
                      <td className="px-4 py-3"><button className="text-blue-600 hover:text-blue-700"><Eye size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PENDING VERIFICATIONS */}
      {tab === "Pending Verifications" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Name", "Type", "Submitted", "Documents", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_PENDING.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-4 py-3 font-bold text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{p.type}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{p.submitted}</td>
                    <td className="px-4 py-3 text-gray-700">{p.docs} uploaded</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"><CheckCircle size={12} /> Approve</button>
                        <button className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"><XCircle size={12} /> Reject</button>
                        <button className="border border-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 transition-colors">Request Info</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ANALYTICS */}
      {tab === "Analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Shipments", value: "417", color: "text-gray-900" },
              { label: "Delivered Successfully", value: "325", color: "text-green-600" },
              { label: "Failed / Returned", value: "33", color: "text-red-600" },
              { label: "Avg Delivery Time", value: "3.2 days", color: "text-blue-600" },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-black text-gray-800 mb-4">Shipments by City</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={CITY_DATA}>
                  <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="shipments" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-black text-gray-800 mb-4">Delivery Success Rate</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={SUCCESS_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                    {SUCCESS_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-black text-gray-800 mb-4">Monthly Shipment Volume</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MONTHLY_DATA}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="shipments" stroke="#FF6B00" strokeWidth={2} dot={{ fill: "#FF6B00", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
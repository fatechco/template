import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Phone, MessageCircle, Eye } from "lucide-react";

const PROJECTS = ["All Projects", "Nile Towers Residences", "Palm Hills Village", "Marina Residences"];

const FUNNEL = [
  { stage: "Total Inquiries", value: 135, color: "#0077B6" },
  { stage: "Contacted", value: 98, color: "#3b82f6" },
  { stage: "Site Visit", value: 52, color: "#f59e0b" },
  { stage: "Negotiating", value: 24, color: "#8b5cf6" },
  { stage: "Sold", value: 11, color: "#10b981" },
];

const INQ_BY_PROJECT = [
  { name: "Nile Towers", inquiries: 45 },
  { name: "Palm Hills", inquiries: 29 },
  { name: "Marina", inquiries: 61 },
];

const MONTHLY_SALES = [
  { month: "Oct", sales: 2 }, { month: "Nov", sales: 3 }, { month: "Dec", sales: 1 },
  { month: "Jan", sales: 4 }, { month: "Feb", sales: 5 }, { month: "Mar", sales: 3 },
];

const UNIT_TYPES = [
  { name: "Studio", value: 18, color: "#0077B6" },
  { name: "1 Bedroom", value: 35, color: "#FF6B00" },
  { name: "2 Bedrooms", value: 28, color: "#10b981" },
  { name: "3 Bedrooms", value: 14, color: "#8b5cf6" },
  { name: "Penthouse", value: 5, color: "#f59e0b" },
];

const LEADS = [
  { id: 1, name: "Ahmed Hassan", contact: "+20 123 456 789", unit: "2BR — Nile Towers", status: "Negotiating", date: "2026-03-15" },
  { id: 2, name: "Fatima Mohamed", contact: "+20 111 222 333", unit: "Studio — Marina Res.", status: "Site Visit", date: "2026-03-12" },
  { id: 3, name: "Omar Rashid", contact: "+20 100 987 654", unit: "1BR — Palm Hills", status: "Contacted", date: "2026-03-10" },
  { id: 4, name: "Sara Khaled", contact: "+20 122 345 678", unit: "3BR — Nile Towers", status: "Sold", date: "2026-03-05" },
  { id: 5, name: "Mohamed Nasser", contact: "+20 115 567 890", unit: "Penthouse — Marina", status: "Inquiry", date: "2026-03-18" },
];

const LEAD_STATUS_COLORS = {
  Inquiry: "bg-gray-100 text-gray-600",
  Contacted: "bg-blue-100 text-blue-700",
  "Site Visit": "bg-orange-100 text-orange-700",
  Negotiating: "bg-purple-100 text-purple-700",
  Sold: "bg-green-100 text-green-700",
};

export default function ProjectSales() {
  const [project, setProject] = useState("All Projects");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-gray-900">Project Sales</h1>
        <select value={project} onChange={e => setProject(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-orange-400">
          {PROJECTS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-900 mb-5">Sales Funnel</h3>
        <div className="space-y-2">
          {FUNNEL.map((f, i) => {
            const pct = Math.round((f.value / FUNNEL[0].value) * 100);
            return (
              <div key={f.stage} className="flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-600 w-32 text-right flex-shrink-0">{f.stage}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div className="h-full rounded-full flex items-center justify-end pr-3" style={{ width: `${pct}%`, backgroundColor: f.color }}>
                    <span className="text-white text-xs font-black">{f.value}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-8">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-4">Inquiries by Project</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={INQ_BY_PROJECT}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="inquiries" fill="#0077B6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-4">Monthly Sales Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY_SALES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#FF6B00" strokeWidth={2} dot={{ r: 4, fill: "#FF6B00" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-4">Unit Types Sold</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={UNIT_TYPES} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                {UNIT_TYPES.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Buyer Leads Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900">Buyer Leads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Buyer</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Contact</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Unit Interested</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {LEADS.map((l, i) => (
                <tr key={l.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{l.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{l.contact}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{l.unit}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${LEAD_STATUS_COLORS[l.status]}`}>{l.status}</span></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{l.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center"><Phone size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-emerald-50 text-emerald-600 flex items-center justify-center"><MessageCircle size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Eye size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
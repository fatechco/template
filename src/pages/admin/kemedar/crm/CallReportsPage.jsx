import { Search, Filter, Download } from "lucide-react";
import { useState } from "react";

const mockReports = [
  { id: 1, salesPerson: "Fatima Ali", contact: "Ahmed Hassan", phone: "+201001234567", type: "WhatsApp", date: "2024-03-21", duration: "15:30", outcome: "Interested", notes: "Discussed features", nextAction: "2024-03-25" },
  { id: 2, salesPerson: "Omar Khalil", contact: "Layla Mohamed", phone: "+201101234567", type: "Phone", date: "2024-03-21", duration: "08:45", outcome: "Converted", notes: "Closed deal", nextAction: "" },
  { id: 3, salesPerson: "Fatima Ali", contact: "Mohamed Fahmy", phone: "+201201234567", type: "SMS", date: "2024-03-20", duration: "—", outcome: "No Answer", notes: "Left message", nextAction: "2024-03-22" },
];

export default function CallReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ salesPerson: "all", callType: "all", outcome: "all" });

  const today = mockReports.filter(r => r.date === "2024-03-21");
  const whatsappCount = mockReports.filter(r => r.type === "WhatsApp").length;
  const phoneCount = mockReports.filter(r => r.type === "Phone").length;
  const smsCount = mockReports.filter(r => r.type === "SMS").length;

  const filtered = mockReports.filter(r =>
    (r.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.salesPerson.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filters.salesPerson === "all" || r.salesPerson === filters.salesPerson) &&
    (filters.callType === "all" || r.type === filters.callType) &&
    (filters.outcome === "all" || r.outcome === filters.outcome)
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Call Reports</h1>
        <p className="text-sm text-gray-600 mt-1">Track all customer interactions and outcomes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Today's Calls", value: today.length, color: "bg-blue-100 text-blue-700" },
          { label: "WhatsApp", value: whatsappCount, color: "bg-green-100 text-green-700" },
          { label: "Phone", value: phoneCount, color: "bg-purple-100 text-purple-700" },
          { label: "SMS", value: smsCount, color: "bg-orange-100 text-orange-700" },
          { label: "Email", value: 0, color: "bg-gray-100 text-gray-700" },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-xs font-bold mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search contact or sales person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
          <select
            value={filters.callType}
            onChange={(e) => setFilters({ ...filters, callType: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="Phone">Phone</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="SMS">SMS</option>
          </select>
          <select
            value={filters.outcome}
            onChange={(e) => setFilters({ ...filters, outcome: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Outcomes</option>
            <option value="Interested">Interested</option>
            <option value="Converted">Converted</option>
            <option value="No Answer">No Answer</option>
          </select>
          <button className="px-4 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 flex items-center gap-2 whitespace-nowrap">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Sales Person</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Contact</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Duration</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Outcome</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Notes</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(report => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">{report.salesPerson}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{report.contact}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{report.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      report.type === "Phone" ? "bg-purple-100 text-purple-700"
                      : report.type === "WhatsApp" ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{report.date}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{report.duration}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      report.outcome === "Converted" ? "bg-green-100 text-green-700"
                      : report.outcome === "Interested" ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}>
                      {report.outcome}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-xs">{report.notes}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{report.nextAction || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
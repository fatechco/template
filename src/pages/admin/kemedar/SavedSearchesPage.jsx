import { Search, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

const mockSearches = [
  { id: 1, user: "Ahmed Hassan", criteria: "Villa in Cairo, 500K-1M", alert: "Email", frequency: "Weekly", lastTriggered: "2024-03-21", created: "2024-02-01" },
  { id: 2, user: "Layla Mohamed", criteria: "Apartment in Giza, Rent", alert: "Push", frequency: "Daily", lastTriggered: "2024-03-21", created: "2024-03-10" },
];

export default function SavedSearchesPage() {
  const [tab, setTab] = useState("properties");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Saved Searches</h1>
        <p className="text-sm text-gray-600 mt-1">View saved searches from users</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        {["properties", "projects", "agents", "developers", "buy-requests"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-bold rounded-t-lg transition-all border-b-2 ${
              tab === t
                ? "border-orange-600 text-orange-600 bg-orange-50"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-3">
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          <input type="text" placeholder="Search user..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">User</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Search Criteria</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Alert Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Frequency</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Last Triggered</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Created</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockSearches.map(search => (
                <tr key={search.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">{search.user}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs">{search.criteria}</td>
                  <td className="px-4 py-3"><span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">{search.alert}</span></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{search.frequency}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{search.lastTriggered}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{search.created}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-blue-600 font-bold text-xs hover:underline">View</button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Trash2 size={14} className="text-red-600" />
                      </button>
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
import { useState } from 'react';
import { Download, FileText } from 'lucide-react';

const REPORTS = [
  { id: 1, title: "💰 Revenue Report", desc: "Sales, invoices, and payment status", icon: "💰" },
  { id: 2, title: "📦 Orders Report", desc: "All proposals and estimates", icon: "📦" },
  { id: 3, title: "👥 Clients Report", desc: "Customer list and spending", icon: "👥" },
  { id: 4, title: "👤 Employee Performance", desc: "Tasks completed and metrics", icon: "👤" },
  { id: 5, title: "📋 Tasks Report", desc: "Task completion and timeline", icon: "📋" },
  { id: 6, title: "💸 Expenses Report", desc: "All expenses by category", icon: "💸" },
];

export default function FranchiseOwnerBizReports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState("month");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-indigo-600 pl-4">
        <h1 className="text-3xl font-black text-gray-900">Business Reports</h1>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
        <label className="text-sm font-bold text-gray-700">Date Range:</label>
        <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-400">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        {REPORTS.map(report => (
          <button key={report.id} onClick={() => setSelectedReport(report)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all text-left group"
          >
            <p className="text-5xl mb-3 group-hover:scale-110 transition-transform">{report.icon}</p>
            <h3 className="text-lg font-black text-gray-900 mb-1">{report.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{report.desc}</p>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm group-hover:gap-3 transition-all">
              <span>Generate Report</span>
              <span>→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">{selectedReport.title}</h2>

            {/* Sample Data */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-black text-green-600">$28,500</p>
                  <p className="text-xs text-gray-600 mt-1">Total Revenue</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-black text-blue-600">12</p>
                  <p className="text-xs text-gray-600 mt-1">Invoices</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-black text-purple-600">89%</p>
                  <p className="text-xs text-gray-600 mt-1">Collection Rate</p>
                </div>
              </div>

              {/* Sample Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-bold text-gray-900">Item</th>
                      <th className="px-4 py-2 text-left font-bold text-gray-900">Amount</th>
                      <th className="px-4 py-2 text-left font-bold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-2 text-gray-700">Invoice KFO-001</td>
                      <td className="px-4 py-2 font-bold">$5,000</td>
                      <td className="px-4 py-2"><span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">Paid</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-700">Invoice KFO-002</td>
                      <td className="px-4 py-2 font-bold">$3,500</td>
                      <td className="px-4 py-2"><span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-700">Sent</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-700">Invoice KFO-003</td>
                      <td className="px-4 py-2 font-bold">$8,000</td>
                      <td className="px-4 py-2"><span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">Paid</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-3">
              <button onClick={() => setSelectedReport(null)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Close</button>
              <button className="flex-1 border-2 border-indigo-600 text-indigo-600 font-bold py-2.5 rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-2">
                <Download size={16} /> Download CSV
              </button>
              <button className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
                <FileText size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
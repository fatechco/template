// @ts-nocheck
import { Download, Printer, Mail } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ReportTemplate({
  title,
  description,
  filters,
  kpis,
  chartData,
  chartType = "line",
  tableHeaders,
  tableData,
  onExportCSV,
  onExportExcel,
  onPrint,
  onEmail,
}) {
  const handleGenerateReport = () => {
    console.log("Report generated");
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Filters</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filters.map((filter, idx) => (
            <div key={idx}>
              <label className="text-xs font-bold text-gray-600 block mb-1">{filter.label}</label>
              {filter.type === "date" && (
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
              )}
              {filter.type === "select" && (
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
                  <option>All</option>
                  {filter.options?.map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              )}
              {filter.type === "text" && (
                <input type="text" placeholder={filter.placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
              )}
            </div>
          ))}
        </div>
        <button onClick={handleGenerateReport} className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700">
          📊 Generate Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-600 font-bold uppercase mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
            <p className="text-xs text-green-600 font-bold mt-2">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ff6b00" strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ff6b00" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Data</h2>
          <span className="text-xs text-gray-600 font-bold">{tableData?.length || 0} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {tableHeaders?.map((header, idx) => (
                  <th key={idx} className="px-4 py-3 text-left font-bold text-gray-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData?.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(row).map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-3 text-gray-900">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tableData?.length > 10 && (
          <div className="px-6 py-3 border-t border-gray-200 text-center text-sm text-gray-600">
            Showing 10 of {tableData.length} records (pagination available)
          </div>
        )}
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={onExportCSV} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50">
          <Download size={16} /> Export CSV
        </button>
        <button onClick={onExportExcel} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50">
          <Download size={16} /> Export Excel
        </button>
        <button onClick={onPrint} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50">
          <Printer size={16} /> Print
        </button>
        <button onClick={onEmail} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50">
          <Mail size={16} /> Email Report
        </button>
      </div>
    </div>
  );
}
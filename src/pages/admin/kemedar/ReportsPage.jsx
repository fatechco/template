import { useState } from "react";
import { Download, Printer, Mail, FileText } from "lucide-react";
import UsersReport from "@/components/admin/kemedar/reports/UsersReport";
import PropertiesReport from "@/components/admin/kemedar/reports/PropertiesReport";
import ProjectsReport from "@/components/admin/kemedar/reports/ProjectsReport";
import RevenueReport from "@/components/admin/kemedar/reports/RevenueReport";
import ActivityReport from "@/components/admin/kemedar/reports/ActivityReport";

const REPORT_TYPES = [
  { id: "users", label: "Users Report", icon: "👥" },
  { id: "properties", label: "Properties Report", icon: "🏠" },
  { id: "projects", label: "Projects Report", icon: "🏗" },
  { id: "revenue", label: "Revenue Report", icon: "💰" },
  { id: "activity", label: "Activity Report", icon: "📊" },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("users");

  const reportComponents = {
    users: <UsersReport />,
    properties: <PropertiesReport />,
    projects: <ProjectsReport />,
    revenue: <RevenueReport />,
    activity: <ActivityReport />,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Reports</h1>
        <p className="text-sm text-gray-600 mt-1">Generate and analyze detailed reports</p>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {REPORT_TYPES.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 flex-shrink-0 ${
                selectedReport === report.id
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{report.icon}</span>
              {report.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Report */}
      {reportComponents[selectedReport]}
    </div>
  );
}
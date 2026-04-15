// @ts-nocheck
import ReportTemplate from "./ReportTemplate";

const mockChartData = [
  { name: "Jan", value: 12 },
  { name: "Feb", value: 19 },
  { name: "Mar", value: 28 },
  { name: "Apr", value: 35 },
  { name: "May", value: 42 },
  { name: "Jun", value: 48 },
];

const mockTableData = [
  { name: "New Cairo City", developer: "Cairo Dev", city: "Cairo", units: 450, status: "active", delivery: "Q4 2025", source: "on-site" },
  { name: "Sheikh Zayed Phase 2", developer: "Gold Coast", city: "Giza", units: 320, status: "pending", delivery: "Q2 2026", source: "on-site" },
  { name: "Downtown Mall", developer: "Megamall", city: "Cairo", units: 180, status: "active", delivery: "Q1 2025", source: "imported" },
];

export default function ProjectsReport() {
  return (
    <ReportTemplate
      title="Projects Report"
      description="Analyze development projects and units"
      filters={[
        { label: "Date From", type: "date" },
        { label: "Date To", type: "date" },
        { label: "City", type: "select", options: ["Cairo", "Giza", "Alexandria"] },
        { label: "Status", type: "select", options: ["Active", "Pending", "Completed"] },
      ]}
      kpis={[
        { label: "Total Projects", value: "234", change: "↑ 8% from last month" },
        { label: "Active Projects", value: "156", change: "↑ 5% from last month" },
        { label: "Pending Review", value: "34", change: "↓ 1% from last month" },
        { label: "Total Units", value: "12,450", change: "↑ 10% from last month" },
      ]}
      chartData={mockChartData}
      chartType="line"
      tableHeaders={["Project Name", "Developer", "City", "Units", "Status", "Delivery", "Source"]}
      tableData={mockTableData}
      onExportCSV={() => console.log("Export CSV")}
      onExportExcel={() => console.log("Export Excel")}
      onPrint={() => window.print()}
      onEmail={() => console.log("Email report")}
    />
  );
}
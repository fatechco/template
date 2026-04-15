// @ts-nocheck
import ReportTemplate from "./ReportTemplate";

const mockChartData = [
  { name: "Mar 1", value: 45 },
  { name: "Mar 5", value: 52 },
  { name: "Mar 10", value: 48 },
  { name: "Mar 15", value: 61 },
  { name: "Mar 20", value: 55 },
  { name: "Mar 25", value: 67 },
  { name: "Mar 30", value: 72 },
];

const mockTableData = [
  { name: "Ahmed Hassan", email: "ahmed@example.com", role: "Agent", status: "active", joined: "2024-03-15", properties: 12 },
  { name: "Layla Mohamed", email: "layla@example.com", role: "Common", status: "active", joined: "2024-03-14", properties: 3 },
  { name: "Omar Khalil", email: "omar@example.com", role: "Developer", status: "pending", joined: "2024-03-13", properties: 25 },
];

export default function UsersReport() {
  return (
    <ReportTemplate
      title="Users Report"
      description="Analyze user registrations and demographics"
      filters={[
        { label: "Date From", type: "date" },
        { label: "Date To", type: "date" },
        { label: "Country", type: "select", options: ["Egypt", "Saudi Arabia", "UAE"] },
        { label: "Role", type: "select", options: ["Common", "Agent", "Developer", "Agency"] },
      ]}
      kpis={[
        { label: "New Users", value: "234", change: "↑ 12% from last month" },
        { label: "Active Users", value: "1,245", change: "↑ 8% from last month" },
        { label: "Pending Approval", value: "45", change: "↓ 3% from last month" },
        { label: "Verified Users", value: "892", change: "↑ 15% from last month" },
      ]}
      chartData={mockChartData}
      chartType="line"
      tableHeaders={["Name", "Email", "Role", "Status", "Joined", "Properties"]}
      tableData={mockTableData}
      onExportCSV={() => console.log("Export CSV")}
      onExportExcel={() => console.log("Export Excel")}
      onPrint={() => window.print()}
      onEmail={() => console.log("Email report")}
    />
  );
}
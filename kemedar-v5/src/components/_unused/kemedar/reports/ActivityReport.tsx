// @ts-nocheck
import ReportTemplate from "./ReportTemplate";

const mockChartData = [
  { name: "Mar 1", value: 1240 },
  { name: "Mar 5", value: 1521 },
  { name: "Mar 10", value: 1489 },
  { name: "Mar 15", value: 1610 },
  { name: "Mar 20", value: 1555 },
  { name: "Mar 25", value: 1678 },
  { name: "Mar 30", value: 1742 },
];

const mockTableData = [
  { user: "Ahmed Hassan", action: "Login", timestamp: "2024-03-21 14:23", ip: "192.168.1.1", status: "success" },
  { user: "Layla Mohamed", action: "Search Property", timestamp: "2024-03-21 13:45", ip: "192.168.1.2", status: "success" },
  { user: "Omar Khalil", action: "View Listing", timestamp: "2024-03-21 12:30", ip: "192.168.1.3", status: "success" },
];

export default function ActivityReport() {
  return (
    <ReportTemplate
      title="Activity Report"
      description="Monitor user activity and engagement"
      filters={[
        { label: "Date From", type: "date" },
        { label: "Date To", type: "date" },
        { label: "Action", type: "select", options: ["Login", "Search", "View", "Contact", "All"] },
        { label: "User Type", type: "select", options: ["All", "Buyers", "Sellers", "Agents"] },
      ]}
      kpis={[
        { label: "Daily Active Users", value: "1,742", change: "↑ 15% from last month" },
        { label: "Total Searches", value: "8,234", change: "↑ 22% from last month" },
        { label: "Property Views", value: "45,123", change: "↑ 18% from last month" },
        { label: "Contacts Made", value: "2,341", change: "↑ 25% from last month" },
      ]}
      chartData={mockChartData}
      chartType="line"
      tableHeaders={["User", "Action", "Timestamp", "IP Address", "Status"]}
      tableData={mockTableData}
      onExportCSV={() => console.log("Export CSV")}
      onExportExcel={() => console.log("Export Excel")}
      onPrint={() => window.print()}
      onEmail={() => console.log("Email report")}
    />
  );
}
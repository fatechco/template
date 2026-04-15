// @ts-nocheck
import ReportTemplate from "./ReportTemplate";

const mockChartData = [
  { name: "Jan", value: 234 },
  { name: "Feb", value: 289 },
  { name: "Mar", value: 312 },
  { name: "Apr", value: 378 },
  { name: "May", value: 401 },
  { name: "Jun", value: 455 },
];

const mockTableData = [
  { title: "Modern Villa Cairo", owner: "Ahmed Hassan", city: "Cairo", category: "Villa", status: "active", price: "850,000 EGP", views: 234 },
  { title: "Apartment Giza", owner: "Layla Mohamed", city: "Giza", category: "Apartment", status: "pending", price: "2,500 EGP", views: 45 },
  { title: "Office Complex", owner: "Omar Khalil", city: "Cairo", category: "Office", status: "active", price: "5,000 EGP", views: 567 },
];

export default function PropertiesReport() {
  return (
    <ReportTemplate
      title="Properties Report"
      description="Analyze property listings and performance"
      filters={[
        { label: "Date From", type: "date" },
        { label: "Date To", type: "date" },
        { label: "City", type: "select", options: ["Cairo", "Giza", "Alexandria"] },
        { label: "Category", type: "select", options: ["Villa", "Apartment", "Office", "Land"] },
      ]}
      kpis={[
        { label: "Total Properties", value: "1,245", change: "↑ 5% from last month" },
        { label: "Active Listings", value: "892", change: "↑ 8% from last month" },
        { label: "Pending Review", value: "123", change: "↓ 2% from last month" },
        { label: "Imported Data", value: "230", change: "↑ 12% from last month" },
      ]}
      chartData={mockChartData}
      chartType="bar"
      tableHeaders={["Title", "Owner", "City", "Category", "Status", "Price", "Views"]}
      tableData={mockTableData}
      onExportCSV={() => console.log("Export CSV")}
      onExportExcel={() => console.log("Export Excel")}
      onPrint={() => window.print()}
      onEmail={() => console.log("Email report")}
    />
  );
}
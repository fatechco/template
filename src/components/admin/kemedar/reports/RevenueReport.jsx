import ReportTemplate from "./ReportTemplate";

const mockChartData = [
  { name: "Jan", value: 45000 },
  { name: "Feb", value: 52000 },
  { name: "Mar", value: 48000 },
  { name: "Apr", value: 61000 },
  { name: "May", value: 75000 },
  { name: "Jun", value: 82000 },
];

const mockTableData = [
  { orderId: "ORD-001", product: "Premium Plan", type: "Subscription", amount: "2,500 EGP", date: "2024-03-21", status: "paid" },
  { orderId: "ORD-002", product: "Featured Listing", type: "Service", amount: "500 EGP", date: "2024-03-20", status: "paid" },
  { orderId: "ORD-003", product: "Annual Plan", type: "Subscription", amount: "25,000 EGP", date: "2024-03-19", status: "pending" },
];

export default function RevenueReport() {
  return (
    <ReportTemplate
      title="Revenue Report"
      description="Analyze platform revenue and transactions"
      filters={[
        { label: "Date From", type: "date" },
        { label: "Date To", type: "date" },
        { label: "Product Type", type: "select", options: ["Subscription", "Service", "Featured", "All"] },
        { label: "Status", type: "select", options: ["Paid", "Pending", "Refunded"] },
      ]}
      kpis={[
        { label: "Total Revenue", value: "363,000 EGP", change: "↑ 18% from last month" },
        { label: "Subscriptions", value: "245,000 EGP", change: "↑ 12% from last month" },
        { label: "Services", value: "98,000 EGP", change: "↑ 24% from last month" },
        { label: "Refunds", value: "-20,000 EGP", change: "↑ 5% from last month" },
      ]}
      chartData={mockChartData}
      chartType="bar"
      tableHeaders={["Order ID", "Product", "Type", "Amount", "Date", "Status"]}
      tableData={mockTableData}
      onExportCSV={() => console.log("Export CSV")}
      onExportExcel={() => console.log("Export Excel")}
      onPrint={() => window.print()}
      onEmail={() => console.log("Email report")}
    />
  );
}
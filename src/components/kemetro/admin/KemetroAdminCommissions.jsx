import { DollarSign, Send } from "lucide-react";

const COMMISSION_DATA = [
  {
    id: "1",
    store: "BuildRight Materials",
    orders: 340,
    gmv: "$125,000",
    commission: "$10,625",
    netToSeller: "$114,375",
    status: "Paid",
  },
  {
    id: "2",
    store: "Steel Direct",
    orders: 280,
    gmv: "$98,000",
    commission: "$8,330",
    netToSeller: "$89,670",
    status: "Pending",
  },
  {
    id: "3",
    store: "Tile Experts",
    orders: 250,
    gmv: "$87,000",
    commission: "$7,395",
    netToSeller: "$79,605",
    status: "Pending",
  },
  {
    id: "4",
    store: "Paint Hub",
    orders: 180,
    gmv: "$65,000",
    commission: "$5,525",
    netToSeller: "$59,475",
    status: "Paid",
  },
];

const SUMMARY = {
  totalGMV: "$375,000",
  totalCommission: "$31,875",
  paidOut: "$173,850",
  pending: "$32,025",
};

export default function KemetroAdminCommissions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Commission & Payments</h1>
        <p className="text-gray-600 mt-1">Track platform earnings and seller payouts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Total GMV</p>
          <p className="text-3xl font-black text-gray-900">{SUMMARY.totalGMV}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Total Commission</p>
          <p className="text-3xl font-black text-[#0077B6]">{SUMMARY.totalCommission}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Paid Out</p>
          <p className="text-3xl font-black text-green-600">{SUMMARY.paidOut}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Pending</p>
          <p className="text-3xl font-black text-orange-600">{SUMMARY.pending}</p>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Store</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Orders</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">GMV</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Commission (8.5%)</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Net to Seller</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {COMMISSION_DATA.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 font-semibold text-gray-900">{item.store}</td>
                  <td className="px-6 py-4 text-gray-700">{item.orders}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{item.gmv}</td>
                  <td className="px-6 py-4 text-[#0077B6] font-bold">{item.commission}</td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{item.netToSeller}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded ${
                        item.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.status === "Pending" && (
                      <button className="flex items-center gap-1 bg-[#0077B6] hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors">
                        <Send size={12} />
                        Pay
                      </button>
                    )}
                    {item.status === "Paid" && (
                      <span className="text-green-600 text-xs font-bold">✓ Completed</span>
                    )}
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
// @ts-nocheck
import { Eye, CheckCircle, Ban, Shield, Edit2 } from "lucide-react";

const SELLERS = [
  {
    id: "1",
    storeName: "BuildRight Materials",
    owner: "Ahmed Hassan",
    plan: "Professional",
    products: 156,
    sales: 2340,
    status: "Active",
    verified: true,
  },
  {
    id: "2",
    storeName: "Steel Direct",
    owner: "Fatima Mohamed",
    plan: "Enterprise",
    products: 89,
    sales: 1856,
    status: "Active",
    verified: true,
  },
  {
    id: "3",
    storeName: "Tile Experts",
    owner: "Omar Ahmed",
    plan: "Basic",
    products: 45,
    sales: 567,
    status: "Pending",
    verified: false,
  },
  {
    id: "4",
    storeName: "Paint Hub",
    owner: "Layla Hassan",
    plan: "Professional",
    products: 78,
    sales: 890,
    status: "Suspended",
    verified: false,
  },
];

const PLAN_COLORS = {
  Basic: "bg-blue-100 text-blue-700",
  Professional: "bg-purple-100 text-purple-700",
  Enterprise: "bg-[#0077B6] text-white",
};

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Suspended: "bg-red-100 text-red-700",
};

export default function KemetroAdminSellers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Sellers Management</h1>
        <p className="text-gray-600 mt-1">Manage store registrations, plans, and verification</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Store</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Owner</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Plan</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Products</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Sales</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Verified</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {SELLERS.map((seller, idx) => (
                <tr key={seller.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 font-semibold text-gray-900">{seller.storeName}</td>
                  <td className="px-6 py-4 text-gray-700">{seller.owner}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded ${PLAN_COLORS[seller.plan]}`}>
                      {seller.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{seller.products}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{seller.sales}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded ${STATUS_COLORS[seller.status]}`}>
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {seller.verified ? (
                      <span className="text-green-600">✅ Verified</span>
                    ) : (
                      <span className="text-yellow-600">⏳ Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700 font-bold" title="View">
                        <Eye size={16} />
                      </button>
                      {seller.status === "Pending" && (
                        <button className="text-green-600 hover:text-green-700 font-bold" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {seller.status === "Active" && (
                        <button className="text-red-600 hover:text-red-700 font-bold" title="Suspend">
                          <Ban size={16} />
                        </button>
                      )}
                      {!seller.verified && (
                        <button className="text-teal-600 hover:text-teal-700 font-bold" title="Verify">
                          <Shield size={16} />
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-700 font-bold" title="Edit Plan">
                        <Edit2 size={16} />
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
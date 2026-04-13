import { CheckCircle, XCircle, Edit2, Eye } from "lucide-react";

const PENDING_PRODUCTS = [
  {
    id: "1",
    productName: "Premium Cement 50kg",
    store: "BuildRight Materials",
    category: "Cement & Concrete",
    price: "$7.50",
    submitted: "2025-03-10",
    status: "Pending Review",
  },
  {
    id: "2",
    productName: "Steel Rods 12mm",
    store: "Steel Direct",
    category: "Steel & Iron",
    price: "$450",
    submitted: "2025-03-09",
    status: "Under Review",
  },
  {
    id: "3",
    productName: "Wall Paint 20L",
    store: "Paint Hub",
    category: "Paint & Coatings",
    price: "$49.99",
    submitted: "2025-03-08",
    status: "Pending Review",
  },
  {
    id: "4",
    productName: "Ceramic Tiles 60x60",
    store: "Tile Experts",
    category: "Tiles & Flooring",
    price: "$28.50",
    submitted: "2025-03-07",
    status: "Pending Review",
  },
];

export default function KemetroAdminProducts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Products Pending Approval</h1>
        <p className="text-gray-600 mt-1">{PENDING_PRODUCTS.length} products awaiting review</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Product</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Store</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Price</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Submitted</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_PRODUCTS.map((product, idx) => (
                <tr key={product.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 font-semibold text-gray-900">{product.productName}</td>
                  <td className="px-6 py-4 text-gray-700">{product.store}</td>
                  <td className="px-6 py-4 text-gray-700">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{product.price}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(product.submitted).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-3 py-1.5 rounded bg-yellow-100 text-yellow-700">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="text-green-600 hover:text-green-700 font-bold"
                        title="Approve"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-700 font-bold"
                        title="Reject"
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-700 font-bold"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-700 font-bold"
                        title="View"
                      >
                        <Eye size={16} />
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
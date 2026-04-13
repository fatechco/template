import { useState } from "react";
import { Eye, Mail, CheckCircle, Flag, X } from "lucide-react";

const MOCK_SELLERS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  logo: ["TF", "SK", "MM", "EL", "RP", "AS"][i],
  store: ["Tech Finds", "Sara's Kitchen", "Mobile Max", "El-Nour Shop", "Room Perfect", "Ahmed's Store"][i],
  owner: ["Ahmed Hassan", "Sara Khaled", "Mohamed Ali", "El-Nour Co.", "Rania Pro", "Ahmed Saber"][i],
  category: ["Electronics", "Food & Bev.", "Mobile", "General", "Furniture", "Apparel"][i],
  products: [45, 120, 28, 200, 67, 34][i],
  orders: [230, 89, 412, 156, 78, 193][i],
  revenue: ["$12,400", "$4,200", "$31,000", "$8,700", "$5,600", "$11,200"][i],
  plan: ["Gold", "Free", "Silver", "Gold", "Bronze", "Silver"][i],
  verified: [true, false, true, true, false, true][i],
  status: ["Active", "Active", "Active", "Suspended", "Active", "Active"][i],
}));

const PLAN_COLORS = { Gold: "bg-yellow-100 text-yellow-700", Silver: "bg-gray-100 text-gray-600", Bronze: "bg-orange-100 text-orange-700", Free: "bg-blue-50 text-blue-600" };
const STATUS_COLORS = { Active: "bg-green-100 text-green-700", Suspended: "bg-red-100 text-red-700" };

function VerifySellerModal({ seller, onClose }) {
  const [checks, setChecks] = useState({ exists: false, products: false, contact: false, bank: false, guidelines: false });
  const toggle = k => setChecks(c => ({ ...c, [k]: !c[k] }));

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Verify Kemetro Seller</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="font-bold text-gray-900">{seller.store}</p>
            <p className="text-sm text-gray-500">Owner: {seller.owner} · {seller.category}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Verification Checklist</p>
            {[
              { key: "exists", label: "Business exists and confirmed" },
              { key: "products", label: "Products are legitimate" },
              { key: "contact", label: "Contact information verified" },
              { key: "bank", label: "Bank details confirmed" },
              { key: "guidelines", label: "Complies with Kemetro guidelines" },
            ].map(c => (
              <label key={c.key} className="flex items-center gap-3 py-1.5 cursor-pointer">
                <input type="checkbox" checked={checks[c.key]} onChange={() => toggle(c.key)} className="w-4 h-4 accent-blue-500" />
                <span className="text-sm text-gray-700">{c.label}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm">✅ Approve</button>
            <button onClick={onClose} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm">❌ Reject</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function KemetroSellers() {
  const [verifySeller, setVerifySeller] = useState(null);

  return (
    <div className="space-y-5">
      <div className="bg-blue-600 rounded-2xl px-6 py-5">
        <h1 className="text-2xl font-black text-white">🛒 Kemetro Sellers in My Area</h1>
        <p className="text-blue-100 text-sm mt-1">Monitor and verify sellers operating in your coverage zone</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[{ label: "Total Sellers", value: "67" }, { label: "Active Stores", value: "61" }, { label: "Products in Area", value: "2,140" }, { label: "Orders This Month", value: "834" }, { label: "Revenue", value: "$42.8k" }].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Store", "Owner", "Category", "Products", "Orders", "Revenue", "Plan", "Verified", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_SELLERS.map((s, i) => (
                <tr key={s.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">{s.logo}</div>
                      <span className="font-semibold text-gray-900 whitespace-nowrap">{s.store}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{s.owner}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.category}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 text-center">{s.products}</td>
                  <td className="px-4 py-3 text-gray-700 text-center">{s.orders}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{s.revenue}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PLAN_COLORS[s.plan]}`}>{s.plan}</span></td>
                  <td className="px-4 py-3 text-center">{s.verified ? <CheckCircle size={16} className="text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[s.status]}`}>{s.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Eye size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center"><Mail size={13} /></button>
                      <button onClick={() => setVerifySeller(s)} className="w-7 h-7 rounded-lg hover:bg-orange-50 text-orange-500 flex items-center justify-center"><CheckCircle size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><Flag size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {verifySeller && <VerifySellerModal seller={verifySeller} onClose={() => setVerifySeller(null)} />}
    </div>
  );
}
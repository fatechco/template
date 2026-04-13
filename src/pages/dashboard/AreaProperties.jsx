import { useState } from "react";
import { Eye, Edit, Star, Trash2, CheckSquare, X, MapPin } from "lucide-react";

const TABS = ["All", "My Added", "Recent", "Pending Verification", "Active", "Imported", "Franchise"];

const MOCK_PROPS = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  image: `https://images.unsplash.com/photo-${["1545324418-cc1a3fa10c00","1600596542815-ffad4c1539a9","1502672260266-1c1ef2d93688","1497366216548-37526070297c","1570129477492-45c003edd2be","1512917774080-9991f1c4c750","1560448204-e02f11c3d0e2"][i]}?w=80&q=70`,
  title: ["Modern Apt New Cairo", "Villa Sheikh Zayed", "Studio Maadi", "Office Downtown", "Townhouse Katameya", "Sea View North Coast", "Duplex 5th Settlement"][i],
  owner: ["Ahmed H.", "Fatima M.", "Omar R.", "Sara K.", "Mohamed N.", "Khaled T.", "Rania S."][i],
  category: ["Apartment", "Villa", "Studio", "Office", "Townhouse", "Apartment", "Duplex"][i],
  purpose: ["Sale", "Sale", "Rent", "Rent", "Sale", "Sale", "Rent"][i],
  price: ["$120k", "$380k", "$700/mo", "$2,500/mo", "$260k", "$145k", "$1,200/mo"][i],
  status: ["Active", "Pending", "Active", "Pending", "Active", "Active", "Active"][i],
  verified: [true, false, true, false, true, false, true][i],
  views: [234, 89, 56, 34, 101, 203, 45][i],
  date: ["Jan 15", "Feb 10", "Mar 01", "Mar 10", "Feb 28", "Jan 20", "Mar 05"][i],
}));

const STATUS_COLORS = { Active: "bg-green-100 text-green-700", Pending: "bg-yellow-100 text-yellow-700" };

const STATS = [
  { label: "Total", value: "1,247", color: "bg-gray-900 text-white" },
  { label: "Active", value: "892", color: "bg-green-500 text-white" },
  { label: "Pending", value: "47", color: "bg-yellow-500 text-white" },
  { label: "Added Today", value: "12", color: "bg-blue-500 text-white" },
  { label: "Need Attention", value: "23", color: "bg-red-500 text-white" },
];

function VerifyPropertyModal({ prop, onClose }) {
  const [step, setStep] = useState(1);
  const [checks, setChecks] = useState({
    exists: false, owner: false, price: false, photos: false, docs: false, duplicate: false, legal: false
  });
  const [notes, setNotes] = useState("");
  const toggle = k => setChecks(c => ({ ...c, [k]: !c[k] }));

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Verify Property</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? "bg-orange-500" : "bg-gray-200"}`} />
            ))}
          </div>
          <p className="text-xs text-gray-500 font-semibold">Step {step} of 4</p>

          {step === 1 && (
            <div className="space-y-3">
              <p className="font-bold text-gray-700 text-sm">Review Property Details</p>
              <div className="flex gap-3 bg-gray-50 rounded-xl p-4">
                <img src={prop.image} alt="" className="w-20 h-16 rounded-lg object-cover" />
                <div>
                  <p className="font-bold text-gray-900">{prop.title}</p>
                  <p className="text-sm text-gray-500">{prop.category} · {prop.purpose} · {prop.price}</p>
                  <p className="text-sm text-gray-500">Owner: {prop.owner}</p>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-2">
              <p className="font-bold text-gray-700 text-sm">Verification Checklist</p>
              {[
                { key: "exists", label: "Property physically exists and confirmed" },
                { key: "owner", label: "Owner identity verified" },
                { key: "price", label: "Price is accurate and reasonable" },
                { key: "photos", label: "Photos match actual property" },
                { key: "docs", label: "All required documents submitted" },
                { key: "duplicate", label: "No duplicate listing found" },
                { key: "legal", label: "Legal status confirmed" },
              ].map(c => (
                <label key={c.key} className="flex items-center gap-3 py-1 cursor-pointer">
                  <input type="checkbox" checked={checks[c.key]} onChange={() => toggle(c.key)} className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-gray-700">{c.label}</span>
                </label>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <p className="font-bold text-gray-700 text-sm">Add Verification Report</p>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Verification notes..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Verification Date</label>
                <input type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <p className="font-bold text-gray-700 text-sm">Final Action</p>
              <div className="flex flex-col gap-2">
                <button onClick={onClose} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors">✅ Mark as Verified</button>
                <button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">📋 Request More Info</button>
                <button onClick={onClose} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors">❌ Reject Verification</button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {step > 1 && <button onClick={() => setStep(s => s - 1)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm">← Back</button>}
            {step < 4 && <button onClick={() => setStep(s => s + 1)} className="flex-1 bg-[#1a1a2e] text-white font-bold py-2.5 rounded-xl text-sm">Next →</button>}
          </div>
        </div>
      </div>
    </>
  );
}

export default function AreaProperties() {
  const [activeTab, setActiveTab] = useState("All");
  const [verifyProp, setVerifyProp] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">🏠 Properties in My Area</h1>
        <p className="text-gray-500 text-sm mt-0.5">Monitor, verify, and manage all properties in your coverage area</p>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-3 flex-wrap">
        {STATS.map(s => (
          <div key={s.label} className={`${s.color} rounded-xl px-4 py-2.5 text-center min-w-[80px]`}>
            <p className="text-lg font-black">{s.value}</p>
            <p className="text-xs opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === t ? "bg-[#1a1a2e] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        {["Category", "Purpose", "Status", "Date Range", "Owner Type", "Verified"].map(f => (
          <select key={f} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-600 cursor-pointer">
            <option>{f}: All</option>
          </select>
        ))}
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg text-sm">Export CSV</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Property", "Owner", "Category", "Purpose", "Price", "Status", "Verified", "Views", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_PROPS.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-12 h-9 object-cover rounded-lg flex-shrink-0" />
                      <span className="font-semibold text-gray-800 whitespace-nowrap">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{p.owner}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.category}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.purpose}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{p.price}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                  <td className="px-4 py-3 text-center">{p.verified ? <CheckSquare size={16} className="text-green-500 mx-auto" /> : <span className="text-gray-300 text-xs">—</span>}</td>
                  <td className="px-4 py-3 text-gray-600">{p.views}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Eye size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center"><Edit size={13} /></button>
                      <button onClick={() => setVerifyProp(p)} className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center" title="Verify"><CheckSquare size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-yellow-50 text-yellow-600 flex items-center justify-center"><Star size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {verifyProp && <VerifyPropertyModal prop={verifyProp} onClose={() => setVerifyProp(null)} />}
    </div>
  );
}
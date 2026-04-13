import { useState } from "react";
import { X, Check } from "lucide-react";

const PENDING = [
  { id: 1, title: "Full Home Interior Design & Furnishing Package", pro: "Ahmed Hassan", category: "Interior Design", packages: 3, priceMin: 500, priceMax: 2000, currency: "USD", submitted: "Mar 18, 2026", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&q=70" },
  { id: 2, title: "Custom Built-in Wardrobes & Kitchen Cabinets", pro: "Kareem Saad", category: "Carpentry", packages: 2, priceMin: 300, priceMax: 900, currency: "USD", submitted: "Mar 19, 2026", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70" },
  { id: 3, title: "Garden Landscaping & Outdoor Lighting Design", pro: "Layla Nour", category: "Landscaping", packages: 3, priceMin: 200, priceMax: 800, currency: "USD", submitted: "Mar 20, 2026", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70" },
];

const CHECKLIST_ITEMS = [
  "Appropriate category selection",
  "Clear and detailed description",
  "Quality images uploaded",
  "Reasonable pricing structure",
  "Complies with Kemework guidelines",
];

function ReviewModal({ service, onClose }) {
  const [checklist, setChecklist] = useState({});
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [view, setView] = useState("review"); // review | reject

  const allChecked = CHECKLIST_ITEMS.every((_, i) => checklist[i]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <p className="font-black text-gray-900">Review Service</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-5 flex flex-col gap-5">
          {/* Service Preview */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="h-40 bg-gray-100">
              {service.image && <img src={service.image} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <p className="font-black text-gray-900 mb-1">{service.title}</p>
              <p className="text-xs text-gray-500">By {service.pro} · {service.category} · {service.packages} packages · ${service.priceMin}–${service.priceMax}</p>
              <p className="text-xs text-gray-400 mt-1">Submitted: {service.submitted}</p>
            </div>
          </div>

          {view === "reject" ? (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Rejection Reason <span className="text-red-500">*</span></label>
              <textarea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Explain why this service is being rejected..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 resize-none" />
              <div className="flex gap-3 mt-3">
                <button onClick={() => setView("review")} className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-gray-300 text-gray-700">Back</button>
                <button disabled={!rejectReason} onClick={onClose} className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-red-600 disabled:opacity-40">Confirm Rejection</button>
              </div>
            </div>
          ) : (
            <>
              {/* Checklist */}
              <div>
                <p className="font-bold text-gray-800 text-sm mb-3">Approval Checklist</p>
                <div className="flex flex-col gap-2">
                  {CHECKLIST_ITEMS.map((item, i) => (
                    <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${checklist[i] ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="checkbox" checked={!!checklist[i]} onChange={e => setChecklist(c => ({ ...c, [i]: e.target.checked }))} className="accent-green-600 w-4 h-4" />
                      <span className="text-sm text-gray-700">{item}</span>
                      {checklist[i] && <Check size={14} className="ml-auto text-green-600" />}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Approval Notes (optional)</label>
                <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes for the professional..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
              </div>

              <div className="flex gap-3">
                <button disabled={!allChecked} onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-green-600 disabled:opacity-40">✅ Approve Service</button>
                <button onClick={() => setView("reject")} className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-red-300 text-red-600 hover:bg-red-50">❌ Reject</button>
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-amber-300 text-amber-700 hover:bg-amber-50">✏️ Request Changes</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KemeworkServicesPending() {
  const [reviewing, setReviewing] = useState(null);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-black text-gray-900">Services Pending Approval</h1>
        <p className="text-sm text-gray-500">{PENDING.length} services awaiting review</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Service", "Professional", "Category", "Packages", "Price Range", "Submitted", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-black text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PENDING.map(svc => (
              <tr key={svc.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {svc.image && <img src={svc.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <p className="text-xs font-bold text-gray-900 max-w-[160px] line-clamp-2">{svc.title}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{svc.pro}</td>
                <td className="px-4 py-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{svc.category}</span></td>
                <td className="px-4 py-3 text-xs font-bold text-gray-900">{svc.packages} pkgs</td>
                <td className="px-4 py-3 text-xs font-bold text-gray-900">${svc.priceMin}–${svc.priceMax}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{svc.submitted}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => setReviewing(svc)} className="px-3 py-1.5 text-[10px] font-bold bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200">Review</button>
                    <button onClick={() => setReviewing(svc)} className="px-3 py-1.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-lg hover:bg-green-200">✅ Approve</button>
                    <button className="px-3 py-1.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-lg hover:bg-red-200">❌ Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reviewing && <ReviewModal service={reviewing} onClose={() => setReviewing(null)} />}
    </div>
  );
}
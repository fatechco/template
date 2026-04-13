import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";

const TABS = ["All", "Pending", "Accepted", "Rejected", "Withdrawn"];

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Withdrawn: "bg-gray-100 text-gray-500",
};

const MOCK_BIDS = [
  { id: 1, task: "Full Kitchen Renovation with New Cabinets", category: "Remodeling", amount: 4500, currency: "USD", days: 21, status: "Pending", date: "Mar 18", clientRating: 4.7, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=70", description: "Modern kitchen with custom cabinetry, granite countertops, and new appliances." },
  { id: 2, task: "AC Units Installation — 5 Split Units", category: "HVAC", amount: 750, currency: "USD", days: 3, status: "Accepted", date: "Mar 15", clientRating: 4.9, image: null, description: "Professional installation of 5 split AC units with warranty." },
  { id: 3, task: "Interior Painting — Full Villa 4 Bedrooms", category: "Painting", amount: 1400, currency: "USD", days: 10, status: "Rejected", date: "Mar 10", clientRating: 4.5, image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=200&q=70", description: "Interior painting for 4 bedrooms with premium paint." },
  { id: 4, task: "Garden Landscaping & Irrigation System", category: "Landscaping", amount: 3200, currency: "USD", days: 14, status: "Pending", date: "Mar 19", clientRating: null, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=70", description: "Complete landscape design with irrigation system installation." },
  { id: 5, task: "Bathroom Tile Installation — 2 Bathrooms", category: "Tiling", amount: 480, currency: "USD", days: 5, status: "Withdrawn", date: "Mar 5", clientRating: 4.2, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&q=70", description: "Professional tile installation with waterproofing." },
];

function EditBidModal({ bid, onClose }) {
  const [amount, setAmount] = useState(bid.amount);
  const [days, setDays] = useState(bid.days);
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">Edit Bid</p>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <p className="text-xs text-gray-400 mb-4">{bid.task}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Bid Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Duration (days)</label>
            <input
              type="number"
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Additional Note</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Any changes to your bid..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: "#0D9488" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyBidsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedBid, setExpandedBid] = useState(null);
  const [editBid, setEditBid] = useState(null);

  const filtered = MOCK_BIDS.filter(b => activeTab === "All" || b.status === activeTab);

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-[900px] mx-auto">
          <h1 className="text-xl font-black text-gray-900">My Bids</h1>
          <p className="text-sm text-gray-500">{MOCK_BIDS.length} bids submitted</p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
              style={{ background: activeTab === t ? "#0D9488" : "#fff", color: activeTab === t ? "#fff" : "#374151", border: activeTab === t ? "none" : "1px solid #e5e7eb" }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map(bid => (
            <div key={bid.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Bid Summary */}
              <button
                onClick={() => setExpandedBid(expandedBid === bid.id ? null : bid.id)}
                className="w-full p-4 flex gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {bid.image ? <img src={bid.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 text-sm line-clamp-1 mb-1">{bid.task}</p>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{bid.category}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[bid.status]}`}>{bid.status}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Bid: <span className="font-bold text-gray-700">${bid.amount}</span> · {bid.days} days · Submitted {bid.date}
                    {bid.clientRating && ` · Client ⭐ ${bid.clientRating}`}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0 justify-center">
                  {bid.status === "Pending" && (
                    <>
                      <button onClick={e => { e.stopPropagation(); setEditBid(bid); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-teal-300 text-teal-700 hover:bg-teal-50">Edit Bid</button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 text-red-600 hover:bg-red-50">Withdraw</button>
                    </>
                  )}
                  {bid.status === "Accepted" && (
                    <Link to="/dashboard/pro/orders" className="px-3 py-1.5 rounded-lg text-xs font-bold text-white text-center" style={{ background: "#0D9488" }}>View Order →</Link>
                  )}
                  {bid.status === "Rejected" && (
                    <Link to={`/kemework/task/${bid.id}`} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-300 text-gray-600 text-center hover:bg-gray-50">View Task</Link>
                  )}
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedBid === bid.id ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Expanded Details */}
              {expandedBid === bid.id && (
                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-1">Description</p>
                    <p className="text-xs text-gray-600">{bid.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="font-bold text-gray-900">${bid.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="font-bold text-gray-900">{bid.days} days</p>
                    </div>
                    {bid.clientRating && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Rating</p>
                        <p className="font-bold text-gray-900">⭐ {bid.clientRating}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">📬</p>
              <p className="text-gray-500 font-semibold">No bids in this category</p>
            </div>
          )}
        </div>
      </div>

      {editBid && <EditBidModal bid={editBid} onClose={() => setEditBid(null)} />}
    </div>
  );
}
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Share2, X, Clock, CheckCircle2, AlertCircle, FileText, MessageCircle, DollarSign, MapPin } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const TABS = ["All", "Open", "Quotes Received", "Accepted", "Closed"];

const STATUS_CONFIG = {
  open: { label: "Open", icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
  quotes_received: { label: "Quotes Received", icon: FileText, color: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
  accepted: { label: "Accepted", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-700" },
  closed: { label: "Closed", icon: FileText, color: "text-gray-600", bg: "bg-gray-50", badge: "bg-gray-100 text-gray-500" },
};

const MOCK_RFQS = [
  { id: 1, num: "KT-RFQ001", status: "quotes_received", product: "Office Chairs - Executive Model", category: "Furniture", qty: 50, unit: "pieces", budget: 3000, city: "Cairo", deadline: "2026-03-28", quotesCount: 4 },
  { id: 2, num: "KT-RFQ002", status: "open", product: "Ceramic Floor Tiles 60×60", category: "Building Materials", qty: 200, unit: "sqm", budget: 1500, city: "Dubai", deadline: "2026-04-10", quotesCount: 0 },
  { id: 3, num: "KT-RFQ003", status: "accepted", product: "Laptop Bags - Corporate Branded", category: "Electronics", qty: 100, unit: "pieces", budget: 800, city: "Riyadh", deadline: "2026-03-15", quotesCount: 6 },
  { id: 4, num: "KT-RFQ004", status: "closed", product: "Office Stationery Bundle", category: "Office Supplies", qty: 20, unit: "boxes", budget: 400, city: "Amman", deadline: "2026-03-01", quotesCount: 2 },
];

const MOCK_QUOTES = [
  { id: 1, store: "Office Pro", initials: "OP", rating: 4.8, pricePerUnit: 55, deliveryDays: 7, validityDays: 14, message: "We can offer a 5% bulk discount for orders above 60 units. Premium quality guaranteed.", hasDoc: true },
  { id: 2, store: "FurniWorld", initials: "FW", rating: 4.5, pricePerUnit: 48, deliveryDays: 10, validityDays: 10, message: "Stock available. Can deliver within 10 business days to Cairo.", hasDoc: false },
  { id: 3, store: "Cairo Office", initials: "CO", rating: 4.2, pricePerUnit: 62, deliveryDays: 5, validityDays: 7, message: "Express delivery available. Top-grade materials used.", hasDoc: true },
];

function RFQCard({ rfq }) {
  const navigate = useNavigate();
  const sc = STATUS_CONFIG[rfq.status];
  const StatusIcon = sc.icon;
  const daysLeft = Math.ceil((new Date(rfq.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const isUrgent = rfq.status === "open" && daysLeft < 3;

  return (
    <div
      onClick={() => navigate(`/m/kemetro/rfq/${rfq.id}`)}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
    >
      {/* Header with Status */}
      <div className={`px-3.5 py-3 flex items-start justify-between ${sc.bg} border-b border-gray-100`}>
        <div className="flex items-start gap-2 flex-1">
          <StatusIcon size={14} className={`${sc.color} mt-0.5 flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">{rfq.num}</p>
            <p className="text-xs font-bold text-gray-900 line-clamp-1">{rfq.product}</p>
          </div>
        </div>
        {isUrgent && <span className="text-[9px] font-black bg-red-100 text-red-700 px-1.5 py-1 rounded ml-2 flex-shrink-0">URGENT</span>}
      </div>

      {/* Key Info Row */}
      <div className="px-3.5 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <DollarSign size={12} className="text-orange-600" />
            <span className="font-bold text-gray-900">${rfq.budget}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-gray-400" />
            <span className="text-gray-600">{rfq.city}</span>
          </div>
        </div>
        {rfq.quotesCount > 0 && (
          <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">💬 {rfq.quotesCount}</span>
        )}
      </div>

      {/* Category & Deadline */}
      <div className="px-3.5 py-3 flex items-center justify-between">
        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{rfq.category}</span>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${isUrgent ? "text-red-600" : "text-gray-600"}`}>
          <Clock size={11} />
          <span>{daysLeft > 0 ? `${daysLeft}d left` : "Expired"}</span>
        </div>
      </div>
    </div>
  );
}

function RFQDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const rfq = MOCK_RFQS.find(r => r.id === parseInt(id)) || MOCK_RFQS[0];
  const [confirmQuote, setConfirmQuote] = useState(null);
  const sc = STATUS_CONFIG[rfq.status];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-[480px] mx-auto">
      <MobileTopBar title="RFQ Details" showBack
        rightAction={<button className="p-1"><Share2 size={18} className="text-gray-700" /></button>} />

      {/* Sticky Header */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-4 py-3 mb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${sc.badge} mb-2`}>{sc.label}</p>
            <h1 className="text-sm font-black text-gray-900 line-clamp-2">{rfq.product}</h1>
          </div>
          <span className="text-xs font-bold text-gray-500 flex-shrink-0">#{rfq.num}</span>
        </div>
        <p className="text-[10px] text-gray-500">{rfq.category} • {rfq.qty} {rfq.unit}</p>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mb-4 grid grid-cols-3 gap-2">
        <div className="bg-white rounded-lg p-2.5 border border-gray-100 text-center">
          <p className="text-[10px] text-gray-500 font-medium mb-1">Budget</p>
          <p className="text-sm font-black text-orange-600">${rfq.budget}</p>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-gray-100 text-center">
          <p className="text-[10px] text-gray-500 font-medium mb-1">Location</p>
          <p className="text-xs font-bold text-gray-900">{rfq.city}</p>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-gray-100 text-center">
          <p className="text-[10px] text-gray-500 font-medium mb-1">Deadline</p>
          <p className="text-xs font-bold text-gray-900">{Math.ceil((new Date(rfq.deadline) - new Date()) / (1000 * 60 * 60 * 24))}d left</p>
        </div>
      </div>

      {/* Full Details Card */}
      <div className="mx-4 mb-4 bg-white rounded-xl border border-gray-100 p-3.5 space-y-2.5">
        {[
          { icon: FileText, label: "Quantity", value: `${rfq.qty} ${rfq.unit}` },
          { icon: Clock, label: "Deadline", value: new Date(rfq.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
          { icon: MapPin, label: "Ship To", value: rfq.city },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <span className="text-gray-500 flex items-center gap-2"><Icon size={13} className="text-gray-400" />{label}</span>
            <span className="font-bold text-gray-900">{value}</span>
          </div>
        ))}
      </div>

      {/* Quotes Header */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-gray-700" />
          <p className="font-bold text-gray-900 text-sm">Quotes ({MOCK_QUOTES.length})</p>
        </div>
      </div>

      {/* Quotes List */}
      <div className="px-4 space-y-2.5">
        {MOCK_QUOTES.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 p-6 text-center">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-xs font-bold text-gray-700">No quotes yet</p>
          </div>
        ) : (
          MOCK_QUOTES.map(q => (
            <div key={q.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              {/* Seller Info */}
              <div className="px-3 py-2.5 bg-blue-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[9px] font-bold text-white">
                    {q.initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{q.store}</p>
                    <p className="text-[10px] text-gray-500">⭐ {q.rating}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-orange-600">${q.pricePerUnit}</p>
              </div>

              {/* Quote Details */}
              <div className="px-3 py-2.5 space-y-1.5">
                <p className="text-[10px] text-gray-500">Total: <span className="font-bold text-gray-900">${(q.pricePerUnit * rfq.qty).toLocaleString()}</span></p>
                <div className="flex gap-3 text-[10px]">
                  <span className="text-gray-600">Delivery: <span className="font-bold text-gray-900">{q.deliveryDays}d</span></span>
                  <span className="text-gray-600">Valid: <span className="font-bold text-gray-900">{q.validityDays}d</span></span>
                </div>
                {q.message && (
                  <p className="text-[10px] text-gray-600 italic bg-gray-50 p-2 rounded mt-2 line-clamp-2">"{q.message}"</p>
                )}

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setConfirmQuote(q)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg text-[10px] transition active:scale-95"
                  >
                    Accept
                  </button>
                  <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-lg text-[10px] hover:bg-gray-50 transition">
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmQuote && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmQuote(null)} />
          <div className="relative bg-white rounded-t-2xl w-full max-w-[480px] mx-auto p-4 animate-in slide-in-from-bottom">
            <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
            <p className="font-bold text-gray-900 mb-3">Accept This Quote?</p>
            
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 mb-3 border border-orange-100 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[8px] font-bold text-white">
                  {confirmQuote.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{confirmQuote.store}</p>
                  <p className="text-[10px] text-gray-500">⭐ {confirmQuote.rating}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-2.5 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">${confirmQuote.pricePerUnit} × {rfq.qty}</span>
                  <span className="font-bold text-orange-600">${(confirmQuote.pricePerUnit * rfq.qty).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setConfirmQuote(null)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-sm mb-2 transition active:scale-95"
            >
              Confirm & Place Order
            </button>
            <button onClick={() => setConfirmQuote(null)} className="w-full text-gray-600 font-bold py-2 text-xs">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function KemetroRFQDetailPage() {
  return <RFQDetail />;
}

export default function KemetroRFQPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [showBanner, setShowBanner] = useState(true);

  const filtered = activeTab === "All" ? MOCK_RFQS
    : MOCK_RFQS.filter(r => STATUS_CONFIG[r.status].label === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="My RFQs" showBack
        rightAction={
          <button onClick={() => navigate("/m/add/rfq")} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <Plus size={22} className="text-orange-600" />
          </button>
        } />

      {/* Info Banner */}
      {showBanner && (
        <div className="mx-4 mt-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">📝</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-900">RFQ = Request for Quotation</p>
            <p className="text-xs text-blue-700 mt-1">Post what you need and let sellers send their best offers</p>
          </div>
          <button onClick={() => setShowBanner(false)} className="flex-shrink-0 text-blue-400 hover:text-blue-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100 mt-3">
        <div className="flex overflow-x-auto no-scrollbar px-4 py-2.5 gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* RFQ List */}
      <div className="px-4 py-4 space-y-3 pt-0">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📝</div>
            <p className="font-bold text-gray-700 mb-1">No RFQs found</p>
            <p className="text-xs text-gray-500 mb-4">Create one to get quotes from sellers</p>
            <button
              onClick={() => navigate("/m/add/rfq")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition active:scale-95"
            >
              Post New RFQ
            </button>
          </div>
        ) : (
          filtered.map(rfq => <RFQCard key={rfq.id} rfq={rfq} />)
        )}
      </div>
    </div>
  );
}
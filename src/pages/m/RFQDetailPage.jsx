import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Upload } from "lucide-react";

const MOCK_RFQ = {
  id: "1",
  title: "Need 500 sqm Floor Tiles – Marble Effect",
  deadline: "2026-03-22",
  daysLeft: 3,
  urgent: true,
  status: "Open",
  category: "Tiles",
  subcategory: "Porcelain / Marble Effect",
  quantity: 500,
  unit: "sqm",
  specifications: "Looking for high-quality Italian or equivalent marble-effect porcelain tiles. Size: 60×60cm or 80×80cm. Finish: polished. Color: white/beige tones. Must be suitable for residential flooring. Samples required before bulk order.",
  budgetMin: 70,
  budgetMax: 90,
  budgetCurrency: "EGP",
  deliveryLocation: "New Cairo, Cairo",
  deliveryDate: "2026-04-10",
  paymentTerms: "50% upfront, 50% on delivery",
  buyerType: "Individual",
  buyerCompany: null,
  buyerLocation: "Cairo, Egypt",
  quotesReceived: 4,
  details: [
    { label: "Category", value: "Tiles" },
    { label: "Subcategory", value: "Porcelain / Marble Effect" },
    { label: "Quantity", value: "500 sqm" },
    { label: "Budget Range", value: "EGP 70–90 per sqm" },
    { label: "Delivery Location", value: "New Cairo, Cairo" },
    { label: "Required By", value: "April 10, 2026" },
    { label: "Payment Terms", value: "50% upfront, 50% on delivery" },
  ],
};

const CURRENCIES = ["EGP", "USD", "EUR", "SAR", "AED"];
const PER_UNITS = ["sqm", "piece", "unit", "set", "kg", "ton", "roll"];
const TIMEFRAMES = ["1–3 days", "3–7 days", "1–2 weeks", "2–4 weeks", "4–6 weeks"];
const VALIDITY = ["3 days", "7 days", "14 days", "30 days"];

function QuoteSheet({ open, onClose, rfq }) {
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("EGP");
  const [perUnit, setPerUnit] = useState(rfq.unit);
  const [timeframe, setTimeframe] = useState("");
  const [validity, setValidity] = useState("7 days");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");

  if (!open) return null;

  const total = price && rfq.quantity ? (parseFloat(price) * rfq.quantity).toLocaleString() : "—";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl flex flex-col" style={{ maxHeight: "88vh" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3" />
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="font-black text-gray-900 text-base">Submit Your Quote</p>
          <button onClick={onClose} className="text-gray-400 text-lg font-bold">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Price */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-1.5">Your Price per {rfq.unit}</p>
            <div className="flex gap-2">
              <select value={currency} onChange={e => setCurrency(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 text-sm outline-none bg-white text-gray-700 font-bold">
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-orange-400" />
              <select value={perUnit} onChange={e => setPerUnit(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 text-sm outline-none bg-white text-gray-700">
                {PER_UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Total */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount ({rfq.quantity} {rfq.unit})</span>
            <span className="font-black text-orange-600 text-base">{currency} {total}</span>
          </div>

          {/* Delivery timeframe */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-1.5">Delivery Timeframe</p>
            <div className="flex flex-wrap gap-2">
              {TIMEFRAMES.map(t => (
                <button key={t} onClick={() => setTimeframe(t)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border ${timeframe === t ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Validity */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-1.5">Quote Valid For</p>
            <div className="flex gap-2">
              {VALIDITY.map(v => (
                <button key={v} onClick={() => setValidity(v)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border ${validity === v ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-1.5">Notes / Message to Buyer</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Describe your offer, product details, samples available..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none" rows={3} />
          </div>

          {/* File upload */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-1.5">Attach Quote Document (optional)</p>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-orange-300 transition-colors">
              <Upload size={18} className="text-gray-400" />
              <span className="text-sm text-gray-500">{fileName || "Upload PDF, Excel..."}</span>
              <input type="file" accept=".pdf,.xlsx,.xls" className="hidden"
                onChange={e => setFileName(e.target.files[0]?.name || "")} />
            </label>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} disabled={!price || !timeframe}
            className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl text-sm disabled:opacity-40">
            Submit Quote →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RFQDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const rfq = MOCK_RFQ;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="sticky top-0 z-40 bg-white flex items-center px-4 gap-3" style={{ height: 52, boxShadow: "0 1px 0 #E5E7EB" }}>
        <button onClick={() => navigate(-1)} className="p-1 -ml-1"><ArrowLeft size={22} className="text-gray-900" /></button>
        <span className="flex-1 text-center font-black text-gray-900 text-sm truncate">{rfq.title}</span>
        <button className="p-1"><Share2 size={20} className="text-gray-700" /></button>
      </div>

      {/* Deadline badge */}
      <div className={`mx-4 mt-3 rounded-2xl px-4 py-3 flex items-center justify-between ${rfq.urgent ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"}`}>
        <div>
          <p className={`text-sm font-black ${rfq.urgent ? "text-red-600" : "text-gray-700"}`}>
            {rfq.urgent ? "🔴 Urgent" : "📅"} Deadline in {rfq.daysLeft} days
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{rfq.deadline}</p>
        </div>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">● {rfq.status}</span>
      </div>

      {/* Product Details */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <p className="font-black text-gray-900 text-sm mb-3">Product Details</p>
        <div className="space-y-2">
          {rfq.details.map(d => (
            <div key={d.label} className="flex justify-between">
              <span className="text-xs text-gray-400">{d.label}</span>
              <span className="text-xs font-bold text-gray-800 text-right max-w-[55%]">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <p className="font-black text-gray-900 text-sm mb-2">Specifications</p>
        <p className="text-sm text-gray-600 leading-relaxed">{rfq.specifications}</p>
      </div>

      {/* Buyer Info */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <p className="font-black text-gray-900 text-sm mb-3">Buyer Info</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Buyer Type</span>
            <span className="text-xs font-bold text-gray-800">{rfq.buyerType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Location</span>
            <span className="text-xs font-bold text-gray-800">{rfq.buyerLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Quotes so far</span>
            <span className="text-xs font-bold text-orange-600">{rfq.quotesReceived} submitted</span>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3" style={{ paddingBottom: "max(12px,env(safe-area-inset-bottom))" }}>
        <button onClick={() => setQuoteOpen(true)} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl text-sm">
          Submit Your Quote →
        </button>
      </div>

      <QuoteSheet open={quoteOpen} onClose={() => setQuoteOpen(false)} rfq={rfq} />
    </div>
  );
}
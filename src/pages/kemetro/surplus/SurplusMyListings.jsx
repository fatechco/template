import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plus, Eye, Edit, Trash2, QrCode, MessageCircle, RefreshCw, Leaf, ArrowLeft } from "lucide-react";

const CONDITION_LABELS = {
  brand_new_excess: "Brand New",
  open_box: "Open Box",
  lightly_used: "Lightly Used",
  salvaged: "Salvaged",
};

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  reserved: "bg-amber-100 text-amber-700",
  sold: "bg-blue-100 text-blue-700",
  expired: "bg-gray-100 text-gray-500",
  deleted: "bg-red-100 text-red-400",
};

function EcoSummaryCard({ items }) {
  const totalKg = items.reduce((s, i) => s + (i.estimatedWeightKg || 0), 0);
  const totalCo2 = items.reduce((s, i) => s + (i.estimatedCo2SavedKg || 0), 0);
  const totalSold = items.filter(i => i.status === "sold").length;

  return (
    <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg,#15803d,#166534)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Leaf size={18} className="text-green-200" />
        <p className="font-bold text-green-100 text-sm">Your Eco Contribution</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/15 rounded-xl p-3 text-center">
          <p className="text-xl font-black">{totalKg.toFixed(0)}</p>
          <p className="text-green-200 text-[10px] font-bold mt-0.5">kg diverted</p>
        </div>
        <div className="bg-white/15 rounded-xl p-3 text-center">
          <p className="text-xl font-black">{totalCo2.toFixed(0)}</p>
          <p className="text-green-200 text-[10px] font-bold mt-0.5">kg CO₂ saved</p>
        </div>
        <div className="bg-white/15 rounded-xl p-3 text-center">
          <p className="text-xl font-black">{totalSold}</p>
          <p className="text-green-200 text-[10px] font-bold mt-0.5">items sold</p>
        </div>
      </div>
    </div>
  );
}

function ListingRow({ item, onDelete }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this listing?")) return;
    setDeleting(true);
    await base44.entities.SurplusItem.update(item.id, { status: "deleted" });
    onDelete(item.id);
    setDeleting(false);
  };

  const expiryLabel = item.reservationExpiryAt
    ? `Expires ${new Date(item.reservationExpiryAt).toLocaleString("en-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
    : "";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <img
          src={item.primaryImageUrl || item.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=70"}
          alt=""
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{item.title}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 capitalize ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-600"}`}>
              {item.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            <span className="font-bold text-green-700">{Number(item.surplusPriceEGP).toLocaleString()} EGP</span>
            <span>{CONDITION_LABELS[item.condition] || item.condition}</span>
            <span className="flex items-center gap-0.5"><Eye size={11} /> {item.viewCount || 0}</span>
          </div>

          {item.status === "active" && (
            <div className="flex gap-2">
              <Link
                to={`/kemetro/surplus/${item.id}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                <Eye size={12} /> View
              </Link>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
                <Edit size={12} /> Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
              >
                <Trash2 size={12} /> {deleting ? "…" : "Delete"}
              </button>
            </div>
          )}

          {item.status === "reserved" && (
            <div className="space-y-2">
              <p className="text-xs text-amber-600 font-bold">🔒 Reserved by buyer · {expiryLabel}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/kemetro/surplus/scan/${item.id}`)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-colors"
                >
                  <QrCode size={13} /> 📷 Scan Buyer QR
                </button>
                <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">
                  <MessageCircle size={12} /> Chat with Buyer
                </button>
              </div>
            </div>
          )}

          {item.status === "sold" && (
            <div className="space-y-1.5">
              <p className="text-xs text-blue-700 font-bold">
                Sold {new Date(item.soldAt).toLocaleDateString("en-EG", { month: "short", day: "numeric" })} · {Number(item.sellerNetEGP || item.surplusPriceEGP).toLocaleString()} EGP earned
              </p>
              <button
                onClick={() => navigate("/kemetro/surplus/add")}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <RefreshCw size={11} /> Re-list Similar Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TABS = ["active", "reserved", "sold", "expired"];

export default function SurplusMyListings() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const user = await base44.auth.me();
      const data = await base44.entities.SurplusItem.filter({ sellerId: user.id }, "-created_date", 100);
      setItems(data || []);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const handleDelete = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const filtered = items.filter(i => i.status === tab);
  const counts = Object.fromEntries(TABS.map(t => [t, items.filter(i => i.status === t).length]));

  return (
    <div className="min-h-screen" style={{ background: "#F8FAF8" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-gray-900 text-base">My Surplus Listings</h1>
        </div>
        <Link
          to="/kemetro/surplus/add"
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white font-bold rounded-xl text-sm hover:bg-green-700 transition-colors"
        >
          <Plus size={15} /> Add Item
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* Eco Summary */}
        <EcoSummaryCard items={items} />

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                tab === t ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t} {counts[t] > 0 && <span className={`ml-0.5 ${tab === t ? "text-green-200" : "text-gray-400"}`}>({counts[t]})</span>}
            </button>
          ))}
        </div>

        {/* Items */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">📦</p>
            <p className="font-bold text-gray-700 mb-1">No {tab} listings</p>
            {tab === "active" && (
              <Link to="/kemetro/surplus/add" className="text-green-600 font-bold text-sm hover:underline">
                → List your first item
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <ListingRow key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
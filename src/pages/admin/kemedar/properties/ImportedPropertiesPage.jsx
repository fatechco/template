import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download, Search, Filter, Eye, Edit, CheckCircle, XCircle, Trash2,
  Phone, Copy, MoreVertical, ArrowRight, Users, Grid, List, X,
  ChevronDown, AlertCircle
} from "lucide-react";

const SOURCES = ["All Sources", "Aqarmap", "OLX", "Property Finder", "Dubizzle", "Bayut", "Manual"];
const CATEGORIES = ["All Categories", "Apartment", "Villa", "Duplex", "Studio", "Chalet", "Land", "Commercial", "Office"];
const PURPOSES = ["All Purposes", "For Sale", "For Rent", "Both"];
const IMPORT_STATUSES = ["All", "New", "Moved to Pending", "Rejected", "Duplicate"];
const CONTACT_STATUSES = ["All", "Not Contacted", "Contacted", "No Answer", "Interested", "Not Interested", "Activated"];

const CONTACT_STATUS_CONFIG = {
  "not_contacted": { label: "Not Contacted", color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  "contacted": { label: "Contacted", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  "no_answer": { label: "No Answer", color: "bg-red-100 text-red-600", dot: "bg-red-500" },
  "interested": { label: "Interested", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  "not_interested": { label: "Not Interested", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  "activated": { label: "Activated", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
};

const IMPORT_STATUS_CONFIG = {
  "imported": { label: "New", color: "bg-blue-100 text-blue-700" },
  "moved_to_pending": { label: "Moved to Pending", color: "bg-orange-100 text-orange-700" },
  "rejected": { label: "Rejected", color: "bg-red-100 text-red-600" },
  "duplicate": { label: "Duplicate", color: "bg-gray-100 text-gray-500" },
};

const SOURCE_ABBR = { "Aqarmap": "AQ", "OLX": "OLX", "Property Finder": "PF", "Dubizzle": "DZ", "Bayut": "BY", "Manual": "MN" };
const SOURCE_COLORS = { "Aqarmap": "bg-red-500", "OLX": "bg-yellow-500", "Property Finder": "bg-green-600", "Dubizzle": "bg-blue-600", "Bayut": "bg-purple-600", "Manual": "bg-gray-500" };

const MOCK_STATS = { total: 1247, today: 83, awaiting: 312, movedThisMonth: 524 };

const MOCK_PROPERTIES = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: ["Modern Apartment in New Cairo", "Villa Sheikh Zayed 5th District", "Studio near Maadi Metro", "Duplex 5th Settlement", "Office Space Smart Village", "Twin House October City", "Penthouse Heliopolis", "Chalet North Coast Sahel"][i % 8],
  category: ["Apartment", "Villa", "Studio", "Duplex", "Office", "Twin House", "Penthouse", "Chalet"][i % 8],
  purpose: ["For Sale", "For Rent", "For Sale", "For Sale", "For Rent", "For Sale", "For Sale", "For Rent"][i % 8],
  city: ["New Cairo", "Sheikh Zayed", "Maadi", "5th Settlement", "Smart Village", "6th October", "Heliopolis", "North Coast"][i % 8],
  district: ["El Rehab", "Beverly Hills", "Sarayat", "South Academy", "Ring Road", "Hayy 11", "Korba", "Sidi Abder"][i % 8],
  price: [2500000, 8000000, 750000, 3200000, 1500000, 5500000, 12000000, 1800000][i % 8],
  area: [120, 350, 55, 220, 180, 280, 380, 140][i % 8],
  beds: [2, 5, 0, 3, 0, 4, 5, 3][i % 8],
  baths: [1, 4, 1, 2, 2, 3, 4, 2][i % 8],
  phone: `+20 1${String(i * 7 + 10).padStart(9, "0")}`,
  ownerName: ["Ahmed Hassan", "Sara Mohamed", "Omar Khalil", "Fatima Ali", null, "Karim Nasser", "Layla Ahmed", "Mohamed Samir"][i % 8],
  source: ["Aqarmap", "OLX", "Property Finder", "Bayut", "Aqarmap", "OLX", "Property Finder", "Manual"][i % 8],
  jobId: `JOB-0${(i % 5) + 1}`,
  importedAt: `2026-03-${String((i % 20) + 1).padStart(2, "0")}`,
  importStatus: ["imported", "imported", "moved_to_pending", "imported", "rejected", "imported", "duplicate", "imported"][i % 8],
  ownerContactStatus: ["not_contacted", "contacted", "interested", "no_answer", "not_contacted", "not_contacted", "contacted", "not_interested"][i % 8],
  image: ["photo-1560448204-e02f11c3d0e2", "photo-1600596542815-ffad4c1539a9", "photo-1502672260266-1c1ef2d93688", "photo-1564013799919-ab600027ffc6"][i % 4],
}));

function StatCard({ icon, number, label, sub, color, pulse }) {
  return (
    <div className={`bg-white rounded-xl border ${pulse ? "border-orange-300 animate-pulse" : "border-gray-100"} shadow-sm p-4 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className={`text-2xl font-black ${pulse ? "text-orange-600" : "text-gray-900"}`}>{number.toLocaleString()}</p>
        <p className="text-xs font-bold text-gray-700">{label}</p>
        <p className="text-[11px] text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function MoveToPendingModal({ selected, properties, onClose, onConfirm }) {
  const [notes, setNotes] = useState("");
  const [salesRep, setSalesRep] = useState("auto");
  const [sendSms, setSendSms] = useState(false);
  const [notifyRep, setNotifyRep] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectedProps = properties.filter(p => selected.includes(p.id));
  const bySource = selectedProps.reduce((acc, p) => { acc[p.source] = (acc[p.source] || 0) + 1; return acc; }, {});

  const handleConfirm = () => {
    setProcessing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 20) + 10;
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(() => setDone(true), 400); }
      setProgress(p);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {!done ? (
          <>
            <div className="px-6 pt-6 pb-4 text-center border-b border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">⏳</div>
              <h2 className="text-lg font-black text-gray-900">Move to Pending Properties</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* Summary */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-xs text-orange-700 font-bold mb-2">You are about to move:</p>
                <p className="text-2xl font-black text-orange-600">{selected.length} <span className="text-base text-orange-700">properties to Pending</span></p>
                <div className="mt-2 space-y-0.5">
                  {Object.entries(bySource).map(([src, cnt]) => (
                    <p key={src} className="text-[11px] text-orange-600">• {cnt} from {src}</p>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-orange-200">
                  <p className="text-[11px] text-orange-600">Properties will appear in:<br/><strong>Admin → Properties → Pending Properties</strong></p>
                </div>
              </div>

              {/* Sales rep */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Assign to Sales Representative:</label>
                <select value={salesRep} onChange={e => setSalesRep(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                  <option value="auto">Auto-assign (round robin)</option>
                  <option value="unassigned">Unassigned</option>
                  <option value="rep1">Ahmed Karim (Sales)</option>
                  <option value="rep2">Sara Hassan (Sales)</option>
                  <option value="rep3">Omar Nasser (Sales)</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">Assigned rep will see these in their Sales CRM queue</p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Internal notes (optional):</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g. High priority batch from Aqarmap — call owners this week"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400 resize-none" />
              </div>

              {/* Notifications */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sendSms} onChange={e => setSendSms(e.target.checked)} className="accent-orange-500" />
                  <span className="text-xs text-gray-700">Send SMS to owners with login credentials</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={notifyRep} onChange={e => setNotifyRep(e.target.checked)} className="accent-orange-500" />
                  <span className="text-xs text-gray-700">Notify assigned sales rep</span>
                </label>
              </div>

              {processing && (
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 text-center">Moving properties... {Math.round(progress / 100 * selected.length)} / {selected.length}</p>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirm} disabled={processing}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white font-black py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                ⏳ Move {selected.length} Properties to Pending
              </button>
            </div>
          </>
        ) : (
          <div className="px-6 py-10 text-center space-y-4">
            <div className="text-5xl">✅</div>
            <h2 className="text-xl font-black text-gray-900">{selected.length} Properties Moved!</h2>
            <p className="text-sm text-gray-500">Your sales team can now contact the property owners.</p>
            <div className="flex flex-col gap-2 mt-4">
              <Link to="/admin/properties/crm" onClick={onClose} className="bg-orange-500 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-orange-600">
                📞 Go to Sales CRM
              </Link>
              <Link to="/admin/properties" onClick={onClose} className="border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
                View Pending Properties
              </Link>
              <button onClick={() => { onConfirm(selected); onClose(); }} className="text-sm text-gray-400 hover:text-gray-600">Stay Here</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickMoveTooltip({ property, onMove, onCancel }) {
  const [salesRep, setSalesRep] = useState("auto");
  return (
    <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-56">
      <p className="text-xs font-black text-gray-800 mb-2">Move to Pending?</p>
      <select value={salesRep} onChange={e => setSalesRep(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs mb-2 focus:outline-none">
        <option value="auto">Auto-assign</option>
        <option value="rep1">Ahmed Karim</option>
        <option value="rep2">Sara Hassan</option>
      </select>
      <div className="flex gap-1.5">
        <button onClick={onCancel} className="flex-1 border border-gray-200 text-gray-600 font-bold py-1 rounded-lg text-xs">Cancel</button>
        <button onClick={() => onMove(property.id, salesRep)} className="flex-1 bg-orange-500 text-white font-bold py-1 rounded-lg text-xs">✅ Move</button>
      </div>
    </div>
  );
}

export default function ImportedPropertiesPage() {
  const [viewMode, setViewMode] = useState("table");
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("All Sources");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterPurpose, setFilterPurpose] = useState("All Purposes");
  const [filterImportStatus, setFilterImportStatus] = useState("All");
  const [filterContactStatus, setFilterContactStatus] = useState("All");
  const [selected, setSelected] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [quickMoveId, setQuickMoveId] = useState(null);
  const [groupByPhone, setGroupByPhone] = useState(false);
  const [movedIds, setMovedIds] = useState([]);

  const filtered = MOCK_PROPERTIES.filter(p => {
    if (movedIds.includes(p.id) && filterImportStatus === "All") return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.phone.includes(search) && !(p.ownerName || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (filterSource !== "All Sources" && p.source !== filterSource) return false;
    if (filterCategory !== "All Categories" && p.category !== filterCategory) return false;
    if (filterPurpose !== "All Purposes" && p.purpose !== filterPurpose) return false;
    if (filterImportStatus !== "All") {
      const map = { "New": "imported", "Moved to Pending": "moved_to_pending", "Rejected": "rejected", "Duplicate": "duplicate" };
      if (p.importStatus !== map[filterImportStatus]) return false;
    }
    if (filterContactStatus !== "All") {
      const map = { "Not Contacted": "not_contacted", "Contacted": "contacted", "No Answer": "no_answer", "Interested": "interested", "Not Interested": "not_interested", "Activated": "activated" };
      if (p.ownerContactStatus !== map[filterContactStatus]) return false;
    }
    return true;
  });

  const awaitingCount = MOCK_PROPERTIES.filter(p => p.importStatus === "imported" && !movedIds.includes(p.id)).length;

  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));
  const toggleOne = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleQuickMove = (id) => {
    setMovedIds(prev => [...prev, id]);
    setQuickMoveId(null);
    setSelected(s => s.filter(x => x !== id));
  };

  const handleBulkMoveConfirm = (ids) => {
    setMovedIds(prev => [...prev, ...ids]);
    setSelected([]);
  };

  // Group by phone
  const phoneGroups = groupByPhone ? filtered.reduce((acc, p) => {
    const key = p.phone;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {}) : {};

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>Admin</span><span>›</span><span>Properties</span><span>›</span>
            <span className="text-gray-700 font-semibold">Imported Properties</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Imported Properties</h1>
          <p className="text-gray-500 text-sm mt-0.5">Properties imported from external sources. Review and move selected properties to Pending so your sales team can contact owners.</p>
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="⬇️" number={MOCK_STATS.total} label="Total Imported" sub="from 5 scraping sources" color="bg-blue-100" />
        <StatCard icon="🆕" number={MOCK_STATS.today} label="Imported Today" sub="Last run: 2 hours ago" color="bg-green-100" />
        <StatCard icon="⏳" number={awaitingCount} label="Awaiting Review" sub="not yet moved to pending" color="bg-orange-100" pulse={awaitingCount > 100} />
        <StatCard icon="✅" number={MOCK_STATS.movedThisMonth} label="Moved to Pending" sub="this month" color="bg-emerald-100" />
      </div>

      {/* Workflow Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 flex items-center gap-4">
        <div className="text-4xl flex-shrink-0">📋</div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-sm mb-2">Imported Properties Workflow</p>
          <div className="flex items-center gap-2 flex-wrap text-xs text-blue-100">
            <span className="bg-white/20 px-2 py-1 rounded-full">⬇️ Imported</span>
            <ArrowRight size={12} />
            <span className="bg-white/20 px-2 py-1 rounded-full">👀 Admin Reviews</span>
            <ArrowRight size={12} />
            <span className="bg-white/20 px-2 py-1 rounded-full">⏳ Pending</span>
            <ArrowRight size={12} />
            <span className="bg-white/20 px-2 py-1 rounded-full">📞 Sales Contacts</span>
            <ArrowRight size={12} />
            <span className="bg-white/20 px-2 py-1 rounded-full">✅ Active</span>
          </div>
        </div>
        <Link to="/admin/properties/crm" className="flex-shrink-0 border border-white/50 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-white/10 whitespace-nowrap flex items-center gap-1.5">
          📞 Go to Sales CRM <ArrowRight size={12} />
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, owner name, phone, city, source..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Source", value: filterSource, options: SOURCES, onChange: setFilterSource },
            { label: "Category", value: filterCategory, options: CATEGORIES, onChange: setFilterCategory },
            { label: "Purpose", value: filterPurpose, options: PURPOSES, onChange: setFilterPurpose },
            { label: "Import Status", value: filterImportStatus, options: IMPORT_STATUSES, onChange: setFilterImportStatus },
            { label: "Contact Status", value: filterContactStatus, options: CONTACT_STATUSES, onChange: setFilterContactStatus },
          ].map(f => (
            <select key={f.label} value={f.value} onChange={e => f.onChange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400 cursor-pointer">
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Showing <strong>{filtered.length}</strong> of <strong>{MOCK_PROPERTIES.length}</strong> imported properties</p>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 font-semibold">
              <input type="checkbox" checked={groupByPhone} onChange={e => setGroupByPhone(e.target.checked)} className="accent-orange-500" />
              Group by Owner Phone
            </label>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setViewMode("table")} className={`px-3 py-1.5 text-xs transition-colors ${viewMode === "table" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
                <List size={13} />
              </button>
              <button onClick={() => setViewMode("grid")} className={`px-3 py-1.5 text-xs transition-colors ${viewMode === "grid" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
                <Grid size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div className="bg-white border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap shadow-sm sticky top-2 z-10">
          <span className="text-sm font-black text-gray-900">{selected.length} selected</span>
          <div className="flex gap-2 flex-wrap flex-1">
            <button onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-black px-4 py-2 rounded-lg text-xs">
              ⏳ Move to Pending
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
              📞 Assign to Sales Rep
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
              ❌ Mark Duplicate
            </button>
            <button className="flex items-center gap-1.5 border border-red-200 text-red-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-red-50">
              <Trash2 size={12} /> Reject
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
              <Download size={12} /> Export
            </button>
          </div>
          <button onClick={() => setSelected([])} className="text-xs text-gray-400 font-bold flex items-center gap-1 hover:text-gray-600">
            <X size={12} /> Clear
          </button>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === "table" && !groupByPhone && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left w-8">
                    <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-orange-500" />
                  </th>
                  <th className="px-3 py-3 text-left w-16 font-bold text-gray-600">Image</th>
                  <th className="px-3 py-3 text-left font-bold text-gray-600">Property</th>
                  <th className="px-3 py-3 text-left font-bold text-gray-600">Source</th>
                  <th className="px-3 py-3 text-left font-bold text-gray-600">Category</th>
                  <th className="px-3 py-3 text-left font-bold text-gray-600">Purpose</th>
                  <th className="px-3 py-3 text-left font-bold text-gray-600">Owner Contact</th>
                  <th className="px-3 py-3 text-left font-bold text-gray-600">City</th>
                  <th className="px-3 py-3 text-left font-bold text-gray-600">Price</th>
                  <th className="px-3 py-3 text-left font-bold text-gray-600">Imported</th>
                  <th className="px-3 py-3 text-left font-bold text-gray-600">Status</th>
                  <th className="px-3 py-3 text-left font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => {
                  const contactCfg = CONTACT_STATUS_CONFIG[p.ownerContactStatus] || CONTACT_STATUS_CONFIG["not_contacted"];
                  const importCfg = IMPORT_STATUS_CONFIG[p.importStatus] || IMPORT_STATUS_CONFIG["imported"];
                  return (
                    <tr key={p.id} className={`hover:bg-gray-50/50 ${selected.includes(p.id) ? "bg-orange-50/40" : ""}`}>
                      <td className="px-3 py-3">
                        <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleOne(p.id)} className="accent-orange-500" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={`https://images.unsplash.com/${p.image}?w=80&q=60`} alt="" className="w-full h-full object-cover" />
                          <span className={`absolute bottom-0 left-0 text-[8px] text-white font-black px-1 ${SOURCE_COLORS[p.source] || "bg-gray-500"}`}>
                            {SOURCE_ABBR[p.source] || "?"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 max-w-[200px]">
                        <p className="font-bold text-gray-900 truncate">{p.title}</p>
                        <p className="text-gray-400 mt-0.5">
                          {p.beds > 0 && `🛏 ${p.beds} `}{p.baths > 0 && `🚿 ${p.baths} `}📐 {p.area}sqm
                        </p>
                        <button onClick={() => navigator.clipboard?.writeText(p.phone)}
                          className="text-gray-500 font-mono hover:text-orange-600 flex items-center gap-1 mt-0.5">
                          📱 {p.phone}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-bold px-2 py-0.5 rounded-full text-white text-[10px] ${SOURCE_COLORS[p.source] || "bg-gray-500"}`}>
                          {p.source}
                        </span>
                        <p className="text-blue-500 text-[10px] mt-1 cursor-pointer hover:underline">View original →</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">{p.category}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-bold px-2 py-0.5 rounded-full ${p.purpose === "For Sale" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                          {p.purpose}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${contactCfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${contactCfg.dot}`} />
                          {contactCfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-gray-800">{p.city}</p>
                        <p className="text-gray-400 text-[10px]">{p.district}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-black text-orange-600">{(p.price / 1000000).toFixed(1)}M EGP</p>
                        <p className="text-gray-400 text-[10px]">{Math.round(p.price / p.area).toLocaleString()}/m²</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-gray-600">{p.importedAt}</p>
                        <p className="text-gray-400 text-[10px]">{p.jobId}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${importCfg.color}`}>{importCfg.label}</span>
                      </td>
                      <td className="px-3 py-3 relative">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setQuickMoveId(quickMoveId === p.id ? null : p.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-2 py-1 rounded-lg text-[10px] whitespace-nowrap">
                            ⏳ Pending
                          </button>
                          <button className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center">
                            <MoreVertical size={12} />
                          </button>
                        </div>
                        {quickMoveId === p.id && (
                          <QuickMoveTooltip property={p} onMove={handleQuickMove} onCancel={() => setQuickMoveId(null)} />
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={12} className="px-4 py-16 text-center text-gray-400">
                    <p className="text-3xl mb-2">🏠</p>
                    <p className="font-bold">No imported properties match this filter</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GROUPED BY PHONE VIEW */}
      {viewMode === "table" && groupByPhone && (
        <div className="space-y-3">
          {Object.entries(phoneGroups).map(([phone, props]) => (
            <div key={phone} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-blue-50 border-b border-blue-100 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox"
                    checked={props.every(p => selected.includes(p.id))}
                    onChange={() => {
                      const ids = props.map(p => p.id);
                      const allSelected = props.every(p => selected.includes(p.id));
                      setSelected(s => allSelected ? s.filter(x => !ids.includes(x)) : [...new Set([...s, ...ids])]);
                    }}
                    className="accent-blue-500"
                  />
                  <div>
                    <p className="text-xs font-black text-gray-900">📱 {phone} — {props.length} properties</p>
                    {props[0].ownerName && <p className="text-[11px] text-gray-500">Owner: {props[0].ownerName}</p>}
                  </div>
                </div>
                <button
                  onClick={() => { setSelected(props.map(p => p.id)); setShowBulkModal(true); }}
                  className="bg-orange-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-orange-600">
                  ⏳ Move All {props.length} to Pending
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {props.map(p => (
                  <div key={p.id} className="px-4 py-3 flex items-center gap-3">
                    <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleOne(p.id)} className="accent-orange-500" />
                    <img src={`https://images.unsplash.com/${p.image}?w=60&q=60`} alt="" className="w-12 h-9 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{p.title}</p>
                      <p className="text-[11px] text-gray-400">{p.category} · {p.city} · {(p.price / 1000000).toFixed(1)}M EGP</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${IMPORT_STATUS_CONFIG[p.importStatus]?.color}`}>
                      {IMPORT_STATUS_CONFIG[p.importStatus]?.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => {
            const contactCfg = CONTACT_STATUS_CONFIG[p.ownerContactStatus] || CONTACT_STATUS_CONFIG["not_contacted"];
            const importCfg = IMPORT_STATUS_CONFIG[p.importStatus] || IMPORT_STATUS_CONFIG["imported"];
            return (
              <div key={p.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${selected.includes(p.id) ? "border-orange-400" : "border-gray-100"}`}>
                <div className="relative">
                  <img src={`https://images.unsplash.com/${p.image}?w=400&q=70`} alt="" className="w-full h-36 object-cover" />
                  <span className={`absolute top-2 left-2 text-[9px] text-white font-black px-1.5 py-0.5 rounded-full ${SOURCE_COLORS[p.source] || "bg-gray-500"}`}>
                    {p.source}
                  </span>
                  <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${importCfg.color}`}>
                    {importCfg.label}
                  </span>
                  <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleOne(p.id)}
                    className="absolute bottom-2 left-2 accent-orange-500 w-4 h-4 opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-xs font-bold text-gray-900 leading-tight line-clamp-2">{p.title}</p>
                  <p className="text-[11px] text-gray-500">📍 {p.district}, {p.city}</p>
                  <p className="text-[11px] text-gray-400">📐 {p.area}sqm{p.beds > 0 ? ` · 🛏 ${p.beds}` : ""}</p>
                  <p className="text-sm font-black text-orange-600">{(p.price / 1000000).toFixed(1)}M EGP</p>
                  <div className="border-t border-gray-100 pt-2 space-y-1">
                    <p className="text-[10px] text-gray-500 font-mono">{p.phone}</p>
                    <p className="text-[10px] text-gray-400">Imported {p.importedAt} via {p.source}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${contactCfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${contactCfg.dot}`} />
                      {contactCfg.label}
                    </span>
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <button onClick={() => { setSelected([p.id]); setShowBulkModal(true); }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg text-xs">
                    ⏳ Move to Pending
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bulk Modal */}
      {showBulkModal && (
        <MoveToPendingModal
          selected={selected}
          properties={MOCK_PROPERTIES}
          onClose={() => setShowBulkModal(false)}
          onConfirm={handleBulkMoveConfirm}
        />
      )}
    </div>
  );
}
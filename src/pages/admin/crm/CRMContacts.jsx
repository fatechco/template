import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, Download, ChevronDown, ChevronRight, ChevronUp,
  Phone, MessageCircle, Mail, UserPlus, CheckCircle,
  RefreshCw, Eye, ArrowRight, Users, Clock, Globe, Shield
} from "lucide-react";

// ─── Shared Mock Data (same as AdminUsers, AdminPendingUsers, AdminImportedUsers) ─
const AVATARS_BG = ["bg-orange-500","bg-blue-500","bg-green-500","bg-purple-500","bg-teal-500","bg-red-500","bg-indigo-500"];

// Active users — from AdminUsers MOCK_USERS
const MOCK_ACTIVE = Array.from({ length: 20 }, (_, i) => ({
  id: `act-${i + 1}`,
  displayName: ["Ahmed Hassan","Fatima Mohamed","Omar Rashid","Sara Khaled","Mohamed Nasser","Nour Adel","Karim Samir","Layla Ahmed","Youssef Ali","Rana Tarek"][i % 10],
  email: `user${i + 1}@email.com`,
  phone: `+20 1${String(i).padStart(9, "0")}`,
  whatsapp: `+20 1${String(i).padStart(9, "0")}`,
  primaryRole: ["user","agent","agency","developer","franchise_owner","admin"][i % 6],
  accountName: ["","Elite Realty","Gulf Homes","Desert Realty","Cairo Properties",""][i % 6] || null,
  city: ["Cairo","Dubai","Riyadh","Kuwait City"][i % 4],
  country: ["Egypt","UAE","Saudi Arabia","Kuwait"][i % 4],
  source: "self_registered",
  sourceJob: null,
  crmStatus: "active",
  isVerified: i % 3 === 0,
  propertiesCount: [0,3,12,7,45,2][i % 6],
  projectsCount: [0,0,1,3,8,0][i % 6],
  plan: ["Free","Basic","Pro","Business"][i % 4],
  createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
  pendingReason: null,
}));

// Pending users — from AdminPendingUsers MOCK_PENDING
const MOCK_PENDING = Array.from({ length: 16 }, (_, i) => ({
  id: `pnd-${i + 1}`,
  displayName: ["Ahmed Hassan","Fatima Mohamed","Omar Rashid","Sara Khaled","Mohamed Nasser","Nour Adel","Karim Samir","Rania Bassem"][i % 8],
  email: `pending${i + 1}@email.com`,
  phone: `+20 1${String(i).padStart(9, "0")}`,
  whatsapp: `+20 1${String(i).padStart(9, "0")}`,
  primaryRole: ["user","agent","agency","developer","professional"][i % 5],
  accountName: ["Elite Realty","Property Finders","Gulf Homes","Desert Realty","Cairo Properties"][i % 5],
  city: ["Cairo","Alexandria","Giza","New Cairo"][i % 4],
  country: "Egypt",
  source: i % 3 === 0 ? "self_registered" : "scraped",
  sourceJob: i % 3 === 0 ? null : `JOB-00${(i % 3) + 1}`,
  crmStatus: "pending",
  isVerified: false,
  propertiesCount: [0,3,7,12,1,5,0,2,18,4][i % 10],
  projectsCount: [0,0,1,3,0,2,0,0,5,1][i % 10],
  plan: null,
  createdAt: `2026-03-${String((i % 18) + 1).padStart(2, "0")}`,
  pendingReason: ["Missing license","Incomplete profile","Pending document review","Awaiting verification call","Imported — awaiting activation"][i % 5],
  hasDocs: [true,false,true,true,false][i % 5],
}));

// Imported users — from AdminImportedUsers MOCK_IMPORTED
const MOCK_IMPORTED = Array.from({ length: 20 }, (_, i) => ({
  id: `imp-${i + 1}`,
  displayName: ["Ahmed Hassan","Sara Mohamed","Karim Ali","Layla Nour","Omar Khalid","Noor Hassan","Mohamed Samir","Rana Adel"][i % 8],
  email: `user${i + 1}@imported.com`,
  phone: `+20 1${String(i).padStart(9, "0")}`,
  whatsapp: `+20 1${String(i).padStart(9, "0")}`,
  primaryRole: ["user","agent","agency","developer","professional"][i % 5],
  accountName: ["Elite Realty","Property Finders","Gulf Properties","Desert Realty","Cairo Homes","Nile Realty","Sky Properties","Golden Gate"][i % 8],
  city: ["Cairo","Giza","Alexandria","New Cairo"][i % 4],
  country: "Egypt",
  source: ["Aqarmap","OLX","Property Finder","Bayut"][i % 4],
  sourceJob: `JOB-00${(i % 3) + 1}`,
  crmStatus: "imported",
  isVerified: false,
  propertiesCount: [0,3,7,12,1,5,0,2,18,4][i % 10],
  projectsCount: [0,0,1,3,0,2,0,0,5,1][i % 10],
  plan: null,
  createdAt: `2026-03-${String((i % 20) + 1).padStart(2, "0")}`,
  pendingReason: "Imported — awaiting call",
  hasDocs: false,
}));

const ALL_MOCK_CONTACTS = [...MOCK_IMPORTED, ...MOCK_PENDING, ...MOCK_ACTIVE];

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLE_COLORS = {
  agent:           "bg-blue-100 text-blue-700",
  agency:          "bg-indigo-100 text-indigo-700",
  developer:       "bg-purple-100 text-purple-700",
  investor:        "bg-yellow-100 text-yellow-700",
  professional:    "bg-teal-100 text-teal-700",
  product_seller:  "bg-orange-100 text-orange-700",
  franchise_owner: "bg-red-100 text-red-700",
  common_user:     "bg-gray-100 text-gray-500",
  admin:           "bg-red-100 text-red-700",
  user:            "bg-gray-100 text-gray-500",
};

const STATUS_CONFIG = {
  imported:           { label: "Imported",            color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  pending:            { label: "Pending",              color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  pending_activation: { label: "Pending Activation",  color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  active:             { label: "Active",               color: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  suspended:          { label: "Suspended",            color: "bg-red-100 text-red-600",       dot: "bg-red-500" },
};

const ROLE_TABS = [
  { id: "all",             label: "All" },
  { id: "user",            label: "Common Users" },
  { id: "agent",           label: "Agents" },
  { id: "agency",          label: "Agencies" },
  { id: "developer",       label: "Developers" },
  { id: "professional",    label: "Professionals" },
  { id: "franchise_owner", label: "Franchise Owners" },
  { id: "product_seller",  label: "Kemetro Sellers" },
  { id: "admin",           label: "Admins" },
];

const SOURCE_LABELS = {
  imported:        "Imported",
  scraped:         "Scraped",
  self_registered: "Self-registered",
  referral:        "Referral",
  manual:          "Manual",
};

const PAGE_SIZE = 20;



function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.active;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Avatar({ name, color = "bg-violet-500" }) {
  return (
    <div className={`w-8 h-8 rounded-full ${color} text-white text-[10px] font-black flex items-center justify-center flex-shrink-0`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function avatarColor(id) { return AVATARS_BG[(id || "").charCodeAt(0) % AVATARS_BG.length] || "bg-violet-500"; }

export default function CRMContacts() {
  const initialStatus = new URLSearchParams(window.location.search).get("status") || "all";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState(initialStatus);   // all | imported | pending | active
  const [roleTab, setRoleTab] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const fetch = () => {
    setLoading(true);
    setTimeout(() => { setUsers(ALL_MOCK_CONTACTS); setLoading(false); }, 300);
  };
  useEffect(() => { fetch(); }, []);

  const stats = useMemo(() => ({
    all:      users.length,
    imported: users.filter(u => u.crmStatus === "imported").length,
    pending:  users.filter(u => u.crmStatus === "pending").length,
    active:   users.filter(u => u.crmStatus === "active").length,
  }), [users]);

  const filtered = useMemo(() => {
    let data = [...users];
    if (statusTab !== "all") data = data.filter(u => u.crmStatus === statusTab);
    if (roleTab !== "all")   data = data.filter(u => u.primaryRole === roleTab);
    if (sourceFilter)        data = data.filter(u => u.source === sourceFilter);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(u =>
        u.displayName.toLowerCase().includes(q) ||
        (u.phone || "").includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.accountName || "").toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      let av = a[sortField] ?? "", bv = b[sortField] ?? "";
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return data;
  }, [users, statusTab, roleTab, sourceFilter, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelectedIds(selectedIds.length === paginated.length ? [] : paginated.map(c => c.id));
  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };
  const SortIcon = ({ field }) => sortField !== field
    ? <ChevronDown size={10} className="text-gray-300" />
    : sortDir === "asc" ? <ChevronUp size={10} className="text-violet-500" /> : <ChevronDown size={10} className="text-violet-500" />;

  const moveToStatus = (id, newStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, crmStatus: newStatus } : u));
  };

  const switchStatus = (tab) => { setStatusTab(tab); setRoleTab("all"); setPage(1); setSelectedIds([]); };
  const switchRole = (tab) => { setRoleTab(tab); setPage(1); setSelectedIds([]); };

  // Columns differ slightly per status tab
  const showPendingReason = statusTab === "imported" || statusTab === "pending";
  const showSource = statusTab === "imported";

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Contacts</h1>
          <p className="text-gray-500 text-sm">All users across Kemedar, Kemetro & Kemework in one place</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetch} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={12} /> Export CSV
          </button>
          <Link to="/admin/crm/contacts/new" className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs">
            <UserPlus size={12} /> Add Contact
          </Link>
        </div>
      </div>

      {/* ── Status KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: "all",      label: "All Contacts",  val: stats.all,      icon: Users,       color: "text-gray-900",   bg: "bg-gray-50",   border: "border-gray-200" },
          { id: "imported", label: "Imported",       val: stats.imported, icon: Globe,       color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
          { id: "pending",  label: "Pending",        val: stats.pending,  icon: Clock,       color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
          { id: "active",   label: "Active",         val: stats.active,   icon: CheckCircle, color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
        ].map(k => {
          const Icon = k.icon;
          return (
            <button key={k.id} onClick={() => switchStatus(k.id)}
              className={`${k.bg} rounded-xl p-4 border-2 text-left transition-all ${statusTab === k.id ? k.border + " shadow-md" : "border-transparent hover:" + k.border}`}>
              <div className="flex items-center justify-between mb-1">
                <Icon size={16} className={k.color} />
                {statusTab === k.id && <span className="text-[9px] font-black bg-violet-600 text-white px-1.5 py-0.5 rounded-full">ACTIVE</span>}
              </div>
              <p className={`text-3xl font-black ${k.color}`}>{loading ? "—" : k.val}</p>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
            </button>
          );
        })}
      </div>

      {/* ── Status pipeline explanation ── */}
      <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <span className="font-bold text-blue-600">📥 Imported</span>
        <span className="text-gray-300">→ from external sources (Aqarmap, OLX, scraping…)</span>
        <ArrowRight size={12} className="text-gray-300" />
        <span className="font-bold text-yellow-600">⏳ Pending</span>
        <span className="text-gray-300">→ sales team contacts & qualifies</span>
        <ArrowRight size={12} className="text-gray-300" />
        <span className="font-bold text-green-600">✅ Active</span>
        <span className="text-gray-300">→ confirmed & activated (also: self-registered verified users)</span>
      </div>

      {/* ── Role Sub-Tabs ── */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {ROLE_TABS.map(t => {
          const count = users.filter(u =>
            (statusTab === "all" || u.crmStatus === statusTab) &&
            (t.id === "all" || u.primaryRole === t.id)
          ).length;
          return (
            <button key={t.id} onClick={() => switchRole(t.id)}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex-shrink-0 transition-colors ${
                roleTab === t.id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"
              }`}>
              {t.label} {!loading && <span className="ml-1 text-gray-400">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Search + source filter ── */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, phone, email…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-violet-400" />
        </div>
        {showSource && (
          <select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none bg-white">
            <option value="">All Sources</option>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        )}
        <span className="flex items-center text-xs text-gray-400 font-semibold px-2">
          {loading ? "…" : `${filtered.length} users`}
        </span>
      </div>

      {/* ── Bulk actions ── */}
      {selectedIds.length > 0 && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-violet-700">{selectedIds.length} selected</span>
          {statusTab === "imported" && (
            <button onClick={() => { selectedIds.forEach(id => moveToStatus(id, "pending")); setSelectedIds([]); }}
              className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
              <ArrowRight size={11} /> Move to Pending
            </button>
          )}
          {statusTab === "pending" && (
            <button onClick={() => { selectedIds.forEach(id => moveToStatus(id, "active")); setSelectedIds([]); }}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
              <CheckCircle size={11} /> Activate
            </button>
          )}
          <button className="flex items-center gap-1 border border-violet-300 text-violet-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-violet-100">
            <Download size={11} /> Export
          </button>
          <button onClick={() => setSelectedIds([])} className="text-xs text-gray-400 px-2 font-bold">Clear</button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <RefreshCw size={28} className="mx-auto mb-3 animate-spin opacity-40" />
            <p className="text-sm font-semibold">Loading contacts…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <input type="checkbox"
                      checked={selectedIds.length === paginated.length && paginated.length > 0}
                      onChange={toggleAll}
                      className="w-3.5 h-3.5 accent-violet-600" />
                  </th>
                  {[
                    { label: "User", field: "displayName" },
                    { label: "Email" },
                    { label: "Phone" },
                    { label: "Role" },
                    showPendingReason && { label: "Pending Reason" },
                    showSource       && { label: "Source" },
                    { label: "Properties", field: "propertiesCount" },
                    { label: "Projects", field: "projectsCount" },
                    { label: "Status", field: "crmStatus" },
                    { label: "Joined", field: "createdAt" },
                    { label: "Actions" },
                  ].filter(Boolean).map(col => (
                    <th key={col.label} onClick={() => col.field && handleSort(col.field)}
                      className={`px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap text-[10px] ${col.field ? "cursor-pointer hover:text-gray-700 select-none" : ""}`}>
                      <span className="flex items-center gap-1">
                        {col.label} {col.field && <SortIcon field={col.field} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 && (
                  <tr><td colSpan={12} className="py-16 text-center text-gray-400">
                    <Search size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No contacts found</p>
                  </td></tr>
                )}
                {paginated.map(c => (
                  <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(c.id) ? "bg-violet-50" : ""}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} className="w-3.5 h-3.5 accent-violet-600" />
                    </td>

                    {/* User */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.displayName} color={avatarColor(c.id)} />
                        <div className="min-w-0">
                          <Link to={`/admin/crm/contacts/${c.id}`} className="font-semibold text-gray-900 hover:text-violet-600 truncate block max-w-[130px]">
                            {c.displayName}
                          </Link>
                          {c.accountName && (
                            <p className="text-[9px] text-gray-400 flex items-center gap-0.5 truncate max-w-[130px]">
                              🏢 {c.accountName}
                            </p>
                          )}
                          {c.sourceJob && (
                            <p className="text-[9px] text-blue-400 truncate max-w-[130px]">📦 {c.sourceJob}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-3 py-3 text-gray-600 max-w-[160px] truncate">
                      {c.email || <span className="text-gray-300">—</span>}
                    </td>

                    {/* Phone */}
                    <td className="px-3 py-3 font-mono text-gray-600">
                      {c.phone || <span className="text-gray-300">—</span>}
                    </td>

                    {/* Role */}
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize ${ROLE_COLORS[c.primaryRole] || "bg-gray-100 text-gray-600"}`}>
                        {c.primaryRole.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Pending Reason (conditional) */}
                    {showPendingReason && (
                      <td className="px-3 py-3 text-gray-500 max-w-[140px] truncate">
                        {c.pendingReason || <span className="text-gray-300">—</span>}
                      </td>
                    )}

                    {/* Source (conditional) */}
                    {showSource && (
                      <td className="px-3 py-3">
                        <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded-full capitalize">
                          {SOURCE_LABELS[c.source] || c.source}
                        </span>
                      </td>
                    )}

                    {/* Properties */}
                    <td className="px-3 py-3 text-center">
                      {c.propertiesCount > 0
                        ? <span className="bg-orange-100 text-orange-700 font-black text-[10px] px-1.5 py-0.5 rounded-full">{c.propertiesCount}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>

                    {/* Projects */}
                    <td className="px-3 py-3 text-center">
                      {c.projectsCount > 0
                        ? <span className="bg-purple-100 text-purple-700 font-black text-[10px] px-1.5 py-0.5 rounded-full">{c.projectsCount}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <StatusBadge status={c.crmStatus} />
                    </td>

                    {/* Joined */}
                    <td className="px-3 py-3 text-gray-400 whitespace-nowrap">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-0.5">
                        {/* View */}
                        <Link to={`/admin/crm/contacts/${c.id}`}
                          className="p-1.5 hover:bg-violet-50 rounded text-violet-400 hover:text-violet-600" title="View">
                          <Eye size={13} />
                        </Link>
                        {/* WhatsApp */}
                        <a href={(c.whatsapp || c.phone) ? `https://wa.me/${(c.whatsapp || c.phone).replace(/\D/g, "")}` : undefined}
                          target="_blank" rel="noreferrer"
                          onClick={e => { if (!c.whatsapp && !c.phone) e.preventDefault(); }}
                          className={`p-1.5 rounded ${c.whatsapp || c.phone ? "hover:bg-green-50 text-green-500" : "text-gray-200 cursor-not-allowed"}`}
                          title="WhatsApp">
                          <MessageCircle size={13} />
                        </a>
                        {/* Call */}
                        <a href={(c.phone || c.whatsapp) ? `tel:${c.phone || c.whatsapp}` : undefined}
                          onClick={e => { if (!c.phone && !c.whatsapp) e.preventDefault(); }}
                          className={`p-1.5 rounded ${c.phone || c.whatsapp ? "hover:bg-orange-50 text-orange-500" : "text-gray-200 cursor-not-allowed"}`}
                          title="Call">
                          <Phone size={13} />
                        </a>
                        {/* Email */}
                        <a href={c.email ? `mailto:${c.email}` : undefined}
                          onClick={e => { if (!c.email) e.preventDefault(); }}
                          className={`p-1.5 rounded ${c.email ? "hover:bg-blue-50 text-blue-500" : "text-gray-200 cursor-not-allowed"}`}
                          title="Email">
                          <Mail size={13} />
                        </a>
                        {/* Move to next stage */}
                        {c.crmStatus === "imported" && (
                          <button onClick={() => moveToStatus(c.id, "pending")}
                            className="p-1.5 rounded hover:bg-yellow-50 text-yellow-500" title="Move to Pending">
                            <ArrowRight size={13} />
                          </button>
                        )}
                        {c.crmStatus === "pending" && (
                          <button onClick={() => moveToStatus(c.id, "active")}
                            className="p-1.5 rounded hover:bg-green-50 text-green-500" title="Activate">
                            <CheckCircle size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-50">Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p > totalPages) return null;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`px-3 py-1.5 border rounded-lg text-xs font-bold ${page === p ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 hover:bg-gray-50"}`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
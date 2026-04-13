import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Filter, Download, ChevronRight, ChevronDown, ChevronUp,
  UserPlus, Tag, CheckCircle, Building2, Phone, AlertCircle, X
} from "lucide-react";

const TYPE_COLORS = {
  agency: "bg-indigo-100 text-indigo-700",
  developer: "bg-purple-100 text-purple-700",
  franchise_owner: "bg-red-100 text-red-700",
  finishing_company: "bg-teal-100 text-teal-700",
  store: "bg-orange-100 text-orange-700",
  enterprise: "bg-blue-100 text-blue-700",
  partner: "bg-green-100 text-green-700",
  individual: "bg-gray-100 text-gray-600",
};

const STAGE_COLORS = {
  prospect: "text-blue-600",
  active: "text-green-600",
  partner: "text-teal-600",
  churned: "text-red-500",
  archived: "text-gray-400",
};

const PLAN_COLORS = {
  Business: "bg-purple-100 text-purple-700",
  Pro: "bg-blue-100 text-blue-700",
  Basic: "bg-gray-100 text-gray-600",
  Free: "bg-gray-50 text-gray-400",
};

const MOCK_ACCOUNTS = Array.from({ length: 30 }, (_, i) => {
  const types = ["agency", "developer", "franchise_owner", "finishing_company", "store", "enterprise", "partner", "individual"];
  const stages = ["prospect", "active", "partner", "churned", "archived"];
  const plans = ["Business", "Pro", "Basic", "Free"];
  const cities = ["Cairo", "Giza", "Alexandria", "New Cairo", "Sheikh Zayed"];

  return {
    id: `acc${i + 1}`,
    name: ["Elite Realty", "Palm Hills Dev", "Gulf Properties", "City Homes", "Delta Stores", "Star Agency", "Nile Corp", "Cairo Partners"][i % 8],
    type: types[i % types.length],
    owner: ["You", "Adel M.", "Sara K.", "Mona A."][i % 4],
    team: ["Sales", "CS", "Activations"][i % 3],
    mainContact: ["Ahmed Hassan", "Sara Mohamed", "Karim Ali", "Fatima Nour"][i % 4],
    city: cities[i % cities.length],
    contactsCount: (i % 12) + 1,
    linkedRecords: (i % 30) + 1,
    plan: plans[i % plans.length],
    renewalDate: `${2026}-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
    healthScore: 30 + (i * 3) % 70,
    lastActivity: `${(i % 14) + 1} days ago`,
    lifecycleStage: stages[i % stages.length],
    isRenewingSoon: i % 4 === 0,
    isInactive: i % 7 === 0,
    openOpportunities: i % 5,
    tags: i % 3 === 0 ? ["vip"] : [],
  };
});

const PAGE_SIZE = 12;

function BulkActions({ count, onClear }) {
  return (
    <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-3">
      <span className="text-sm font-bold text-violet-700">{count} selected</span>
      <div className="flex flex-wrap gap-2">
        {["Assign Owner", "Add Tag", "Create Task", "Change Stage", "Export"].map(label => (
          <button key={label} className="border border-violet-300 text-violet-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-violet-100">
            {label}
          </button>
        ))}
        <button onClick={onClear} className="text-xs text-gray-400 px-2 font-bold">Clear</button>
      </div>
    </div>
  );
}

export default function CRMAccounts() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("healthScore");
  const [sortDir, setSortDir] = useState("desc");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(() => {
    let data = [...MOCK_ACCOUNTS];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(a => a.name.toLowerCase().includes(q) || a.mainContact.toLowerCase().includes(q) || a.city.toLowerCase().includes(q));
    }
    if (typeFilter) data = data.filter(a => a.type === typeFilter);
    if (ownerFilter) data = data.filter(a => a.owner === ownerFilter);
    if (cityFilter) data = data.filter(a => a.city === cityFilter);
    if (planFilter) data = data.filter(a => a.plan === planFilter);
    if (stageFilter) data = data.filter(a => a.lifecycleStage === stageFilter);
    if (activeTab === "renewing") data = data.filter(a => a.isRenewingSoon);
    if (activeTab === "inactive") data = data.filter(a => a.isInactive);
    if (activeTab === "risk") data = data.filter(a => a.healthScore < 40);

    data.sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return data;
  }, [search, typeFilter, ownerFilter, cityFilter, planFilter, stageFilter, activeTab, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelectedIds(selectedIds.length === paginated.length ? [] : paginated.map(a => a.id));

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={10} className="text-gray-300" />;
    return sortDir === "asc" ? <ChevronUp size={10} className="text-violet-500" /> : <ChevronDown size={10} className="text-violet-500" />;
  };

  const TABS = [
    { id: "all", label: "All", count: MOCK_ACCOUNTS.length },
    { id: "renewing", label: "Renewing Soon", count: MOCK_ACCOUNTS.filter(a => a.isRenewingSoon).length },
    { id: "inactive", label: "Inactive", count: MOCK_ACCOUNTS.filter(a => a.isInactive).length },
    { id: "risk", label: "At Risk", count: MOCK_ACCOUNTS.filter(a => a.healthScore < 40).length },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Accounts</h1>
          <p className="text-gray-500 text-sm">{filtered.length} accounts</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs">
            <Building2 size={12} /> New Account
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setPage(1); }}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"
            }`}>
            {tab.label}
            <span className="ml-1.5 bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search account name, contact, city..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-violet-400" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 border font-bold px-3 py-2 rounded-lg text-xs ${showFilters ? "bg-violet-50 border-violet-300 text-violet-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          <Filter size={12} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {[
            { label: "Type", value: typeFilter, setter: setTypeFilter, options: ["agency","developer","franchise_owner","finishing_company","store","enterprise","partner"] },
            { label: "Owner", value: ownerFilter, setter: setOwnerFilter, options: ["You","Adel M.","Sara K.","Mona A."] },
            { label: "City", value: cityFilter, setter: setCityFilter, options: ["Cairo","Giza","Alexandria","New Cairo","Sheikh Zayed"] },
            { label: "Plan", value: planFilter, setter: setPlanFilter, options: ["Business","Pro","Basic","Free"] },
            { label: "Stage", value: stageFilter, setter: setStageFilter, options: ["prospect","active","partner","churned","archived"] },
          ].map(({ label, value, setter, options }) => (
            <div key={label}>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">{label}</label>
              <select value={value} onChange={e => { setter(e.target.value); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-violet-400 bg-white">
                <option value="">All</option>
                {options.map(o => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {selectedIds.length > 0 && <BulkActions count={selectedIds.length} onClear={() => setSelectedIds([])} />}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" checked={selectedIds.length === paginated.length && paginated.length > 0} onChange={toggleAll} className="w-3.5 h-3.5 accent-violet-600" />
                </th>
                {[
                  { label: "Account", field: "name" },
                  { label: "Type" },
                  { label: "Owner", field: "owner" },
                  { label: "Main Contact" },
                  { label: "City", field: "city" },
                  { label: "Contacts", field: "contactsCount" },
                  { label: "Records", field: "linkedRecords" },
                  { label: "Plan" },
                  { label: "Renewal", field: "renewalDate" },
                  { label: "Health", field: "healthScore" },
                  { label: "Last Activity", field: "lastActivity" },
                  { label: "" },
                ].map(col => (
                  <th key={col.label} onClick={() => col.field && handleSort(col.field)}
                    className={`px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap ${col.field ? "cursor-pointer hover:text-gray-700 select-none" : ""}`}>
                    <span className="flex items-center gap-1">{col.label}{col.field && <SortIcon field={col.field} />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 && (
                <tr><td colSpan={12} className="py-16 text-center text-gray-400">
                  <Building2 size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No accounts match your filters</p>
                </td></tr>
              )}
              {paginated.map(a => (
                <tr key={a.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(a.id) ? "bg-violet-50" : ""}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggleSelect(a.id)} className="w-3.5 h-3.5 accent-violet-600" />
                  </td>
                  {/* Account */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                        {a.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <Link to={`/admin/crm/accounts/${a.id}`} className="font-semibold text-gray-900 hover:text-violet-600 truncate block max-w-[120px]">{a.name}</Link>
                        <div className="flex gap-1 mt-0.5">
                          {a.tags.map(t => <span key={t} className="text-[9px] bg-yellow-100 text-yellow-700 font-bold px-1 rounded">{t}</span>)}
                          {a.openOpportunities > 0 && <span className="text-[9px] bg-teal-100 text-teal-700 font-bold px-1 rounded">{a.openOpportunities} opps</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Type */}
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize ${TYPE_COLORS[a.type] || "bg-gray-100 text-gray-600"}`}>
                      {a.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-gray-700">{a.owner}</td>
                  <td className="px-3 py-3 text-gray-500">{a.mainContact}</td>
                  <td className="px-3 py-3 text-gray-500">{a.city}</td>
                  <td className="px-3 py-3"><span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{a.contactsCount}</span></td>
                  <td className="px-3 py-3 text-gray-500">{a.linkedRecords}</td>
                  {/* Plan */}
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${PLAN_COLORS[a.plan] || "bg-gray-100 text-gray-600"}`}>{a.plan}</span>
                  </td>
                  {/* Renewal */}
                  <td className="px-3 py-3">
                    {a.isRenewingSoon
                      ? <span className="text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {a.renewalDate}</span>
                      : <span className="text-gray-500">{a.renewalDate}</span>}
                  </td>
                  {/* Health */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-10 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${a.healthScore >= 70 ? "bg-green-500" : a.healthScore >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
                          style={{ width: `${a.healthScore}%` }} />
                      </div>
                      <span className="font-bold text-gray-700">{a.healthScore}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-400">{a.lastActivity}</td>
                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-green-50 rounded text-green-600" title="Call"><Phone size={12} /></button>
                      <Link to={`/admin/crm/accounts/${a.id}`} className="p-1 hover:bg-violet-50 rounded text-violet-500" title="Open"><ChevronRight size={12} /></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-50">Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p > totalPages) return null;
                return <button key={p} onClick={() => setPage(p)}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-bold ${page === p ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>;
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
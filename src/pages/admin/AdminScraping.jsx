import { useState, useEffect } from "react";
import { Download, Plus, Trash2, Settings, Play, Pause, Eye, Loader, X, ChevronDown } from "lucide-react";
import FieldMappingSection from "@/components/admin/FieldMappingSection";

const SOURCES = ["Aqarmap", "OLX", "Property Finder", "Bayut", "Other"];
const SCRAPE_TYPES = ["Property", "Project", "User"];

const FIELD_MAPPINGS = {
  Property: ["id", "title", "description", "size", "size_unit", "price", "currency", "purpose", "type", "furnished", "bathroom", "bedroom", "view_360", "amenities", "province", "city", "district", "area", "street", "latitude", "longitude", "publish_date", "video_url", "user_name", "phone", "whatsapp", "gallery", "address"],
  User: ["id", "name", "path", "avatar", "phone", "whatsapp", "position", "biography", "country_code", "country_name", "linkedin", "broker_license_no", "verification_status", "total_properties", "years_of_experience", "work_area", "languages", "company_id", "company_name", "source", "email", "address"],
  Project: ["id", "title", "description", "latitude", "longitude", "lang", "number_code", "email", "phone", "end_date", "video", "amenities", "developer_id", "developer_name", "website", "biography", "path_avatar", "avatar", "address_project", "path_gallery", "gallery", "path_logo_project", "logo_project", "path_floorplan", "floorplan", "path_brochure", "brochure", "source", "country_code"],
};

const PROPERTY_CATEGORIES = [
  { id: "auto", label: "─── Auto-detect from scraped data ───", emoji: "" },
  { id: "apartment", label: "Apartment (شقة)", emoji: "🏢" },
  { id: "villa", label: "Villa (فيلا)", emoji: "🏠" },
  { id: "duplex", label: "Duplex (دوبلكس)", emoji: "🏘" },
  { id: "townhouse", label: "Townhouse (تاون هاوس)", emoji: "🏠" },
  { id: "twin_house", label: "Twin House (توين هاوس)", emoji: "🏠" },
  { id: "studio", label: "Studio (استوديو)", emoji: "🏠" },
  { id: "chalet", label: "Chalet (شاليه)", emoji: "🏡" },
  { id: "land", label: "Land (أرض)", emoji: "🌍" },
  { id: "under_construction", label: "Under Construction (قيد الإنشاء)", emoji: "🏗" },
  { id: "commercial", label: "Commercial (تجاري)", emoji: "🏢" },
  { id: "administrative", label: "Administrative (إداري)", emoji: "🏢" },
  { id: "medical", label: "Medical (طبي)", emoji: "🏥" },
  { id: "other", label: "Other (أخرى)", emoji: "🏢" },
];

const USER_ROLES = [
  { group: "KEMEDAR ROLES", options: [
    { id: "common_user", label: "Common User (مستخدم عادي)", emoji: "👤", desc: "Property owners, buyers, general users" },
    { id: "agent", label: "Real Estate Agent - Individual", emoji: "🤝", desc: "Individual licensed brokers" },
    { id: "agency", label: "Real Estate Agency - Company", emoji: "🏢", desc: "Brokerage companies and offices" },
    { id: "developer", label: "Real Estate Developer", emoji: "🏗", desc: "Construction and development companies" },
    { id: "franchise_owner", label: "Franchise Owner (Area)", emoji: "🗺", desc: "Local Kemedar representatives" },
  ]},
  { group: "KEMEWORK ROLES", options: [
    { id: "professional", label: "Professional / Handyman", emoji: "🔧", desc: "Individual service professionals" },
    { id: "finishing_company", label: "Finishing Company", emoji: "🏢", desc: "Home finishing and renovation companies" },
  ]},
  { group: "KEMETRO ROLES", options: [
    { id: "product_seller", label: "Product Seller", emoji: "🏪", desc: "Store owners selling products" },
  ]},
  { group: "AUTO-DETECT", options: [
    { id: "auto_detect", label: "Auto-detect from scraped data", emoji: "⚡", desc: "System reads role from source data (requires role mapping below)" },
  ]},
];

const ALL_USER_ROLES_FLAT = USER_ROLES.flatMap(g => g.options);

const KEMEWORK_CATEGORIES = [
  "Electrical Services", "Plumbing Services", "Painting & Decorating",
  "Carpentry & Woodwork", "Flooring & Tiling", "HVAC & Air Conditioning",
  "Interior Design", "General Contracting", "Landscaping", "Cleaning Services",
];

const STATUS_CONFIG = {
  Running: { color: "bg-blue-100 text-blue-700", icon: "🔵" },
  Completed: { color: "bg-green-100 text-green-700", icon: "✅" },
  Failed: { color: "bg-red-100 text-red-700", icon: "❌" },
  Paused: { color: "bg-orange-100 text-orange-700", icon: "⏸" },
  Pending: { color: "bg-gray-100 text-gray-700", icon: "⏳" },
};

// ─── Shared UI helpers ───────────────────────────────────────────────────────
function SectionDivider({ label, isNew }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5">
        {label}
        {isNew && <span className="bg-blue-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">NEW</span>}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function FieldLabel({ label, sub }) {
  return (
    <div className="mb-1.5">
      <label className="block text-xs font-bold text-gray-700">{label}</label>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function PillRadio({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            value === opt.value
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Property Assignment Fields ──────────────────────────────────────────────
function PropertyAssignmentFields({ config, onChange }) {
  return (
    <div className="space-y-4">
      <SectionDivider label="Import Assignment" isNew />

      {/* Category */}
      <div className="border-l-2 border-blue-200 pl-3">
        <FieldLabel label="Property Category" sub="Scraped properties will be assigned to this category in the system" />
        <select
          value={config.categoryId}
          onChange={e => onChange({ ...config, categoryId: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
        >
          {PROPERTY_CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>
              {c.emoji ? `${c.emoji} ${c.label}` : c.label}
            </option>
          ))}
        </select>
        {config.categoryId === "auto" && (
          <div className="mt-2 space-y-2">
            <p className="text-[11px] text-gray-500 font-semibold">What if category cannot be auto-detected?</p>
            <PillRadio
              options={[
                { value: "skip", label: "⛔ Skip property" },
                { value: "fallback", label: "📁 Use fallback category" },
                { value: "other", label: "📂 Import as 'Other'" },
              ]}
              value={config.categoryFallbackMode}
              onChange={v => onChange({ ...config, categoryFallbackMode: v })}
            />
            {config.categoryFallbackMode === "fallback" && (
              <select
                value={config.fallbackCategoryId}
                onChange={e => onChange({ ...config, fallbackCategoryId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 mt-1"
              >
                {PROPERTY_CATEGORIES.filter(c => c.id !== "auto").map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Purpose */}
      <div className="border-l-2 border-blue-200 pl-3">
        <FieldLabel label="Property Purpose" sub="Scraped properties will be assigned to this purpose" />
        <PillRadio
          options={[
            { value: "Sale", label: "🏷 For Sale" },
            { value: "Rent", label: "🔑 For Rent" },
            { value: "Both", label: "🔄 Both" },
            { value: "auto", label: "⚡ Auto-detect" },
          ]}
          value={config.purpose}
          onChange={v => onChange({ ...config, purpose: v })}
        />
        {config.purpose === "auto" && (
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">ℹ️ System will read purpose from the scraped data. If not found, applies fallback below.</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-600 font-semibold">Fallback:</span>
              <select
                value={config.fallbackPurpose}
                onChange={e => onChange({ ...config, fallbackPurpose: e.target.value })}
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
              >
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
                <option value="skip">Skip property</option>
              </select>
            </div>
          </div>
        )}
        {(config.purpose === "Sale" || config.purpose === "Rent") && (
          <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs text-orange-700">⚠️ All scraped properties from this job will be forced to "{config.purpose === "Sale" ? "For Sale" : "For Rent"}" regardless of what the source website shows.</p>
          </div>
        )}
      </div>

      <SectionDivider label="Import Rules" isNew />

      {/* Import Status */}
      <div className="border-l-2 border-blue-200 pl-3">
        <FieldLabel label="Import Status" sub="Status assigned to scraped properties when they enter the system" />
        <PillRadio
          options={[
            { value: "pending", label: "⏳ Pending" },
            { value: "imported", label: "🔵 Imported" },
            { value: "auto_activate", label: "✅ Auto-Activate" },
          ]}
          value={config.importStatus}
          onChange={v => onChange({ ...config, importStatus: v })}
        />
        {config.importStatus === "pending" && (
          <p className="mt-2 text-[11px] text-gray-400">Properties will appear in: Admin → Properties → Pending Properties AND Imported Properties</p>
        )}
      </div>

      {/* Duplicate Handling */}
      <div className="border-l-2 border-blue-200 pl-3">
        <FieldLabel label="If property already exists" sub="What to do when same property found again" />
        <PillRadio
          options={[
            { value: "skip", label: "⏭ Skip" },
            { value: "update", label: "🔄 Update existing" },
            { value: "create_new", label: "➕ Create new entry" },
          ]}
          value={config.duplicateHandling}
          onChange={v => onChange({ ...config, duplicateHandling: v })}
        />
        <p className="mt-1.5 text-[11px] text-gray-400">Duplicates detected by: Phone number + City + Price + Area (all 4 must match)</p>
      </div>
    </div>
  );
}

// ─── User Assignment Fields ──────────────────────────────────────────────────
function UserAssignmentFields({ config, onChange }) {
  const addRoleMapping = () => onChange({ ...config, roleMapping: [...(config.roleMapping || []), { source: "", roleId: "common_user" }] });
  const removeRoleMapping = (i) => onChange({ ...config, roleMapping: config.roleMapping.filter((_, idx) => idx !== i) });
  const updateRoleMapping = (i, field, val) => {
    const updated = [...config.roleMapping];
    updated[i] = { ...updated[i], [field]: val };
    onChange({ ...config, roleMapping: updated });
  };

  const showProfessionalCategories = ["professional", "finishing_company"].includes(config.assignedRoleId);

  return (
    <div className="space-y-4">
      <SectionDivider label="Import Assignment" isNew />

      {/* Role */}
      <div className="border-l-2 border-blue-200 pl-3">
        <FieldLabel label="User Role / Type" sub="Scraped users will be assigned to this role when imported into the system" />
        <select
          value={config.assignedRoleId}
          onChange={e => onChange({ ...config, assignedRoleId: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
        >
          <option value="">-- Select user role --</option>
          {USER_ROLES.map(group => (
            <optgroup key={group.group} label={group.group}>
              {group.options.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.emoji} {opt.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
        {config.assignedRoleId && config.assignedRoleId !== "auto_detect" && (
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2.5">
            <p className="text-xs text-blue-700">
              ℹ️ Scraped users will appear in: Admin → Users → Imported Users → {ALL_USER_ROLES_FLAT.find(r => r.id === config.assignedRoleId)?.label}
              {" "}<span className="font-bold">Status: Pending Activation</span>
            </p>
          </div>
        )}
      </div>

      {/* Auto-detect role mapping */}
      {config.assignedRoleId === "auto_detect" && (
        <div className="border-l-2 border-blue-200 pl-3">
          <FieldLabel label="Role Mapping" sub="Map source website's user types to Kemedar roles" />
          <div className="space-y-2">
            {(config.roleMapping || []).map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={row.source}
                  onChange={e => updateRoleMapping(i, "source", e.target.value)}
                  placeholder="Enter exact value from source..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400"
                />
                <span className="text-gray-400">→</span>
                <select
                  value={row.roleId}
                  onChange={e => updateRoleMapping(i, "roleId", e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-blue-400"
                >
                  {ALL_USER_ROLES_FLAT.filter(r => r.id !== "auto_detect").map(r => (
                    <option key={r.id} value={r.id}>{r.emoji} {r.label}</option>
                  ))}
                </select>
                <button onClick={() => removeRoleMapping(i)} className="p-1 hover:bg-red-50 rounded text-red-400">
                  <X size={14} />
                </button>
              </div>
            ))}
            <button onClick={addRoleMapping} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1">
              <Plus size={13} /> Add Mapping Row
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-600 font-semibold">If source role not in mapping above:</span>
            <select
              value={config.fallbackRoleId}
              onChange={e => onChange({ ...config, fallbackRoleId: e.target.value })}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400"
            >
              <option value="skip">Skip user</option>
              {ALL_USER_ROLES_FLAT.filter(r => r.id !== "auto_detect").map(r => (
                <option key={r.id} value={r.id}>{r.emoji} {r.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Professional Category */}
      {showProfessionalCategories && (
        <div className="border-l-2 border-blue-200 pl-3">
          <FieldLabel label="Professional Category / Specialization" sub="Imported professionals will be assigned to this work category" />
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-36 overflow-y-auto space-y-1.5">
            {KEMEWORK_CATEGORIES.map(cat => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="accent-blue-500"
                  checked={(config.professionalCategories || []).includes(cat)}
                  onChange={e => {
                    const prev = config.professionalCategories || [];
                    onChange({ ...config, professionalCategories: e.target.checked ? [...prev, cat] : prev.filter(c => c !== cat) });
                  }}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>
      )}

      <SectionDivider label="Import Rules" isNew />

      {/* Activation */}
      <div className="border-l-2 border-blue-200 pl-3">
        <FieldLabel label="User Activation" sub="How imported users are activated in the system" />
        <div className="space-y-2">
          {[
            { value: "pending", label: "Pending Activation (recommended)", desc: "User gets phone/email as credentials. Must login to activate." },
            { value: "pre_activated", label: "Pre-Activated", desc: "Account immediately active. User needs to reset password on first login." },
            { value: "manual_review", label: "Requires Manual Review", desc: "Admin must manually activate each imported user." },
          ].map(opt => (
            <label key={opt.value} className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="activation"
                value={opt.value}
                checked={config.activationMode === opt.value}
                onChange={() => onChange({ ...config, activationMode: opt.value })}
                className="mt-0.5 accent-blue-500"
              />
              <div>
                <span className="text-xs font-bold text-gray-700">{opt.label}</span>
                <p className="text-[11px] text-gray-400">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {config.activationMode === "pending" && (
          <div className="mt-3 bg-white border-l-4 border-blue-400 rounded-lg p-3 shadow-sm">
            <p className="text-xs font-bold text-gray-700 mb-1">🔐 Default Login Credentials:</p>
            <p className="text-xs text-gray-600">Username: <span className="font-mono font-bold">[phone number]</span></p>
            <p className="text-xs text-gray-600">Password: <span className="font-mono font-bold">[last 6 digits of phone]</span></p>
            <p className="text-[11px] text-gray-400 mt-1.5">When user logs in, they are automatically activated and prompted to change their password.</p>
          </div>
        )}
      </div>

      {/* Duplicate */}
      <div className="border-l-2 border-blue-200 pl-3">
        <FieldLabel label="If user phone already exists" sub="How to handle existing users" />
        <PillRadio
          options={[
            { value: "skip", label: "⏭ Skip" },
            { value: "update", label: "🔄 Update profile" },
            { value: "create_new", label: "➕ New record" },
          ]}
          value={config.duplicateHandling}
          onChange={v => onChange({ ...config, duplicateHandling: v })}
        />
        <p className="mt-1.5 text-[11px] text-gray-400">Match by: Phone number (primary) OR email address (secondary)</p>
      </div>
    </div>
  );
}

// ─── Project Assignment Fields ────────────────────────────────────────────────
function ProjectAssignmentFields({ config, onChange }) {
  return (
    <div className="space-y-4">
      <SectionDivider label="Import Assignment" isNew />

      <div className="border-l-2 border-blue-200 pl-3">
        <FieldLabel label="Project Type / Category" />
        <PillRadio
          options={[
            { value: "Residential", label: "🏘 Residential" },
            { value: "Commercial", label: "🏢 Commercial" },
            { value: "Mixed", label: "🔀 Mixed Use" },
            { value: "Administrative", label: "🏛 Administrative" },
            { value: "auto", label: "⚡ Auto-detect" },
          ]}
          value={config.projectType}
          onChange={v => onChange({ ...config, projectType: v })}
        />
      </div>

      <div className="border-l-2 border-blue-200 pl-3">
        <FieldLabel label="Assign Developer" sub="If developer not found in our system, create them as:" />
        <div className="space-y-1.5">
          {[
            { value: "create_new", label: "New imported developer account" },
            { value: "generic", label: "Assign to generic 'Imported' developer" },
            { value: "skip", label: "Skip project if no developer found" },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
              <input type="radio" name="dev_handling" value={opt.value} checked={config.developerHandling === opt.value}
                onChange={() => onChange({ ...config, developerHandling: opt.value })} className="accent-blue-500" />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <SectionDivider label="Import Rules" isNew />

      <div className="border-l-2 border-blue-200 pl-3">
        <FieldLabel label="Import Status" sub="Status assigned to scraped projects when they enter the system" />
        <PillRadio
          options={[
            { value: "pending", label: "⏳ Pending" },
            { value: "imported", label: "🔵 Imported" },
            { value: "auto_activate", label: "✅ Auto-Activate" },
          ]}
          value={config.importStatus}
          onChange={v => onChange({ ...config, importStatus: v })}
        />
      </div>
    </div>
  );
}

// ─── Results Modal ────────────────────────────────────────────────────────────
function JobResultsModal({ job, onClose }) {
  const [tab, setTab] = useState("All");
  const TABS = ["All", "Imported", "Skipped", "Failed", "Updated"];
  const mockResults = [
    { id: 1, title: "Apartment in New Cairo", category: "Apartment", purpose: "For Sale", city: "New Cairo", price: "EGP 2.5M", status: "imported", statusLabel: "Imported successfully" },
    { id: 2, title: "Villa in Sheikh Zayed", category: "Villa", purpose: "For Sale", city: "Giza", price: "EGP 8M", status: "skipped", statusLabel: "Skipped — duplicate found" },
    { id: 3, title: "Studio in Maadi", category: "Studio", purpose: "For Rent", city: "Cairo", price: "EGP 5K/mo", status: "failed", statusLabel: "Failed — invalid data format" },
  ];
  const statusStyle = { imported: "text-green-600", skipped: "text-orange-500", failed: "text-red-500", updated: "text-blue-600" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900">{job.source} Scraping Results</h2>
            <p className="text-xs text-gray-400">Job ran: {job.created}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-3 px-6 py-4 border-b border-gray-100">
          {[
            { label: "Imported", count: job.items || 247, color: "bg-green-50 text-green-700 border-green-200" },
            { label: "Skipped", count: 12, color: "bg-orange-50 text-orange-700 border-orange-200" },
            { label: "Failed", count: 3, color: "bg-red-50 text-red-700 border-red-200" },
            { label: "Updated", count: 0, color: "bg-blue-50 text-blue-700 border-blue-200" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
              <p className="text-2xl font-black">{s.count}</p>
              <p className="text-xs font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${tab === t ? "bg-blue-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Results table */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 font-bold text-gray-500">Title</th>
                <th className="text-left py-2 font-bold text-gray-500">Category</th>
                <th className="text-left py-2 font-bold text-gray-500">Purpose</th>
                <th className="text-left py-2 font-bold text-gray-500">City</th>
                <th className="text-left py-2 font-bold text-gray-500">Price</th>
                <th className="text-left py-2 font-bold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockResults.filter(r => tab === "All" || r.status === tab.toLowerCase()).map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 font-semibold text-gray-800 max-w-[160px] truncate">{r.title}</td>
                  <td className="py-2.5 text-gray-500">{r.category}</td>
                  <td className="py-2.5 text-gray-500">{r.purpose}</td>
                  <td className="py-2.5 text-gray-500">{r.city}</td>
                  <td className="py-2.5 font-bold text-gray-700">{r.price}</td>
                  <td className={`py-2.5 font-semibold ${statusStyle[r.status]}`}>{r.statusLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={13} /> Export Results as CSV
          </button>
          <button onClick={onClose} className="bg-gray-800 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-gray-700">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ scrapeType, source, url, config, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">Confirm Scraping Job</h2>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Source:</span><span className="font-bold">{source}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">What:</span><span className="font-bold">{scrapeType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">URL:</span><span className="font-bold text-xs truncate max-w-[200px]">{url}</span></div>
            {scrapeType === "Property" && (
              <>
                <div className="flex justify-between"><span className="text-gray-500">📁 Category:</span><span className="font-bold">{config.categoryId === "auto" ? "Auto-detect" : config.categoryId}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">🏷 Purpose:</span><span className="font-bold">{config.purpose === "auto" ? "Auto-detect" : config.purpose}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">📊 Status:</span><span className="font-bold capitalize">{config.importStatus}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">🔄 Duplicates:</span><span className="font-bold capitalize">{config.duplicateHandling}</span></div>
              </>
            )}
            {scrapeType === "User" && (
              <>
                <div className="flex justify-between"><span className="text-gray-500">👤 Role:</span><span className="font-bold">{ALL_USER_ROLES_FLAT.find(r => r.id === config.assignedRoleId)?.label || "—"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">🔐 Activation:</span><span className="font-bold capitalize">{config.activationMode}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">🔄 Duplicates:</span><span className="font-bold capitalize">{config.duplicateHandling}</span></div>
              </>
            )}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-1">
            <p className="text-xs text-orange-700 font-bold">⚠️ After scraping, data will appear in:</p>
            {scrapeType === "Property" && (
              <>
                <p className="text-xs text-orange-600">📥 Admin → Properties → <strong>Imported Properties</strong> (Category / Purpose / Source filters)</p>
                {(config.importStatus === "pending") && <p className="text-xs text-orange-600">⏳ Admin → Properties → <strong>Pending Properties</strong></p>}
              </>
            )}
            {scrapeType === "User" && (
              <>
                <p className="text-xs text-orange-600">📥 Admin → Users → <strong>Imported Users</strong> → {ALL_USER_ROLES_FLAT.find(r => r.id === config.assignedRoleId)?.label || "role tab"}</p>
                {(config.activationMode === "pending" || config.activationMode === "manual_review") && <p className="text-xs text-orange-600">⏳ Admin → Users → <strong>Pending Users</strong> (mini-CRM)</p>}
              </>
            )}
            {scrapeType === "Project" && (
              <>
                <p className="text-xs text-orange-600">📥 Admin → Projects → <strong>Imported Projects</strong></p>
                {(config.importStatus === "pending") && <p className="text-xs text-orange-600">⏳ Admin → Projects → <strong>Pending Projects</strong></p>}
              </>
            )}
          </div>
        </div>
        <div className="px-6 py-4 flex justify-end gap-3">
          <button onClick={onCancel} className="border border-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="bg-blue-500 text-white font-black px-5 py-2 rounded-lg text-sm hover:bg-blue-600 flex items-center gap-2">
            <Play size={14} /> Start Scraping Job →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
function ScrapingConfigForm({ onJobCreated }) {
  const [scrapeType, setScrapeType] = useState("Property");
  const [source, setSource] = useState("Aqarmap");
  const [url, setUrl] = useState("");
  const [selectedFields, setSelectedFields] = useState(FIELD_MAPPINGS["Property"].slice(0, 5));
  const [fieldMappings, setFieldMappings] = useState({});
  const [running, setRunning] = useState(false);
  const [jobCreated, setJobCreated] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [propertyConfig, setPropertyConfig] = useState({
    categoryId: "auto", categoryFallbackMode: "other", fallbackCategoryId: "other",
    purpose: "auto", fallbackPurpose: "Sale", importStatus: "pending", duplicateHandling: "skip",
  });
  const [userConfig, setUserConfig] = useState({
    assignedRoleId: "", roleMapping: [], fallbackRoleId: "common_user",
    professionalCategories: [], activationMode: "pending", duplicateHandling: "skip",
  });
  const [projectConfig, setProjectConfig] = useState({
    projectType: "auto", developerHandling: "create_new", importStatus: "pending",
  });

  const availableFields = FIELD_MAPPINGS[scrapeType] || [];
  const toggleField = (field) => setSelectedFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]);

  const activeConfig = scrapeType === "Property" ? propertyConfig : scrapeType === "User" ? userConfig : projectConfig;

  const validate = () => {
    if (!url) return "Please enter a URL to scrape.";
    if (scrapeType === "User" && !userConfig.assignedRoleId) return "Please select a user role.";
    if (selectedFields.length < 3) return "Please select at least 3 fields to scrape.";
    return null;
  };

  const handleStartClick = () => {
    const err = validate();
    if (err) { alert(err); return; }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setJobCreated(true);
      onJobCreated && onJobCreated({ scrapeType, source, url, config: activeConfig });
      setTimeout(() => setJobCreated(false), 3000);
    }, 2000);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-black text-gray-900">Create Scraping Job</h2>

          <SectionDivider label="Basic Configuration" />

          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">What to Scrape</label>
            <div className="flex gap-2">
              {SCRAPE_TYPES.map(type => (
                <button key={type} onClick={() => { setScrapeType(type); setSelectedFields(FIELD_MAPPINGS[type].slice(0, 5)); }}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${scrapeType === type ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Source Website</label>
            <select value={source} onChange={e => setSource(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
              {SOURCES.map(src => <option key={src} value={src}>{src}</option>)}
            </select>
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">URL to Scrape</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://aqarmap.com/..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
          </div>

          {/* Dynamic assignment fields */}
          {scrapeType === "Property" && <PropertyAssignmentFields config={propertyConfig} onChange={setPropertyConfig} />}
          {scrapeType === "User" && <UserAssignmentFields config={userConfig} onChange={setUserConfig} />}
          {scrapeType === "Project" && <ProjectAssignmentFields config={projectConfig} onChange={setProjectConfig} />}

          <SectionDivider label="Fields to Scrape" />

          {/* Field Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Select Fields to Scrape</label>
            <p className="text-xs text-gray-400 mb-2">Choose which fields to scrape from the source website</p>
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto border border-gray-200">
              <div className="grid grid-cols-2 gap-y-1.5">
                {availableFields.map(field => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedFields.includes(field)} onChange={() => toggleField(field)} className="w-4 h-4 accent-blue-500" />
                    <span className="text-xs text-gray-700">{field}</span>
                  </label>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Selected: {selectedFields.length} / {availableFields.length} fields</p>
          </div>

          {jobCreated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-green-700">✅ Scraping job created successfully!</p>
            </div>
          )}

          <button onClick={handleStartClick} disabled={running}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white font-bold py-2.5 rounded-lg transition-colors">
            {running ? <><Loader size={16} className="animate-spin" /> Creating Job...</> : <><Play size={16} /> Start Scraping</>}
          </button>
        </div>

        {selectedFields.length > 0 && (
          <FieldMappingSection scrapeType={scrapeType} selectedFields={selectedFields} onMappingChange={setFieldMappings} />
        )}
      </div>

      {showConfirm && (
        <ConfirmModal scrapeType={scrapeType} source={source} url={url} config={activeConfig}
          onConfirm={handleConfirm} onCancel={() => setShowConfirm(false)} />
      )}
    </>
  );
}

// ─── Jobs Table ───────────────────────────────────────────────────────────────
function ScrapingJobs() {
  const [jobs, setJobs] = useState([
    { id: 1, type: "Property", source: "Aqarmap", status: "Running", created: "2026-03-24 10:30", items: 45, fields: 12, category: "Apartment", purpose: "For Sale", imported: 45, skipped: 12, failed: 3 },
    { id: 2, type: "User", source: "OLX", status: "Completed", created: "2026-03-23 15:20", items: 28, fields: 15, role: "Agent", imported: 28, skipped: 5, failed: 1 },
    { id: 3, type: "Project", source: "Property Finder", status: "Failed", created: "2026-03-22 09:10", items: 0, fields: 18, projectType: "Residential", imported: 0, skipped: 0, failed: 18 },
  ]);
  const [selectedJob, setSelectedJob] = useState(null);

  const getCategoryPill = (job) => {
    if (job.type === "Property") return <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{job.category || "Auto-detect"}</span>;
    if (job.type === "User") return <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{job.role || "Auto-detect"}</span>;
    if (job.type === "Project") return <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{job.projectType || "Auto-detect"}</span>;
    return <span className="text-gray-400 text-xs">—</span>;
  };

  const getPurposePill = (job) => {
    if (job.type !== "Property") return <span className="text-gray-400 text-xs">—</span>;
    const colors = { "For Sale": "bg-green-100 text-green-700", "For Rent": "bg-blue-100 text-blue-700", "Both": "bg-purple-100 text-purple-700", "Auto": "bg-gray-100 text-gray-600" };
    const val = job.purpose || "Auto";
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[val] || colors.Auto}`}>{val}</span>;
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-black text-gray-900">Scraping Jobs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                {["Type", "Source", "Category / Role", "Purpose", "Status", "Results", "Actions"].map(h => (
                  <th key={h} className="text-left px-3 py-3 font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => {
                const s = STATUS_CONFIG[job.status] || STATUS_CONFIG.Pending;
                return (
                  <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-3 py-3 font-bold text-gray-900">{job.type}</td>
                    <td className="px-3 py-3 text-gray-600">{job.source}</td>
                    <td className="px-3 py-3">{getCategoryPill(job)}</td>
                    <td className="px-3 py-3">{getPurposePill(job)}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                        {s.icon} {job.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {job.status === "Running" ? (
                        <span className="text-blue-600 font-bold">{job.imported}/{job.items}...</span>
                      ) : (
                        <div>
                          <p className="text-green-600 font-bold">{job.imported} imported</p>
                          <p className="text-gray-400">{job.skipped} skipped</p>
                          {job.failed > 0 && <p className="text-red-400">{job.failed} errors</p>}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        {job.status === "Running"
                          ? <button className="p-1 hover:bg-orange-100 rounded text-orange-500" title="Pause"><Pause size={13} /></button>
                          : <button className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Run again"><Play size={13} /></button>
                        }
                        <button onClick={() => setSelectedJob(job)} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="View results"><Eye size={13} /></button>
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-600" title="Edit"><Settings size={13} /></button>
                        <button className="p-1 hover:bg-red-100 rounded text-red-500" title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedJob && <JobResultsModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </>
  );
}

// ─── Where Data Goes Panel ────────────────────────────────────────────────────
function WhereDataGoesPanel() {
  const ROUTES = [
    {
      type: "Property",
      icon: "🏠",
      color: "border-orange-300 bg-orange-50",
      headerColor: "bg-orange-500",
      destinations: [
        {
          label: "Admin → Properties → Imported Properties",
          sublabel: "Filtered by: Category, Purpose, Source",
          icon: "📥",
          condition: "All scraped properties",
        },
        {
          label: "Admin → Properties → Pending Properties",
          sublabel: "if Import Status = Pending",
          icon: "⏳",
          condition: "When importStatus = pending",
        },
      ],
    },
    {
      type: "User",
      icon: "👤",
      color: "border-blue-300 bg-blue-50",
      headerColor: "bg-blue-500",
      destinations: [
        {
          label: "Admin → Users → Imported Users",
          sublabel: "Tabs: Common Users / Agents / Agencies / Developers / Professionals",
          icon: "📥",
          condition: "All scraped users",
        },
        {
          label: "Admin → Users → Pending Users",
          sublabel: "Same role tabs + mini-CRM for activation",
          icon: "⏳",
          condition: "When activationMode = pending",
        },
      ],
    },
    {
      type: "Project",
      icon: "🏗",
      color: "border-purple-300 bg-purple-50",
      headerColor: "bg-purple-500",
      destinations: [
        {
          label: "Admin → Projects → Imported Projects",
          sublabel: "Filtered by: Type, Source",
          icon: "📥",
          condition: "All scraped projects",
        },
        {
          label: "Admin → Projects → Pending Projects",
          sublabel: "if Import Status = Pending",
          icon: "⏳",
          condition: "When importStatus = pending",
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div>
        <h2 className="text-sm font-black text-gray-900">📍 Where Does Scraped Data Go?</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">After a scraping job completes, data is routed here based on your settings</p>
      </div>
      <div className="space-y-3">
        {ROUTES.map(route => (
          <div key={route.type} className={`rounded-xl border-2 ${route.color} overflow-hidden`}>
            <div className={`${route.headerColor} text-white px-3 py-2 flex items-center gap-2`}>
              <span className="text-sm">{route.icon}</span>
              <span className="text-xs font-black">{route.type}s</span>
            </div>
            <div className="px-3 py-2 space-y-2">
              {route.destinations.map((dest, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-base mt-0.5 flex-shrink-0">{dest.icon}</span>
                  <div>
                    <p className="text-[11px] font-black text-gray-800">{dest.label}</p>
                    <p className="text-[10px] text-gray-500">{dest.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
        <p className="text-[10px] text-yellow-700 font-semibold">💡 Tip: Data always lands in "Imported" AND "Pending" when Import Status = Pending. When auto-activated, only "Imported" is updated.</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminScraping() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Scraping Configuration</h1>
        <p className="text-gray-500 text-sm">Configure and manage web scraping jobs for properties, projects, and users</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ScrapingConfigForm />
        </div>
        <div className="space-y-5">
          <WhereDataGoesPanel />
          <ScrapingJobs />
        </div>
      </div>
    </div>
  );
}
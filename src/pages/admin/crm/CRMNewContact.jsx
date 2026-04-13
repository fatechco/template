import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, UserPlus } from "lucide-react";

const ROLES = [
  "lead", "common_user", "agent", "agency", "developer",
  "franchise_owner", "professional", "finishing_company",
  "product_seller", "product_buyer", "shipper", "investor", "partner"
];

const LIFECYCLE_STAGES = ["lead", "prospect", "activated", "onboarding", "active", "churned", "disqualified"];
const PRIORITIES = ["low", "medium", "high", "urgent"];
const CHANNELS = ["whatsapp", "phone", "email", "sms", "app"];
const LANGUAGES = ["ar", "en", "fr"];
const SOURCES = ["manual", "imported", "scraped", "self_registered", "referral", "inbound", "outbound"];

export default function CRMNewContact() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    whatsapp: "",
    primaryRole: "lead",
    lifecycleStage: "lead",
    priority: "medium",
    preferredChannel: "whatsapp",
    preferredLanguage: "ar",
    source: "manual",
    city: "",
    country: "Egypt",
    accountName: "",
    notes: "",
    tags: "",
  });

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save then redirect
    setTimeout(() => {
      setSaving(false);
      navigate("/admin/crm/contacts");
    }, 800);
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 bg-white";
  const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/crm/contacts" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-600 font-semibold">
          <ChevronLeft size={14} /> Back to Contacts
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
          <UserPlus size={18} className="text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Add New Contact</h1>
          <p className="text-sm text-gray-500">Manually create a new CRM contact</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-black text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>First Name *</label>
              <input required value={form.firstName} onChange={e => set("firstName", e.target.value)}
                placeholder="e.g. Ahmed" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Last Name</label>
              <input value={form.lastName} onChange={e => set("lastName", e.target.value)}
                placeholder="e.g. Hassan" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="+20 100 000 0000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp</label>
              <input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)}
                placeholder="+20 100 000 0000" className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Email</label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="email@example.com" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Role & Classification */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-black text-gray-800 mb-4">Role & Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Primary Role *</label>
              <select required value={form.primaryRole} onChange={e => set("primaryRole", e.target.value)} className={inputCls}>
                {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Lifecycle Stage</label>
              <select value={form.lifecycleStage} onChange={e => set("lifecycleStage", e.target.value)} className={inputCls}>
                {LIFECYCLE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select value={form.priority} onChange={e => set("priority", e.target.value)} className={inputCls}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Source</label>
              <select value={form.source} onChange={e => set("source", e.target.value)} className={inputCls}>
                {SOURCES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Location & Account */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-black text-gray-800 mb-4">Location & Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input value={form.city} onChange={e => set("city", e.target.value)}
                placeholder="e.g. Cairo" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <input value={form.country} onChange={e => set("country", e.target.value)}
                placeholder="e.g. Egypt" className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Company / Account Name</label>
              <input value={form.accountName} onChange={e => set("accountName", e.target.value)}
                placeholder="e.g. Elite Realty" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-black text-gray-800 mb-4">Communication Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Preferred Channel</label>
              <select value={form.preferredChannel} onChange={e => set("preferredChannel", e.target.value)} className={inputCls}>
                {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Preferred Language</label>
              <select value={form.preferredLanguage} onChange={e => set("preferredLanguage", e.target.value)} className={inputCls}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l === "ar" ? "Arabic" : l === "en" ? "English" : "French"}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Notes & Tags */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-black text-gray-800 mb-4">Notes & Tags</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Notes</label>
              <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
                rows={3} placeholder="Any relevant notes about this contact..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 resize-none" />
            </div>
            <div>
              <label className={labelCls}>Tags <span className="font-normal text-gray-400 normal-case">(comma-separated)</span></label>
              <input value={form.tags} onChange={e => set("tags", e.target.value)}
                placeholder="e.g. vip, warm, renewal" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link to="/admin/crm/contacts"
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-60">
            <Save size={14} />
            {saving ? "Saving…" : "Save Contact"}
          </button>
        </div>
      </form>
    </div>
  );
}
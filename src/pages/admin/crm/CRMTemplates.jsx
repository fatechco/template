import { useState, useMemo } from "react";
import {
  Plus, Search, Filter, Copy, Archive, Eye, Pencil, CheckCircle,
  Clock, X, Download, AlertCircle, ChevronRight
} from "lucide-react";

// ─── Config ────────────────────────────────────────────────────────────────────
const CHANNELS = ["whatsapp", "email", "sms", "call_script", "note"];
const CATEGORIES = ["welcome", "onboarding", "profile_completion", "listing_activation", "document_request", "renewal_reminder", "payment_reminder", "no_response", "reactivation", "viewing_confirmation", "upsell"];
const STATUSES = ["draft", "pending_review", "approved", "rejected", "archived"];
const LANGUAGES = ["ar", "en", "fr"];
const VARIABLES = ["{{first_name}}", "{{company_name}}", "{{user_type}}", "{{city}}", "{{active_listings}}", "{{total_listings}}", "{{profile_completion}}", "{{subscription_plan}}", "{{renewal_date}}", "{{preferred_area}}", "{{budget_range}}", "{{assigned_rep_name}}"];

const STATUS_COLOR = {
  draft: "bg-gray-100 text-gray-600",
  pending_review: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
  archived: "bg-gray-50 text-gray-400",
};

const CHANNEL_ICON = { whatsapp: "💬", email: "📧", sms: "📱", call_script: "📞", note: "📝" };

const MOCK_TEMPLATES = [
  { id: "t1", name: "Agent Welcome — AR", channel: "whatsapp", category: "welcome", language: "ar", status: "approved", usageCount: 142, body: "مرحباً {{first_name}}، نرحب بك في كيمدار. يمكنك الآن البدء في نشر عقاراتك.", variables: ["{{first_name}}"], approvedBy: "Admin", approvedAt: "Mar 1, 2026", version: 3, providerTemplateId: "waba_agent_welcome_ar_v3" },
  { id: "t2", name: "Renewal Reminder — EN", channel: "whatsapp", category: "renewal_reminder", language: "en", status: "approved", usageCount: 89, body: "Hello {{first_name}}, your {{subscription_plan}} plan expires on {{renewal_date}}. Renew today and enjoy continued access.", variables: ["{{first_name}}", "{{subscription_plan}}", "{{renewal_date}}"], approvedBy: "Admin", approvedAt: "Feb 15, 2026", version: 2, providerTemplateId: "waba_renewal_en_v2" },
  { id: "t3", name: "Profile Completion — AR", channel: "sms", category: "profile_completion", language: "ar", status: "approved", usageCount: 214, body: "أكمل بيانات ملفك الشخصي على كيمدار للحصول على عملاء أكثر. نسبة اكتمال ملفك: {{profile_completion}}%", variables: ["{{profile_completion}}"], approvedBy: "Admin", approvedAt: "Jan 20, 2026", version: 1, providerTemplateId: null },
  { id: "t4", name: "Developer Onboarding Email", channel: "email", category: "onboarding", language: "en", status: "approved", usageCount: 34, body: "Dear {{first_name}},\n\nWelcome to Kemedar Developer Portal. Your account for {{company_name}} is now active. Here's how to get started...", variables: ["{{first_name}}", "{{company_name}}"], approvedBy: "Admin", approvedAt: "Mar 10, 2026", version: 1, providerTemplateId: null },
  { id: "t5", name: "No Response Follow-up — AR", channel: "whatsapp", category: "no_response", language: "ar", status: "pending_review", usageCount: 0, body: "مرحباً {{first_name}}، لم نتمكن من الوصول إليك مؤخراً. هل يمكنك إخبارنا بالوقت المناسب للتواصل؟", variables: ["{{first_name}}"], approvedBy: null, approvedAt: null, version: 1, providerTemplateId: null },
  { id: "t6", name: "Upsell — Featured Listings", channel: "whatsapp", category: "upsell", language: "ar", status: "draft", usageCount: 0, body: "هل تريد عرض عقاراتك لأكثر من 50,000 مشتري؟ جرّب خدمة الإعلانات المميزة من كيمدار.", variables: [], approvedBy: null, approvedAt: null, version: 1, providerTemplateId: null },
  { id: "t7", name: "Listing Activation Reminder", channel: "sms", category: "listing_activation", language: "ar", status: "approved", usageCount: 178, body: "لديك {{total_listings}} عقار منشور، {{active_listings}} منها نشطة فقط. فعّل باقي إعلاناتك الآن.", variables: ["{{total_listings}}", "{{active_listings}}"], approvedBy: "Admin", approvedAt: "Feb 1, 2026", version: 2, providerTemplateId: "sms_listing_act_ar_v2" },
  { id: "t8", name: "Reactivation — Churned Agent", channel: "whatsapp", category: "reactivation", language: "ar", status: "approved", usageCount: 52, body: "مرحباً {{first_name}}، نشتاق إليك في كيمدار! عُد إلينا وسنمنحك شهرًا مجانيًا للبدء من جديد.", variables: ["{{first_name}}"], approvedBy: "Admin", approvedAt: "Mar 15, 2026", version: 1, providerTemplateId: "waba_react_churned_ar_v1" },
  { id: "t9", name: "Document Request", channel: "email", category: "document_request", language: "en", status: "draft", usageCount: 0, body: "Dear {{first_name}},\n\nTo complete verification of {{company_name}}, we need the following documents...", variables: ["{{first_name}}", "{{company_name}}"], approvedBy: null, approvedAt: null, version: 1, providerTemplateId: null },
  { id: "t10", name: "Viewing Confirmation", channel: "whatsapp", category: "viewing_confirmation", language: "ar", status: "approved", usageCount: 67, body: "تم تأكيد موعد المعاينة في {{preferred_area}}. {{assigned_rep_name}} سيتواصل معك قريباً.", variables: ["{{preferred_area}}", "{{assigned_rep_name}}"], approvedBy: "Admin", approvedAt: "Feb 20, 2026", version: 1, providerTemplateId: "waba_viewing_conf_ar_v1" },
];

// ─── Template Editor Modal ────────────────────────────────────────────────────
function TemplateModal({ template, onClose }) {
  const isEdit = !!template;
  const [form, setForm] = useState(template || { name: "", channel: "whatsapp", category: "welcome", language: "ar", body: "", providerTemplateId: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const [previewMode, setPreviewMode] = useState(false);

  const previewBody = form.body
    .replace("{{first_name}}", "Ahmed")
    .replace("{{company_name}}", "Elite Realty")
    .replace("{{subscription_plan}}", "Pro Plan")
    .replace("{{renewal_date}}", "May 1, 2026")
    .replace("{{profile_completion}}", "72")
    .replace("{{active_listings}}", "12")
    .replace("{{total_listings}}", "18")
    .replace("{{assigned_rep_name}}", "Adel Mohamed")
    .replace("{{preferred_area}}", "New Cairo")
    .replace("{{city}}", "Cairo")
    .replace("{{user_type}}", "Agent")
    .replace("{{budget_range}}", "EGP 2-3M");

  const insertVar = (v) => setForm(p => ({ ...p, body: p.body + v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-base font-black text-gray-900">{isEdit ? "Edit Template" : "Create Template"}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${previewMode ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-600"}`}>
              <Eye size={11} /> Preview
            </button>
            <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {previewMode ? (
            <div>
              <p className="text-xs font-black text-gray-700 mb-3">Preview (with sample data)</p>
              <div className={`rounded-2xl p-4 max-w-sm ${form.channel === "whatsapp" ? "bg-green-50 border border-green-200" : form.channel === "email" ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}>
                {form.name && <p className="text-[10px] font-black text-gray-500 mb-2">{form.name}</p>}
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{previewBody}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-gray-400">{form.channel} · {form.language}</span>
                  <span className="text-[10px] text-gray-300">✓✓</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <input placeholder="Template name..." value={form.name} onChange={e => set("name", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Channel", key: "channel", options: CHANNELS },
                  { label: "Category", key: "category", options: CATEGORIES },
                  { label: "Language", key: "language", options: LANGUAGES },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{label}</label>
                    <select value={form[key]} onChange={e => set(key, e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                      {options.map(o => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Provider Template ID</label>
                  <input placeholder="e.g. waba_xxx_v1" value={form.providerTemplateId} onChange={e => set("providerTemplateId", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>

              {/* Variables bar */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 mb-1.5">Insert variable:</p>
                <div className="flex flex-wrap gap-1.5">
                  {VARIABLES.map(v => (
                    <button key={v} onClick={() => insertVar(v)}
                      className="text-[10px] font-mono bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded hover:bg-violet-100">{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Body</label>
                <textarea value={form.body} onChange={e => set("body", e.target.value)} rows={6}
                  placeholder="Write your template body here. Use {{variable}} format."
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400 resize-none font-mono" />
                <p className="text-[10px] text-gray-400 mt-1">{form.body.length} characters</p>
              </div>
            </>
          )}
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
          <button onClick={onClose} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">Cancel</button>
          <button className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">Save Draft</button>
          <button className="bg-violet-600 text-white font-black px-5 py-2 rounded-xl text-xs hover:bg-violet-700">Submit for Review</button>
        </div>
      </div>
    </div>
  );
}

// ─── Template Card ────────────────────────────────────────────────────────────
function TemplateCard({ tmpl, onEdit, onDuplicate }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow ${tmpl.status === "archived" ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-base">{CHANNEL_ICON[tmpl.channel]}</span>
            <p className="text-xs font-black text-gray-900 truncate">{tmpl.name}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize ${STATUS_COLOR[tmpl.status]}`}>{tmpl.status.replace(/_/g, " ")}</span>
            <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded-full capitalize">{tmpl.category.replace(/_/g, " ")}</span>
            <span className="text-[9px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded-full uppercase">{tmpl.language}</span>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => onEdit(tmpl)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><Pencil size={11} /></button>
          <button onClick={() => onDuplicate(tmpl)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><Copy size={11} /></button>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 line-clamp-2 mb-2">{tmpl.body}</p>
      <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-50 pt-2">
        <span>v{tmpl.version} · Used {tmpl.usageCount}×</span>
        {tmpl.providerTemplateId
          ? <span className="bg-green-50 text-green-600 font-mono font-bold px-1.5 py-0.5 rounded">{tmpl.providerTemplateId.slice(0, 16)}…</span>
          : <span className="bg-orange-50 text-orange-500 font-bold px-1.5 py-0.5 rounded">No provider ID</span>}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CRMTemplates() {
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);

  const filtered = useMemo(() => {
    let data = [...templates];
    if (search) { const q = search.toLowerCase(); data = data.filter(t => t.name.toLowerCase().includes(q) || t.body.toLowerCase().includes(q)); }
    if (channelFilter) data = data.filter(t => t.channel === channelFilter);
    if (categoryFilter) data = data.filter(t => t.category === categoryFilter);
    if (statusFilter) data = data.filter(t => t.status === statusFilter);
    if (langFilter) data = data.filter(t => t.language === langFilter);
    return data;
  }, [templates, search, channelFilter, categoryFilter, statusFilter, langFilter]);

  const handleDuplicate = (tmpl) => {
    setTemplates(prev => [...prev, { ...tmpl, id: `t${Date.now()}`, name: `${tmpl.name} (Copy)`, status: "draft", usageCount: 0, version: 1, providerTemplateId: null }]);
  };

  const stats = [
    { label: "Total", value: templates.length, color: "text-gray-900" },
    { label: "Approved", value: templates.filter(t => t.status === "approved").length, color: "text-green-600" },
    { label: "Pending Review", value: templates.filter(t => t.status === "pending_review").length, color: "text-yellow-600" },
    { label: "Draft", value: templates.filter(t => t.status === "draft").length, color: "text-gray-500" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-black text-gray-900">Templates Library</h1><p className="text-gray-500 text-sm">{filtered.length} templates</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs"><Plus size={12} /> New Template</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm"><p className={`text-2xl font-black ${s.color}`}>{s.value}</p><p className="text-xs text-gray-400 mt-0.5">{s.label}</p></div>)}
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-violet-400" />
        </div>
        {[
          { label: "Channel", value: channelFilter, setter: setChannelFilter, options: CHANNELS },
          { label: "Category", value: categoryFilter, setter: setCategoryFilter, options: CATEGORIES },
          { label: "Status", value: statusFilter, setter: setStatusFilter, options: STATUSES },
          { label: "Language", value: langFilter, setter: setLangFilter, options: LANGUAGES },
        ].map(({ label, value, setter, options }) => (
          <select key={label} value={value} onChange={e => setter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none bg-white">
            <option value="">All {label}s</option>
            {options.map(o => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
          </select>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(t => <TemplateCard key={t.id} tmpl={t} onEdit={setEditingTemplate} onDuplicate={handleDuplicate} />)}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📝</p>
            <p className="font-semibold">No templates found</p>
          </div>
        )}
      </div>

      {(showCreate || editingTemplate) && (
        <TemplateModal template={editingTemplate} onClose={() => { setShowCreate(false); setEditingTemplate(null); }} />
      )}
    </div>
  );
}
"use client";
// @ts-nocheck
import { useState } from "react";
import {
  Phone, MessageCircle, Mail, Pencil, Plus, Bot,
  Users, Star, RefreshCw, Send, CheckCircle, X
} from "lucide-react";

function Toast({ msg, onClose }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2">
      {msg}
      <button onClick={onClose} className="ml-1 text-white/60 hover:text-white"><X size={12} /></button>
    </div>
  );
}

const ROLE_COLORS = {
  agent: "bg-blue-100 text-blue-700",
  agency: "bg-indigo-100 text-indigo-700",
  developer: "bg-purple-100 text-purple-700",
  buyer: "bg-green-100 text-green-700",
  lead: "bg-gray-100 text-gray-600",
  investor: "bg-yellow-100 text-yellow-700",
  professional: "bg-teal-100 text-teal-700",
  product_seller: "bg-orange-100 text-orange-700",
  franchise_owner: "bg-red-100 text-red-700",
  common_user: "bg-gray-100 text-gray-500",
};

const STAGE_COLORS = {
  lead: "bg-gray-100 text-gray-600",
  prospect: "bg-blue-100 text-blue-700",
  activated: "bg-teal-100 text-teal-700",
  onboarding: "bg-orange-100 text-orange-700",
  active: "bg-green-100 text-green-700",
  churned: "bg-red-100 text-red-600",
  disqualified: "bg-gray-100 text-gray-400",
};

const PRIORITY_DOT = {
  urgent: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  low: "bg-gray-300",
};

const CHANNEL_ICON = {
  whatsapp: "💬",
  phone: "📞",
  email: "📧",
  sms: "📱",
  app: "📲",
};

const TEMPLATES = [
  { id: "t1", name: "Renewal Offer", type: "whatsapp", category: "activation", lang: "ar" },
  { id: "t2", name: "Welcome Message", type: "whatsapp", category: "onboarding", lang: "ar" },
  { id: "t3", name: "Follow-up Call", type: "whatsapp", category: "follow_up", lang: "en" },
  { id: "t4", name: "Activation Reminder", type: "sms", category: "activation", lang: "ar" },
  { id: "t5", name: "Welcome Email", type: "email", category: "onboarding", lang: "en" },
  { id: "t6", name: "Promotional Offer", type: "email", category: "promotion", lang: "ar" },
  { id: "t7", name: "Re-engagement", type: "whatsapp", category: "retention", lang: "ar" },
];

const TYPE_ICON = { whatsapp: "💬", email: "📧", sms: "📱", call_script: "📞" };
const TYPE_COLOR = {
  whatsapp: "bg-green-100 text-green-700",
  email: "bg-blue-100 text-blue-700",
  sms: "bg-purple-100 text-purple-700",
};

function TemplatePicker({ contact, onClose }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = TEMPLATES.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-black text-gray-700 mb-2">Send Template</p>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search templates…"
          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-violet-400" />
        <div className="flex gap-1 mt-2">
          {["all","whatsapp","email","sms"].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all ${typeFilter === t ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {t === "all" ? "All" : TYPE_ICON[t] + " " + t}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No templates found</p>
        )}
        {filtered.map(t => (
          <button key={t.id} onClick={() => { onClose(`Template "${t.name}" sent via ${t.type}`); }}
            className="w-full text-left px-4 py-3 hover:bg-violet-50 transition-colors flex items-center gap-3">
            <span className="text-base">{TYPE_ICON[t.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800">{t.name}</p>
              <p className="text-[10px] text-gray-400 capitalize">{t.category.replace(/_/g, " ")} · {t.lang === "ar" ? "Arabic" : "English"}</p>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${TYPE_COLOR[t.type]}`}>{t.type}</span>
          </button>
        ))}
      </div>
      <div className="p-2 border-t border-gray-100">
        <button onClick={() => onClose(null)} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 font-bold py-1">Close</button>
      </div>
    </div>
  );
}

export default function ContactHeader({ contact, onAction }) {
  const [stage, setStage] = useState(contact.lifecycleStage);
  const [editingOwner, setEditingOwner] = useState(false);
  const [owner, setOwner] = useState(contact.owner || "Unassigned");
  const [toast, setToast] = useState(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const initials = contact.displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      {/* Main info row */}
      <div className="flex items-start gap-4 flex-wrap">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {contact.avatarUrl
            ? <img src={contact.avatarUrl} alt={contact.displayName} className="w-16 h-16 rounded-2xl object-cover" />
            : <div className="w-16 h-16 rounded-2xl bg-violet-600 text-white text-xl font-black flex items-center justify-center">{initials}</div>}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${PRIORITY_DOT[contact.priority]}`} />
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-black text-gray-900">{contact.displayName}</h1>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STAGE_COLORS[stage]}`}>
              {stage}
            </div>
            {contact.tags.map(t => (
              <span key={t} className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-1.5 py-0.5 rounded-full">{t}</span>
            ))}
          </div>

          {/* Roles */}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS[contact.primaryRole] || "bg-gray-100 text-gray-600"}`}>
              {contact.primaryRole.replace(/_/g, " ")}
            </span>
            {contact.secondaryRoles.map(r => (
              <span key={r} className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS[r] || "bg-gray-100 text-gray-600"}`}>{r.replace(/_/g, " ")}</span>
            ))}
            {contact.accountName && (
              <span className="text-[11px] text-gray-500 font-semibold flex items-center gap-1">
                @ {contact.accountName}
              </span>
            )}
          </div>

          {/* Quick stats row */}
          <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-gray-500">
            <span className="flex items-center gap-1">📍 {contact.city}</span>
            <span className="flex items-center gap-1">{CHANNEL_ICON[contact.preferredChannel]} {contact.preferredChannel}</span>
            <span className="flex items-center gap-1">🕒 {contact.lastActivityAt}</span>
            {contact.nextFollowupAt && (
              <span className={`flex items-center gap-1 font-semibold ${contact.nextFollowupAt === "Overdue" ? "text-red-500" : "text-orange-500"}`}>
                📅 {contact.nextFollowupAt}
              </span>
            )}
            <span className="flex items-center gap-1">📥 {contact.source}</span>
          </div>
        </div>

        {/* Score + owner */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {/* Score */}
          <div className="text-center">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#7C3AED" strokeWidth="3"
                  strokeDasharray={`${contact.score * 0.942} 94.2`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-violet-600">{contact.score}</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Score</p>
          </div>

          {/* Owner */}
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Owner</p>
            <button onClick={() => setEditingOwner(true)} className="text-xs font-bold text-gray-700 hover:text-violet-600 flex items-center gap-1">
              {owner} <Pencil size={9} />
            </button>
          </div>
        </div>
      </div>

      {/* Consent badges */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {[
          { label: "Marketing", ok: contact.consentMarketing },
          { label: "Communication", ok: contact.consentCommunication },
          { label: "Data Storage", ok: contact.consentDataStorage },
        ].map(c => (
          <span key={c.label} className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${c.ok ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
            {c.ok ? "✓" : "✗"} {c.label}
          </span>
        ))}
        <span className="text-[10px] text-gray-400 ml-1">
          {contact.preferredLanguage === "ar" ? "🇦🇪 Arabic" : contact.preferredLanguage === "fr" ? "🇫🇷 French" : "🇬🇧 English"}
        </span>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-2 mt-4 flex-wrap border-t border-gray-100 pt-4">
        <a href={(contact.whatsapp || contact.phone) ? `https://wa.me/${(contact.whatsapp || contact.phone).replace(/\D/g,"")}` : undefined}
          target="_blank" rel="noreferrer"
          onClick={e => { if (!contact.whatsapp && !contact.phone) e.preventDefault(); }}
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded-lg text-xs">
          <MessageCircle size={12} /> WhatsApp
        </a>
        <a href={contact.email ? `mailto:${contact.email}` : undefined}
          onClick={e => { if (!contact.email) e.preventDefault(); }}
          className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-2 rounded-lg text-xs">
          <Mail size={12} /> Email
        </a>
        <a href={(contact.phone || contact.whatsapp) ? `tel:${(contact.phone || contact.whatsapp).replace(/\s/g,"")}` : undefined}
          onClick={e => { if (!contact.phone && !contact.whatsapp) e.preventDefault(); }}
          className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 text-white font-bold px-3 py-2 rounded-lg text-xs">
          <Phone size={12} /> Call
        </a>
        <button onClick={() => onAction?.("note")}
          className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
          <Pencil size={12} /> Add Note
        </button>
        <button onClick={() => onAction?.("task")}
          className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
          <CheckCircle size={12} /> Create Task
        </button>
        <button onClick={() => onAction?.("opportunity")}
          className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
          <Star size={12} /> Opportunity
        </button>
        <div className="relative">
          <button onClick={() => setShowTemplatePicker(p => !p)}
            className={`flex items-center gap-1.5 border font-bold px-3 py-2 rounded-lg text-xs transition-all ${showTemplatePicker ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
            <Send size={12} /> Template
          </button>
          {showTemplatePicker && (
            <TemplatePicker contact={contact} onClose={(msg) => { setShowTemplatePicker(false); if (msg) showToast(msg); }} />
          )}
        </div>
        <button onClick={() => showToast("AI assistant — engine not yet connected")}
          className="flex items-center gap-1.5 border border-dashed border-violet-300 text-violet-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-violet-50">
          <Bot size={12} /> Ask AI
        </button>
        <button onClick={() => showToast("AI Call — telephony not yet connected")}
          className="flex items-center gap-1.5 border border-dashed border-violet-300 text-violet-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-violet-50">
          <Phone size={12} /> AI Call
        </button>
        <button onClick={() => setEditingOwner(true)}
          className="ml-auto flex items-center gap-1.5 border border-gray-200 text-gray-500 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
          <Users size={12} /> Reassign
        </button>
      </div>

      {/* Owner reassign inline */}
      {editingOwner && (
        <div className="mt-3 flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
          <span className="text-xs font-bold text-gray-600">Reassign to:</span>
          <select value={owner} onChange={e => setOwner(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-violet-400">
            {["You", "Adel M.", "Sara K.", "Mona A.", "Unassigned"].map(r => <option key={r}>{r}</option>)}
          </select>
          <button onClick={() => { setEditingOwner(false); showToast(`Contact reassigned to ${owner}`); }}
            className="bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-violet-700">Save</button>
          <button onClick={() => setEditingOwner(false)} className="text-xs text-gray-400 font-bold">Cancel</button>
        </div>
      )}

      {showTemplatePicker && (
        <div className="fixed inset-0 z-40" onClick={() => setShowTemplatePicker(false)} />
      )}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* Edit stage inline */}
      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-gray-500">Stage:</span>
        <select value={stage} onChange={e => setStage(e.target.value)}
          className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-violet-400">
          {["lead","prospect","activated","onboarding","active","churned","disqualified"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-xs text-gray-500">Priority:</span>
        <select defaultValue={contact.priority}
          className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-violet-400">
          {["urgent","high","medium","low"].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </div>
  );
}
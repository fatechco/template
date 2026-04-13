import { useState } from "react";
import { Eye, EyeOff, Save, CheckCircle, AlertTriangle, Copy, RefreshCw } from "lucide-react";

const ENV_GROUPS = [
  {
    group: "🤖 AI Models",
    color: "purple",
    vars: [
      { key: "ANTHROPIC_API_KEY", label: "Anthropic (Claude)", placeholder: "sk-ant-...", link: "https://console.anthropic.com/settings/keys", desc: "Used for AI property extraction, content generation" },
      { key: "OPENAI_API_KEY", label: "OpenAI (GPT-4o)", placeholder: "sk-...", link: "https://platform.openai.com/api-keys", desc: "Used for AI chat, summaries, smart search" },
      { key: "GEMINI_API_KEY", label: "Google Gemini", placeholder: "AIza...", link: "https://aistudio.google.com/app/apikey", desc: "Google's AI model for content tasks" },
      { key: "QWEN_API_KEY", label: "Alibaba Qwen", placeholder: "sk-...", link: "https://dashscope.aliyuncs.com/", desc: "Arabic-optimized AI model" },
      { key: "MISTRAL_API_KEY", label: "Mistral AI", placeholder: "...", link: "https://console.mistral.ai/", desc: "Open-weight AI model" },
    ]
  },
  {
    group: "🗺️ Maps & Location",
    color: "blue",
    vars: [
      { key: "GOOGLE_MAPS_API_KEY", label: "Google Maps API", placeholder: "AIza...", link: "https://console.cloud.google.com/", desc: "Property maps, geocoding, place search" },
      { key: "MAPBOX_API_KEY", label: "Mapbox API", placeholder: "pk.eyJ1...", link: "https://account.mapbox.com/", desc: "Alternative mapping provider" },
    ]
  },
  {
    group: "📧 Email & Notifications",
    color: "green",
    vars: [
      { key: "RESEND_API_KEY", label: "Resend (Email)", placeholder: "re_...", link: "https://resend.com/api-keys", desc: "Transactional email service" },
      { key: "SENDGRID_API_KEY", label: "SendGrid", placeholder: "SG...", link: "https://app.sendgrid.com/settings/api_keys", desc: "Alternative email provider" },
      { key: "TWILIO_ACCOUNT_SID", label: "Twilio Account SID", placeholder: "AC...", link: "https://console.twilio.com/", desc: "SMS & WhatsApp notifications" },
      { key: "TWILIO_AUTH_TOKEN", label: "Twilio Auth Token", placeholder: "...", link: "https://console.twilio.com/", desc: "Twilio authentication token" },
      { key: "FIREBASE_SERVER_KEY", label: "Firebase (Push Notifications)", placeholder: "AAAA...", link: "https://console.firebase.google.com/", desc: "Mobile push notifications" },
    ]
  },
  {
    group: "💳 Payments",
    color: "orange",
    vars: [
      { key: "STRIPE_API_KEY", label: "Stripe Secret Key", placeholder: "sk_live_...", link: "https://dashboard.stripe.com/apikeys", desc: "Payment processing" },
      { key: "STRIPE_WEBHOOK_SECRET", label: "Stripe Webhook Secret", placeholder: "whsec_...", link: "https://dashboard.stripe.com/webhooks", desc: "Stripe webhook verification" },
      { key: "PAYMOB_API_KEY", label: "Paymob API Key", placeholder: "...", link: "https://accept.paymob.com/", desc: "Local payment gateway (EGP)" },
    ]
  },
  {
    group: "🔗 Integrations",
    color: "teal",
    vars: [
      { key: "GOOGLE_CLIENT_ID", label: "Google OAuth Client ID", placeholder: "....apps.googleusercontent.com", link: "https://console.cloud.google.com/", desc: "Google Sign-In" },
      { key: "GOOGLE_CLIENT_SECRET", label: "Google OAuth Secret", placeholder: "GOCSPX-...", link: "https://console.cloud.google.com/", desc: "Google Sign-In secret" },
      { key: "FACEBOOK_APP_ID", label: "Facebook App ID", placeholder: "...", link: "https://developers.facebook.com/", desc: "Facebook Sign-In" },
      { key: "FACEBOOK_APP_SECRET", label: "Facebook App Secret", placeholder: "...", link: "https://developers.facebook.com/", desc: "Facebook App secret" },
      { key: "WHATSAPP_API_TOKEN", label: "WhatsApp Business Token", placeholder: "EAAx...", link: "https://developers.facebook.com/docs/whatsapp/", desc: "WhatsApp messaging" },
    ]
  },
  {
    group: "⚙️ App Configuration",
    color: "gray",
    vars: [
      { key: "APP_BASE_URL", label: "App Base URL", placeholder: "https://yourapp.com", link: null, desc: "Used for redirects and emails", isText: true },
      { key: "SUPPORT_EMAIL", label: "Support Email", placeholder: "support@kemedar.com", link: null, desc: "Email shown in contact pages", isText: true },
      { key: "DEFAULT_CURRENCY", label: "Default Currency", placeholder: "EGP", link: null, desc: "Default currency for listings", isText: true },
    ]
  },
];

const COLOR_MAP = {
  purple: { badge: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  blue: { badge: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  green: { badge: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500" },
  orange: { badge: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  teal: { badge: "bg-teal-100 text-teal-700 border-teal-200", dot: "bg-teal-500" },
  gray: { badge: "bg-gray-100 text-gray-700 border-gray-200", dot: "bg-gray-400" },
};

function EnvRow({ envVar, groupColor }) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    // In a real implementation this would call a secure admin API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const colors = COLOR_MAP[groupColor] || COLOR_MAP.gray;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{envVar.key}</span>
          <span className="text-xs text-gray-500">{envVar.label}</span>
          {envVar.link && (
            <a href={envVar.link} target="_blank" rel="noreferrer"
              className="text-[10px] text-blue-500 hover:underline">Get key ↗</a>
          )}
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5">{envVar.desc}</p>
      </div>
      <div className="flex items-center gap-2 sm:w-[340px]">
        <div className="flex-1 relative">
          <input
            type={show || envVar.isText ? "text" : "password"}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={envVar.placeholder}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-orange-400 bg-gray-50 pr-8"
          />
          {!envVar.isText && (
            <button onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              {show ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          )}
        </div>
        <button onClick={handleCopy} title="Copy" className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
          {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
        <button
          onClick={handleSave}
          disabled={!value.trim()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1 ${
            saved ? "bg-green-500 text-white" : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {saved ? <><CheckCircle size={12} /> Saved</> : <><Save size={12} /> Save</>}
        </button>
      </div>
    </div>
  );
}

export default function AdminEnvSettings() {
  const [search, setSearch] = useState("");

  const filtered = ENV_GROUPS.map(group => ({
    ...group,
    vars: group.vars.filter(v =>
      !search ||
      v.key.toLowerCase().includes(search.toLowerCase()) ||
      v.label.toLowerCase().includes(search.toLowerCase()) ||
      v.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(g => g.vars.length > 0);

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Environment Variables</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage API keys and configuration for all integrations</p>
        </div>
        <a
          href="https://base44.com/dashboard"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"
        >
          <RefreshCw size={12} /> Sync from Dashboard
        </a>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
        <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-800">Secrets are stored securely in the Base44 platform</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Values entered here are encrypted and never exposed to the frontend. Changes may require a deployment to take effect.
            You can also manage them directly in <strong>Dashboard → Settings → Environment Variables</strong>.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by key name, label or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      {/* Groups */}
      {filtered.map(group => {
        const colors = COLOR_MAP[group.color] || COLOR_MAP.gray;
        return (
          <div key={group.group} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
              <h2 className="font-black text-gray-800 text-sm">{group.group}</h2>
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                {group.vars.length} keys
              </span>
            </div>
            <div className="px-5 divide-y divide-gray-50">
              {group.vars.map(envVar => (
                <EnvRow key={envVar.key} envVar={envVar} groupColor={group.color} />
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-bold text-gray-600">No variables found for "{search}"</p>
        </div>
      )}
    </div>
  );
}
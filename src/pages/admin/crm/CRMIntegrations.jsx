import { useState } from "react";
import {
  CheckCircle, AlertCircle, X, RefreshCw, Eye, EyeOff, Copy, Plus
} from "lucide-react";

// ─── Integration definitions ───────────────────────────────────────────────────
const INTEGRATIONS = [
  {
    id: "whatsapp", name: "WhatsApp Business API", icon: "💬", category: "Messaging",
    description: "Send and receive WhatsApp messages through official WABA provider.",
    fields: [{ key: "provider", label: "Provider", type: "select", options: ["Meta (official)", "Twilio", "360dialog", "Vonage", "MessageBird"] }, { key: "access_token", label: "Access Token", type: "password" }, { key: "phone_number_id", label: "Phone Number ID", type: "text" }, { key: "waba_id", label: "WABA Business ID", type: "text" }],
    status: "not_connected", lastSync: null, lastError: null,
    webhookPath: "/webhooks/crm/whatsapp",
    docs: "https://developers.facebook.com/docs/whatsapp",
  },
  {
    id: "email", name: "Email / SMTP", icon: "📧", category: "Messaging",
    description: "Send transactional and CRM emails via SMTP or provider API.",
    fields: [{ key: "provider", label: "Provider", type: "select", options: ["SMTP", "SendGrid", "Mailgun", "Postmark", "Amazon SES"] }, { key: "api_key", label: "API Key / SMTP Password", type: "password" }, { key: "from_email", label: "From Email", type: "email" }, { key: "from_name", label: "From Name", type: "text" }, { key: "smtp_host", label: "SMTP Host", type: "text" }, { key: "smtp_port", label: "SMTP Port", type: "text" }],
    status: "not_connected", lastSync: null, lastError: null,
    webhookPath: "/webhooks/crm/email",
    docs: null,
  },
  {
    id: "sms", name: "SMS Provider", icon: "📱", category: "Messaging",
    description: "Send SMS messages to contacts via supported providers.",
    fields: [{ key: "provider", label: "Provider", type: "select", options: ["Twilio", "Vonage", "MessageBird", "Bandwidth", "Local Gateway"] }, { key: "account_sid", label: "Account SID / Key", type: "text" }, { key: "auth_token", label: "Auth Token", type: "password" }, { key: "from_number", label: "From Number", type: "text" }],
    status: "not_connected", lastSync: null, lastError: null,
    webhookPath: "/webhooks/crm/sms",
    docs: null,
  },
  {
    id: "telephony", name: "Telephony / Voice", icon: "📞", category: "Voice",
    description: "Connect a telephony provider for click-to-call and AI voice calling.",
    fields: [{ key: "provider", label: "Provider", type: "select", options: ["Twilio", "Vonage", "ElevenLabs + Twilio", "Vapi.ai", "Retell AI", "Bland AI"] }, { key: "account_sid", label: "Account SID", type: "text" }, { key: "auth_token", label: "Auth Token", type: "password" }, { key: "ai_model", label: "AI Voice Model", type: "text" }],
    status: "not_connected", lastSync: null, lastError: null,
    webhookPath: "/webhooks/crm/voice",
    docs: null,
    readinessPhase: true,
  },
  {
    id: "ai_model", name: "AI Model Provider", icon: "🤖", category: "AI",
    description: "Connect an LLM provider for message drafting, summarization, and battlecards.",
    fields: [{ key: "provider", label: "Provider", type: "select", options: ["OpenAI (GPT-4)", "Anthropic (Claude)", "Google Gemini", "Azure OpenAI", "Custom endpoint"] }, { key: "api_key", label: "API Key", type: "password" }, { key: "model_id", label: "Default Model ID", type: "text" }, { key: "max_tokens", label: "Max Tokens", type: "text" }],
    status: "not_connected", lastSync: null, lastError: null,
    webhookPath: null,
    docs: null,
  },
];

const WEBHOOKS = [
  { event: "crm.contact.created", url: "/webhooks/crm/contact-created", enabled: true, lastCalled: "2 hrs ago", secret: "whsec_abc123" },
  { event: "crm.message.status", url: "/webhooks/crm/message-status", enabled: true, lastCalled: "10 min ago", secret: "whsec_def456" },
  { event: "crm.call.completed", url: "/webhooks/crm/call-completed", enabled: true, lastCalled: "1 day ago", secret: "whsec_ghi789" },
  { event: "crm.approval.action", url: "/webhooks/crm/approval-action", enabled: false, lastCalled: null, secret: "whsec_jkl012" },
];

const STATUS_BADGE = {
  connected: "bg-green-100 text-green-700",
  not_connected: "bg-gray-100 text-gray-500",
  error: "bg-red-100 text-red-600",
  partial: "bg-yellow-100 text-yellow-700",
};

// ─── Integration Form ─────────────────────────────────────────────────────────
function IntegrationCard({ integration }) {
  const [expanded, setExpanded] = useState(false);
  const [config, setConfig] = useState({});
  const [showSecrets, setShowSecrets] = useState({});
  const [status, setStatus] = useState(integration.status);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const setField = (k, v) => setConfig(p => ({ ...p, [k]: v }));
  const toggleShowSecret = (k) => setShowSecrets(p => ({ ...p, [k]: !p[k] }));

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult({ ok: false, message: "Provider not configured — placeholder test complete" });
    }, 1500);
  };

  const handleSave = () => {
    setStatus("not_connected");
    setExpanded(false);
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm ${integration.readinessPhase ? "border-purple-200" : "border-gray-100"}`}>
      <div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <span className="text-2xl flex-shrink-0">{integration.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-black text-gray-900">{integration.name}</p>
            {integration.readinessPhase && <span className="text-[9px] bg-purple-100 text-purple-600 font-black px-1.5 py-0.5 rounded-full">READINESS</span>}
          </div>
          <p className="text-[11px] text-gray-500">{integration.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[status]}`}>
            {status === "connected" ? "✅ Connected" : status === "error" ? "✗ Error" : "Not Connected"}
          </span>
          <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {integration.fields.map(field => (
              <div key={field.key}>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">{field.label}</label>
                {field.type === "select" ? (
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none" onChange={e => setField(field.key, e.target.value)}>
                    <option value="">Select...</option>
                    {field.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <div className="relative">
                    <input type={field.type === "password" && !showSecrets[field.key] ? "password" : "text"}
                      placeholder={field.type === "password" ? "••••••••••••" : `Enter ${field.label.toLowerCase()}...`}
                      value={config[field.key] || ""} onChange={e => setField(field.key, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400 pr-8" />
                    {field.type === "password" && (
                      <button onClick={() => toggleShowSecret(field.key)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        {showSecrets[field.key] ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Webhook URL */}
          {integration.webhookPath && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Webhook URL (configure in provider)</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <code className="text-[10px] text-gray-700 flex-1 font-mono truncate">https://app.kemedar.com{integration.webhookPath}</code>
                <button className="text-gray-400 hover:text-violet-600"><Copy size={11} /></button>
              </div>
            </div>
          )}

          {/* Test result */}
          {testResult && (
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${testResult.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}>
              {testResult.ok ? <CheckCircle size={13} /> : <AlertCircle size={13} />} {testResult.message}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button onClick={handleTest} disabled={testing}
              className={`flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs ${testing ? "opacity-60" : "hover:bg-gray-50"}`}>
              <RefreshCw size={11} className={testing ? "animate-spin" : ""} /> {testing ? "Testing..." : "Test Connection"}
            </button>
            <button onClick={handleSave} className="bg-violet-600 text-white font-black px-4 py-2 rounded-lg text-xs hover:bg-violet-700">Save Settings</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CRMIntegrations() {
  const [showSecretIdx, setShowSecretIdx] = useState(null);

  const baseUrl = "https://app.kemedar.com";
  const apiKey = "crm_sk_live_••••••••••••••••••••••••";

  const byCategory = INTEGRATIONS.reduce((acc, i) => { if (!acc[i.category]) acc[i.category] = []; acc[i.category].push(i); return acc; }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">CRM Integrations</h1>
        <p className="text-gray-500 text-sm">Configure communication providers, AI models, and webhooks</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
        ℹ️ Integrations degrade gracefully — if a provider is not configured, actions will be queued and flagged. All integrations are adapter-based and can be swapped without code changes.
      </div>

      {/* Integration categories */}
      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category}>
          <h2 className="text-sm font-black text-gray-700 mb-3 border-l-4 border-violet-500 pl-3">{category}</h2>
          <div className="space-y-3">
            {items.map(integration => <IntegrationCard key={integration.id} integration={integration} />)}
          </div>
        </div>
      ))}

      {/* Webhooks section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-gray-700 border-l-4 border-violet-500 pl-3">Outbound Webhooks</h2>
          <button className="flex items-center gap-1 text-xs font-bold text-violet-600 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-50"><Plus size={11} /> Add Webhook</button>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Event", "URL", "Status", "Last Called", "Secret", ""].map(h => <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {WEBHOOKS.map((wh, i) => (
                <tr key={wh.event} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 font-mono font-bold text-gray-700 text-[10px]">{wh.event}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px] text-gray-500">{baseUrl}{wh.url}</td>
                  <td className="px-3 py-2.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${wh.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{wh.enabled ? "Active" : "Disabled"}</span></td>
                  <td className="px-3 py-2.5 text-gray-400">{wh.lastCalled || "Never"}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <code className="text-[10px] font-mono text-gray-500">{showSecretIdx === i ? wh.secret : "whsec_••••••"}</code>
                      <button onClick={() => setShowSecretIdx(showSecretIdx === i ? null : i)} className="text-gray-300 hover:text-gray-600">
                        {showSecretIdx === i ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>
                      <button className="text-gray-300 hover:text-gray-600"><Copy size={11} /></button>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button className="text-[10px] border border-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-50">Edit</button>
                      <button className="text-[10px] border border-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-50">Test</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Keys */}
      <div>
        <h2 className="text-sm font-black text-gray-700 border-l-4 border-violet-500 pl-3 mb-3">API Access</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-2">CRM API Base URL</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <code className="text-xs font-mono text-gray-700 flex-1">{baseUrl}/api/crm/v1</code>
              <button className="text-gray-400 hover:text-violet-600"><Copy size={12} /></button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-2">API Key</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <code className="text-xs font-mono text-gray-700 flex-1">{apiKey}</code>
              <button className="text-gray-400 hover:text-violet-600"><Copy size={12} /></button>
              <button className="text-xs text-red-500 font-bold border border-red-200 px-2 py-1 rounded hover:bg-red-50">Rotate</button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Keep this key secret. Rotate if compromised.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
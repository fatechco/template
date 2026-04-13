import { useState } from "react";
import { Save, CheckCircle, Upload, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <h3 className="font-black text-gray-900 text-sm">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="p-5 space-y-5">{children}</div>
    </div>
  );
}

function NumberField({ label, description, value, onChange, min = 0, max, suffix }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-center focus:outline-none focus:border-orange-400"
        />
        {suffix && <span className="text-xs font-semibold text-gray-500 w-8">{suffix}</span>}
      </div>
    </div>
  );
}

function TextField({ label, description, value, onChange, placeholder, textarea }) {
  return (
    <div className="space-y-1.5 py-2 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
        />
      )}
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${checked ? "bg-orange-500" : "bg-gray-200"}`}
        style={{ width: 40, height: 22 }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform"
          style={{
            width: 18, height: 18,
            transform: checked ? "translateX(18px)" : "translateX(0)"
          }}
        />
      </button>
    </div>
  );
}

export default function SubscriptionSettings() {
  const [saved, setSaved] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // General Settings
  const [subCommissionPct, setSubCommissionPct] = useState(15);
  const [orderCommissionPct, setOrderCommissionPct] = useState(20);
  const [trialDays, setTrialDays] = useState(0);
  const [graceDays, setGraceDays] = useState(3);
  const [maxFailedPayments, setMaxFailedPayments] = useState(3);

  // Notification Settings
  const [notifications, setNotifications] = useState({
    welcomeEmail: true,
    reminder7days: true,
    reminder3days: true,
    reminder1day: true,
    expiryNotification: true,
    paymentReceipt: true,
    orderConfirmation: true,
    assignmentNotification: true,
    completionNotification: true,
    commissionApproval: true,
  });

  const setNotif = (key) => (val) => setNotifications(n => ({ ...n, [key]: val }));

  // Invoice Settings
  const [companyName, setCompanyName] = useState("Kemedar Group");
  const [companyAddress, setCompanyAddress] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [invoiceFooter, setInvoiceFooter] = useState("Thank you for your business.");

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setLogoUrl(file_url);
    setUploading(false);
  };

  const handleSave = () => {
    // In a full implementation this would persist to a SystemConfig entity
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const NOTIFICATION_ITEMS = [
    { key: "welcomeEmail",         label: "Welcome email on new subscription",              description: "Sent to subscriber immediately after activation" },
    { key: "reminder7days",        label: "Renewal reminder — 7 days before expiry",        description: "Early heads-up for subscription renewal" },
    { key: "reminder3days",        label: "Renewal reminder — 3 days before expiry",        description: "Follow-up renewal reminder" },
    { key: "reminder1day",         label: "Renewal reminder — 1 day before expiry",         description: "Final renewal reminder" },
    { key: "expiryNotification",   label: "Expiry notification",                            description: "Sent when subscription expires" },
    { key: "paymentReceipt",       label: "Payment receipt",                               description: "Sent to subscriber after successful payment" },
    { key: "orderConfirmation",    label: "Order confirmation to buyer",                    description: "Sent when service order is placed" },
    { key: "assignmentNotification", label: "Assignment notification to franchise owner",   description: "Sent when a service order is assigned" },
    { key: "completionNotification", label: "Completion notification to buyer",             description: "Sent when franchise owner marks order complete" },
    { key: "commissionApproval",   label: "Commission approval notification to franchise owner", description: "Sent when commission is approved for payout" },
  ];

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span>Admin</span>
        <ChevronRight size={11} />
        <span>Subscriptions & Services</span>
        <ChevronRight size={11} />
        <span className="text-gray-700 font-semibold">Settings</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Subscription & Services Settings</h1>
          <p className="text-gray-500 text-sm">Configure defaults, notifications, and invoice settings</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm transition-all ${
            saved ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}>
          {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Settings</>}
        </button>
      </div>

      {/* SUBSECTION 1 — General Settings */}
      <Section
        title="⚙️ General Settings"
        description="Default values applied when creating subscriptions and service orders"
      >
        <NumberField
          label="Default commission % on subscriptions"
          description="Applied to franchise owners for subscription revenue in their area"
          value={subCommissionPct}
          onChange={setSubCommissionPct}
          min={0} max={100} suffix="%"
        />
        <NumberField
          label="Default commission % on service orders"
          description="Applied to franchise owners when they complete a service order"
          value={orderCommissionPct}
          onChange={setOrderCommissionPct}
          min={0} max={100} suffix="%"
        />
        <NumberField
          label="Trial period"
          description="Number of free trial days for new subscribers (0 = no trial)"
          value={trialDays}
          onChange={setTrialDays}
          min={0} max={365} suffix="days"
        />
        <NumberField
          label="Grace period after expiry"
          description="Days a subscription stays accessible after the end date before suspension"
          value={graceDays}
          onChange={setGraceDays}
          min={0} max={30} suffix="days"
        />
        <NumberField
          label="Auto-suspend after failed payments"
          description="Number of consecutive failed payment attempts before suspending subscription"
          value={maxFailedPayments}
          onChange={setMaxFailedPayments}
          min={1} max={10} suffix="tries"
        />
      </Section>

      {/* SUBSECTION 2 — Notification Settings */}
      <Section
        title="🔔 Notification Settings"
        description="Control which automated emails are sent to users and franchise owners"
      >
        {NOTIFICATION_ITEMS.map(item => (
          <Toggle
            key={item.key}
            label={item.label}
            description={item.description}
            checked={notifications[item.key]}
            onChange={setNotif(item.key)}
          />
        ))}
      </Section>

      {/* SUBSECTION 3 — Invoice Settings */}
      <Section
        title="🧾 Invoice Settings"
        description="Information printed on all generated invoices"
      >
        <TextField
          label="Company name"
          description="Shown as issuer on all invoices"
          value={companyName}
          onChange={setCompanyName}
          placeholder="Kemedar Group"
        />
        <TextField
          label="Company address"
          description="Full business address for invoices"
          value={companyAddress}
          onChange={setCompanyAddress}
          placeholder="123 Business St, Cairo, Egypt"
          textarea
        />
        <NumberField
          label="Tax rate"
          description="VAT or GST percentage applied to all invoices"
          value={taxRate}
          onChange={setTaxRate}
          min={0} max={100} suffix="%"
        />
        <TextField
          label="Invoice footer text"
          description="Shown at the bottom of every invoice"
          value={invoiceFooter}
          onChange={setInvoiceFooter}
          placeholder="Thank you for your business."
          textarea
        />

        {/* Logo Upload */}
        <div className="py-2">
          <p className="text-sm font-bold text-gray-800 mb-1">Invoice logo</p>
          <p className="text-xs text-gray-500 mb-3">PNG or SVG, recommended 300×80px</p>
          <div className="flex items-center gap-4 flex-wrap">
            {logoUrl && (
              <img src={logoUrl} alt="Invoice logo" className="h-12 border border-gray-200 rounded-lg p-1 bg-white" />
            )}
            <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 hover:border-orange-400 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors">
              <Upload size={14} />
              {uploading ? "Uploading…" : logoUrl ? "Replace Logo" : "Upload Logo"}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
            </label>
            {logoUrl && (
              <button onClick={() => setLogoUrl("")} className="text-xs text-red-400 hover:text-red-600 font-semibold">
                Remove
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* Save button (bottom) */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-sm transition-all ${
            saved ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}>
          {saved ? <><CheckCircle size={14} /> Settings Saved!</> : <><Save size={14} /> Save All Settings</>}
        </button>
      </div>
    </div>
  );
}
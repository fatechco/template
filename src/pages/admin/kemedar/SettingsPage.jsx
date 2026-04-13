import { useState } from "react";
import GeneralSettings from "@/components/admin/kemedar/settings/GeneralSettings";
import SEOSettings from "@/components/admin/kemedar/settings/SEOSettings";
import EmailSettings from "@/components/admin/kemedar/settings/EmailSettings";
import IntegrationsSettings from "@/components/admin/kemedar/settings/IntegrationsSettings";
import SecuritySettings from "@/components/admin/kemedar/settings/SecuritySettings";

const SETTINGS_TABS = [
  { id: "general", label: "General", icon: "⚙️" },
  { id: "seo", label: "SEO", icon: "🔍" },
  { id: "email", label: "Email", icon: "📧" },
  { id: "integrations", label: "Integrations", icon: "🔗" },
  { id: "security", label: "Security", icon: "🔒" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "seo":
        return <SEOSettings />;
      case "email":
        return <EmailSettings />;
      case "integrations":
        return <IntegrationsSettings />;
      case "security":
        return <SecuritySettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Manage platform configuration and integrations</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 overflow-x-auto">
        <div className="flex gap-2">
          {SETTINGS_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTab()}
    </div>
  );
}
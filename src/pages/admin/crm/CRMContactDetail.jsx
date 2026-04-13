import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Phone, MessageCircle, Mail, Pencil, Plus, ChevronLeft, ChevronRight,
  CheckCircle, Clock, AlertCircle, Star, Bot, Users, Building2,
  FileText, BarChart3, Shield, Tag, X, Download, Eye, Send
} from "lucide-react";
import ContactHeader from "@/components/crm/ContactHeader";
import ContactOverviewTab from "@/components/crm/ContactOverviewTab";
import ContactTimelineTab from "@/components/crm/ContactTimelineTab";
import ContactTasksTab from "@/components/crm/ContactTasksTab";
import ContactOpportunitiesTab from "@/components/crm/ContactOpportunitiesTab";
import ContactRelatedTab from "@/components/crm/ContactRelatedTab";
import ContactDocumentsTab from "@/components/crm/ContactDocumentsTab";
import ContactAITab from "@/components/crm/ContactAITab";
import ContactAuditTab from "@/components/crm/ContactAuditTab";

// ─── Mock contact data ────────────────────────────────────────────────────────
// Generate fallback for any unknown ID
const generateFallbackContact = (id) => ({
  id, displayName: `Contact ${id}`, firstName: "Contact", lastName: id,
  phone: "+20 100 000 0000", email: `contact-${id}@example.com`,
  whatsapp: "+20 100 000 0000", avatarUrl: null,
  primaryRole: "lead", secondaryRoles: [],
  accountName: null, accountId: null,
  owner: "Unassigned", teamId: "sales",
  lifecycleStage: "lead", status: "new", priority: "medium",
  score: 0, aiScore: 0,
  preferredLanguage: "ar", preferredChannel: "whatsapp",
  consentMarketing: false, consentCommunication: false, consentDataStorage: false,
  city: "Cairo", country: "Egypt",
  source: "manual", sourceDetail: null,
  lastActivityAt: "Never", lastContactedAt: "Never", nextFollowupAt: null,
  tags: [], notes: "", isArchived: false, userId: null, createdAt: "Unknown",
});

const MOCK_CONTACTS = {
  c1: {
    id: "c1", displayName: "Ahmed Hassan", firstName: "Ahmed", lastName: "Hassan",
    phone: "+20 100 123 4567", email: "ahmed.hassan@example.com",
    whatsapp: "+20 100 123 4567", avatarUrl: null,
    primaryRole: "agent", secondaryRoles: ["buyer"],
    accountName: "Elite Realty", accountId: "acc1",
    owner: "You", teamId: "sales",
    lifecycleStage: "active", status: "in_progress", priority: "high",
    score: 78, aiScore: 82,
    preferredLanguage: "ar", preferredChannel: "whatsapp",
    consentMarketing: true, consentCommunication: true, consentDataStorage: true,
    city: "New Cairo", country: "Egypt",
    source: "scraped", sourceDetail: "Aqarmap",
    lastActivityAt: "2 hours ago", lastContactedAt: "1 day ago",
    nextFollowupAt: "Tomorrow 10:00",
    tags: ["vip", "warm"],
    notes: "Very interested in upgrading plan. Prefers morning calls.",
    isArchived: false,
    userId: "user123",
    createdAt: "2026-01-15",
    // Agent-specific
    agentData: {
      profileCompleteness: 72,
      verificationStatus: "verified",
      serviceAreas: ["New Cairo", "5th Settlement"],
      totalListings: 18,
      activeListings: 12,
      draftListings: 3,
      expiredListings: 3,
      responseRate: "84%",
      lastPlatformActivity: "2 hours ago",
      plan: "Pro",
      renewalDate: "2026-05-01",
      paymentStatus: "paid",
      boostedListings: 4,
      recentLeads: 7,
    }
  },
  c2: {
    id: "c2", displayName: "Sara Mohamed", firstName: "Sara", lastName: "Mohamed",
    phone: "+20 110 987 6543", email: "sara@palmhills.com",
    whatsapp: "+20 110 987 6543", avatarUrl: null,
    primaryRole: "developer", secondaryRoles: [],
    accountName: "Palm Hills Dev", accountId: "acc2",
    owner: "Adel M.", teamId: "sales",
    lifecycleStage: "active", status: "in_progress", priority: "high",
    score: 91, aiScore: 88,
    preferredLanguage: "en", preferredChannel: "email",
    consentMarketing: true, consentCommunication: true, consentDataStorage: true,
    city: "Sheikh Zayed", country: "Egypt",
    source: "self_registered", sourceDetail: null,
    lastActivityAt: "1 day ago", lastContactedAt: "3 days ago",
    nextFollowupAt: "Overdue",
    tags: ["enterprise"],
    notes: "Key account. Renewal coming up in 3 months.",
    isArchived: false,
    userId: "user456",
    createdAt: "2025-09-10",
    developerData: {
      companyName: "Palm Hills Developments",
      activeProjects: 4,
      inventoryCount: 480,
      inventoryFreshness: "Good",
      contractStatus: "active",
      renewalDate: "2026-07-01",
      accountHealth: 88,
      campaigns: 2,
    }
  }
};

const FALLBACK_CONTACT = {
  id: "cx", displayName: "Contact Not Found", firstName: "Unknown", lastName: "",
  phone: "—", email: "—", whatsapp: "—", avatarUrl: null,
  primaryRole: "lead", secondaryRoles: [],
  accountName: null, owner: "—", lifecycleStage: "lead", status: "new",
  priority: "medium", score: 0, aiScore: 0,
  preferredLanguage: "ar", preferredChannel: "whatsapp",
  consentMarketing: false, consentCommunication: false, consentDataStorage: false,
  city: "—", country: "—", source: "manual", sourceDetail: null,
  lastActivityAt: "—", lastContactedAt: "—", nextFollowupAt: null,
  tags: [], notes: "", isArchived: false, userId: null, createdAt: "—",
};

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "tasks", label: "Tasks", icon: CheckCircle },
  { id: "opportunities", label: "Opportunities", icon: Star },
  { id: "related", label: "Related Records", icon: FileText },
  { id: "documents", label: "Documents", icon: Download },
  { id: "ai", label: "AI Insights", icon: Bot },
  { id: "audit", label: "Audit Log", icon: Shield },
];

export default function CRMContactDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [openForm, setOpenForm] = useState(null); // "note" | "task" | "opportunity"
  const contact = MOCK_CONTACTS[id] || generateFallbackContact(id);

  const handleAction = (action) => {
    if (action === "note") { setActiveTab("timeline"); setOpenForm("note"); }
    else if (action === "task") { setActiveTab("tasks"); setOpenForm("task"); }
    else if (action === "opportunity") { setActiveTab("opportunities"); setOpenForm("opportunity"); }
  };

  // Clear openForm after tab switch so it doesn't re-trigger
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== "timeline" && tab !== "tasks" && tab !== "opportunities") setOpenForm(null);
  };

  return (
    <div className="space-y-0">
      {/* Back */}
      <div className="mb-4">
        <Link to="/admin/crm/contacts" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-600 font-semibold">
          <ChevronLeft size={14} /> Back to Contacts
        </Link>
      </div>

      {/* Header */}
      <ContactHeader contact={contact} onAction={handleAction} />

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 bg-white mt-5 overflow-x-auto no-scrollbar">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"
              }`}>
              <Icon size={12} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-5">
        {activeTab === "overview" && <ContactOverviewTab contact={contact} onAction={handleAction} />}
        {activeTab === "timeline" && <ContactTimelineTab contact={contact} autoOpenNote={openForm === "note"} onFormOpened={() => setOpenForm(null)} />}
        {activeTab === "tasks" && <ContactTasksTab contact={contact} autoOpenCreate={openForm === "task"} onFormOpened={() => setOpenForm(null)} />}
        {activeTab === "opportunities" && <ContactOpportunitiesTab contact={contact} autoOpenCreate={openForm === "opportunity"} onFormOpened={() => setOpenForm(null)} />}
        {activeTab === "related" && <ContactRelatedTab contact={contact} />}
        {activeTab === "documents" && <ContactDocumentsTab contact={contact} />}
        {activeTab === "ai" && <ContactAITab contact={contact} />}
        {activeTab === "audit" && <ContactAuditTab contact={contact} />}
      </div>
    </div>
  );
}
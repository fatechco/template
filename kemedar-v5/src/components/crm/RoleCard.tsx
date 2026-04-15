// @ts-nocheck
// Dynamic role-specific data card for Contact 360

const SECTION = ({ title, children }) => (
  <div className="mb-4 last:mb-0">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-2">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

const Row = ({ label, value, badge, color }) => (
  <div className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-500 flex-shrink-0 w-36">{label}</span>
    {badge
      ? <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color || "bg-gray-100 text-gray-600"}`}>{value}</span>
      : <span className="text-xs font-semibold text-gray-800 text-right">{value || <span className="text-gray-300">—</span>}</span>}
  </div>
);

function AgentCard({ data }) {
  return (
    <>
      <SECTION title="Profile & Verification">
        <Row label="Verification" value={data.verificationStatus} badge color={data.verificationStatus === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} />
        <Row label="Profile Complete" value={`${data.profileCompleteness}%`} />
        <Row label="Service Areas" value={data.serviceAreas.join(", ")} />
      </SECTION>
      <SECTION title="Listings Activity">
        <Row label="Total Listings" value={data.totalListings} />
        <Row label="Active" value={data.activeListings} badge color="bg-green-100 text-green-700" />
        <Row label="Draft" value={data.draftListings} badge color="bg-gray-100 text-gray-600" />
        <Row label="Expired" value={data.expiredListings} badge color="bg-red-100 text-red-600" />
        <Row label="Boosted" value={data.boostedListings} />
        <Row label="Recent Leads" value={data.recentLeads} />
        <Row label="Response Rate" value={data.responseRate} />
      </SECTION>
      <SECTION title="Commercial">
        <Row label="Plan" value={data.plan} badge color="bg-blue-100 text-blue-700" />
        <Row label="Renewal Date" value={data.renewalDate} />
        <Row label="Payment Status" value={data.paymentStatus} badge color={data.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"} />
        <Row label="Last Active" value={data.lastPlatformActivity} />
      </SECTION>
    </>
  );
}

function AgencyCard({ data }) {
  return (
    <>
      <SECTION title="Company Info">
        <Row label="Agency Name" value={data.agencyName} />
        <Row label="Role in Company" value={data.roleInCompany} />
        <Row label="Branch / Office" value={data.branch} />
      </SECTION>
      <SECTION title="Inventory & Team">
        <Row label="Company Listings" value={data.companyListings} />
        <Row label="Teammates" value={data.teammates} />
        <Row label="Contract Status" value={data.contractStatus} badge color="bg-teal-100 text-teal-700" />
        <Row label="Package" value={data.packageName} />
      </SECTION>
    </>
  );
}

function DeveloperCard({ data }) {
  return (
    <>
      <SECTION title="Company">
        <Row label="Company" value={data.companyName} />
        <Row label="Contract" value={data.contractStatus} badge color={data.contractStatus === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"} />
        <Row label="Account Health" value={`${data.accountHealth}%`} />
      </SECTION>
      <SECTION title="Projects & Inventory">
        <Row label="Active Projects" value={data.activeProjects} badge color="bg-purple-100 text-purple-700" />
        <Row label="Total Inventory" value={data.inventoryCount} />
        <Row label="Freshness" value={data.inventoryFreshness} badge color={data.inventoryFreshness === "Good" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} />
        <Row label="Active Campaigns" value={data.campaigns} />
        <Row label="Renewal Date" value={data.renewalDate} />
      </SECTION>
    </>
  );
}

function OwnerCard({ data }) {
  return (
    <>
      <SECTION title="Properties">
        <Row label="Total Properties" value={data.totalProperties} />
        <Row label="Listed" value={data.listedProperties} badge color="bg-green-100 text-green-700" />
        <Row label="Unlisted" value={data.unlistedProperties} badge color="bg-gray-100 text-gray-500" />
        <Row label="Listing Readiness" value={data.listingReadiness} />
        <Row label="Docs Complete" value={data.docsComplete} badge color={data.docsComplete === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"} />
      </SECTION>
      <SECTION title="Sales Activity">
        <Row label="Recent Inquiries" value={data.recentInquiries} />
        <Row label="Last Viewing" value={data.lastViewing} />
        <Row label="Activation Status" value={data.activationStatus} badge />
      </SECTION>
    </>
  );
}

function BuyerCard({ data }) {
  return (
    <>
      <SECTION title="Requirements">
        <Row label="Budget Range" value={data.budgetRange} />
        <Row label="Preferred Areas" value={data.preferredAreas.join(", ")} />
        <Row label="Property Type" value={data.propertyType} />
        <Row label="Urgency Score" value={`${data.urgencyScore}/10`} />
      </SECTION>
      <SECTION title="Activity">
        <Row label="Total Inquiries" value={data.inquiryCount} />
        <Row label="Saved Properties" value={data.savedProperties} />
        <Row label="Viewed Properties" value={data.viewedProperties} />
        <Row label="Financing" value={data.financing} badge />
      </SECTION>
    </>
  );
}

function TenantCard({ data }) {
  return (
    <>
      <SECTION title="Requirements">
        <Row label="Rental Budget" value={data.rentalBudget} />
        <Row label="Move Date" value={data.moveDate} />
        <Row label="Preferred Areas" value={data.preferredAreas.join(", ")} />
        <Row label="Urgency Score" value={`${data.urgencyScore}/10`} />
      </SECTION>
      <SECTION title="Activity">
        <Row label="Viewings" value={data.viewings} />
        <Row label="Requirements" value={data.requirements} />
      </SECTION>
    </>
  );
}

function ProspectCard({ data }) {
  return (
    <>
      <SECTION title="Qualification">
        <Row label="Source" value={data.source} />
        <Row label="First Touch" value={data.firstTouch} />
        <Row label="Contact Attempts" value={data.contactAttempts} />
        <Row label="Last Response" value={data.lastResponse} />
        <Row label="Qualification" value={data.qualificationStatus} badge
          color={data.qualificationStatus === "Qualified" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"} />
        <Row label="Not Converted Reason" value={data.notConvertedReason} />
      </SECTION>
    </>
  );
}

function ProfessionalCard({ data }) {
  return (
    <>
      <SECTION title="Services">
        <Row label="Category" value={data.category} />
        <Row label="Coverage" value={data.areaCoverage.join(", ")} />
        <Row label="Total Services" value={data.servicesCount} />
        <Row label="Orders" value={data.ordersCount} />
        <Row label="Rating" value={`⭐ ${data.rating}/5`} />
        <Row label="SLA Performance" value={data.slaPerformance} badge color="bg-teal-100 text-teal-700" />
        <Row label="Contract Status" value={data.contractStatus} />
      </SECTION>
    </>
  );
}

// ─── Fallback mock data per role ──────────────────────────────────────────────
const ROLE_FALLBACK_DATA = {
  agent: {
    profileCompleteness: 72, verificationStatus: "verified",
    serviceAreas: ["New Cairo", "5th Settlement"], totalListings: 18,
    activeListings: 12, draftListings: 3, expiredListings: 3,
    responseRate: "84%", lastPlatformActivity: "2 hours ago",
    plan: "Pro", renewalDate: "2026-05-01", paymentStatus: "paid",
    boostedListings: 4, recentLeads: 7,
  },
  agency: {
    agencyName: "Elite Realty", roleInCompany: "Branch Manager",
    branch: "New Cairo Branch", companyListings: 48, teammates: 6,
    contractStatus: "Active", packageName: "Business Annual",
  },
  developer: {
    companyName: "Cairo Dev Corp", activeProjects: 3, inventoryCount: 240,
    inventoryFreshness: "Good", contractStatus: "active",
    renewalDate: "2026-08-01", accountHealth: 81, campaigns: 1,
  },
  lead: {
    totalProperties: 4, listedProperties: 2, unlistedProperties: 2,
    listingReadiness: "Medium", docsComplete: "No",
    recentInquiries: 3, lastViewing: "1 week ago", activationStatus: "Pending",
  },
  buyer: {
    budgetRange: "EGP 2–3M", preferredAreas: ["New Cairo", "5th Settlement"],
    propertyType: "Apartment", urgencyScore: 7,
    inquiryCount: 12, savedProperties: 8, viewedProperties: 24, financing: "Cash",
  },
  common_user: {
    rentalBudget: "EGP 10K/mo", moveDate: "June 2026",
    preferredAreas: ["Maadi", "Zamalek"], urgencyScore: 5,
    viewings: 4, requirements: "3 bedrooms, elevator, parking",
  },
  professional: {
    category: "Electrical Services", areaCoverage: ["Cairo", "Giza"],
    servicesCount: 8, ordersCount: 34, rating: 4.6,
    slaPerformance: "Excellent", contractStatus: "Active",
  },
  prospect: {
    source: "Aqarmap Import", firstTouch: "Mar 15, 2026",
    contactAttempts: 3, lastResponse: "No answer",
    qualificationStatus: "Unqualified", notConvertedReason: "No response",
  },
};

const ROLE_CONFIG = {
  agent: { label: "🏠 Agent Profile", color: "border-blue-200 bg-blue-50/30", component: AgentCard },
  agency: { label: "🏢 Agency Staff", color: "border-indigo-200 bg-indigo-50/30", component: AgencyCard },
  developer: { label: "🏗 Developer Account", color: "border-purple-200 bg-purple-50/30", component: DeveloperCard },
  lead: { label: "🔑 Property Owner", color: "border-orange-200 bg-orange-50/30", component: OwnerCard },
  buyer: { label: "🔍 Buyer Profile", color: "border-green-200 bg-green-50/30", component: BuyerCard },
  common_user: { label: "🏠 Tenant Profile", color: "border-teal-200 bg-teal-50/30", component: TenantCard },
  professional: { label: "🔧 Professional", color: "border-teal-200 bg-teal-50/30", component: ProfessionalCard },
  prospect: { label: "🎯 Prospect", color: "border-gray-200 bg-gray-50/30", component: ProspectCard },
};

export default function RoleCard({ contact }) {
  const role = contact.primaryRole;
  const config = ROLE_CONFIG[role] || ROLE_CONFIG["prospect"];
  const RoleComponent = config.component;
  // Use actual data from contact if available, else fallback mock
  const roleKey = `${role}Data`;
  const data = contact[roleKey] || ROLE_FALLBACK_DATA[role] || {};

  return (
    <div className={`rounded-xl border p-5 ${config.color}`}>
      <h3 className="text-sm font-black text-gray-900 mb-4">{config.label}</h3>
      <RoleComponent data={data} />
    </div>
  );
}
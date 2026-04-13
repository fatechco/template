import { MessageCircle, User } from "lucide-react";

const MOCK_AGENCIES = [
  { id: 1, name: "Kemedar Realty Group", properties: 120, agents: 14, color: "#FF6B00", initials: "KR" },
  { id: 2, name: "Elite Properties", properties: 85, agents: 9, color: "#3B82F6", initials: "EP" },
  { id: 3, name: "Prime Homes Egypt", properties: 63, agents: 7, color: "#10B981", initials: "PH" },
  { id: 4, name: "Delta Real Estate", properties: 47, agents: 5, color: "#8B5CF6", initials: "DR" },
];

function AgencyCard({ agency }) {
  return (
    <div
      className="flex-shrink-0 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden"
      style={{ width: "72vw", maxWidth: 260 }}
    >
      {/* Banner */}
      <div
        className="flex items-center justify-center"
        style={{ height: 80, backgroundColor: agency.color + "18" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow"
          style={{ backgroundColor: agency.color }}
        >
          {agency.initials}
        </div>
      </div>
      <div className="p-3">
        <p className="font-black text-[#1F2937] text-sm">{agency.name}</p>
        <p className="text-[#6B7280] text-xs mt-0.5">
          {agency.properties} Properties · {agency.agents} Agents
        </p>
        <div className="flex gap-2 mt-3">
          <button
            className="flex-1 flex items-center justify-center gap-1 bg-orange-50 text-[#FF6B00] text-xs font-bold rounded-xl border border-orange-100"
            style={{ minHeight: 36 }}
          >
            <MessageCircle size={13} /> Chat
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1 bg-[#F8FAFC] text-[#6B7280] text-xs font-bold rounded-xl border border-[#E5E7EB]"
            style={{ minHeight: 36 }}
          >
            <User size={13} /> Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MobileFeaturedAgencies() {
  return (
    <div className="mb-6">
      <div className="px-4 flex items-center justify-between mb-3">
        <span className="text-[#1F2937] font-black text-base">Top Agencies</span>
        <button className="text-[#FF6B00] text-sm font-semibold">View All →</button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {MOCK_AGENCIES.map((a) => (
          <AgencyCard key={a.id} agency={a} />
        ))}
      </div>
    </div>
  );
}
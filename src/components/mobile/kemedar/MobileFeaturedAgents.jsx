import { MessageCircle, User } from "lucide-react";

const MOCK_AGENTS = [
  { id: 1, name: "Ahmed Hassan", properties: 34, rating: 4.9, avatar: "AH", color: "#FF6B00" },
  { id: 2, name: "Sara Mostafa", properties: 21, rating: 4.8, avatar: "SM", color: "#3B82F6" },
  { id: 3, name: "Omar Khalil", properties: 18, rating: 4.7, avatar: "OK", color: "#10B981" },
  { id: 4, name: "Nadia Farouk", properties: 45, rating: 5.0, avatar: "NF", color: "#8B5CF6" },
];

function AgentCard({ agent }) {
  return (
    <div
      className="flex-shrink-0 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 flex flex-col items-center"
      style={{ width: 150 }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-black shadow-md mb-2"
        style={{ backgroundColor: agent.color }}
      >
        {agent.avatar}
      </div>
      <p className="font-black text-[#1F2937] text-xs text-center">{agent.name}</p>
      <span className="text-[10px] bg-orange-50 text-[#FF6B00] font-bold px-2 py-0.5 rounded-full mt-1 border border-orange-100">
        {agent.properties} Properties
      </span>
      <p className="text-[10px] text-[#6B7280] mt-1">⭐ {agent.rating}</p>
      <div className="flex gap-2 mt-3 w-full">
        <button
          className="flex-1 flex items-center justify-center gap-1 bg-orange-50 text-[#FF6B00] text-[10px] font-bold rounded-lg border border-orange-100"
          style={{ minHeight: 32 }}
        >
          <MessageCircle size={11} /> Chat
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-1 bg-[#F8FAFC] text-[#6B7280] text-[10px] font-bold rounded-lg border border-[#E5E7EB]"
          style={{ minHeight: 32 }}
        >
          <User size={11} /> Profile
        </button>
      </div>
    </div>
  );
}

export default function MobileFeaturedAgents() {
  return (
    <div className="mb-6">
      <div className="px-4 flex items-center justify-between mb-3">
        <span className="text-[#1F2937] font-black text-base">Top Agents</span>
        <button className="text-[#FF6B00] text-sm font-semibold">View All →</button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {MOCK_AGENTS.map((a) => (
          <AgentCard key={a.id} agent={a} />
        ))}
      </div>
    </div>
  );
}
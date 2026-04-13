import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X } from "lucide-react";

const AGENTS = [
  { id: 1, name: "Ahmed Hassan", listings: 12, views: 1200, rating: 4.8, status: "active" },
  { id: 2, name: "Sara Mohamed", listings: 8, views: 950, rating: 4.6, status: "active" },
  { id: 3, name: "Karim Ali", listings: 15, views: 1450, rating: 4.9, status: "active" },
  { id: 4, name: "Fatima Khalil", listings: 6, views: 520, rating: 4.4, status: "active" },
  { id: 5, name: "Hassan Ibrahim", listings: 10, views: 890, rating: 4.7, status: "inactive" },
];

const AGENT_STATUSES = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "top", label: "Top Performers" },
];

export default function AgencyMyAgentsPage() {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState("all");
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", phone: "" });

  const filteredAgents = AGENTS.filter(agent => {
    if (activeStatus === "all") return true;
    if (activeStatus === "active") return agent.status === "active";
    if (activeStatus === "top") return agent.rating >= 4.7;
    return true;
  });

  const handleInvite = () => {
    console.log("Invite sent:", inviteForm);
    setShowInviteSheet(false);
    setInviteForm({ name: "", email: "", phone: "" });
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">My Agents</h1>
        <button onClick={() => setShowInviteSheet(true)} className="ml-auto text-purple-600 hover:bg-purple-50 p-2 rounded-lg">
          <Plus size={20} />
        </button>
      </div>

      {/* Status Filters */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {AGENT_STATUSES.map(status => (
          <button
            key={status.id}
            onClick={() => setActiveStatus(status.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeStatus === status.id
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Agent Cards */}
      <div className="px-4 py-4 pb-24 space-y-2">
        {filteredAgents.map(agent => (
          <button
            key={agent.id}
            onClick={() => navigate(`/m/dashboard/my-agents/${agent.id}`)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3 hover:bg-gray-50 text-left"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center text-lg flex-shrink-0 relative">
              👤
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  agent.status === "active" ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900">{agent.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {agent.listings} listings • {agent.views} views
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-orange-600">⭐ {agent.rating}</span>
              </div>
            </div>

            {/* Badge */}
            <div className="flex-shrink-0 text-right">
              <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold ${
                agent.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {agent.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Invite Agent Sheet */}
      {showInviteSheet && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-gray-900">Invite New Agent</h2>
              <button onClick={() => setShowInviteSheet(false)} className="text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 pb-6">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Agent name"
                  value={inviteForm.name}
                  onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="agent@example.com"
                  value={inviteForm.email}
                  onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+201234567890"
                  value={inviteForm.phone}
                  onChange={e => setInviteForm({ ...inviteForm, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-800">
                  An invitation will be sent to the agent's email. They can accept and join your agency.
                </p>
              </div>

              <button
                onClick={handleInvite}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg mt-4"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Plus, X, MessageCircle, Eye, Star, Home, Users, TrendingUp } from "lucide-react";

const PERF_BADGES = {
  Top: "bg-yellow-100 text-yellow-700",
  Active: "bg-green-100 text-green-700",
  New: "bg-blue-100 text-blue-700",
};

const MOCK_AGENTS = [
  { id: 1, avatar: "AH", name: "Ahmed Hassan", listings: 12, views: 1240, clients: 8, joined: "Jan 2024", perf: "Top", email: "ahmed.h@agency.com", phone: "+20 123 456 789" },
  { id: 2, avatar: "FM", name: "Fatima Mohamed", listings: 8, views: 890, clients: 5, joined: "Mar 2024", perf: "Active", email: "fatima.m@agency.com", phone: "+20 111 222 333" },
  { id: 3, avatar: "OR", name: "Omar Rashid", listings: 3, views: 320, clients: 2, joined: "Feb 2026", perf: "New", email: "omar.r@agency.com", phone: "+20 100 987 654" },
  { id: 4, avatar: "SK", name: "Sara Khaled", listings: 10, views: 1050, clients: 7, joined: "Jun 2023", perf: "Top", email: "sara.k@agency.com", phone: "+20 122 345 678" },
];

function InviteModal({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Invite New Agent</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <p className="text-sm text-gray-500">An invitation email will be sent to join your agency.</p>
          {["Full Name", "Email Address", "Phone Number"].map(f => (
            <div key={f}>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{f}</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          ))}
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors" onClick={onClose}>
            Send Invitation
          </button>
        </div>
      </div>
    </>
  );
}

export default function ManageMyAgents() {
  const [showInvite, setShowInvite] = useState(false);

  const topAgent = MOCK_AGENTS.find(a => a.perf === "Top");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage My Agents</h1>
          <p className="text-gray-500 text-sm">{MOCK_AGENTS.length} agents in your agency</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Invite New Agent
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Agents", value: MOCK_AGENTS.length, icon: Users, color: "bg-blue-500" },
          { label: "Active Agents", value: MOCK_AGENTS.filter(a => a.perf !== "New").length, icon: TrendingUp, color: "bg-green-500" },
          { label: "Top Performer", value: topAgent?.name.split(" ")[0] || "—", icon: Star, color: "bg-yellow-500" },
          { label: "Total Listings", value: MOCK_AGENTS.reduce((s, a) => s + a.listings, 0), icon: Home, color: "bg-purple-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {MOCK_AGENTS.map(agent => (
          <div key={agent.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1a1a2e] text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                  {agent.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{agent.name}</p>
                  <p className="text-xs text-gray-400">Since {agent.joined}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${PERF_BADGES[agent.perf]}`}>{agent.perf}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Listings", value: agent.listings, icon: Home },
                { label: "Views", value: agent.views > 999 ? `${(agent.views / 1000).toFixed(1)}k` : agent.views, icon: Eye },
                { label: "Clients", value: agent.clients, icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-2">
                  <Icon size={14} className="text-gray-400 mx-auto mb-1" />
                  <p className="font-black text-gray-900 text-sm">{value}</p>
                  <p className="text-[10px] text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                <Eye size={12} /> View
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold py-2 rounded-lg transition-colors">
                <MessageCircle size={12} /> Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}
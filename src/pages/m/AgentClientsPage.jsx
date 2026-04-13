import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Phone, MessageCircle, Mail } from "lucide-react";

const CLIENT_STATUSES = [
  { id: "all", label: "All", color: "gray" },
  { id: "new", label: "New", color: "yellow" },
  { id: "contacted", label: "Contacted", color: "blue" },
  { id: "interested", label: "Interested", color: "green" },
  { id: "negotiating", label: "Negotiating", color: "purple" },
  { id: "won", label: "Won", color: "emerald" },
  { id: "lost", label: "Lost", color: "red" },
];

const MOCK_CLIENTS = [
  { id: 1, name: "Ahmed Hassan", status: "interested", interests: "Apartment, Villa", lastContact: "2d ago", phone: "+201234567890" },
  { id: 2, name: "Sara Mohamed", status: "contacted", interests: "Office Space", lastContact: "Today", phone: "+201987654321" },
  { id: 3, name: "Karim Ali", status: "new", interests: "Studio, Apartment", lastContact: "1d ago", phone: "+201555555555" },
  { id: 4, name: "Fatima Khalil", status: "negotiating", interests: "Villa New Cairo", lastContact: "4h ago", phone: "+201666666666" },
  { id: 5, name: "Hassan Ibrahim", status: "won", interests: "Commercial Space", lastContact: "5d ago", phone: "+201777777777" },
];

const STATUS_COLORS = {
  new: { badge: "bg-yellow-100 text-yellow-700", dot: "🟡" },
  contacted: { badge: "bg-blue-100 text-blue-700", dot: "🔵" },
  interested: { badge: "bg-green-100 text-green-700", dot: "🟢" },
  negotiating: { badge: "bg-purple-100 text-purple-700", dot: "🟣" },
  won: { badge: "bg-emerald-100 text-emerald-700", dot: "✅" },
  lost: { badge: "bg-red-100 text-red-700", dot: "❌" },
};

export default function AgentClientsPage() {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = MOCK_CLIENTS.filter(client => {
    const statusMatch = activeStatus === "all" || client.status === activeStatus;
    const searchMatch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       client.phone.includes(searchQuery);
    return statusMatch && searchMatch;
  });

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">My Clients</h1>
        <button className="ml-auto text-orange-600 hover:bg-orange-50 p-2 rounded-lg">
          <Plus size={20} />
        </button>
      </div>

      {/* Status Filter Chips */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {CLIENT_STATUSES.map(status => (
          <button
            key={status.id}
            onClick={() => setActiveStatus(status.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeStatus === status.id
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <input
          type="text"
          placeholder="Search client name, phone..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* Client List */}
      <div className="px-4 py-4 pb-24 space-y-2">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => {
            const colors = STATUS_COLORS[client.status] || STATUS_COLORS.new;
            return (
              <button
                key={client.id}
                onClick={() => navigate(`/m/dashboard/clients/${client.id}`)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3 hover:bg-gray-50 active:bg-orange-50 text-left"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-lg">
                    👤
                  </div>
                  <span className="absolute -top-1 -right-1 text-sm">{colors.dot}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">Interested in: {client.interests}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-400">Last contact: {client.lastContact}</p>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${colors.badge}`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Phone size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                    <MessageCircle size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                    <Mail size={16} />
                  </button>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No clients found</p>
          </div>
        )}
      </div>
    </div>
  );
}
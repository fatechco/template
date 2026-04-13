import { useState } from "react";
import { Menu, Plus, Search, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import SellerMobileDrawer from "@/components/seller/SellerMobileDrawer";

const MOCK_TICKETS = [
  {
    id: "TK-001",
    subject: "Order delivery delayed",
    module: "kemetro",
    status: "open",
    priority: "high",
    lastMessage: "Support Team replied: We're investigating the shipment delay...",
    lastMessageTime: "2h ago",
    unread: true,
  },
  {
    id: "TK-002",
    subject: "Payment processing issue",
    module: "kemetro",
    status: "in_progress",
    priority: "high",
    lastMessage: "You: The payment gateway is showing an error code",
    lastMessageTime: "5h ago",
    unread: false,
  },
  {
    id: "TK-003",
    subject: "Product listing verification",
    module: "general",
    status: "pending",
    priority: "medium",
    lastMessage: "Support Team: We need more details about your products",
    lastMessageTime: "1d ago",
    unread: false,
  },
];

export default function SupportPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filters = [
    { id: "all", label: "All", count: MOCK_TICKETS.length },
    { id: "open", label: "Open", count: 2 },
    { id: "in_progress", label: "In Progress", count: 1 },
    { id: "pending", label: "Pending", count: 1 },
    { id: "resolved", label: "Resolved", count: 0 },
    { id: "closed", label: "Closed", count: 0 },
  ];

  const getModuleColor = (module) => {
    const colors = {
      kemedar: "bg-orange-100 text-orange-700",
      kemetro: "bg-blue-100 text-blue-700",
      kemework: "bg-teal-100 text-teal-700",
      general: "bg-gray-100 text-gray-700",
    };
    return colors[module] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-orange-100 text-orange-700",
      in_progress: "bg-blue-100 text-blue-700",
      pending: "bg-yellow-100 text-yellow-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityDot = (priority) => {
    const colors = {
      high: "🔴",
      medium: "🟡",
      low: "🟢",
    };
    return colors[priority] || "🟢";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex items-start justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col relative">
        <SellerMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />
        <MobileTopBar
          title="Support"
          rightAction={
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/m/dashboard/support/new")}
                className="p-1 text-orange-600"
              >
                <Plus size={22} />
              </button>
              <button onClick={() => setDrawerOpen(true)} className="p-1">
                <Menu size={22} className="text-gray-700" />
              </button>
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Overview Card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-500"></div>
            <div className="p-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-black text-orange-600">2</p>
                <p className="text-xs text-gray-600 mt-1">Open</p>
              </div>
              <div>
                <p className="text-2xl font-black text-yellow-600">1</p>
                <p className="text-xs text-gray-600 mt-1">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-black text-green-600">0</p>
                <p className="text-xs text-gray-600 mt-1">Resolved</p>
              </div>
            </div>
          </div>

          {/* Quick Help */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-3">Quick Help</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: "📚",
                  title: "Knowledge Base",
                  sub: "Find answers",
                  action: () => navigate("/m/kemetro/seller/knowledge"),
                },
                {
                  icon: "💬",
                  title: "Live Chat",
                  sub: "Online now",
                  action: () => {},
                },
                {
                  icon: "📞",
                  title: "Contact Kemedar",
                  sub: "Call or message",
                  action: () => navigate("/m/kemetro/seller/contact"),
                },
                {
                  icon: "📧",
                  title: "Send Email",
                  sub: "support@kemedar.com",
                  action: () => (window.location.href = "mailto:support@kemedar.com"),
                },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={item.action}
                  className="text-left bg-white border border-gray-200 rounded-2xl p-3 hover:shadow-md transition-all"
                >
                  <p className="text-2xl mb-1">{item.icon}</p>
                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  {item.sub === "Online now" ? (
                    <p className="text-xs text-green-600 font-bold mt-1">🟢 {item.sub}</p>
                  ) : (
                    <p className="text-xs text-gray-600 mt-1">{item.sub}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* My Tickets */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-2">My Tickets</p>
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto mb-3 pb-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex-shrink-0 ${
                    activeFilter === f.id
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2.5 mb-3">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>

            {/* Tickets List */}
            <div className="space-y-3">
              {MOCK_TICKETS.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-2">🎫</p>
                  <p className="font-bold text-gray-900">No support tickets yet</p>
                  <p className="text-sm text-gray-600 mt-1">Having an issue? Our team is here to help</p>
                </div>
              ) : (
                MOCK_TICKETS.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => navigate(`/m/dashboard/support/${ticket.id}`)}
                    className="w-full text-left bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs font-bold text-gray-500">{ticket.id}</p>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                        {ticket.priority === "high"
                          ? "🔴 High"
                          : ticket.priority === "medium"
                          ? "🟡 Medium"
                          : "🟢 Low"}
                      </span>
                    </div>

                    {/* Subject */}
                    <p className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{ticket.subject}</p>

                    {/* Badges */}
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${getModuleColor(ticket.module)}`}>
                        {ticket.module === "kemetro"
                          ? "🛒 Kemetro"
                          : ticket.module === "kemedar"
                          ? "🏠 Kemedar"
                          : "⚙️ General"}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace("_", " ").charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>

                    {/* Last Message */}
                    <p className="text-xs text-gray-600 line-clamp-2">{ticket.lastMessage}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">⏰ {ticket.lastMessageTime}</p>
                      {ticket.unread && <span className="text-xs font-bold text-blue-600">🔵 New reply</span>}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
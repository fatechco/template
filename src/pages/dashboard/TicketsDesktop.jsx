import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ChevronDown, AlertCircle, Clock, CheckCircle, MessageSquare, Calendar } from "lucide-react";

const STATUS_COLORS = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

const MOCK_TICKETS = [
  {
    id: "TKT-001",
    subject: "Unable to list my property",
    category: "Technical Support",
    status: "open",
    priority: "high",
    created: "2024-03-20",
    updated: "2024-03-22",
    responses: 3,
  },
  {
    id: "TKT-002",
    subject: "Payment verification failed",
    category: "Billing",
    status: "in_progress",
    priority: "high",
    created: "2024-03-19",
    updated: "2024-03-22",
    responses: 5,
  },
  {
    id: "TKT-003",
    subject: "How to verify my profile",
    category: "Account Help",
    status: "resolved",
    priority: "low",
    created: "2024-03-18",
    updated: "2024-03-21",
    responses: 2,
  },
  {
    id: "TKT-004",
    subject: "Request for bulk property import",
    category: "Feature Request",
    status: "closed",
    priority: "medium",
    created: "2024-03-17",
    updated: "2024-03-20",
    responses: 4,
  },
];

function CreateTicketModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    subject: "",
    category: "technical",
    priority: "medium",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
    setForm({ subject: "", category: "technical", priority: "medium", description: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create Support Ticket</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Brief subject of your issue"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="technical">Technical Support</option>
                <option value="billing">Billing</option>
                <option value="account">Account Help</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Please describe your issue in detail..."
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TicketsDesktop() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = MOCK_TICKETS.filter(t =>
    (statusFilter === "all" || t.status === statusFilter) &&
    (t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search.toUpperCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Support Tickets</h1>
            <p className="text-gray-500">Track and manage your support requests</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus size={18} /> Create Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Open", count: 2, icon: AlertCircle, color: "text-blue-600" },
            { label: "In Progress", count: 1, icon: Clock, color: "text-yellow-600" },
            { label: "Resolved", count: 1, icon: CheckCircle, color: "text-green-600" },
            { label: "Total", count: 4, icon: MessageSquare, color: "text-gray-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <stat.icon size={24} className={stat.color} />
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="flex-1 outline-none text-sm placeholder-gray-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-semibold">No tickets found</p>
            </div>
          ) : (
            filtered.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/cp/user/tickets/${ticket.id}`)}
                className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">{ticket.id}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[ticket.status]}`}>
                        {ticket.status.replace("_", " ")}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        ticket.priority === "high" ? "bg-red-100 text-red-700" :
                        ticket.priority === "medium" ? "bg-orange-100 text-orange-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{ticket.subject}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>{ticket.category}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> Created: {ticket.created}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={12} /> {ticket.responses} responses
                      </span>
                    </div>
                  </div>
                  <ChevronDown size={20} className="text-gray-300 flex-shrink-0" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreateTicketModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
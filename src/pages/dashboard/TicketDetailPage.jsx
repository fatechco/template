import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Paperclip } from "lucide-react";

const TICKETS = [
  {
    id: "TKT-001",
    subject: "Unable to list my property",
    status: "open",
    priority: "high",
    created: "2024-03-20",
    messages: [
      { id: 1, from: "support", text: "Hi! We received your ticket. Our team is looking into the listing issue.", time: "Mar 20, 2:30 PM" },
      { id: 2, from: "user", text: "Thank you. The error says 'Invalid location data'", time: "Mar 20, 3:15 PM" },
      { id: 3, from: "support", text: "We found the issue. Please try updating your property location and try again.", time: "Mar 20, 4:00 PM" },
    ]
  },
];

export default function TicketDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reply, setReply] = useState("");
  const ticket = TICKETS.find(t => t.id === id) || TICKETS[0];

  const handleSend = () => {
    if (reply.trim()) {
      setReply("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/cp/user/tickets")}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-black text-gray-900">Ticket Details</h1>
      </div>

      {/* Ticket Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">{ticket.id}</p>
            <h2 className="text-xl font-bold text-gray-900">{ticket.subject}</h2>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              ticket.priority === "high" ? "bg-red-100 text-red-700" :
              ticket.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
              "bg-green-100 text-green-700"
            }`}>
              {ticket.priority} priority
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              ticket.status === "open" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
            }`}>
              {ticket.status}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500">Created on {ticket.created}</p>
      </div>

      {/* Messages Thread */}
      <div className="space-y-4 mb-6">
        {ticket.messages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-lg border border-gray-100 p-4 ${
              msg.from === "user" ? "border-blue-200 bg-blue-50" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-gray-900">
                {msg.from === "user" ? "You" : "Support Team"}
              </p>
              <p className="text-xs text-gray-500">{msg.time}</p>
            </div>
            <p className="text-gray-700">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Add a reply</h3>
        <div className="space-y-3">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your message..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <Paperclip size={16} />
              <span className="text-sm">Attach file</span>
            </button>
            <button
              onClick={handleSend}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
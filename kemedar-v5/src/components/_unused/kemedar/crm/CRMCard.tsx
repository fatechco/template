"use client";
// @ts-nocheck
import { Phone, MessageCircle, Mail, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function CRMCard({ contact, onMove, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(contact.notes || "");
  const [status, setStatus] = useState(contact.status);
  const [nextAction, setNextAction] = useState(contact.nextAction || "");

  const statusColors = {
    "new": "bg-blue-100 text-blue-700",
    "contacted": "bg-purple-100 text-purple-700",
    "discussing": "bg-orange-100 text-orange-700",
    "interested": "bg-yellow-100 text-yellow-700",
    "hot": "bg-red-100 text-red-700",
    "converted": "bg-green-100 text-green-700",
    "lost": "bg-gray-100 text-gray-700",
  };

  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "C";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {getInitials(contact.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">{contact.name}</p>
          <p className="text-xs text-gray-500">{contact.role}</p>
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            onMove(contact.id, e.target.value);
          }}
          className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="discussing">Discussing</option>
          <option value="interested">Interested</option>
          <option value="hot">Hot</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="space-y-1.5 mb-3 text-xs">
        <p className="text-gray-600"><span className="font-bold text-gray-700">Phone:</span> {contact.phone}</p>
        <p className="text-gray-600"><span className="font-bold text-gray-700">Email:</span> {contact.email}</p>
        <p className="text-gray-600"><span className="font-bold text-gray-700">Properties:</span> {contact.properties}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <button onClick={() => onAction(contact.id, "phone")} title="Call" className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
          <Phone size={14} />
        </button>
        <button onClick={() => onAction(contact.id, "whatsapp")} title="WhatsApp" className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
          <MessageCircle size={14} />
        </button>
        <button onClick={() => onAction(contact.id, "email")} title="Email" className="p-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
          <Mail size={14} />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <label className="text-xs font-bold text-gray-700">Sales Person</label>
          <select className="w-full text-xs px-2 py-1 border border-gray-200 rounded-lg">
            <option>{contact.salesPerson || "Unassigned"}</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700">Next Action</label>
          <input
            type="date"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            className="w-full text-xs px-2 py-1 border border-gray-200 rounded-lg"
          />
        </div>
      </div>

      {/* Expandable Notes */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left text-xs font-bold text-gray-700 flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        Notes
        <ChevronDown size={12} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          className="w-full text-xs px-2 py-1 border border-gray-200 rounded-lg mt-2 resize-none h-20 focus:border-orange-500 focus:outline-none"
        />
      )}

      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
        Last contact: {contact.lastContact || "Never"}
      </div>
    </div>
  );
}
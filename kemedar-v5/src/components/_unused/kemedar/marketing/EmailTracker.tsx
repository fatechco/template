"use client";
// @ts-nocheck
import React, { useState } from "react";
import { Eye, Reply, UserPlus, Forward, Trash2 } from "lucide-react";

export default function EmailTracker() {
  const mockEmails = [
    { id: 1, date: "2024-03-21 14:30", from: "Ahmed Hassan", to: "Support Team", subject: "Property Inquiry", preview: "I'm interested in the villa...", source: "Contact Form", status: "Read" },
    { id: 2, date: "2024-03-21 12:15", from: "Guest User", to: "Layla Mohamed", subject: "Viewing Request", preview: "Can I schedule a viewing...", source: "Property Detail", status: "Unread" },
    { id: 3, date: "2024-03-20 16:45", from: "Omar Khalil", to: "Admin", subject: "Bug Report", preview: "I found an issue with...", source: "Dashboard", status: "Read" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Email Tracker</h1>
        <p className="text-sm text-gray-600 mt-1">Track all incoming emails and messages</p>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-4 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="text-center">
          <p className="text-2xl font-black text-blue-600">24</p>
          <p className="text-xs text-gray-600 mt-1">Total emails today</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-green-600">75%</p>
          <p className="text-xs text-gray-600 mt-1">Registered senders</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-orange-600">25%</p>
          <p className="text-xs text-gray-600 mt-1">Guest senders</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-3">
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          <input
            type="text"
            placeholder="Search subject..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="rounded" />
            <span>Registered only</span>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date/Time</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">From</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">To</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Preview</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Source</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockEmails.map(email => (
                <tr key={email.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{email.date}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{email.from}</td>
                  <td className="px-4 py-3 text-gray-600">{email.to}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{email.subject}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{email.preview}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{email.source}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${email.status === "Read" ? "bg-gray-100 text-gray-700" : "bg-blue-100 text-blue-700"}`}>{email.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedEmail(email); setShowModal(true); }} className="p-1 hover:bg-gray-200 rounded">
                        <Eye size={14} className="text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Reply size={14} className="text-green-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <UserPlus size={14} className="text-orange-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedEmail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-4">{selectedEmail.subject}</h2>
            <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
              <p><span className="font-bold text-gray-700">From:</span> {selectedEmail.from}</p>
              <p><span className="font-bold text-gray-700">To:</span> {selectedEmail.to}</p>
              <p><span className="font-bold text-gray-700">Date:</span> {selectedEmail.date}</p>
            </div>
            <p className="text-gray-700">{selectedEmail.preview}...</p>
            <button onClick={() => setShowModal(false)} className="mt-6 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
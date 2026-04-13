import { useState } from 'react';
import { Search, Send, Reply, ReplyAll, Forward, Star, Trash2, MoreVertical, Plus } from 'lucide-react';

const EMAILS = [
  { id: 1, from: "Ahmed Hassan", email: "ahmed@kemedar.com", subject: "Property Verification Report", preview: "Here's the monthly verification report for Q1 2026. Please review the attached document...", date: "Mar 23, 2:30 PM", unread: true, folder: "inbox", starred: false },
  { id: 2, from: "Kemedar Support", email: "support@kemedar.com", subject: "New Feature: Bulk Verification", preview: "We've added bulk verification to help you manage multiple properties at once...", date: "Mar 22, 10:15 AM", unread: true, folder: "inbox", starred: false },
  { id: 3, from: "Sara Mohamed", email: "sara@sellers.com", subject: "Seller Registration Question", preview: "Hi, I have a question about the seller registration process...", date: "Mar 20, 4:45 PM", unread: false, folder: "inbox", starred: true },
  { id: 4, from: "Layla Ahmed", email: "layla@franchisees.com", subject: "Area Meeting - March 30", preview: "I wanted to confirm our meeting for March 30 at 10 AM...", date: "Mar 19, 3:20 PM", unread: false, folder: "inbox", starred: false },
];

export default function FranchiseOwnerEmail() {
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  const folderEmails = EMAILS.filter(e => e.folder === selectedFolder);
  const unreadCount = EMAILS.filter(e => e.unread).length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-52 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <button onClick={() => setShowCompose(true)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2 text-sm">
            <Plus size={16} /> Compose
          </button>
        </div>

        {/* Folders */}
        <div className="flex-1 px-2 py-4 space-y-1">
          {[
            { id: "inbox", label: "📥 Inbox", count: unreadCount },
            { id: "sent", label: "📤 Sent", count: 0 },
            { id: "important", label: "⭐ Important", count: 1 },
            { id: "drafts", label: "📁 Drafts", count: 2 },
          ].map(folder => (
            <button key={folder.id} onClick={() => { setSelectedFolder(folder.id); setSelectedEmail(null); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                selectedFolder === folder.id
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{folder.label}</span>
              {folder.count > 0 && <span className="text-xs font-bold">{folder.count}</span>}
            </button>
          ))}
        </div>

        {/* Labels */}
        <div className="border-t border-gray-100 px-2 py-4 space-y-1">
          <p className="text-xs font-bold text-gray-600 px-3 mb-2">Labels</p>
          {["🏠 Kemedar", "💰 Finance", "👤 Clients"].map(label => (
            <button key={label} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Email List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search emails..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {folderEmails.map(email => (
            <button key={email.id} onClick={() => setSelectedEmail(email)}
              className={`w-full text-left p-4 border-l-4 transition-all hover:bg-gray-50 ${
                selectedEmail?.id === email.id ? "bg-orange-50 border-orange-600" : email.unread ? "bg-blue-50 border-blue-500" : "border-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-sm font-bold flex-shrink-0 text-orange-700">
                  {email.from[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${email.unread ? "text-gray-900" : "text-gray-700"}`}>{email.from}</p>
                  <p className={`text-xs truncate ${email.unread ? "font-bold text-gray-900" : "text-gray-600"}`}>{email.subject}</p>
                  <p className="text-xs text-gray-500 truncate">{email.preview}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <p className="text-xs text-gray-500">{email.date}</p>
                  {email.starred && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedEmail ? (
          <>
            {/* Toolbar */}
            <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Reply size={18} /></button>
                <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><ReplyAll size={18} /></button>
                <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Forward size={18} /></button>
                <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Star size={18} /></button>
                <button className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 size={18} /></button>
                <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Email Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h1 className="text-2xl font-black text-gray-900 mb-4">{selectedEmail.subject}</h1>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-lg font-bold text-orange-700">
                  {selectedEmail.from[0]}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{selectedEmail.from}</p>
                  <p className="text-xs text-gray-600">{selectedEmail.email}</p>
                </div>
                <p className="text-sm text-gray-600">{selectedEmail.date}</p>
              </div>
              <p className="text-sm text-gray-600 mt-3">To: admin@franchisee.com</p>
            </div>

            {/* Email Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedEmail.preview}</p>
              <p className="text-base text-gray-700 leading-relaxed mt-4">This is a sample email content. The actual email would be rendered here with proper formatting and attachments.</p>

              {/* Attachments Example */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-bold text-gray-700 mb-3">Attachments</p>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Report_Q1_2026.pdf</p>
                    <p className="text-xs text-gray-500">2.4 MB</p>
                  </div>
                  <button className="px-3 py-1.5 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded">Download</button>
                </div>
              </div>
            </div>

            {/* Reply Area */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <textarea placeholder="Write your reply..." className="w-full border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:border-orange-400 resize-none h-24 mb-3" />
              <div className="flex gap-3">
                <button className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Save Draft</button>
                <button className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2">
                  <Send size={16} /> Send Reply
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-lg">Select an email to read</p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">New Email</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">To</label>
                <input type="email" placeholder="recipient@example.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">CC</label>
                <input type="email" placeholder="optional" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Subject</label>
                <input type="text" placeholder="Email subject" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Message</label>
                <textarea placeholder="Write your email..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none h-32" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCompose(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Discard</button>
                <button onClick={() => setShowCompose(false)} className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
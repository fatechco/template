import { useState } from 'react';
import { ChevronLeft, Plus, Search, Reply, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EMAILS = [
  { id: 1, from: "Ahmed Hassan", subject: "Property Verification Report", preview: "Here's the monthly verification report...", date: "Mar 23", unread: true, folder: "inbox" },
  { id: 2, from: "Kemedar Support", subject: "New Feature: Bulk Verification", preview: "We've added bulk verification to help you...", date: "Mar 22", unread: true, folder: "inbox" },
  { id: 3, from: "Sara Mohamed", subject: "Seller Registration Question", preview: "Hi, I have a question about the seller...", date: "Mar 20", unread: false, folder: "inbox" },
];

export default function FranchiseOwnerEmailMobile() {
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  const folderEmails = EMAILS.filter(e => e.folder === selectedFolder);
  const unreadCount = EMAILS.filter(e => e.unread && e.folder === "inbox").length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => selectedEmail ? setSelectedEmail(null) : navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">{selectedEmail ? "Email" : "Email"}</h1>
        <button onClick={() => setShowCompose(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Plus size={22} className="text-gray-900" />
        </button>
      </div>

      {!selectedEmail ? (
        <>
          {/* Folder Tabs */}
          <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-2 py-2 flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: "inbox", label: "📥 Inbox", count: unreadCount },
              { id: "sent", label: "📤 Sent", count: 0 },
              { id: "important", label: "⭐ Important", count: 1 },
              { id: "trash", label: "🗑 Trash", count: 0 },
            ].map(folder => (
              <button key={folder.id} onClick={() => setSelectedFolder(folder.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                  selectedFolder === folder.id
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {folder.label} {folder.count > 0 && `(${folder.count})`}
              </button>
            ))}
          </div>

          {/* Email List */}
          <div className="p-3 space-y-2">
            {folderEmails.map(email => (
              <button key={email.id} onClick={() => setSelectedEmail(email)}
                className={`w-full text-left rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow ${
                  email.unread ? "bg-blue-50 border-blue-200" : "bg-white"
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
                  <p className="text-xs text-gray-500 flex-shrink-0">{email.date}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Email Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <h2 className="font-black text-gray-900 text-base mb-2">{selectedEmail.subject}</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-sm font-bold text-orange-700">
                {selectedEmail.from[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-900">{selectedEmail.from}</p>
                <p className="text-xs text-gray-500">{selectedEmail.date}</p>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-4">
            <p className="text-sm text-gray-700 leading-relaxed">{selectedEmail.preview}</p>
            <p className="text-sm text-gray-700 leading-relaxed mt-4">This is a sample email content. The actual email would be rendered here with proper formatting.</p>
          </div>

          {/* Reply Area */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3">
            <textarea placeholder="Write your reply..." className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-400 resize-none h-20" />
            <div className="flex gap-2">
              <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button className="flex-1 bg-orange-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-orange-700">Send</button>
            </div>
          </div>
        </>
      )}

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">New Email</h2>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 text-2xl">×</button>
            </div>

            <input type="email" placeholder="To" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400" />
            <input type="text" placeholder="Subject" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400" />
            <textarea placeholder="Write your email..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none h-24" />

            <div className="flex gap-2">
              <button onClick={() => setShowCompose(false)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-lg text-sm">Discard</button>
              <button onClick={() => setShowCompose(false)} className="flex-1 bg-orange-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-orange-700">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
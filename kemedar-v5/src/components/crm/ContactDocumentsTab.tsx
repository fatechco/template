// @ts-nocheck
import { Download, Eye, FileText, Shield, Paperclip } from "lucide-react";

const MOCK_DOCS = [
  { id: "d1", name: "National ID — Front", type: "verification", size: "245 KB", uploadedAt: "Jan 15, 2026", uploadedBy: "System", status: "verified" },
  { id: "d2", name: "National ID — Back", type: "verification", size: "231 KB", uploadedAt: "Jan 15, 2026", uploadedBy: "System", status: "verified" },
  { id: "d3", name: "Broker License", type: "business", size: "1.2 MB", uploadedAt: "Jan 20, 2026", uploadedBy: "Ahmed Hassan", status: "verified" },
  { id: "d4", name: "Call Recording — Mar 28", type: "call", size: "3.4 MB", uploadedAt: "Mar 28, 2026", uploadedBy: "System", status: null },
  { id: "d5", name: "Renewal Proposal PDF", type: "crm", size: "380 KB", uploadedAt: "Apr 1, 2026", uploadedBy: "You", status: null },
];

const TYPE_ICON = {
  verification: "🛡",
  business: "🏢",
  call: "📞",
  crm: "📎",
  message: "💬",
};

const TYPE_LABEL = {
  verification: "Verification",
  business: "Business Doc",
  call: "Call Attachment",
  crm: "CRM Upload",
  message: "Message Attachment",
};

const STATUS_COLOR = {
  verified: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-600",
};

export default function ContactDocumentsTab({ contact }) {
  const grouped = MOCK_DOCS.reduce((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900">Documents</h3>
        <button className="flex items-center gap-1.5 border border-violet-300 text-violet-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-violet-50">
          <Paperclip size={12} /> Upload
        </button>
      </div>

      {Object.entries(grouped).map(([type, docs]) => (
        <div key={type} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-base">{TYPE_ICON[type] || "📄"}</span>
            <span className="text-xs font-black text-gray-700">{TYPE_LABEL[type] || type}</span>
            <span className="text-[10px] bg-gray-200 text-gray-500 font-bold px-1.5 py-0.5 rounded-full">{docs.length}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {docs.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                <FileText size={16} className="text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{doc.name}</p>
                  <p className="text-[10px] text-gray-400">{doc.size} · {doc.uploadedAt} · {doc.uploadedBy}</p>
                </div>
                {doc.status && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[doc.status] || "bg-gray-100 text-gray-500"}`}>{doc.status}</span>
                )}
                <div className="flex gap-1 flex-shrink-0">
                  <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500" title="Preview"><Eye size={12} /></button>
                  <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-500" title="Download"><Download size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {MOCK_DOCS.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">No documents uploaded yet</p>
        </div>
      )}
    </div>
  );
}
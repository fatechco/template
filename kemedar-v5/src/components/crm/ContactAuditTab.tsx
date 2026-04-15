// @ts-nocheck
const MOCK_AUDIT = [
  { id: 1, action: "field_update", field: "lifecycleStage", from: "prospect", to: "active", actor: "You", time: "3 days ago", source: "CRM" },
  { id: 2, action: "owner_change", field: "owner", from: "Adel M.", to: "You", actor: "Sara K.", time: "5 days ago", source: "CRM" },
  { id: 3, action: "note_created", field: null, from: null, to: null, actor: "You", time: "4 days ago", source: "CRM", detail: "Note added: morning call preference" },
  { id: 4, action: "task_completed", field: null, from: null, to: null, actor: "Sara K.", time: "5 days ago", source: "CRM", detail: "Task: Send welcome email" },
  { id: 5, action: "message_sent", field: "channel", from: null, to: "whatsapp", actor: "You", time: "1 day ago", source: "CRM", detail: "Template: renewal_offer_ar" },
  { id: 6, action: "call_logged", field: null, from: null, to: null, actor: "You", time: "2 hours ago", source: "CRM", detail: "Outbound call — no answer" },
  { id: 7, action: "field_update", field: "priority", from: "medium", to: "high", actor: "You", time: "1 week ago", source: "CRM" },
  { id: 8, action: "contact_created", field: null, from: null, to: null, actor: "System", time: "2 weeks ago", source: "Import", detail: "Imported from Aqarmap — JOB-002" },
];

const ACTION_CONFIG = {
  field_update: { icon: "✏️", color: "bg-blue-100 text-blue-700", label: "Field Updated" },
  owner_change: { icon: "👥", color: "bg-teal-100 text-teal-700", label: "Owner Changed" },
  note_created: { icon: "📝", color: "bg-yellow-100 text-yellow-700", label: "Note Added" },
  task_completed: { icon: "✅", color: "bg-green-100 text-green-700", label: "Task Completed" },
  message_sent: { icon: "💬", color: "bg-blue-100 text-blue-700", label: "Message Sent" },
  call_logged: { icon: "📞", color: "bg-green-100 text-green-600", label: "Call Logged" },
  contact_created: { icon: "🆕", color: "bg-violet-100 text-violet-700", label: "Contact Created" },
  approval_action: { icon: "🛡", color: "bg-orange-100 text-orange-700", label: "Approval" },
};

export default function ContactAuditTab({ contact }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-black text-gray-900">Audit Log</h3>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500">
        All CRM actions on this contact are logged here. Source-module changes appear when flagged with "edited from CRM".
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Action", "Detail", "Actor", "Source", "Time"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_AUDIT.map(entry => {
              const config = ACTION_CONFIG[entry.action] || { icon: "•", color: "bg-gray-100 text-gray-500", label: entry.action };
              return (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${config.color}`}>
                      {config.icon} {config.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    {entry.action === "field_update" || entry.action === "owner_change" ? (
                      <span className="text-gray-600">
                        <span className="line-through text-red-400">{entry.from}</span>
                        {" → "}
                        <span className="font-bold text-green-600">{entry.to}</span>
                        {entry.field && <span className="text-gray-400 ml-1">({entry.field})</span>}
                      </span>
                    ) : (
                      <span className="text-gray-600 truncate">{entry.detail || "—"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">{entry.actor}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${entry.source === "CRM" ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-500"}`}>
                      {entry.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{entry.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
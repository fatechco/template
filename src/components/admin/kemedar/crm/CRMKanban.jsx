import { Plus } from "lucide-react";
import CRMCard from "./CRMCard";

const STATUSES = [
  { id: "new", label: "🆕 New Contacts", color: "bg-blue-50" },
  { id: "contacted", label: "📞 Contacted", color: "bg-purple-50" },
  { id: "discussing", label: "💬 In Discussion", color: "bg-orange-50" },
  { id: "interested", label: "🤝 Interested", color: "bg-yellow-50" },
  { id: "hot", label: "🔥 Hot Lead", color: "bg-red-50" },
  { id: "converted", label: "✅ Converted", color: "bg-green-50" },
  { id: "lost", label: "❌ Cold / Lost", color: "bg-gray-50" },
];

export default function CRMKanban({ contacts, onMove, onAction }) {
  const groupedContacts = STATUSES.reduce((acc, status) => {
    acc[status.id] = contacts.filter(c => c.status === status.id);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {STATUSES.map(status => (
          <div key={status.id} className={`flex-shrink-0 w-80 ${status.color} rounded-2xl p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">{status.label}</h3>
              <span className="bg-white text-gray-700 font-bold text-xs px-2.5 py-1 rounded-full">{groupedContacts[status.id].length}</span>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {groupedContacts[status.id].map(contact => (
                <CRMCard
                  key={contact.id}
                  contact={contact}
                  onMove={onMove}
                  onAction={onAction}
                />
              ))}
            </div>

            <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
              <Plus size={16} className="mx-auto" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
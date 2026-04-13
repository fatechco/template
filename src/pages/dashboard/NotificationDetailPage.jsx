import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Archive, Trash2 } from "lucide-react";

const ALL_NOTIFS = [
  { id: 1, type: "property", icon: "🏠", title: "New match for your buy request", desc: "3 new properties match your buy request BR-001 in New Cairo.", time: "2 min ago", read: false, fullContent: "You have 3 new property matches for your buy request BR-001. These properties are located in New Cairo and match your criteria. View these properties to express interest or save them for later." },
  { id: 2, type: "message", icon: "💬", title: "New message from Ahmed Hassan", desc: "Ahmed sent you a message about your apartment listing in Maadi.", time: "1 hour ago", read: false, fullContent: "Ahmed Hassan sent you a message: 'Hi, I'm very interested in your apartment in Maadi. Can we schedule a viewing this weekend?'" },
  { id: 3, type: "property", icon: "👁", title: "Someone viewed your listing", desc: "Your apartment in New Cairo received 12 new views today.", time: "3 hours ago", read: false, fullContent: "Your apartment listing in New Cairo has received 12 new views today. This is great engagement! Keep your listing fresh by updating photos and descriptions regularly." },
];

export default function NotificationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const notif = ALL_NOTIFS.find(n => n.id === parseInt(id)) || ALL_NOTIFS[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/cp/user/notifications")}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-black text-gray-900">Notification Details</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
              {notif.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{notif.title}</h2>
              <p className="text-sm text-gray-500">{notif.time}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">{notif.desc}</p>
          <p className="text-gray-700 leading-relaxed">{notif.fullContent}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-100">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition">
            <Archive size={16} />
            Archive
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-600 font-semibold rounded-lg transition">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
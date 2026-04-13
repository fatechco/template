import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Archive } from "lucide-react";

const NOTIFICATIONS_MAP = {
  1: {
    id: 1,
    title: "Order Shipped",
    type: "order",
    icon: "📦",
    content: "Your order #KM12345 has been shipped and is on its way to you. Track your order in the tracking section.",
    timestamp: "Mar 25, 2026 10:30 AM",
    actions: [
      { label: "Track Order", action: "track" },
      { label: "View Order", action: "order" },
    ],
  },
  2: {
    id: 2,
    title: "New Message from Ahmed Hassan",
    type: "message",
    icon: "💬",
    content: "Hi! Are you still interested in the apartment in New Cairo? I have another viewing scheduled this weekend if you'd like to join.",
    timestamp: "Mar 25, 2026 10:15 AM",
    actions: [
      { label: "Reply", action: "reply" },
      { label: "View Profile", action: "profile" },
    ],
  },
  3: {
    id: 3,
    title: "Property Viewed",
    type: "property",
    icon: "🏠",
    content: "Your listing 'Modern Apartment in New Cairo' got 5 new views today.",
    timestamp: "Mar 25, 2026 9:00 AM",
    actions: [
      { label: "View Details", action: "property" },
    ],
  },
};

export default function NotificationsDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const notification = NOTIFICATIONS_MAP[id] || NOTIFICATIONS_MAP[1];

  const handleAction = (action) => {
    switch(action) {
      case "reply":
        navigate(`/m/messages/${notification.id}`);
        break;
      case "profile":
        navigate(`/m/profile/${notification.id}`);
        break;
      case "track":
        navigate("/m/dashboard/kemetro-orders");
        break;
      case "order":
        navigate("/m/dashboard/kemetro-orders");
        break;
      case "property":
        navigate("/m/property/apartment-in-new-cairo");
        break;
      default:
        break;
    }
  };

  const handleDelete = () => {
    navigate("/m/cp/user/notifications");
  };

  const handleArchive = () => {
    navigate("/m/cp/user/notifications");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[480px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/m/cp/user/notifications")} className="p-1">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <span className="text-sm font-bold text-gray-500">Notification</span>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Notification Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{notification.icon}</span>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-gray-900 mb-1">{notification.title}</h1>
              <p className="text-xs text-gray-500">{notification.timestamp}</p>
            </div>
          </div>
        </div>

        {/* Notification Body */}
        <div className="p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">{notification.content}</p>
          </div>

          {/* Action Buttons */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="space-y-2 mb-6">
              {notification.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAction(action.action)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition active:scale-95"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 bg-white p-4 space-y-2">
        <button
          onClick={handleArchive}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition"
        >
          <Archive size={16} />
          Archive
        </button>
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 text-red-600 font-bold py-2.5 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
"use client";
// @ts-nocheck
import { useRouter } from "next/navigation";
import { Home, Heart, MessageCircle, Bell } from "lucide-react";

const ACTIONS = [
  {
    emoji: "🏠",
    label: "My Properties",
    path: "/dashboard/my-properties",
    color: "#FF6B00",
  },
  {
    emoji: "❤️",
    label: "Saved",
    path: "/dashboard/favorites",
    color: "#EF4444",
  },
  {
    emoji: "💬",
    label: "Messages",
    path: "/dashboard/messages",
    color: "#3B82F6",
  },
  {
    emoji: "🔔",
    label: "Notifications",
    path: "/dashboard/notifications",
    color: "#F59E0B",
  },
];

export default function QuickActionsGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-3 px-4 mb-4">
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          onClick={() => router.push(action.path)}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col items-center justify-center gap-2 active:bg-gray-50 transition-colors"
          style={{ minHeight: 100 }}
        >
          <div className="text-3xl">{action.emoji}</div>
          <span className="text-xs font-bold text-[#1F2937] text-center">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
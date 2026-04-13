export default function AuctionStatusTabs({ statusFilter, setStatusFilter, counts }) {
  const tabs = [
    { id: "all", label: "All", count: null },
    { id: "live", label: "🔴 Live Now", count: counts.live },
    { id: "ending_soon", label: "⏰ Ending Soon", count: counts.endingToday },
    { id: "upcoming", label: "📅 Upcoming", count: counts.upcoming },
    { id: "registration", label: "📋 Registration Open", count: counts.registration },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4">
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border-b-2 ${
              statusFilter === tab.id
                ? "border-red-500 text-red-600 bg-red-50"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`px-2 py-1 rounded-full text-xs font-black ${
                statusFilter === tab.id
                  ? "bg-red-200 text-red-700"
                  : "bg-gray-200 text-gray-700"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
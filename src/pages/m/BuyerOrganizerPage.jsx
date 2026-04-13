import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, ChevronRight } from "lucide-react";

const COLUMNS = [
  { id: "saved",       icon: "🔖", label: "Saved",           sublabel: "Properties I'm interested in",   count: 5 },
  { id: "contacted",   icon: "📞", label: "Agent Contacted",  sublabel: "Reached out to the seller/agent", count: 3 },
  { id: "waiting",     icon: "⏳", label: "Awaiting Reply",   sublabel: "Waiting for agent response",      count: 2 },
  { id: "video",       icon: "🎥", label: "Video Tour",       sublabel: "Scheduled a virtual tour",        count: 1 },
  { id: "visited",     icon: "🚪", label: "Site Visited",     sublabel: "Physically visited the property", count: 4 },
  { id: "rejected",    icon: "🚫", label: "Not Interested",   sublabel: "Decided this isn't the right fit",count: 1 },
  { id: "negotiating", icon: "🤝", label: "Negotiating Price","sublabel": "In active price negotiation",    count: 2 },
  { id: "processing",  icon: "📝", label: "Under Contract",   sublabel: "Paperwork & legal in progress",   count: 1 },
  { id: "bought",      icon: "🏡", label: "Purchased",        sublabel: "Deal closed successfully",        count: 3 },
];

const MOCK_PROPERTIES = {
  saved: [
    { id: 1, title: "Luxury Apartment Cairo", price: "$500,000", notes: "" },
    { id: 2, title: "Villa New Cairo", price: "$750,000", notes: "" },
  ],
  contacted: [
    { id: 3, title: "Studio Downtown", price: "$150,000", notes: "Waiting for response" },
  ],
  visited: [
    { id: 4, title: "Office Space", price: "$200,000", notes: "Good condition" },
  ],
};

export default function BuyerOrganizerPage() {
  const navigate = useNavigate();
  const [activeColumn, setActiveColumn] = useState("saved");
  const [notes, setNotes] = useState({});
  const [showMoveMenu, setShowMoveMenu] = useState(null);

  const currentProperties = MOCK_PROPERTIES[activeColumn] || [];

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900 ml-2">Buyer Organizer</h1>
      </div>

      {/* Column Selector */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {COLUMNS.map(col => (
          <button
            key={col.id}
            onClick={() => setActiveColumn(col.id)}
            className={`px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeColumn === col.id
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>{col.icon}</span>
            <span>{col.label}</span>
            <span className={`rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black ${activeColumn === col.id ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"}`}>
              {col.count}
            </span>
          </button>
        ))}
      </div>

      {/* Column Content */}
      <div className="p-4 pb-24 space-y-3">
        {/* Stage Header */}
        {(() => { const col = COLUMNS.find(c => c.id === activeColumn); return col ? (
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{col.icon}</span>
            <div>
              <p className="font-black text-orange-700 text-sm">{col.label}</p>
              <p className="text-xs text-orange-500 mt-0.5">{col.sublabel}</p>
            </div>
          </div>
        ) : null; })()}

        {/* Add Button */}
        <button className="w-full border-2 border-dashed border-orange-400 text-orange-600 font-bold py-3 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-sm">
          <Plus size={18} /> Add property to this stage
        </button>

        {/* Properties */}
        {currentProperties.length > 0 ? (
          currentProperties.map(prop => (
            <div key={prop.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3 relative">
              {/* Close menu when clicking outside */}
              {showMoveMenu === prop.id && (
                <div className="absolute inset-0 z-10" onClick={() => setShowMoveMenu(null)} />
              )}

              {/* Property Info */}
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">{prop.title}</p>
                  <p className="font-bold text-orange-600 text-sm mt-1">{prop.price}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Agent: John Doe</p>
                </div>
              </div>

              {/* Notes Field */}
              <textarea
                placeholder="Add notes about this property..."
                value={notes[prop.id] || ""}
                onChange={(e) => setNotes({ ...notes, [prop.id]: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />

              {/* Move Button */}
              <div className="relative">
                <button
                  onClick={() => setShowMoveMenu(showMoveMenu === prop.id ? null : prop.id)}
                  className="text-orange-600 font-bold text-xs hover:text-orange-700 flex items-center gap-1 ml-auto"
                >
                  Move to <ChevronRight size={14} />
                </button>

                {/* Move Menu */}
                {showMoveMenu === prop.id && (
                  <div className="absolute bottom-full right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-20 w-48 mb-2">
                    {COLUMNS.filter(c => c.id !== activeColumn).map(col => (
                      <button
                        key={col.id}
                        onClick={() => {
                          setActiveColumn(col.id);
                          setShowMoveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-2"
                      >
                        {col.icon} {col.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No properties in this stage yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, ChevronRight } from "lucide-react";

const COLUMNS = [
  { id: "contacted",   icon: "📞", label: "Buyer Contacted",   sublabel: "Buyer reached out or was contacted",  count: 4 },
  { id: "video",       icon: "🎥", label: "Video Tour Done",   sublabel: "Virtual tour completed with buyer",    count: 2 },
  { id: "visit",       icon: "🚪", label: "Site Visit Done",   sublabel: "Buyer physically visited the property",count: 3 },
  { id: "negotiating", icon: "🤝", label: "Negotiating Price", sublabel: "Active price negotiation underway",    count: 2 },
  { id: "processing",  icon: "📝", label: "Under Contract",    sublabel: "Paperwork & legal in progress",        count: 1 },
  { id: "closed",      icon: "🏡", label: "Deal Closed",       sublabel: "Sale successfully completed",          count: 5 },
];

const MOCK_INQUIRIES = {
  contacted: [
    { id: 1, buyerName: "Ahmed Hassan", property: "Villa in New Cairo", note: "" },
    { id: 2, buyerName: "Sara Mohamed", property: "Apartment Cairo", note: "" },
  ],
  video: [
    { id: 3, buyerName: "Karim Ali", property: "Office Space", note: "Scheduled for tomorrow" },
  ],
  visit: [
    { id: 4, buyerName: "Fatima Khalil", property: "Studio Downtown", note: "Very interested" },
  ],
};

export default function SellerOrganizerPage() {
  const navigate = useNavigate();
  const [activeColumn, setActiveColumn] = useState("contacted");
  const [notes, setNotes] = useState({});
  const [showMoveMenu, setShowMoveMenu] = useState(null);

  const currentInquiries = MOCK_INQUIRIES[activeColumn] || [];

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900 ml-2">Seller Organizer</h1>
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
          <Plus size={18} /> Add inquiry to this stage
        </button>

        {/* Inquiries */}
        {currentInquiries.length > 0 ? (
          currentInquiries.map(inquiry => (
            <div key={inquiry.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3 relative">
              {/* Close menu when clicking outside */}
              {showMoveMenu === inquiry.id && (
                <div className="absolute inset-0 z-10" onClick={() => setShowMoveMenu(null)} />
              )}

              {/* Buyer Info */}
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  👤
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">{inquiry.buyerName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Interested in: {inquiry.property}</p>
                  <div className="flex gap-1 mt-1 text-xs">
                    <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200">
                      📞 Call
                    </button>
                    <button className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold hover:bg-green-200">
                      💬 Chat
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes Field */}
              <textarea
                placeholder="Add notes about this inquiry..."
                value={notes[inquiry.id] || ""}
                onChange={(e) => setNotes({ ...notes, [inquiry.id]: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />

              {/* Move Button */}
              <div className="relative">
                <button
                  onClick={() => setShowMoveMenu(showMoveMenu === inquiry.id ? null : inquiry.id)}
                  className="text-orange-600 font-bold text-xs hover:text-orange-700 flex items-center gap-1 ml-auto"
                >
                  Move to <ChevronRight size={14} />
                </button>

                {/* Move Menu */}
                {showMoveMenu === inquiry.id && (
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
            <p className="text-gray-500 text-sm">No inquiries in this stage yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
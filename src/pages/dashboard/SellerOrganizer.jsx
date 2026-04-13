import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Phone, MessageCircle, Mail, ChevronDown } from "lucide-react";

const COLUMNS = [
  { id: "contacted", title: "👥 People Who Contacted Me", color: "bg-blue-50" },
  { id: "video", title: "🎥 Video Viewed My Property", color: "bg-purple-50" },
  { id: "visited", title: "🏠 Site Visited My Property", color: "bg-orange-50" },
  { id: "negotiating", title: "🤝 Negotiating", color: "bg-green-50" },
  { id: "closed", title: "✅ Closed Deals", color: "bg-emerald-50" },
];

const INITIAL_CARDS = {
  contacted: [
    { id: "b1", name: "Ahmed Hassan", avatar: "AH", property: "Modern Apartment New Cairo", propertyImg: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&q=70", phone: "+20 123 456 789", lastContact: "2 days ago", notes: "" },
    { id: "b2", name: "Fatima Mohamed", avatar: "FM", property: "Modern Apartment New Cairo", propertyImg: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&q=70", phone: "+20 111 222 333", lastContact: "1 week ago", notes: "" },
  ],
  video: [
    { id: "b3", name: "Omar Saleh", avatar: "OS", property: "Villa Sheikh Zayed", propertyImg: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=80&q=70", phone: "+20 100 987 654", lastContact: "3 days ago", notes: "Interested, sent video on WhatsApp" },
  ],
  visited: [],
  negotiating: [
    { id: "b4", name: "Sara Khaled", avatar: "SK", property: "Modern Apartment New Cairo", propertyImg: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&q=70", phone: "+20 122 345 678", lastContact: "Yesterday", notes: "Offered $115,000 — countered at $118,000" },
  ],
  closed: [],
};

const BG_COLORS = ["bg-orange-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500"];

function BuyerCard({ card, index, columnId, onNoteChange }) {
  const [showNote, setShowNote] = useState(false);
  const bgColor = BG_COLORS[card.avatar.charCodeAt(0) % BG_COLORS.length];

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-xl border border-gray-100 shadow-sm p-3 mb-2 space-y-3 ${snapshot.isDragging ? "shadow-lg rotate-1" : ""}`}
        >
          {/* Buyer info */}
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full ${bgColor} text-white font-bold text-sm flex items-center justify-center flex-shrink-0`}>
              {card.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{card.name}</p>
              <p className="text-xs text-gray-400">Last contact: {card.lastContact}</p>
            </div>
          </div>

          {/* Property */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <img src={card.propertyImg} alt="" className="w-10 h-8 object-cover rounded flex-shrink-0" />
            <p className="text-xs font-semibold text-gray-700 line-clamp-2">{card.property}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <button className="flex-1 flex items-center justify-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold py-1.5 rounded-lg transition-colors">
              <Phone size={11} /> Call
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold py-1.5 rounded-lg transition-colors">
              <MessageCircle size={11} /> WA
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold py-1.5 rounded-lg transition-colors">
              <Mail size={11} /> Email
            </button>
          </div>

          <button onClick={() => setShowNote(!showNote)} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
            📝 Notes <ChevronDown size={10} className={showNote ? "rotate-180" : ""} />
          </button>
          {showNote && (
            <textarea
              value={card.notes}
              onChange={e => onNoteChange(card.id, columnId, e.target.value)}
              placeholder="Add notes..."
              className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none focus:outline-none focus:border-blue-300"
              rows={2}
            />
          )}
        </div>
      )}
    </Draggable>
  );
}

export default function SellerOrganizer() {
  const [columns, setColumns] = useState(INITIAL_CARDS);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const srcCards = Array.from(columns[source.droppableId]);
    const [moved] = srcCards.splice(source.index, 1);
    if (source.droppableId === destination.droppableId) {
      srcCards.splice(destination.index, 0, moved);
      setColumns(c => ({ ...c, [source.droppableId]: srcCards }));
    } else {
      const dstCards = Array.from(columns[destination.droppableId]);
      dstCards.splice(destination.index, 0, moved);
      setColumns(c => ({ ...c, [source.droppableId]: srcCards, [destination.droppableId]: dstCards }));
    }
  };

  const handleNoteChange = (cardId, colId, value) => {
    setColumns(c => ({ ...c, [colId]: c[colId].map(card => card.id === cardId ? { ...card, notes: value } : card) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Seller Organizer</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track buyer interactions for your properties</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Add Contact
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex-shrink-0 w-64">
              <div className={`${col.color} rounded-xl p-3`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-gray-700">{col.title}</h3>
                  <span className="text-xs text-gray-400 font-bold">{columns[col.id].length}</span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[60px] rounded-lg transition-colors ${snapshot.isDraggingOver ? "bg-white/50" : ""}`}
                    >
                      {columns[col.id].map((card, idx) => (
                        <BuyerCard key={card.id} card={card} index={idx} columnId={col.id} onNoteChange={handleNoteChange} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <button className="w-full mt-1 text-xs text-gray-400 hover:text-gray-700 py-2 rounded-lg hover:bg-white/50 transition-colors flex items-center justify-center gap-1">
                  <Plus size={12} /> Add contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
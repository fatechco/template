import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, MapPin, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CelebrationModal from "@/components/concierge/CelebrationModal";
import ConciergeCardBanner from "@/components/concierge/ConciergeCardBanner";

const COLUMNS = [
  { id: "saved", title: "🔍 Saved / To Contact", color: "bg-gray-100" },
  { id: "contacted", title: "📞 Contacted", color: "bg-blue-50" },
  { id: "waiting", title: "📅 Waiting to See", color: "bg-yellow-50" },
  { id: "video", title: "🎥 Video Shown", color: "bg-purple-50" },
  { id: "visited", title: "🏠 Site Visited", color: "bg-orange-50" },
  { id: "rejected", title: "❌ Rejected", color: "bg-red-50" },
  { id: "negotiation", title: "🤝 In Negotiation", color: "bg-green-50" },
  { id: "processing", title: "⚙️ In Processing", color: "bg-indigo-50" },
  { id: "closed", title: "✅ Bought / Rented", color: "bg-emerald-50" },
];

const CLOSED_COLUMN_ID = "closed";

const INITIAL_CARDS = {
  saved: [
    { id: "c1", title: "Modern Apartment New Cairo", price: "$120,000", location: "New Cairo, Cairo", purpose: "Sale", agent: "Ahmed Ali", notes: "", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=70" },
    { id: "c2", title: "Cozy Studio in Maadi", price: "$700/mo", location: "Maadi, Cairo", purpose: "Rent", agent: "Sara Hassan", notes: "", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=120&q=70" },
  ],
  contacted: [
    { id: "c3", title: "Villa Sheikh Zayed", price: "$380,000", location: "Sheikh Zayed, Giza", purpose: "Sale", agent: "Omar Khaled", notes: "Called twice, waiting for response", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120&q=70" },
  ],
  waiting: [],
  video: [],
  visited: [
    { id: "c4", title: "Townhouse in Katameya", price: "$260,000", location: "Katameya, Cairo", purpose: "Sale", agent: "Mona Tarek", notes: "Visited on Feb 20, liked it", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=120&q=70" },
  ],
  rejected: [],
  negotiation: [],
  processing: [],
  closed: [],
};

const PURPOSE_COLORS = { Sale: "bg-blue-100 text-blue-700", Rent: "bg-purple-100 text-purple-700" };

function PropertyCard({ card, index, columnId, onNoteChange, journey }) {
  const [showNote, setShowNote] = useState(false);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-2 ${snapshot.isDragging ? "shadow-lg rotate-1" : ""}`}
        >
          <img src={card.image} alt={card.title} className="w-full h-24 object-cover" />
          <div className="p-3 space-y-1.5">
            <div className="flex items-start justify-between gap-1">
              <p className="text-xs font-bold text-gray-900 line-clamp-2 flex-1">{card.title}</p>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${PURPOSE_COLORS[card.purpose]}`}>{card.purpose}</span>
            </div>
            <p className="text-sm font-black text-orange-500">{card.price}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={10} /> <span className="truncate">{card.location}</span>
            </div>
            <p className="text-xs text-gray-500">Agent: {card.agent}</p>
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
          {/* Concierge Banner - only shown in the closed column */}
          {columnId === CLOSED_COLUMN_ID && (
            <ConciergeCardBanner journey={journey} propertyId={card.propertyId} />
          )}
        </div>
      )}
    </Draggable>
  );
}

export default function BuyerOrganizer() {
  const [columns, setColumns] = useState(INITIAL_CARDS);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // { journey, property }
  const [journeyMap, setJourneyMap] = useState({}); // cardId → journey

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const handleConciergeModalClose = () => {
    if (activeModal?.journey) {
      base44.entities.ConciergeJourney.update(activeModal.journey.id, {
        celebrationModalShown: true
      }).catch(() => {});
    }
    setActiveModal(null);
  };

  const onDragEnd = async (result) => {
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

      // Handle drop into "Bought / Rented" column
      if (destination.droppableId === CLOSED_COLUMN_ID && currentUser) {
        const journeyType = moved.purpose === 'Rent' ? 'Rented' : 'Bought';
        const propertyId = moved.propertyId || moved.id;

        // Call triggerMoveInConcierge in background
        try {
          const res = await base44.functions.invoke('triggerMoveInConcierge', {
            userId: currentUser.id,
            propertyId,
            journeyType
          });

          const journey = res?.data?.journey;

          // Store journey in map for banner
          if (journey) {
            setJourneyMap(prev => ({ ...prev, [moved.id]: journey }));

            // Show celebration modal if not yet shown
            if (!journey.celebrationModalShown) {
              const propertyData = {
                id: propertyId,
                title: moved.title,
                city_name: moved.location?.split(',')?.[0] || '',
                district_name: moved.location?.split(',')?.[1]?.trim() || '',
                featured_image: moved.image
              };
              setActiveModal({ journey, property: propertyData });

              // Mark modal as shown
              await base44.entities.ConciergeJourney.update(journey.id, {
                celebrationModalShown: true
              });
            }
          }
        } catch (err) {
          console.error('triggerMoveInConcierge error:', err);
        }
      }
    }
  };

  const handleNoteChange = (cardId, colId, value) => {
    setColumns(c => ({
      ...c,
      [colId]: c[colId].map(card => card.id === cardId ? { ...card, notes: value } : card)
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Buyer Organizer</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track properties you're interested in</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Add Property to Board
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex-shrink-0 w-60">
              <div className={`${col.color} rounded-xl p-3`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-gray-700 leading-tight">{col.title}</h3>
                  <span className="text-xs text-gray-400 font-bold">{columns[col.id].length}</span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[60px] transition-colors rounded-lg ${snapshot.isDraggingOver ? "bg-white/50" : ""}`}
                    >
                      {columns[col.id].map((card, idx) => (
                        <PropertyCard
                          key={card.id}
                          card={card}
                          index={idx}
                          columnId={col.id}
                          onNoteChange={handleNoteChange}
                          journey={col.id === CLOSED_COLUMN_ID ? journeyMap[card.id] : null}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <button className="w-full mt-1 text-xs text-gray-400 hover:text-gray-700 py-2 rounded-lg hover:bg-white/50 transition-colors flex items-center justify-center gap-1">
                  <Plus size={12} /> Add card
                </button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Celebration Modal */}
      {activeModal && (
        <CelebrationModal
          journey={activeModal.journey}
          property={activeModal.property}
          onClose={handleConciergeModalClose}
        />
      )}
    </div>
  );
}
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, X, Phone, MessageCircle } from "lucide-react";

const COLUMNS = [
  { id: "new", title: "🆕 New Lead", color: "bg-blue-50" },
  { id: "contacted", title: "📞 Contacted", color: "bg-yellow-50" },
  { id: "interested", title: "💡 Interested", color: "bg-orange-50" },
  { id: "proposal", title: "📄 Proposal Sent", color: "bg-purple-50" },
  { id: "won", title: "✅ Won", color: "bg-green-50" },
  { id: "lost", title: "❌ Lost", color: "bg-red-50" },
];

const INITIAL = {
  new: [
    { id: "l1", name: "Ahmed Hassan", source: "Website", interest: "Property Listing", phone: "+20 123 456", date: "Mar 18" },
    { id: "l2", name: "Sara Khaled", source: "Referral", interest: "Kemework Service", phone: "+20 111 222", date: "Mar 17" },
  ],
  contacted: [
    { id: "l3", name: "Omar Rashid", source: "Walk-in", interest: "Kemetro Seller Plan", phone: "+20 100 987", date: "Mar 15" },
  ],
  interested: [
    { id: "l4", name: "Fatima Mohamed", source: "Social Media", interest: "Franchise Info", phone: "+20 122 345", date: "Mar 14" },
  ],
  proposal: [],
  won: [{ id: "l5", name: "Mohamed Nasser", source: "Event", interest: "Gold Subscription", phone: "+20 115 567", date: "Mar 12" }],
  lost: [],
};

const SOURCE_COLORS = { Website: "bg-blue-100 text-blue-700", Referral: "bg-green-100 text-green-700", "Walk-in": "bg-orange-100 text-orange-700", "Social Media": "bg-pink-100 text-pink-700", Event: "bg-purple-100 text-purple-700" };

function AddLeadModal({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Add New Lead</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          {[
            { label: "Full Name", type: "text" },
            { label: "Phone", type: "tel" },
            { label: "Email", type: "email" },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{f.label}</label>
              <input type={f.type} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Source</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
              {Object.keys(SOURCE_COLORS).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Interested In</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Notes</label>
            <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
          </div>
          <button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">Add Lead</button>
        </div>
      </div>
    </>
  );
}

function LeadCard({ lead, index }) {
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
          className={`bg-white rounded-xl border border-gray-100 shadow-sm p-3 mb-2 space-y-2 ${snapshot.isDragging ? "shadow-lg rotate-1" : ""}`}>
          <div className="flex items-start justify-between gap-1">
            <p className="text-sm font-bold text-gray-900">{lead.name}</p>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${SOURCE_COLORS[lead.source] || "bg-gray-100 text-gray-600"}`}>{lead.source}</span>
          </div>
          <p className="text-xs text-gray-500">{lead.interest}</p>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-400">{lead.date}</p>
            <div className="flex gap-1">
              <button className="w-6 h-6 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center"><Phone size={11} /></button>
              <button className="w-6 h-6 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><MessageCircle size={11} /></button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default function FranchiseLeads() {
  const [columns, setColumns] = useState(INITIAL);
  const [showAdd, setShowAdd] = useState(false);

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const src = Array.from(columns[source.droppableId]);
    const [moved] = src.splice(source.index, 1);
    if (source.droppableId === destination.droppableId) {
      src.splice(destination.index, 0, moved);
      setColumns(c => ({ ...c, [source.droppableId]: src }));
    } else {
      const dst = Array.from(columns[destination.droppableId]);
      dst.splice(destination.index, 0, moved);
      setColumns(c => ({ ...c, [source.droppableId]: src, [destination.droppableId]: dst }));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">👤 Leads Pipeline</h1>
          <p className="text-gray-500 text-sm">{Object.values(columns).flat().length} leads total</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Add New Lead
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex-shrink-0 w-52">
              <div className={`${col.color} rounded-xl p-3`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-gray-700 leading-tight">{col.title}</h3>
                  <span className="text-xs text-gray-400 font-bold">{columns[col.id].length}</span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className={`min-h-[60px] rounded-lg transition-colors ${snapshot.isDraggingOver ? "bg-white/50" : ""}`}>
                      {columns[col.id].map((lead, idx) => <LeadCard key={lead.id} lead={lead} index={idx} />)}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <button className="w-full mt-1 text-xs text-gray-400 hover:text-gray-700 py-2 rounded-lg hover:bg-white/50 flex items-center justify-center gap-1">
                  <Plus size={12} /> Add lead
                </button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
import { useState } from 'react';
import { Plus, Phone, MessageCircle, Mail, Edit, Upload } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const INITIAL_LEADS = {
  new: [
    { id: 1, name: "Ahmed Hassan", company: "Tech Solutions", phone: "+20 100 1234567", source: "Website", value: 5000, assigned: "Sara", days: 2 },
    { id: 2, name: "Fatima Ali", company: "Design Studio", phone: "+20 100 1234568", source: "Referral", value: 3500, assigned: "Omar", days: 5 },
  ],
  contacted: [
    { id: 3, name: "Mohamed Samir", company: "Construction Co", phone: "+20 100 1234569", source: "LinkedIn", value: 8000, assigned: "Sara", days: 3 },
  ],
  discussion: [
    { id: 4, name: "Layla Ahmed", company: "Marketing Agency", phone: "+20 100 1234570", source: "Event", value: 4200, assigned: "Omar", days: 7 },
  ],
  qualified: [],
  converted: [],
  lost: [],
};

const LEAD_COLUMNS = [
  { id: "new", title: "🆕 New" },
  { id: "contacted", title: "📞 Contacted" },
  { id: "discussion", title: "🤝 In Discussion" },
  { id: "qualified", title: "🔥 Qualified" },
  { id: "converted", title: "✅ Converted" },
  { id: "lost", title: "❌ Lost" },
];

function LeadCard({ lead, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-move">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {lead.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{lead.name}</p>
          <p className="text-xs text-gray-600 truncate">{lead.company}</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-2">{lead.phone}</p>
      <p className="text-xs text-gray-500 mb-2">📌 {lead.source}</p>

      <div className="bg-green-50 rounded p-1.5 mb-2">
        <p className="text-xs font-bold text-green-700">${lead.value.toLocaleString()}</p>
      </div>

      <p className="text-xs text-gray-600 mb-3">👤 {lead.assigned} · {lead.days}d ago</p>

      <div className="flex gap-1">
        <button className="flex-1 p-2 text-gray-600 hover:bg-gray-100 rounded text-xs"><Phone size={14} /></button>
        <button className="flex-1 p-2 text-gray-600 hover:bg-gray-100 rounded text-xs"><MessageCircle size={14} /></button>
        <button className="flex-1 p-2 text-gray-600 hover:bg-gray-100 rounded text-xs"><Mail size={14} /></button>
        <button onClick={() => onEdit(lead)} className="flex-1 p-2 text-gray-600 hover:bg-gray-100 rounded text-xs"><Edit size={14} /></button>
      </div>
    </div>
  );
}

export default function FranchiseOwnerBizLeads() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('new');
  const [bulkUploadMessage, setBulkUploadMessage] = useState('');

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    const sourceLead = leads[sourceColumn][source.index];
    const newLeads = {
      ...leads,
      [sourceColumn]: leads[sourceColumn].filter((_, i) => i !== source.index),
      [destColumn]: [...leads[destColumn]],
    };

    newLeads[destColumn].splice(destination.index, 0, sourceLead);
    setLeads(newLeads);
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result;
        const lines = csv.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const newLeads = lines.slice(1).map((line, idx) => {
          const values = line.split(',').map(v => v.trim());
          return {
            id: Math.max(...Object.values(leads).flatMap(col => col).map(l => l.id), 0) + idx + 1,
            name: values[headers.indexOf('name')] || 'Unknown',
            company: values[headers.indexOf('company')] || '',
            phone: values[headers.indexOf('phone')] || '',
            source: values[headers.indexOf('source')] || 'Bulk Import',
            value: parseInt(values[headers.indexOf('value')]) || 0,
            assigned: values[headers.indexOf('assigned')] || 'Unassigned',
            days: 0,
          };
        });

        setLeads(prev => ({
          ...prev,
          [selectedColumn]: [...(prev[selectedColumn] || []), ...newLeads],
        }));

        setBulkUploadMessage(`✅ Successfully imported ${newLeads.length} leads to "${LEAD_COLUMNS.find(c => c.id === selectedColumn)?.title}"`);
        setTimeout(() => {
          setShowBulkUpload(false);
          setBulkUploadMessage('');
        }, 2000);
      } catch (error) {
        setBulkUploadMessage('❌ Error parsing CSV. Make sure columns are: name, company, phone, source, value, assigned');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">📊 Leads Management</h1>
          <p className="text-gray-500 text-sm mt-1">Drag leads between columns to update their status</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulkUpload(true)} className="flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            <Upload size={18} /> Bulk Import
          </button>
          <button onClick={() => setShowAddLead(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={18} /> Add Lead
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {LEAD_COLUMNS.map(column => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-gray-50 rounded-xl p-4 min-h-[500px] flex flex-col transition-all ${
                    snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 text-sm">{column.title}</h2>
                    <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {leads[column.id]?.length || 0}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {(leads[column.id] || []).map((lead, index) => (
                      <Draggable key={lead.id} draggableId={`${lead.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all ${snapshot.isDragging ? 'opacity-50' : 'opacity-100'}`}
                          >
                            <LeadCard lead={lead} onEdit={() => {}} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-gray-900 mb-2">📤 Bulk Import Leads</h2>
            <p className="text-sm text-gray-600 mb-6">Upload a CSV file with leads (columns: name, company, phone, source, value, assigned)</p>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-700 block mb-3">Select Status/Column</label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
              >
                {LEAD_COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">Click to select CSV file</span>
                <span className="text-xs text-gray-500">or drag and drop</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleBulkUpload}
                  className="hidden"
                />
              </label>
            </div>

            {bulkUploadMessage && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-900">
                {bulkUploadMessage}
              </div>
            )}

            <button
              onClick={() => setShowBulkUpload(false)}
              className="w-full border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Add New Lead</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Name</label>
                <input type="text" placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Company</label>
                <input type="text" placeholder="Company name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Phone</label>
                <input type="tel" placeholder="+20 100 1234567" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Email</label>
                <input type="email" placeholder="email@example.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Source</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                  <option>Website</option>
                  <option>Referral</option>
                  <option>LinkedIn</option>
                  <option>Event</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Estimated Value</label>
                <input type="number" placeholder="5000" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Assigned To</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                  <option>Sara</option>
                  <option>Omar</option>
                  <option>Ahmed</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddLead(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowAddLead(false)} className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">Save Lead</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, X, Plus, Star, Search, Save, RotateCcw, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";

const TYPE_LABELS = {
  properties: { title: "Featured Properties", searchLabel: "Search properties..." },
  projects: { title: "Featured Projects", searchLabel: "Search projects..." },
  agents: { title: "Featured Agents", searchLabel: "Search agents..." },
  developers: { title: "Featured Developers", searchLabel: "Search developers..." },
  agencies: { title: "Featured Agencies", searchLabel: "Search agencies..." },
};

const MOCK_FEATURED = [
  { id: "f1", title: "Modern Villa Sheikh Zayed", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=80&q=70", until: "2026-04-30", priority: 1 },
  { id: "f2", title: "Luxury Penthouse Zamalek", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=80&q=70", until: "2026-04-15", priority: 2 },
  { id: "f3", title: "Twin House 6th October", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=80&q=70", until: "2026-05-01", priority: 3 },
  { id: "f4", title: "Studio Maadi Corniche", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=80&q=70", until: "2026-04-20", priority: 4 },
];

const MOCK_SEARCH = [
  { id: "s1", title: "North Coast Chalet", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=80&q=70" },
  { id: "s2", title: "New Cairo Apartment", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&q=70" },
  { id: "s3", title: "Katameya Heights Villa", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&q=70" },
  { id: "s4", title: "Downtown Office", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&q=70" },
];

export default function AdminFeatured() {
  const { pathname } = useLocation();
  const type = pathname.split("/").pop();
  const config = TYPE_LABELS[type] || TYPE_LABELS.properties;

  const [featured, setFeatured] = useState(MOCK_FEATURED);
  const [search, setSearch] = useState("");
  const [untilDate, setUntilDate] = useState("");
  const [maxItems, setMaxItems] = useState(8);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationHours, setRotationHours] = useState(24);
  const [saved, setSaved] = useState(false);

  const filtered = MOCK_SEARCH.filter(
    (s) => !featured.find((f) => f.id === s.id) && (!search || s.title.toLowerCase().includes(search.toLowerCase()))
  );

  const onDragEnd = ({ source, destination }) => {
    if (!destination || source.index === destination.index) return;
    const items = Array.from(featured);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);
    setFeatured(items.map((it, i) => ({ ...it, priority: i + 1 })));
  };

  const remove = (id) => setFeatured((f) => f.filter((x) => x.id !== id).map((it, i) => ({ ...it, priority: i + 1 })));

  const add = (item) => {
    if (featured.length >= maxItems) return;
    setFeatured((f) => [...f, { ...item, until: untilDate || "2026-06-30", priority: f.length + 1 }]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{config.title}</h1>
          <p className="text-gray-500 text-sm">{featured.length} / {maxItems} slots used</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
          <Save size={15} /> {saved ? "✅ Saved!" : "Save Featured Order"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Currently Featured */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Star size={15} className="text-orange-500" />
            <span className="font-bold text-gray-800">Currently Featured</span>
            <span className="ml-auto text-xs text-gray-400">Drag to reorder</span>
          </div>
          <div className="p-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="featured">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {featured.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-3 p-3 rounded-xl border bg-white transition-shadow ${snapshot.isDragging ? "shadow-lg border-orange-300" : "border-gray-100"}`}
                          >
                            <div {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab">
                              <GripVertical size={16} />
                            </div>
                            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-black flex items-center justify-center flex-shrink-0">{item.priority}</span>
                            <img src={item.image} alt={item.title} className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                              <p className="text-xs text-gray-400">Until: {item.until}</p>
                            </div>
                            <button onClick={() => remove(item.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center flex-shrink-0">
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {featured.length === 0 && (
                      <div className="text-center py-10 text-gray-400 text-sm">No featured items. Add some from the right panel.</div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        {/* RIGHT: Add + Settings */}
        <div className="space-y-4">
          {/* Add Panel */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="font-bold text-gray-800 text-sm">Add to Featured</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={config.searchLabel}
                  className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Featured Until</label>
                <input type="date" value={untilDate} onChange={(e) => setUntilDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filtered.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <img src={item.image} alt={item.title} className="w-10 h-8 object-cover rounded flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-700 flex-1 truncate">{item.title}</span>
                    <button onClick={() => add(item)} disabled={featured.length >= maxItems}
                      className="w-6 h-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plus size={12} />
                    </button>
                  </div>
                ))}
                {filtered.length === 0 && <p className="text-xs text-gray-400 text-center py-3">No results</p>}
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Settings size={14} className="text-gray-500" />
              <span className="font-bold text-gray-800 text-sm">Featured Settings</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Max Featured Items</label>
                <input type="number" value={maxItems} onChange={(e) => setMaxItems(Number(e.target.value))} min={1} max={20}
                  className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-orange-400" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Auto-Rotate</label>
                <button onClick={() => setAutoRotate((v) => !v)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${autoRotate ? "bg-orange-500" : "bg-gray-200"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-1 transition-all ${autoRotate ? "left-6" : "left-1"}`} />
                </button>
              </div>
              {autoRotate && (
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">Rotation Interval</label>
                  <div className="flex items-center gap-1.5">
                    <input type="number" value={rotationHours} onChange={(e) => setRotationHours(Number(e.target.value))} min={1}
                      className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-orange-400" />
                    <span className="text-xs text-gray-400">hrs</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
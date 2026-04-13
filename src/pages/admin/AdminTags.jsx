import { useState } from "react";
import { Plus, X, Search } from "lucide-react";

const INITIAL_TAGS = [
  { id: 1, name: "Sea View", count: 234 },
  { id: 2, name: "New Listing", count: 891 },
  { id: 3, name: "Hot Deal", count: 145 },
  { id: 4, name: "Ready to Move", count: 540 },
  { id: 5, name: "Under Construction", count: 380 },
  { id: 6, name: "Off Plan", count: 290 },
  { id: 7, name: "Furnished", count: 420 },
  { id: 8, name: "Garden View", count: 187 },
  { id: 9, name: "Compound", count: 610 },
  { id: 10, name: "Luxury Finishing", count: 320 },
  { id: 11, name: "Corner Unit", count: 98 },
  { id: 12, name: "Ground Floor", count: 145 },
  { id: 13, name: "Pool View", count: 215 },
  { id: 14, name: "Payment Plan", count: 780 },
  { id: 15, name: "Negotiable", count: 440 },
  { id: 16, name: "Price Reduced", count: 127 },
  { id: 17, name: "Exclusive", count: 56 },
  { id: 18, name: "Investment", count: 365 },
];

export default function AdminTags() {
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [search, setSearch] = useState("");
  const [newTag, setNewTag] = useState("");

  const filtered = tags.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const addTag = () => {
    if (!newTag.trim() || tags.find((t) => t.name.toLowerCase() === newTag.trim().toLowerCase())) return;
    setTags((prev) => [...prev, { id: Date.now(), name: newTag.trim(), count: 0 }]);
    setNewTag("");
  };

  const deleteTag = (id) => setTags((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Tags</h1>
        <p className="text-gray-500 text-sm">{tags.length} tags total</p>
      </div>

      {/* Add + Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex gap-3">
          <input value={newTag} onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="New tag name..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          <button onClick={addTag} disabled={!newTag.trim()}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white font-bold px-5 py-2.5 rounded-lg transition-colors text-sm">
            <Plus size={14} /> Add Tag
          </button>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tags..."
            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
        </div>
      </div>

      {/* Tags Cloud */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">All Tags ({filtered.length})</p>
        <div className="flex flex-wrap gap-2">
          {filtered
            .sort((a, b) => b.count - a.count)
            .map((tag) => (
              <div key={tag.id} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl pl-3 pr-1.5 py-1.5 group transition-colors">
                <span className="text-sm font-semibold text-gray-800">{tag.name}</span>
                <span className="text-xs text-gray-500 bg-white rounded-full px-1.5 py-0.5 font-bold">{tag.count}</span>
                <button onClick={() => deleteTag(tag.id)}
                  className="w-5 h-5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <X size={11} />
                </button>
              </div>
            ))}
        </div>
        {filtered.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No tags found</p>}
      </div>

      {/* Table view */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-bold text-gray-600">Tag Details</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Tag Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Usage Count</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.sort((a, b) => b.count - a.count).map((tag, i) => (
                <tr key={tag.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3 font-semibold text-gray-800">{tag.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: `${Math.min((tag.count / 900) * 100, 100)}%` }} />
                      </div>
                      <span className="font-bold text-gray-600">{tag.count}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteTag(tag.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center">
                      <X size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
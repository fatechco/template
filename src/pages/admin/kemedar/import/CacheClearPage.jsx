import { Trash2 } from "lucide-react";
import { useState } from "react";

const CACHE_SECTIONS = [
  { id: "properties", name: "Properties Cache", size: "245 MB", lastCleared: "2024-03-20" },
  { id: "search", name: "Search Results Cache", size: "189 MB", lastCleared: "2024-03-19" },
  { id: "users", name: "User Profiles Cache", size: "95 MB", lastCleared: "2024-03-21" },
  { id: "images", name: "Images Cache", size: "1.2 GB", lastCleared: "2024-03-15" },
  { id: "translations", name: "Translations Cache", size: "45 MB", lastCleared: "2024-03-18" },
  { id: "homepage", name: "Homepage Cache", size: "12 MB", lastCleared: "2024-03-21" },
  { id: "api", name: "API Response Cache", size: "234 MB", lastCleared: "2024-03-20" },
];

export default function CacheClearPage() {
  const [clearing, setClearing] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);

  const handleClear = (id) => {
    setClearing(id);
    setTimeout(() => setClearing(null), 1500);
  };

  const handleClearAll = () => {
    setClearingAll(true);
    setTimeout(() => setClearingAll(false), 2500);
  };

  const totalSize = "2.02 GB";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Cache Management</h1>
        <p className="text-sm text-gray-600 mt-1">Clear application caches to improve performance</p>
      </div>

      {/* Total Cache Size */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="text-sm font-bold text-blue-900">Total Cache Size: <span className="text-lg">{totalSize}</span></p>
      </div>

      {/* Cache Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CACHE_SECTIONS.map(section => (
          <div key={section.id} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
            <h3 className="font-bold text-gray-900 text-lg">{section.name}</h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-gray-600">Size</p>
                <p className="font-bold text-gray-900">{section.size}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-gray-600">Last Cleared</p>
                <p className="font-bold text-gray-900">{section.lastCleared}</p>
              </div>
            </div>

            <button
              onClick={() => handleClear(section.id)}
              disabled={clearing === section.id}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg font-bold text-sm hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              <Trash2 size={14} />
              {clearing === section.id ? "Clearing..." : "Clear This Cache"}
            </button>
          </div>
        ))}
      </div>

      {/* Clear All */}
      <div className="bg-white rounded-2xl border border-red-200 p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <span className="text-2xl">⚠️</span> Clear All Cache
        </h3>
        <p className="text-sm text-gray-700">This will temporarily slow the site while caches rebuild. Continue?</p>
        <button
          onClick={handleClearAll}
          disabled={clearingAll}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <Trash2 size={16} />
          {clearingAll ? "Clearing All Cache..." : "🗑 Clear All Cache"}
        </button>
        {clearingAll && (
          <div className="text-center py-4">
            <p className="text-sm font-bold text-green-600">✅ Cache cleared successfully</p>
          </div>
        )}
      </div>
    </div>
  );
}
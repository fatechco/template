import { useState } from "react";
import { Trash2, AlertTriangle, X, CheckCircle } from "lucide-react";

const CACHE_TYPES = [
  { key: "all", label: "Clear All Cache", desc: "Clears every cached item from all modules", color: "bg-red-500 hover:bg-red-600", confirm: true },
  { key: "properties", label: "Clear Properties Cache", desc: "Property listings, search results, details pages", color: "bg-orange-500 hover:bg-orange-600", confirm: false },
  { key: "users", label: "Clear Users Cache", desc: "User profiles, agent pages, directory listings", color: "bg-orange-500 hover:bg-orange-600", confirm: false },
  { key: "media", label: "Clear Media Cache", desc: "Images, thumbnails, file CDN cache", color: "bg-orange-500 hover:bg-orange-600", confirm: false },
  { key: "translations", label: "Clear Translations Cache", desc: "Language strings and localization files", color: "bg-orange-500 hover:bg-orange-600", confirm: false },
];

export default function AdminCache() {
  const [confirmKey, setConfirmKey] = useState(null);
  const [clearedLog, setClearedLog] = useState([]);

  const doAction = (key) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const label = CACHE_TYPES.find((c) => c.key === key)?.label || key;
    setClearedLog((prev) => [{ key, label, time }, ...prev].slice(0, 6));
    setConfirmKey(null);
  };

  const handleClick = (item) => {
    if (item.confirm) setConfirmKey(item.key);
    else doAction(item.key);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Cache Management</h1>
        <p className="text-gray-500 text-sm">Clear server-side caches to refresh content across the platform</p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-yellow-800">Caution</p>
          <p className="text-sm text-yellow-700 mt-0.5">Clearing cache will temporarily slow the site as data is rebuilt from the database. Avoid during peak traffic hours.</p>
        </div>
      </div>

      {/* Cache buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CACHE_TYPES.map((item) => (
          <div key={item.key} className={`bg-white rounded-xl border p-5 flex items-center justify-between gap-4 ${item.key === "all" ? "border-red-200 bg-red-50/40 md:col-span-2" : "border-gray-100"}`}>
            <div>
              <p className={`font-bold ${item.key === "all" ? "text-red-700" : "text-gray-900"}`}>{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <button onClick={() => handleClick(item)}
              className={`flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors flex-shrink-0 ${item.color}`}>
              <Trash2 size={15} /> Clear
            </button>
          </div>
        ))}
      </div>

      {/* Success log */}
      {clearedLog.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Recent Clears</p>
          {clearedLog.map((log, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
              <span className="font-semibold">{log.label}</span>
              <span className="text-gray-400 text-xs ml-auto">at {log.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {confirmKey && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setConfirmKey(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-black text-gray-900 text-lg">Clear All Cache?</h3>
              <p className="text-sm text-gray-500">This will clear every cached item across the platform. The site may be temporarily slower.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmKey(null)}
                  className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => doAction(confirmKey)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors">Yes, Clear All</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
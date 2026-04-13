import { useState, useRef } from "react";
import { Upload, Globe, MapPin, Users, Download, CheckCircle, Loader } from "lucide-react";
import ImportUsersCard from "@/components/admin/import/ImportUsersCard";

const RECENT_IMPORTS = [
  { source: "bayut.com", items: 142, status: "Completed", date: "2026-03-15" },
  { source: "aqarmap.com", items: 87, status: "Completed", date: "2026-03-12" },
  { source: "propertyfinder.com", items: 56, status: "Failed", date: "2026-03-10" },
];

function StatusBadge({ status }) {
  const colors = { Completed: "bg-green-100 text-green-700", Failed: "bg-red-100 text-red-700", Running: "bg-blue-100 text-blue-700" };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>;
}

function UploadDropzone({ label, accept, onFile }) {
  const ref = useRef();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); onFile?.(f); }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => ref.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragging ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/40"}`}
    >
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) { setFile(f); onFile?.(f); } }} />
      <Upload size={22} className={`mx-auto mb-2 ${file ? "text-green-500" : "text-gray-300"}`} />
      {file ? (
        <p className="text-sm font-semibold text-green-600">{file.name}</p>
      ) : (
        <>
          <p className="text-sm font-semibold text-gray-600">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">or drag & drop</p>
        </>
      )}
    </div>
  );
}

function Card1SiteImport() {
  const [url, setUrl] = useState("");
  const [importType, setImportType] = useState("Properties");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const start = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setDone(true); setTimeout(() => setDone(false), 3000); }, 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Globe size={20} className="text-blue-500" /></div>
        <div><p className="font-black text-gray-900">Import Properties from Other Sites</p><p className="text-xs text-gray-400">Scrape and import listings from external portals</p></div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Source Site URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://bayut.com/for-sale/..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Import Type</label>
        <select value={importType} onChange={(e) => setImportType(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none cursor-pointer">
          <option>Properties</option><option>Projects</option>
        </select>
      </div>
      {done && <p className="text-sm text-green-600 font-semibold">✅ Import started! Check status below.</p>}
      <button onClick={start} disabled={running || !url}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
        {running ? <><Loader size={14} className="animate-spin" /> Importing...</> : "Start Import"}
      </button>
      <div className="mt-2">
        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Recent Imports</p>
        <table className="w-full text-xs">
          <thead><tr className="text-gray-400"><th className="text-left py-1">Source</th><th className="text-left py-1">Items</th><th className="text-left py-1">Status</th><th className="text-left py-1">Date</th></tr></thead>
          <tbody>
            {RECENT_IMPORTS.map((r, i) => (
              <tr key={i} className="border-t border-gray-50">
                <td className="py-1.5 text-gray-700">{r.source}</td>
                <td className="py-1.5 font-bold">{r.items}</td>
                <td className="py-1.5"><StatusBadge status={r.status} /></td>
                <td className="py-1.5 text-gray-400">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card2Translation() {
  const [lang, setLang] = useState("ar");
  const [done, setDone] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"><Globe size={20} className="text-purple-500" /></div>
        <div><p className="font-black text-gray-900">Import Translation Files</p><p className="text-xs text-gray-400">Upload CSV translation strings for the platform</p></div>
      </div>
      <UploadDropzone label="Drop CSV translation file here" accept=".csv" />
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Language</label>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none cursor-pointer">
          <option value="ar">Arabic (ar)</option><option value="fr">French (fr)</option><option value="de">German (de)</option>
        </select>
      </div>
      {done && <p className="text-sm text-green-600 font-semibold">✅ Translations applied!</p>}
      <div className="flex gap-2">
        <button onClick={() => { setDone(true); setTimeout(() => setDone(false), 3000); }}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
          Upload & Apply
        </button>
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Download size={14} /> Template
        </button>
      </div>
    </div>
  );
}

function Card3Locations() {
  const [preview, setPreview] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><MapPin size={20} className="text-green-500" /></div>
        <div><p className="font-black text-gray-900">Import Location Data</p><p className="text-xs text-gray-400">Countries, Provinces, Cities, Districts, Areas</p></div>
      </div>
      <UploadDropzone label="Drop CSV location file here" accept=".csv" />
      {preview && !done && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">Preview</p>
          {[{ label: "Countries", val: 3 }, { label: "Provinces", val: 14 }, { label: "Cities", val: 127 }].map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{r.label}</span>
              <span className="font-bold text-blue-600">{r.val}</span>
            </div>
          ))}
        </div>
      )}
      {done && <p className="text-sm text-green-600 font-semibold">✅ Locations imported successfully!</p>}
      <div className="flex gap-2">
        {!preview ? (
          <button onClick={() => setPreview(true)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Preview Import</button>
        ) : !done ? (
          <button onClick={() => setDone(true)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Confirm Import</button>
        ) : null}
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Download size={14} /> Template
        </button>
      </div>
    </div>
  );
}

function Card4MarketingUsers() {
  const [preview, setPreview] = useState(false);
  const [done, setDone] = useState(false);
  const PREVIEW_STATS = { matched: 42, new: 18, dupes: 7 };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><Users size={20} className="text-orange-500" /></div>
        <div><p className="font-black text-gray-900">Import & Sync Marketing Users</p><p className="text-xs text-gray-400">Upload prospects CSV to sync with user database and create sales leads</p></div>
      </div>
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        Upload a CSV of prospects to sync with your user database and match against existing users.
        Unmatched users become leads for the sales team to contact.
      </p>
      <UploadDropzone label="Drop CSV prospects file here" accept=".csv" />
      {preview && !done && (
        <div className="bg-orange-50 rounded-xl p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">Preview Matches</p>
          {[
            { label: "Matched existing users", val: PREVIEW_STATS.matched, color: "text-green-600" },
            { label: "New leads to create", val: PREVIEW_STATS.new, color: "text-orange-600" },
            { label: "Duplicates skipped", val: PREVIEW_STATS.dupes, color: "text-gray-500" },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{r.label}</span>
              <span className={`font-black ${r.color}`}>{r.val}</span>
            </div>
          ))}
        </div>
      )}
      {done && (
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-green-700">✅ Import complete! {PREVIEW_STATS.new} new leads added to Contact CRM.</p>
        </div>
      )}
      <div className="flex gap-2">
        {!preview ? (
          <button onClick={() => setPreview(true)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Preview Matches</button>
        ) : !done ? (
          <button onClick={() => setDone(true)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Confirm Import</button>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminImport() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Import Data</h1>
        <p className="text-gray-500 text-sm">Import properties, locations, translations, and marketing users</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card1SiteImport />
        <Card2Translation />
        <Card3Locations />
        <Card4MarketingUsers />
        <ImportUsersCard />
      </div>
    </div>
  );
}
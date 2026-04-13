import { useState, useRef } from "react";
import { Upload, Copy, Trash2, FileImage, FileText, Film, File, Check } from "lucide-react";

const TYPE_ICONS = {
  image: FileImage,
  pdf: FileText,
  video: Film,
  other: File,
};
const TYPE_COLORS = {
  image: "text-blue-500 bg-blue-50",
  pdf: "text-red-500 bg-red-50",
  video: "text-purple-500 bg-purple-50",
  other: "text-gray-500 bg-gray-50",
};

const MOCK_FILES = Array.from({ length: 16 }, (_, i) => ({
  id: `file-${i}`,
  name: ["property-photo-01.jpg", "villa-brochure.pdf", "promo-video.mp4", "floor-plan.jpg", "agency-logo.png", "project-render.jpg", "legal-doc.pdf", "tour-video.mp4", "hero-banner.jpg", "district-map.pdf", "team-photo.jpg", "aerial-view.mp4", "studio-gallery.jpg", "buyer-guide.pdf", "amenities-list.jpg", "site-plan.png"][i],
  type: ["image", "pdf", "video", "image", "image", "image", "pdf", "video", "image", "pdf", "image", "video", "image", "pdf", "image", "image"][i],
  size: ["1.2 MB", "340 KB", "18.4 MB", "890 KB", "210 KB", "2.1 MB", "456 KB", "24.7 MB", "1.8 MB", "312 KB", "1.1 MB", "31.2 MB", "980 KB", "520 KB", "740 KB", "1.4 MB"][i],
  date: `2026-03-${String((i % 17) + 1).padStart(2, "0")}`,
  uploader: ["Admin", "Agent Ahmed", "Agency Fatima", "Admin"][i % 4],
  url: `https://cdn.kemedar.com/uploads/file-${i}.jpg`,
  thumb: i % 3 !== 1 && i % 3 !== 2 ? `https://images.unsplash.com/photo-${["1545324418-cc1a3fa10c00", "1600596542815-ffad4c1539a9", "1497366216548-37526070297c", "1502672260266-1c1ef2d93688", "1512917774080-9991f1c4c750", "1570129477492-45c003edd2be"][i % 6]}?w=200&q=60` : null,
}));

export default function AdminMedia() {
  const [files, setFiles] = useState(MOCK_FILES);
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [uploaderFilter, setUploaderFilter] = useState("all");
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(null);
  const inputRef = useRef();

  const filtered = files.filter((f) => {
    const matchType = typeFilter === "all" || f.type === typeFilter;
    const matchDate = !dateFilter || f.date === dateFilter;
    const matchUploader = uploaderFilter === "all" || f.uploader === uploaderFilter;
    return matchType && matchDate && matchUploader;
  });

  const copyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  const deleteFile = (id) => setFiles((f) => f.filter((x) => x.id !== id));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Media Library</h1>
        <p className="text-gray-500 text-sm">{filtered.length} files</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragging ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"}`}
      >
        <input ref={inputRef} type="file" multiple accept="image/*,.pdf,video/*" className="hidden" />
        <Upload size={32} className={`mx-auto mb-3 ${dragging ? "text-orange-500" : "text-gray-300"}`} />
        <p className="font-bold text-gray-700">Drop files here or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG, PDF, MP4 — Max 50MB per file</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="pdf">PDFs</option>
          <option value="video">Videos</option>
        </select>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
        <select value={uploaderFilter} onChange={(e) => setUploaderFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option value="all">All Uploaders</option>
          <option>Admin</option>
          <option>Agent Ahmed</option>
          <option>Agency Fatima</option>
        </select>
        <span className="ml-auto text-sm text-gray-500 self-center">{filtered.length} results</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {filtered.map((file) => {
          const Icon = TYPE_ICONS[file.type] || File;
          const iconColor = TYPE_COLORS[file.type] || TYPE_COLORS.other;
          return (
            <div key={file.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-28 bg-gray-50 flex items-center justify-center overflow-hidden">
                {file.thumb ? (
                  <img src={file.thumb} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
                    <Icon size={24} />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-800 truncate" title={file.name}>{file.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{file.size} · {file.type.toUpperCase()}</p>
                <p className="text-[10px] text-gray-400">{file.date}</p>
                <div className="flex gap-1 mt-2">
                  <button onClick={() => copyUrl(file.id, file.url)} title="Copy URL"
                    className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-gray-600 hover:text-blue-600 transition-colors">
                    {copied === file.id ? <><Check size={10} className="text-green-500" /> Copied</> : <><Copy size={10} /> URL</>}
                  </button>
                  <button onClick={() => deleteFile(file.id)} title="Delete"
                    className="w-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
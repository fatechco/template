import { useState } from 'react';
import { ChevronLeft, Plus, Download, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FOLDERS = [
  { id: 1, name: "Invoice Templates", icon: "📄", count: 12 },
  { id: 2, name: "Contract Templates", icon: "📝", count: 8 },
  { id: 3, name: "Kemedar Letterhead", icon: "📌", count: 5 },
  { id: 4, name: "Business Card Templates", icon: "🎨", count: 3 },
  { id: 5, name: "Signs & Banners", icon: "🖼", count: 15 },
  { id: 6, name: "Resources & Courses", icon: "📚", count: 24 },
];

const FILES = [
  { id: 1, name: "Invoice_Template_2026.pdf", icon: "📄", type: "PDF", size: "2.4 MB", date: "Mar 20" },
  { id: 2, name: "Standard_Contract.docx", icon: "📝", type: "Word", size: "1.2 MB", date: "Mar 19" },
  { id: 3, name: "Banner_Design.psd", icon: "🎨", type: "PSD", size: "5.8 MB", date: "Mar 18" },
];

export default function FranchiseOwnerFilesMobile() {
  const navigate = useNavigate();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => currentFolder ? setCurrentFolder(null) : navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">{currentFolder ? currentFolder.name : "File Manager"}</h1>
        <button onClick={() => setShowUpload(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Upload size={22} className="text-gray-900" />
        </button>
      </div>

      {!currentFolder ? (
        /* Folder Grid */
        <div className="p-4 grid grid-cols-2 gap-3">
          {FOLDERS.map(folder => (
            <button key={folder.id} onClick={() => setCurrentFolder(folder)}
              className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow text-center"
            >
              <p className="text-4xl mb-2">{folder.icon}</p>
              <p className="font-bold text-sm text-gray-900 line-clamp-2">{folder.name}</p>
              <p className="text-xs text-gray-500 mt-1">{folder.count} files</p>
            </button>
          ))}
        </div>
      ) : (
        /* File List */
        <div className="p-4 space-y-2">
          {FILES.map(file => (
            <div key={file.id} className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-3 active:bg-gray-50">
              <span className="text-2xl">{file.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{file.size} • {file.date}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload FAB */}
      <button onClick={() => setShowUpload(true)} className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg hover:bg-orange-700 active:scale-95 transition-transform">
        <Plus size={24} />
      </button>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5">
            <h2 className="text-lg font-black text-gray-900 mb-4">Upload File</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-4">
              <p className="text-3xl mb-2">📁</p>
              <p className="text-sm font-bold text-gray-700">Tap to select file</p>
              <input type="file" multiple className="mt-2 w-full" />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowUpload(false)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-lg text-sm">Cancel</button>
              <button className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-orange-700">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
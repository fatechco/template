import { useState } from 'react';
import { ChevronRight, Upload, FolderPlus, Search, Grid3x3, List, Download, Trash2, Copy, MoreVertical, Eye } from 'lucide-react';

const FOLDERS = [
  { id: 1, name: "Invoice Templates", icon: "📄", count: 12 },
  { id: 2, name: "Contract Templates", icon: "📝", count: 8 },
  { id: 3, name: "Kemedar Letterhead", icon: "📌", count: 5 },
  { id: 4, name: "Business Card Templates", icon: "🎨", count: 3 },
  { id: 5, name: "Signs & Banners", icon: "🖼", count: 15 },
  { id: 6, name: "Resources & Courses", icon: "📚", count: 24 },
  { id: 7, name: "Kemedar Keep", icon: "💾", count: 7 },
  { id: 8, name: "Company Documents", icon: "📋", count: 34 },
  { id: 9, name: "Employee Documents", icon: "👤", count: 45 },
  { id: 10, name: "Other Documents", icon: "📦", count: 28 },
];

const FILES = [
  { id: 1, name: "Invoice_Template_2026.pdf", type: "PDF", icon: "📄", color: "bg-red-50", size: "2.4 MB", date: "Mar 20" },
  { id: 2, name: "Standard_Contract.docx", type: "Word", icon: "📝", color: "bg-blue-50", size: "1.2 MB", date: "Mar 19" },
  { id: 3, name: "Banner_Design.psd", type: "PSD", icon: "🎨", color: "bg-purple-50", size: "5.8 MB", date: "Mar 18" },
  { id: 4, name: "Product_Photo.jpg", type: "Image", icon: "🖼", color: "bg-teal-50", size: "3.2 MB", date: "Mar 17" },
  { id: 5, name: "Training_Video.mp4", type: "Video", icon: "🎬", color: "bg-purple-50", size: "145 MB", date: "Mar 16" },
  { id: 6, name: "Kemedar_Presentation.pptx", type: "PowerPoint", icon: "🎯", color: "bg-orange-50", size: "8.5 MB", date: "Mar 15" },
];

export default function FranchiseOwnerFiles() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const currentFolderName = selectedFolder ? FOLDERS.find(f => f.id === selectedFolder)?.name : "Root";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-black text-gray-900">File Manager</h1>
        </div>

        {/* Folder Tree */}
        <div className="flex-1 overflow-y-auto">
          {FOLDERS.map(folder => (
            <button key={folder.id} onClick={() => setSelectedFolder(folder.id)}
              className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 border-l-4 transition-all ${
                selectedFolder === folder.id
                  ? "bg-orange-50 border-orange-600 text-orange-600"
                  : "border-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{folder.icon}</span>
              <span className="flex-1 truncate">{folder.name}</span>
              <span className="text-xs text-gray-500">{folder.count}</span>
            </button>
          ))}
        </div>

        {/* Storage Usage */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-700 mb-2">Storage Used</p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
            <div className="h-full w-6/12 bg-orange-500"></div>
          </div>
          <p className="text-xs text-gray-600">45.2 GB / 100 GB</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <button className="text-gray-600 hover:text-gray-900">📁</button>
              <span className="font-bold text-gray-900">{currentFolderName}</span>
              {selectedFolder && <ChevronRight size={16} className="text-gray-400" />}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"}`}>
                <Grid3x3 size={18} />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"}`}>
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-bold text-sm rounded-lg hover:bg-orange-700">
              <Upload size={16} /> Upload
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50">
              <FolderPlus size={16} /> New Folder
            </button>
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search files..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>
        </div>

        {/* File Content */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-4 gap-4">
              {FILES.map(file => (
                <div key={file.id} className={`${file.color} rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-shadow group`}>
                  <p className="text-5xl mb-2">{file.icon}</p>
                  <p className="text-xs font-bold text-gray-900 line-clamp-2">{file.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{file.size}</p>
                  <p className="text-xs text-gray-500">{file.date}</p>
                  <div className="flex gap-1 mt-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-gray-200/50 rounded text-gray-600"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-200/50 rounded text-gray-600"><Download size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-200/50 rounded text-gray-600"><MoreVertical size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">File</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Size</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Modified</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {FILES.map(file => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span className="text-2xl">{file.icon}</span>
                        <span className="font-bold text-gray-900">{file.name}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{file.type}</td>
                      <td className="px-4 py-3 text-gray-600">{file.size}</td>
                      <td className="px-4 py-3 text-gray-600">{file.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Eye size={16} /></button>
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Download size={16} /></button>
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Copy size={16} /></button>
                          <button className="p-1.5 hover:bg-gray-100 rounded text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Upload File</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6 hover:border-orange-400 transition-colors">
              <p className="text-4xl mb-2">📁</p>
              <p className="text-sm font-bold text-gray-700 mb-1">Drag files here or click to browse</p>
              <input type="file" multiple className="mt-2 w-full" />
            </div>

            <input type="text" placeholder="Add tags/description (optional)" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-orange-400" />

            <div className="flex gap-3">
              <button onClick={() => setShowUpload(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
              <button className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
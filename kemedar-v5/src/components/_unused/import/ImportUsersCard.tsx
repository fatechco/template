"use client";
// @ts-nocheck
import { useState, useRef } from "react";
import { Upload, Users, Download, Loader } from "lucide-react";

const USER_ROLES = [
  "Common User",
  "Agent",
  "Agency",
  "Developer",
  "Professional",
  "Finishing Company",
  "Product Seller",
];

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
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/40"}`}
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

export default function ImportUsersCard() {
  const [selectedRole, setSelectedRole] = useState("Common User");
  const [preview, setPreview] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const PREVIEW_STATS = { total: 34, new: 28, updated: 6 };

  const handlePreview = () => {
    setPreview(true);
  };

  const handleImport = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Users size={20} className="text-blue-500" />
        </div>
        <div>
          <p className="font-black text-gray-900">Import Users by Role</p>
          <p className="text-xs text-gray-400">Upload CSV to import users with specific roles</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Select User Role</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none cursor-pointer focus:border-blue-400"
        >
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <UploadDropzone label="Drop CSV users file here" accept=".csv" />

      {preview && !done && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">Preview Import</p>
          {[
            { label: "Total records", val: PREVIEW_STATS.total, color: "text-blue-600" },
            { label: "New users to create", val: PREVIEW_STATS.new, color: "text-green-600" },
            { label: "Existing users to update", val: PREVIEW_STATS.updated, color: "text-orange-600" },
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
          <p className="text-sm font-semibold text-green-700">
            ✅ Import complete! {PREVIEW_STATS.new} new users created with role "{selectedRole}".
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {!preview ? (
          <button
            onClick={handlePreview}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
          >
            Preview Import
          </button>
        ) : !done ? (
          <button
            onClick={handleImport}
            disabled={running}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
          >
            {running ? (
              <>
                <Loader size={14} className="animate-spin" /> Importing...
              </>
            ) : (
              "Confirm Import"
            )}
          </button>
        ) : null}
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Download size={14} /> Template
        </button>
      </div>
    </div>
  );
}
import { Upload, Download, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function CSVImportTemplate({ title, description, template }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleStartImport = () => {
    setImporting(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 30;
      setProgress(Math.min(p, 95));
      if (p >= 95) clearInterval(interval);
    }, 500);
    setTimeout(() => {
      setProgress(100);
      setImporting(false);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">{title}</h1>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      {/* Step 1: Download Template */}
      {step >= 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Download Template
          </h2>
          <p className="text-sm text-gray-700">Download the CSV template to ensure correct format</p>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700">
            <Download size={16} /> Download Template
          </button>
        </div>
      )}

      {/* Step 2: Upload File */}
      {step >= 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Upload File
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-orange-500 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer space-y-2">
              <p className="text-sm font-bold text-gray-900">📤 Drop your CSV or Excel file here</p>
              <p className="text-xs text-gray-600">OR <span className="text-orange-600 font-bold">Browse Files</span></p>
              <p className="text-xs text-gray-500 mt-2">Accepted: .csv, .xlsx, .xls | Max size: 50MB</p>
            </label>
          </div>
          {file && <p className="text-sm font-bold text-green-600">✅ {file.name} selected</p>}
        </div>
      )}

      {/* Step 3: Preview */}
      {step >= 3 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            Preview
          </h2>
          <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-bold text-gray-700">Column 1</th>
                  <th className="px-3 py-2 text-left font-bold text-gray-700">Column 2</th>
                  <th className="px-3 py-2 text-left font-bold text-gray-700">Column 3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2">Data {i}</td>
                    <td className="px-3 py-2">Data {i}</td>
                    <td className="px-3 py-2">Data {i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step 4: Import Options */}
      {step >= 4 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
            Import Options
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Duplicate Handling</p>
              {[
                { id: "skip", label: "Skip duplicates" },
                { id: "update", label: "Update existing records" },
                { id: "create", label: "Create new + keep existing" }
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="duplicate" value={opt.id} defaultChecked={opt.id === "skip"} />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Status After Import</p>
              {[
                { id: "pending", label: "Import as Pending" },
                { id: "active", label: "Import as Active" }
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="status" value={opt.id} defaultChecked={opt.id === "pending"} />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>

            <label className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" defaultChecked />
              <span className="text-sm text-gray-700">Send notification to users</span>
            </label>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {importing && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
          <p className="text-sm font-bold text-gray-900">Importing...</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-orange-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-gray-600">{progress}% complete</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50">
            ← Back
          </button>
        )}
        {step < 4 && (
          <button onClick={() => setStep(step + 1)} className="flex-1 px-4 py-2.5 bg-gray-600 text-white rounded-lg font-bold text-sm hover:bg-gray-700">
            Next →
          </button>
        )}
        {step === 4 && (
          <button onClick={handleStartImport} disabled={importing} className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 disabled:opacity-50">
            🚀 Start Import
          </button>
        )}
      </div>
    </div>
  );
}
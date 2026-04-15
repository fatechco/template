// @ts-nocheck
import { Download, Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";

const DOCUMENTS = [
  { id: 1, name: "National ID", type: "ID Document", status: "Verified", uploaded: "Jan 15, 2026" },
  { id: 2, name: "Driver License", type: "License", status: "Verified", uploaded: "Jan 15, 2026" },
  { id: 3, name: "Vehicle Registration", type: "Vehicle Doc", status: "Verified", uploaded: "Jan 16, 2026" },
  { id: 4, name: "Insurance Certificate", type: "Insurance", status: "Verified", uploaded: "Jan 16, 2026" },
  { id: 5, name: "Tax ID", type: "Tax Document", status: "Pending", uploaded: "Mar 18, 2026" },
];

export default function ShipperMobileDocuments() {
  const verified = DOCUMENTS.filter(d => d.status === "Verified").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Documents</h1>
        <p className="text-gray-500 text-sm mt-1">{verified}/{DOCUMENTS.length} documents verified</p>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(verified/DOCUMENTS.length)*100}%` }} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Uploaded Documents</h3>
          <button className="text-xs font-bold text-green-600 flex items-center gap-1 hover:underline">
            <Upload size={12} /> Add
          </button>
        </div>
        
        <div className="space-y-2">
          {DOCUMENTS.map((doc) => (
            <div key={doc.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{doc.name}</p>
                <p className="text-xs text-gray-500 mt-1">{doc.type}</p>
                <p className="text-xs text-gray-400 mt-0.5">Uploaded: {doc.uploaded}</p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                {doc.status === "Verified" ? (
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-yellow-600 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="font-bold text-blue-900 text-sm mb-2">Verification Status</p>
        <p className="text-xs text-blue-800">All critical documents are verified. Your account is fully active for shipments.</p>
      </div>
    </div>
  );
}
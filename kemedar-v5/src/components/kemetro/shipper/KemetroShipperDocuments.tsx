// @ts-nocheck
import { Upload, CheckCircle } from "lucide-react";

const DOCS = [
  { label: "National ID / Passport", status: "verified" },
  { label: "Commercial License", status: "verified" },
  { label: "Vehicle Registration", status: "pending" },
  { label: "Insurance Certificate", status: "missing" },
];

export default function KemetroShipperDocuments() {
  return (
    <div className="space-y-5 max-w-xl">
      <h1 className="text-2xl font-black text-gray-900">Documents</h1>
      <div className="space-y-4">
        {DOCS.map(doc => (
          <div key={doc.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {doc.status === "verified" ? <CheckCircle size={20} className="text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
              <div>
                <p className="font-bold text-gray-900 text-sm">{doc.label}</p>
                <p className={`text-xs font-semibold ${doc.status === "verified" ? "text-green-600" : doc.status === "pending" ? "text-orange-600" : "text-gray-400"}`}>
                  {doc.status === "verified" ? "Verified ✅" : doc.status === "pending" ? "Under Review" : "Not uploaded"}
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors">
              <Upload size={13} /> Upload
              <input type="file" className="hidden" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from "react";
import { Upload, Loader2, Check, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function KYCForm({ accountId, onSuccess }) {
  const [fullName, setFullName] = useState("");
  const [idType, setIdType] = useState("national_id");
  const [idNumber, setIdNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    for (const file of files) {
      try {
        const result = await base44.integrations.Core.UploadFile({ file });
        setDocuments(prev => [...prev, {
          type: file.name.split(".")[0],
          url: result.data.file_url,
          name: file.name,
          uploadedAt: new Date().toISOString()
        }]);
      } catch (err) {
        setError("Failed to upload file");
      }
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !idNumber || documents.length === 0) {
      setError("Please fill all required fields and upload at least one document");
      return;
    }

    setSubmitting(true);
    try {
      await base44.entities.EscrowAccount.update(accountId, {
        kycStatus: "submitted",
        verificationDocuments: documents,
        verificationLevel: "basic"
      });
      onSuccess?.();
    } catch (err) {
      setError("Failed to submit KYC");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-black text-lg text-gray-900">KYC Verification</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
          placeholder="Your legal full name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ID Type *</label>
          <select
            value={idType}
            onChange={e => setIdType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
          >
            <option value="national_id">National ID</option>
            <option value="passport">Passport</option>
            <option value="driver_license">Driver License</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ID Number *</label>
          <input
            type="text"
            value={idNumber}
            onChange={e => setIdNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
            placeholder="ID number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={e => setDateOfBirth(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">Upload Documents *</label>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="doc-upload"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor="doc-upload" className="cursor-pointer block">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">Click to upload or drag</p>
            <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 10MB)</p>
          </label>
        </div>

        {documents.length > 0 && (
          <div className="mt-3 space-y-2">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">{doc.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {submitting ? "Submitting..." : "Submit KYC"}
      </button>
    </form>
  );
}
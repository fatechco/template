import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import { Upload } from "lucide-react";

export default function SupportNewPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    module: "kemetro",
    category: "order",
    priority: "medium",
    description: "",
    files: [],
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate("/m/dashboard/support");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">✅</p>
          <p className="text-2xl font-black text-gray-900">Ticket Submitted!</p>
          <p className="text-blue-600 text-lg font-bold mt-2">Ticket #TK-004</p>
          <p className="text-gray-600 text-sm mt-3">Our team will respond within 24 hours</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 flex items-start justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col relative">
        <MobileTopBar title="New Support Ticket" showBack />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Subject */}
          <div>
            <label className="text-sm font-bold text-gray-900">Subject *</label>
            <input
              type="text"
              placeholder="Briefly describe your issue"
              maxLength={100}
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 mt-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{form.subject.length}/100</p>
          </div>

          {/* Module */}
          <div>
            <label className="text-sm font-bold text-gray-900">Module *</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { id: "kemetro", label: "🛒 Kemetro", color: "blue" },
                { id: "kemedar", label: "🏠 Kemedar", color: "orange" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleChange("module", m.id)}
                  className={`py-3 rounded-2xl font-bold text-sm transition-all ${
                    form.module === m.id
                      ? m.color === "blue"
                        ? "bg-blue-600 text-white"
                        : "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-bold text-gray-900">Category *</label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 mt-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="order">Order Issue</option>
              <option value="payment">Payment Problem</option>
              <option value="product">Product Issue</option>
              <option value="account">Account Problem</option>
              <option value="shipping">Shipping Issue</option>
              <option value="technical">Technical Bug</option>
              <option value="refund">Refund Request</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-bold text-gray-900">Priority</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { id: "low", label: "🟢 Low" },
                { id: "medium", label: "🟡 Medium" },
                { id: "high", label: "🔴 High" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleChange("priority", p.id)}
                  className={`py-2.5 rounded-lg font-bold text-xs transition-all ${
                    form.priority === p.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-bold text-gray-900">Description *</label>
            <textarea
              placeholder="Describe your issue in detail..."
              maxLength={2000}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 mt-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-1">{form.description.length}/2000</p>
          </div>

          {/* Attachments */}
          <div>
            <label className="text-sm font-bold text-gray-900">Attachments (optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center mt-2">
              <Upload size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-900">Add screenshots or files</p>
              <p className="text-xs text-gray-600 mt-1">PNG, JPG, PDF — Max 5MB each</p>
              <button className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200">
                Choose Files
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-2xl transition-colors"
          >
            📤 Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
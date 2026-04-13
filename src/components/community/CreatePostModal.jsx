import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, Image, Plus, Minus } from "lucide-react";

const POST_TYPES = [
  { id: "general", icon: "💬", label: "General Post", desc: "Share news or thoughts" },
  { id: "question", icon: "❓", label: "Ask Neighbors", desc: "Get help or advice" },
  { id: "alert", icon: "⚡", label: "Alert Neighbors", desc: "Report an issue", adminOnly: false },
  { id: "announcement", icon: "📢", label: "Announcement", desc: "Official update", adminOnly: true },
  { id: "recommendation", icon: "⭐", label: "Recommend", desc: "Share a great service" },
  { id: "marketplace", icon: "🛍", label: "Marketplace", desc: "Sell, give or swap" },
  { id: "poll", icon: "📊", label: "Create Poll", desc: "Get community opinion" },
  { id: "help_request", icon: "🔧", label: "Need Help", desc: "Home service request" },
];

const ALERT_TYPES = [
  { id: "water_cut", icon: "💧", label: "Water Cut" },
  { id: "power_outage", icon: "⚡", label: "Power Outage" },
  { id: "gas_cut", icon: "🔥", label: "Gas Cut" },
  { id: "internet_outage", icon: "📶", label: "Internet" },
  { id: "security_incident", icon: "🔒", label: "Security" },
  { id: "maintenance", icon: "🔧", label: "Maintenance" },
  { id: "flooding", icon: "🌊", label: "Flooding" },
  { id: "emergency", icon: "🚨", label: "Emergency" },
];

export default function CreatePostModal({ communityId, currentUser, isAdmin, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1=type, 2=compose
  const [postType, setPostType] = useState(null);
  const [form, setForm] = useState({
    title: "", content: "", isAnonymous: false,
    alertType: null, alertArea: "",
    pollOptions: [{ optionId: "1", optionText: "", votes: 0 }, { optionId: "2", optionText: "", votes: 0 }],
    pollEndsAt: "",
    mediaUrls: [],
    price: "", condition: "good", listingType: "for_sale",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const update = p => setForm(prev => ({ ...prev, ...p }));

  const handleSelectType = (type) => {
    setPostType(type);
    setStep(2);
  };

  const addPollOption = () => {
    if (form.pollOptions.length >= 6) return;
    update({ pollOptions: [...form.pollOptions, { optionId: String(Date.now()), optionText: "", votes: 0 }] });
  };

  const updatePollOption = (idx, text) => {
    const opts = [...form.pollOptions];
    opts[idx] = { ...opts[idx], optionText: text };
    update({ pollOptions: opts });
  };

  const handleSubmit = async () => {
    if (!form.content.trim() && postType !== "poll") return;
    setSubmitting(true);

    const payload = {
      communityId,
      postType,
      content: form.content || form.title || (postType === "poll" ? "Community Poll" : ""),
      title: form.title || null,
      isAnonymous: form.isAnonymous,
      mediaUrls: form.mediaUrls,
      alertType: form.alertType,
      alertArea: form.alertArea || null,
      pollOptions: postType === "poll" ? form.pollOptions.filter(o => o.optionText.trim()) : null,
      pollEndsAt: form.pollEndsAt ? new Date(form.pollEndsAt).toISOString() : null,
    };

    const resp = await base44.functions.invoke("createCommunityPost", payload);
    setSubmitting(false);
    setResult(resp.data);
    if (resp.data?.success) {
      setTimeout(() => { onSuccess?.(); onClose(); }, 1500);
    }
  };

  const canSubmit = postType === "poll"
    ? form.pollOptions.filter(o => o.optionText.trim()).length >= 2
    : form.content.trim().length >= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            {step === 2 && <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-700">←</button>}
            <h2 className="font-black text-gray-900">{step === 1 ? "New Post" : postType ? POST_TYPES.find(t => t.id === postType)?.icon + " " + POST_TYPES.find(t => t.id === postType)?.label : "New Post"}</h2>
          </div>
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={handleSubmit} disabled={!canSubmit || submitting}
                className="bg-orange-500 text-white font-bold px-4 py-1.5 rounded-xl text-sm hover:bg-orange-600 disabled:opacity-50 transition-colors">
                {submitting ? "Posting..." : "Post"}
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
          </div>
        </div>

        <div className="p-5">
          {result?.success && (
            <div className="text-center py-8">
              <p className="text-5xl mb-3">✅</p>
              <p className="font-black text-gray-900 text-lg">Posted!</p>
              {result.kemeworkCategory && (
                <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm text-teal-700">
                  💡 Need help? Find a <strong>{result.kemeworkCategory}</strong> professional on Kemework
                </div>
              )}
            </div>
          )}

          {!result && step === 1 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">What would you like to share?</p>
              <div className="grid grid-cols-2 gap-3">
                {POST_TYPES.filter(t => !t.adminOnly || isAdmin).map(t => (
                  <button key={t.id} onClick={() => handleSelectType(t.id)}
                    className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all text-center group">
                    <span className="text-3xl">{t.icon}</span>
                    <span className="font-bold text-gray-900 text-sm">{t.label}</span>
                    <span className="text-xs text-gray-400">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!result && step === 2 && (
            <div className="space-y-4">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-black text-orange-600">
                  {form.isAnonymous ? "👤" : currentUser?.full_name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">{form.isAnonymous ? "Anonymous Neighbor" : currentUser?.full_name}</p>
                  <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                    <input type="checkbox" checked={form.isAnonymous} onChange={e => update({ isAnonymous: e.target.checked })} className="accent-orange-500" />
                    Post anonymously
                  </label>
                </div>
              </div>

              {/* Alert type */}
              {postType === "alert" && (
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-2">Alert Type *</p>
                  <div className="grid grid-cols-4 gap-2">
                    {ALERT_TYPES.map(a => (
                      <button key={a.id} onClick={() => update({ alertType: a.id })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all text-center ${form.alertType === a.id ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"}`}>
                        <span className="text-xl">{a.icon}</span>
                        <span className="text-[10px] font-bold text-gray-700">{a.label}</span>
                      </button>
                    ))}
                  </div>
                  <input value={form.alertArea} onChange={e => update({ alertArea: e.target.value })}
                    placeholder="Affected area (e.g., Building B, Floors 3-6)"
                    className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              )}

              {/* Title */}
              {["announcement", "event", "marketplace"].includes(postType) && (
                <input value={form.title} onChange={e => update({ title: e.target.value })}
                  placeholder="Title..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-orange-400" />
              )}

              {/* Content */}
              {postType !== "poll" && (
                <textarea value={form.content} onChange={e => update({ content: e.target.value })}
                  placeholder={postType === "alert" ? "Describe the situation..." : postType === "recommendation" ? "Share your experience..." : "Share with your community..."}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              )}

              {/* Poll */}
              {postType === "poll" && (
                <div className="space-y-3">
                  <textarea value={form.content} onChange={e => update({ content: e.target.value })}
                    placeholder="Your question..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
                  {form.pollOptions.map((opt, idx) => (
                    <div key={opt.optionId} className="flex items-center gap-2">
                      <input value={opt.optionText} onChange={e => updatePollOption(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}...`}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                      {form.pollOptions.length > 2 && (
                        <button onClick={() => update({ pollOptions: form.pollOptions.filter((_, i) => i !== idx) })} className="text-gray-400 hover:text-red-500">
                          <Minus size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  {form.pollOptions.length < 6 && (
                    <button onClick={addPollOption} className="flex items-center gap-2 text-sm text-orange-500 font-bold hover:underline">
                      <Plus size={14} /> Add Option
                    </button>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Poll end date</p>
                    <input type="datetime-local" value={form.pollEndsAt} onChange={e => update({ pollEndsAt: e.target.value })}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                </div>
              )}

              {/* Submit button (mobile fallback) */}
              <button onClick={handleSubmit} disabled={!canSubmit || submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm disabled:opacity-50 transition-colors">
                {submitting ? "Posting..." : "📢 Post to Community"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
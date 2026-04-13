import { Bot, Zap, AlertTriangle, TrendingUp, MessageCircle, Star } from "lucide-react";

export default function ContactAITab({ contact }) {
  return (
    <div className="space-y-4">
      {/* Placeholder banner */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Bot size={18} />
          <h3 className="text-sm font-black">AI Insights</h3>
          <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">PLACEHOLDER — AI ENGINE NOT ACTIVE</span>
        </div>
        <p className="text-xs text-white/80">When AI is enabled, this tab will provide real-time battle-cards, risk scoring, and next-best-action recommendations.</p>
      </div>

      {/* Contact Summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bot size={16} className="text-violet-500" />
          <h4 className="text-sm font-black text-gray-900">Contact Summary</h4>
        </div>
        <div className="bg-violet-50 rounded-xl p-4 text-xs text-gray-700 leading-relaxed border border-violet-100">
          <p><strong>{contact.displayName}</strong> is an active {contact.primaryRole.replace(/_/g, " ")} in {contact.city} with a score of {contact.score}/100. 
          They were acquired via {contact.source} and prefer {contact.preferredChannel} communication. 
          Their next follow-up is {contact.nextFollowupAt || "not scheduled"}.</p>
          <p className="mt-2 text-[10px] text-violet-400 italic">Generated from cached profile data — full AI analysis available when AI engine is connected.</p>
        </div>
      </div>

      {/* Battle-card fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            icon: <Star size={14} className="text-yellow-500" />,
            title: "Why Contact Now",
            color: "border-yellow-200 bg-yellow-50/30",
            placeholder: "Renewal approaching in 30 days. Last contacted 3 days ago. High intent score.",
          },
          {
            icon: <MessageCircle size={14} className="text-blue-500" />,
            title: "Key Facts to Mention",
            color: "border-blue-200 bg-blue-50/30",
            placeholder: "Has 12 active listings. Previously responded positively to upgrade offers. Arabic preferred.",
          },
          {
            icon: <AlertTriangle size={14} className="text-orange-500" />,
            title: "Likely Objections",
            color: "border-orange-200 bg-orange-50/30",
            placeholder: "Price increase concerns. May compare with competitor platforms.",
          },
          {
            icon: <TrendingUp size={14} className="text-green-500" />,
            title: "Recommended Next Action",
            color: "border-green-200 bg-green-50/30",
            placeholder: "Send renewal offer template via WhatsApp in morning. Follow up with call if no response in 24h.",
          },
          {
            icon: <Bot size={14} className="text-violet-500" />,
            title: "Suggested Template",
            color: "border-violet-200 bg-violet-50/30",
            placeholder: "renewal_offer_agent_ar — WhatsApp template (Pending approval)",
          },
          {
            icon: <AlertTriangle size={14} className="text-red-500" />,
            title: "Risk Flags",
            color: "border-red-200 bg-red-50/30",
            placeholder: "No contact in 3 days. Renewal in 30 days. 3 expired listings not relisted.",
          },
        ].map(({ icon, title, color, placeholder }) => (
          <div key={title} className={`rounded-xl border p-4 ${color}`}>
            <div className="flex items-center gap-2 mb-2">{icon}<p className="text-xs font-black text-gray-800">{title}</p></div>
            <p className="text-xs text-gray-600">{placeholder}</p>
            <p className="text-[10px] text-gray-400 mt-2 italic">Placeholder — AI engine not connected</p>
          </div>
        ))}
      </div>

      {/* Confidence / Scores */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h4 className="text-sm font-black text-gray-900 mb-4">AI Scores (Placeholder)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Intent Score", val: 72, color: "bg-blue-500" },
            { label: "Churn Risk", val: 34, color: "bg-red-400" },
            { label: "Upsell Likelihood", val: 61, color: "bg-green-500" },
            { label: "Engagement", val: 58, color: "bg-violet-500" },
          ].map(({ label, val, color }) => (
            <div key={label} className="text-center">
              <div className="relative w-14 h-14 mx-auto">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" className={color.replace("bg-", "stroke-")}
                    strokeWidth="3" strokeDasharray={`${val * 0.942} 94.2`} strokeLinecap="round"
                    style={{ stroke: color === "bg-blue-500" ? "#3B82F6" : color === "bg-red-400" ? "#F87171" : color === "bg-green-500" ? "#22C55E" : "#7C3AED" }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-gray-700">{val}</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
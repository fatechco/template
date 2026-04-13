import { useState } from 'react';
import { ChevronLeft, Send, Save, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CAMPAIGNS = [
  { id: 1, date: "Mar 20", type: "WhatsApp", recipients: 245, delivered: 238 },
  { id: 2, date: "Mar 13", type: "Email", recipients: 312, delivered: 305 },
];

export default function FranchiseOwnerBulkCommsMobile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [message, setMessage] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState(["owners", "agents"]);

  const estimatedRecipients = selectedRecipients.length * 50;

  return (
    <div className="min-h-full bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Bulk Communications</h1>
      </div>

      {/* Channel Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-2 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: "whatsapp", label: "📱 WhatsApp" },
          { id: "email", label: "📧 Email" },
          { id: "calls", label: "📞 Calls" },
          { id: "sms", label: "📱 SMS" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              activeTab === tab.id ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "whatsapp" && (
        <div className="p-4 space-y-4">
          {/* Recent Campaigns */}
          <div>
            <p className="text-sm font-black text-gray-900 mb-2">Recent Campaigns</p>
            <div className="space-y-2">
              {CAMPAIGNS.map(c => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-purple-100 text-purple-700">{c.type}</span>
                    <span className="text-xs text-gray-600">{c.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">📊 {c.delivered}/{c.recipients} delivered</p>
                </div>
              ))}
            </div>
          </div>

          {/* Compose */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
            <h2 className="font-black text-gray-900">Compose Message</h2>

            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message..." className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-400 resize-none h-20" />

            <div className="text-xs text-gray-600">{message.length}/1000 chars</div>

            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">Send to:</p>
              <div className="space-y-1">
                {["owners", "agents", "sellers"].map(r => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedRecipients.includes(r)} onChange={e => {
                      if (e.target.checked) setSelectedRecipients([...selectedRecipients, r]);
                      else setSelectedRecipients(selectedRecipients.filter(x => x !== r));
                    }} className="w-4 h-4" />
                    <span className="text-xs text-gray-700 capitalize">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-2 text-xs font-bold text-purple-700">
              ~{estimatedRecipients} recipients
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-green-700">Send</button>
              <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-lg text-sm hover:bg-gray-50">Draft</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "email" && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
            <h2 className="font-black text-gray-900">Email Campaign</h2>
            <input type="text" placeholder="Campaign name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
            <input type="text" placeholder="Subject line" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
            <textarea placeholder="Email preview..." className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-400 resize-none h-20" />
            <button className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700 text-sm">Send Campaign</button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-black text-gray-900 mb-2">Recent</p>
            {CAMPAIGNS.slice(0, 2).map(c => (
              <p key={c.id} className="text-xs text-gray-600 mb-1">{c.date}: {c.delivered} delivered</p>
            ))}
          </div>
        </div>
      )}

      {activeTab === "calls" && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
            <p className="font-black text-gray-900">Call Lists</p>
            <div className="space-y-2">
              {["Hot Leads (45)", "Follow-up (32)"].map((list, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-2 flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-900">{list}</p>
                  <button className="text-xs font-bold text-purple-600">→</button>
                </div>
              ))}
            </div>
            <button className="w-full border border-purple-600 text-purple-600 font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1">
              <Plus size={14} /> New List
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="font-black text-gray-900 mb-3">Log Call</p>
            <input type="text" placeholder="Search user..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-purple-400" />
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-purple-400">
              <option>Answered</option>
              <option>No Answer</option>
              <option>Converted</option>
            </select>
            <button className="w-full bg-green-600 text-white font-bold py-2 rounded-lg text-sm">Save Log</button>
          </div>
        </div>
      )}

      {activeTab === "sms" && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
            <h2 className="font-black text-gray-900">SMS Campaign</h2>
            <textarea value={message} onChange={e => setMessage(e.target.value.slice(0, 160))} placeholder="SMS (max 160 chars)..." className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-400 resize-none h-20" />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{message.length}/160</span>
              <span>💰 ${(message.length > 0 ? (Math.ceil(message.length / 160) * 0.05).toFixed(2) : "0.00")}</span>
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 text-sm">Send SMS</button>
          </div>
        </div>
      )}
    </div>
  );
}
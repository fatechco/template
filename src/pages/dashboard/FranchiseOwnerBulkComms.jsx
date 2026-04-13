import { useState } from 'react';
import { Send, Save, Download, Eye, Plus, Trash2, MoreVertical, Upload, Smile } from 'lucide-react';

const CAMPAIGN_HISTORY = [
  { id: 1, date: "Mar 20", type: "WhatsApp", recipients: 245, delivered: 238, read: 195, status: "completed" },
  { id: 2, date: "Mar 13", type: "Email", recipients: 312, delivered: 305, read: 189, status: "completed" },
  { id: 3, date: "Mar 6", type: "SMS", recipients: 189, delivered: 187, read: 142, status: "completed" },
];

const CALL_REPORTS = [
  { id: 1, date: "Mar 23", salesperson: "Ahmed Hassan", callsMade: 15, answered: 12, noAnswer: 3, converted: 5 },
  { id: 2, date: "Mar 22", salesperson: "Sara Mohamed", callsMade: 18, answered: 14, noAnswer: 4, converted: 6 },
];

export default function FranchiseOwnerBulkComms() {
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [message, setMessage] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState({
    owners: true, buyers: false, agents: true, developers: false, professionals: false, companies: false, sellers: false, all: false
  });
  const [schedule, setSchedule] = useState("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [showCallLog, setShowCallLog] = useState(false);

  const estimatedRecipients = Object.values(selectedRecipients).filter(Boolean).length * 50;

  const recipientOptions = [
    { key: "owners", label: "Property Owners" },
    { key: "buyers", label: "Buyers" },
    { key: "agents", label: "Agents" },
    { key: "developers", label: "Developers" },
    { key: "professionals", label: "Professionals" },
    { key: "companies", label: "Finishing Companies" },
    { key: "sellers", label: "Kemetro Sellers" },
    { key: "all", label: "All Users in My Area" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-purple-600 pl-4">
        <p className="text-xs text-gray-500 mb-1">Dashboard {">"} My Area {">"} Communications</p>
        <h1 className="text-3xl font-black text-gray-900">Bulk Communications</h1>
      </div>

      {/* Channel Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "whatsapp", label: "📱 WhatsApp" },
          { id: "email", label: "📧 Email" },
          { id: "calls", label: "📞 Phone Calls" },
          { id: "sms", label: "📱 SMS" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-purple-600 text-purple-600 bg-purple-50"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: WhatsApp */}
      {activeTab === "whatsapp" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-900 mb-4">Compose Weekly Message</h2>

              {/* Template Selector */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-700 mb-2">Choose template:</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {["Welcome", "Announcement", "Promotion", "Custom"].map(t => (
                    <button key={t} className="flex-shrink-0 px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your weekly message... Use *bold* _italic_ ~strikethrough~"
                className="w-full border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:border-purple-400 resize-none h-32 mb-2"
              />
              <div className="flex justify-between text-xs text-gray-600 mb-4">
                <span>{message.length}/1000 characters</span>
                <button className="text-purple-600 hover:text-purple-700">😊 Emoji</button>
              </div>

              {/* Recipients */}
              <div className="space-y-4 mb-6">
                <p className="font-bold text-gray-900">Send to:</p>
                <div className="grid grid-cols-2 gap-3">
                  {recipientOptions.map(option => (
                    <label key={option.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={selectedRecipients[option.key]} onChange={e => setSelectedRecipients({...selectedRecipients, [option.key]: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Estimated Recipients */}
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-bold text-purple-700">📊 ~{estimatedRecipients} users will receive this</p>
              </div>

              {/* Schedule */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="schedule" value="now" checked={schedule === "now"} onChange={e => setSchedule(e.target.value)} />
                  <span className="text-sm font-bold text-gray-700">Send now</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="schedule" value="later" checked={schedule === "later"} onChange={e => setSchedule(e.target.value)} />
                  <span className="text-sm font-bold text-gray-700">Schedule</span>
                </label>
                {schedule === "later" && (
                  <div className="flex gap-2 ml-6">
                    <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
                    <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                  <Send size={16} /> Send WhatsApp Campaign
                </button>
                <button className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Save size={16} /> Save Draft
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4">Previous Campaigns</h2>

            <div className="space-y-3">
              {CAMPAIGN_HISTORY.map(campaign => (
                <div key={campaign.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-purple-100 text-purple-700">{campaign.type}</span>
                    <span className="text-xs text-gray-600">{campaign.date}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-2">📊 Recipients: {campaign.recipients}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="bg-green-50 rounded p-2">
                      <p className="text-gray-600">Delivered</p>
                      <p className="font-bold text-green-600">{campaign.delivered} ({Math.round(campaign.delivered/campaign.recipients*100)}%)</p>
                    </div>
                    <div className="bg-blue-50 rounded p-2">
                      <p className="text-gray-600">Read</p>
                      <p className="font-bold text-blue-600">{campaign.read} ({Math.round(campaign.read/campaign.recipients*100)}%)</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-gray-600">Status</p>
                      <p className="font-bold text-gray-600 capitalize">{campaign.status}</p>
                    </div>
                  </div>
                  <button className="text-sm font-bold text-purple-600 hover:text-purple-700">View Report →</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Email */}
      {activeTab === "email" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-black text-gray-900">Email Campaign</h2>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Campaign Name</label>
              <input type="text" placeholder="e.g., March Newsletter" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Subject Line</label>
              <input type="text" placeholder="Email subject" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Preview Text</label>
              <input type="text" placeholder="What recipients see in preview" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-4xl mb-2">📧</p>
              <p className="text-sm font-bold text-gray-700">Drag template or click to edit</p>
            </div>

            <button className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700">Send Email Campaign</button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4">Email Campaigns</h2>
            <div className="space-y-3">
              {CAMPAIGN_HISTORY.map(c => (
                <div key={c.id} className="border border-gray-200 rounded-xl p-3">
                  <p className="text-sm font-bold text-gray-900">{c.date} Campaign</p>
                  <p className="text-xs text-gray-600">Opens: 145 (46%) | Clicks: 89 (28%)</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Phone Calls */}
      {activeTab === "calls" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">My Call Lists</h2>
              <button className="px-4 py-2 bg-purple-600 text-white font-bold text-sm rounded-lg hover:bg-purple-700 flex items-center gap-1">
                <Plus size={16} /> New List
              </button>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-bold text-gray-900">List Name</th>
                    <th className="px-4 py-2 text-left font-bold text-gray-900">Users</th>
                    <th className="px-4 py-2 text-left font-bold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-2 font-bold text-gray-900">Hot Leads</td>
                    <td className="px-4 py-2 text-gray-600">45</td>
                    <td className="px-4 py-2"><span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">Active</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-bold text-gray-900">Follow-up</td>
                    <td className="px-4 py-2 text-gray-600">32</td>
                    <td className="px-4 py-2"><span className="text-xs font-bold px-2 py-1 rounded bg-yellow-100 text-yellow-700">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Call Script</label>
              <textarea placeholder="Default call script..." className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-400 resize-none h-24" />
              <button className="mt-2 w-full border border-gray-200 text-gray-900 font-bold py-2 rounded-lg hover:bg-gray-50">Save Script</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Call Reports</h2>
              <button className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:text-purple-700">
                <Download size={16} /> Download CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-2 py-2 text-left font-bold">Date</th>
                    <th className="px-2 py-2 text-left font-bold">Calls</th>
                    <th className="px-2 py-2 text-left font-bold">Answered</th>
                    <th className="px-2 py-2 text-left font-bold">Converted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {CALL_REPORTS.map(r => (
                    <tr key={r.id}>
                      <td className="px-2 py-2 font-bold text-gray-900">{r.date}</td>
                      <td className="px-2 py-2 text-gray-600">{r.callsMade}</td>
                      <td className="px-2 py-2 text-gray-600">{r.answered}</td>
                      <td className="px-2 py-2 font-bold text-green-600">{r.converted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={() => setShowCallLog(!showCallLog)} className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700">
              Log New Call
            </button>

            {showCallLog && (
              <div className="border border-gray-200 rounded-lg p-4 space-y-3 mt-4">
                <input type="text" placeholder="Search user..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400">
                  <option>Answered</option>
                  <option>No Answer</option>
                  <option>Callback Needed</option>
                  <option>Converted</option>
                </select>
                <textarea placeholder="Notes..." className="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none h-20 focus:outline-none focus:border-purple-400" />
                <button className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700">Save Call Log</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: SMS */}
      {activeTab === "sms" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4">SMS Campaign</h2>
            <textarea value={message} onChange={e => setMessage(e.target.value.slice(0, 160))} placeholder="Write SMS (max 160 chars)..." className="w-full border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:border-purple-400 resize-none h-20 mb-2" />
            <div className="flex justify-between text-xs text-gray-600 mb-4">
              <span>{message.length}/160 characters</span>
              <span>💰 Cost: ${(message.length > 0 ? (Math.ceil(message.length / 160) * 0.05).toFixed(2) : "0.00")}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {recipientOptions.slice(0, 4).map(option => (
                <label key={option.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={option.key === "owners"} className="w-4 h-4" />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>

            <button className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <Send size={16} /> Send SMS Campaign
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4">SMS Campaigns</h2>
            <div className="space-y-3">
              {CAMPAIGN_HISTORY.slice(0, 3).map(c => (
                <div key={c.id} className="border border-gray-200 rounded-xl p-3">
                  <p className="text-sm font-bold text-gray-900">{c.date}</p>
                  <p className="text-xs text-gray-600">Sent: {c.delivered} | Delivered: {c.read}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
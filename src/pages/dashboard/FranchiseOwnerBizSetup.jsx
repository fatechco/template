import { useState } from 'react';
import { Upload, Check, Edit } from 'lucide-react';

const CHECKLIST_ITEMS = [
  { id: 1, title: "Company profile completed", completed: true },
  { id: 2, title: "Add first employee", completed: true },
  { id: 3, title: "Create invoice template", completed: false },
  { id: 4, title: "Set up expense categories", completed: false },
  { id: 5, title: "Add your first client", completed: false },
  { id: 6, title: "Create first contract", completed: false },
];

const EXPENSE_CATEGORIES = ["Office", "Travel", "Marketing", "Salaries", "Equipment", "Other"];

export default function FranchiseOwnerBizSetup() {
  const [logo, setLogo] = useState(null);
  const [completed, setCompleted] = useState(CHECKLIST_ITEMS.filter(i => i.completed).length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-green-600 pl-4">
        <h1 className="text-3xl font-black text-gray-900">Setup Your Business System</h1>
        <p className="text-gray-600 mt-1">Complete your setup to unlock full Business Manager features</p>
      </div>

      {/* Setup Checklist */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">Setup Checklist</h2>
          <span className="text-sm font-bold text-green-700">{completed}/6 Complete</span>
        </div>

        <div className="w-full h-3 bg-white rounded-full overflow-hidden mb-6 shadow-sm">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all" style={{ width: `${(completed / 6) * 100}%` }} />
        </div>

        <div className="space-y-2">
          {CHECKLIST_ITEMS.map(item => (
            <label key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:shadow-sm transition-shadow">
              <input type="checkbox" checked={item.completed} className="w-5 h-5 accent-green-600" />
              <span className={item.completed ? "line-through text-gray-400" : "text-gray-700"}>{item.title}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Company Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-black text-gray-900 mb-4">Company Profile</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Company Name</label>
            <input type="text" defaultValue="Cairo Properties Group" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Tax/VAT Number</label>
            <input type="text" defaultValue="123456789" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Phone</label>
            <input type="tel" defaultValue="+20 100 123 4567" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Email</label>
            <input type="email" defaultValue="admin@cairogroup.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
          </div>

          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-700 block mb-2">Address</label>
            <input type="text" defaultValue="123 Nile Street, Cairo, Egypt" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Currency</label>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-400">
              <option>EGP (Egyptian Pound)</option>
              <option>USD</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Invoice Prefix</label>
            <input type="text" defaultValue="KFO-" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-700 block mb-2">Company Logo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
            {logo ? (
              <div className="flex items-center gap-3">
                <span className="text-4xl">🏢</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Logo uploaded</p>
                  <button className="text-xs text-green-600 hover:text-green-700">Change</button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-3xl mb-2">🖼️</p>
                <p className="text-sm font-bold text-gray-700">Drag logo here or click to upload</p>
                <input type="file" onChange={e => setLogo(e.target.files?.[0])} className="mt-2 w-full" />
              </>
            )}
          </div>
        </div>

        <button className="w-full bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700">Save Company Profile</button>
      </div>

      {/* Expense Categories */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-black text-gray-900 mb-4">Expense Categories</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {EXPENSE_CATEGORIES.map(cat => (
            <div key={cat} className="bg-gray-50 rounded-lg p-3 text-center flex items-center justify-between group hover:bg-green-50 transition-colors">
              <p className="text-sm font-bold text-gray-900">{cat}</p>
              <button className="text-gray-400 group-hover:text-green-600 text-sm">✕</button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input type="text" placeholder="Add custom category..." className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
          <button className="bg-green-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-green-700">Add</button>
        </div>
      </div>

      {/* Templates */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">📄 Invoice Template</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 h-40 flex items-center justify-center text-gray-400">
            <span>Preview</span>
          </div>
          <button className="w-full border-2 border-green-600 text-green-600 font-bold py-2.5 rounded-lg hover:bg-green-50 flex items-center justify-center gap-2">
            <Edit size={16} /> Edit Template
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">📄 Contract Template</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 h-40 flex items-center justify-center text-gray-400">
            <span>Preview</span>
          </div>
          <button className="w-full border-2 border-green-600 text-green-600 font-bold py-2.5 rounded-lg hover:bg-green-50 flex items-center justify-center gap-2">
            <Edit size={16} /> Edit Template
          </button>
        </div>
      </div>
    </div>
  );
}
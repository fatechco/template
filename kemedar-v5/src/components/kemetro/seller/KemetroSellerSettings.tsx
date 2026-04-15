"use client";
// @ts-nocheck
import { useState } from "react";
import { Save, Upload, MapPin, Phone, Globe, Clock, Check } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const CATEGORIES = ["Construction", "Masonry Materials", "Architectural", "Electrical", "Plumbing & HVAC", "Finishing & Decoration", "Tools & Equipment", "Furniture & Interior"];

const INITIAL = {
  storeName: "BuildRight Materials",
  storeNameAr: "بيلدرايت للمواد",
  tagline: "Premium construction and finishing materials for professionals",
  phone: "+20 100 123 4567",
  whatsapp: "+20 100 123 4567",
  email: "sales@buildright.com",
  website: "https://buildright.com",
  country: "Egypt",
  city: "Cairo",
  address: "123 Industrial Zone, Cairo",
  categories: ["Construction", "Masonry Materials"],
  openDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  openFrom: "09:00",
  openTo: "17:00",
  minOrderValue: "50",
  processingDays: "1-2",
  returnPolicy: "Returns accepted within 14 days for defective items.",
  shipsInternationally: true,
  autoAcceptOrders: false,
};

const TABS = ["Store Info", "Contact", "Working Hours", "Policies", "Notifications"];

export default function KemetroSellerSettings() {
  const [form, setForm] = useState(INITIAL);
  const [activeTab, setActiveTab] = useState("Store Info");
  const [saved, setSaved] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleArrayItem = (key, item) => {
    const arr = form[key];
    set(key, arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500";
  const Field = ({ label, children, hint }) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Store Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your store profile and preferences</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
          {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 font-semibold text-sm">
          <Check size={18} /> Store settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors -mb-px ${activeTab === tab ? "border-teal-600 text-teal-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Store Info Tab */}
      {activeTab === "Store Info" && (
        <div className="space-y-5">
          {/* Logo / Cover */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Store Branding</h3>
            <div className="flex gap-6">
              <div className="text-center space-y-2">
                <div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:border-teal-400 transition-colors overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1599788996426-3ddb18f10b49?w=200&q=80" alt="logo" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-gray-500">Store Logo</p>
                <button className="text-xs text-teal-600 font-bold flex items-center gap-1 mx-auto"><Upload size={12} /> Change</button>
              </div>
              <div className="flex-1">
                <div className="h-28 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:border-teal-400 transition-colors overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" alt="cover" className="w-full h-full object-cover" />
                </div>
                <button className="text-xs text-teal-600 font-bold flex items-center gap-1 mt-2"><Upload size={12} /> Change Cover Image</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Store Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Store Name (English)">
                <input value={form.storeName} onChange={(e) => set("storeName", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Store Name (Arabic)">
                <input value={form.storeNameAr} onChange={(e) => set("storeNameAr", e.target.value)} className={inputClass} dir="rtl" />
              </Field>
            </div>
            <Field label="Tagline / Short Description">
              <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} maxLength={120} />
              <p className="text-xs text-gray-400 mt-1">{form.tagline.length}/120 characters</p>
            </Field>
            <Field label="Product Categories">
              <div className="flex flex-wrap gap-2 mt-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleArrayItem("categories", cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${form.categories.includes(cat) ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === "Contact" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone Number">
              <div className="relative"><Phone size={15} className="absolute left-3 top-2.5 text-gray-400" /><input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={`${inputClass} pl-9`} /></div>
            </Field>
            <Field label="WhatsApp Number">
              <div className="relative"><Phone size={15} className="absolute left-3 top-2.5 text-gray-400" /><input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={`${inputClass} pl-9`} /></div>
            </Field>
            <Field label="Business Email">
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Website">
              <div className="relative"><Globe size={15} className="absolute left-3 top-2.5 text-gray-400" /><input value={form.website} onChange={(e) => set("website", e.target.value)} className={`${inputClass} pl-9`} /></div>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Country">
              <input value={form.country} onChange={(e) => set("country", e.target.value)} className={inputClass} />
            </Field>
            <Field label="City">
              <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Address">
              <div className="relative"><MapPin size={15} className="absolute left-3 top-2.5 text-gray-400" /><input value={form.address} onChange={(e) => set("address", e.target.value)} className={`${inputClass} pl-9`} /></div>
            </Field>
          </div>
        </div>
      )}

      {/* Working Hours Tab */}
      {activeTab === "Working Hours" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h3 className="font-bold text-gray-900">Working Days & Hours</h3>
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">Working Days</p>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleArrayItem("openDays", day)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${form.openDays.includes(day) ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Opening Time">
              <div className="relative"><Clock size={15} className="absolute left-3 top-2.5 text-gray-400" /><input type="time" value={form.openFrom} onChange={(e) => set("openFrom", e.target.value)} className={`${inputClass} pl-9`} /></div>
            </Field>
            <Field label="Closing Time">
              <div className="relative"><Clock size={15} className="absolute left-3 top-2.5 text-gray-400" /><input type="time" value={form.openTo} onChange={(e) => set("openTo", e.target.value)} className={`${inputClass} pl-9`} /></div>
            </Field>
          </div>
        </div>
      )}

      {/* Policies Tab */}
      {activeTab === "Policies" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Order Policies</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Minimum Order Value ($)" hint="Set 0 for no minimum">
              <input type="number" min="0" value={form.minOrderValue} onChange={(e) => set("minOrderValue", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Processing Time" hint="e.g. 1-2, 3-5">
              <div className="flex items-center gap-2">
                <input value={form.processingDays} onChange={(e) => set("processingDays", e.target.value)} className={inputClass} placeholder="1-2" />
                <span className="text-sm text-gray-500 whitespace-nowrap">business days</span>
              </div>
            </Field>
          </div>
          <Field label="Return & Refund Policy">
            <textarea value={form.returnPolicy} onChange={(e) => set("returnPolicy", e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 resize-none" />
          </Field>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-bold text-gray-900 text-sm">Ships Internationally</p>
              <p className="text-xs text-gray-500">Accept orders from outside your country</p>
            </div>
            <button type="button" onClick={() => set("shipsInternationally", !form.shipsInternationally)} className={`w-12 h-6 rounded-full transition-colors relative ${form.shipsInternationally ? "bg-teal-500" : "bg-gray-300"}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${form.shipsInternationally ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-bold text-gray-900 text-sm">Auto-Accept Orders</p>
              <p className="text-xs text-gray-500">Automatically confirm new orders without manual review</p>
            </div>
            <button type="button" onClick={() => set("autoAcceptOrders", !form.autoAcceptOrders)} className={`w-12 h-6 rounded-full transition-colors relative ${form.autoAcceptOrders ? "bg-teal-500" : "bg-gray-300"}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${form.autoAcceptOrders ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "Notifications" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-1">
          <h3 className="font-bold text-gray-900 mb-4">Notification Preferences</h3>
          {[
            { key: "notif_new_order", label: "New Order Received", desc: "Get notified when a buyer places an order" },
            { key: "notif_payment", label: "Payment Received", desc: "Notify me when a payment is confirmed" },
            { key: "notif_review", label: "New Review Posted", desc: "Alert me when a customer leaves a review" },
            { key: "notif_low_stock", label: "Low Stock Alert", desc: "Notify me when a product stock drops below 5" },
            { key: "notif_payout", label: "Payout Processed", desc: "Inform me when a payout is sent to my account" },
            { key: "notif_messages", label: "New Buyer Messages", desc: "Alert me when a buyer sends a message" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-bold text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => set(key, !form[key])}
                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${form[key] !== false ? "bg-teal-500" : "bg-gray-300"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${form[key] !== false ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Camera, MapPin, Phone, Mail, Globe, X, Facebook, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";

const KEMEWORK_CATEGORIES = [
  "Interior Design",
  "Carpentry",
  "Painting",
  "Flooring",
  "Lighting",
  "Plumbing",
  "Electrical",
  "Tiling",
  "Masonry",
  "Glass Work",
];

const WORK_AREAS = ["Cairo", "New Cairo", "Giza", "Helwan", "6th of October", "Alexandria", "Aswan", "Luxor"];

export default function CompanyBusinessProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [specializations, setSpecializations] = useState(["Interior Design", "Carpentry", "Painting"]);
  const [workAreas, setWorkAreas] = useState(["Cairo", "New Cairo"]);
  const [form, setForm] = useState({
    facebook: "", instagram: "", linkedin: "", youtube: "", twitter: "", whatsapp: "",
    currentPassword: "", newPassword: "", confirmPassword: "",
    notifyTaskMatches: true,
    notifyNewTasks: true,
    notifyMessages: true,
    notifyBidUpdates: true,
    notifyRenewal: true,
    notifyMarketing: false,
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">🏢 Business Profile</h1>
        <button onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            isEditing 
              ? "bg-amber-600 hover:bg-amber-700 text-white" 
              : "bg-gray-200 hover:bg-gray-300 text-gray-900"
          }`}>
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Cover & Logo */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-amber-500 to-amber-600 relative">
          {isEditing && (
            <button className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors">
              <Camera size={24} className="text-white" />
            </button>
          )}
        </div>
        <div className="px-6 py-6 flex items-start gap-6 relative -mt-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-white flex items-center justify-center text-3xl font-black text-amber-600 flex-shrink-0">
              FC
            </div>
            {isEditing && (
              <button className="absolute inset-0 rounded-full bg-black/40 hover:bg-black/50 flex items-center justify-center transition-colors">
                <Camera size={16} className="text-white" />
              </button>
            )}
          </div>
          <div className="flex-1 pt-4">
            {isEditing ? (
              <div className="space-y-3">
                <input type="text" defaultValue="Elite Finishing Co." placeholder="Company Name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                <textarea defaultValue="Premium interior finishing and renovation services" placeholder="Description"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400 resize-none h-12" />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-black text-gray-900">Elite Finishing Co.</h2>
                <p className="text-sm text-gray-500 mt-1">Premium interior finishing and renovation services</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-black text-gray-900">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-gray-400 flex-shrink-0" />
            {isEditing ? (
              <input type="tel" defaultValue="+20 100 123 4567" placeholder="Phone"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
            ) : (
              <p className="text-gray-700">+20 100 123 4567</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gray-400 flex-shrink-0" />
            {isEditing ? (
              <input type="email" defaultValue="info@finishing.com" placeholder="Email"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
            ) : (
              <p className="text-gray-700">info@finishing.com</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-gray-400 flex-shrink-0" />
            {isEditing ? (
              <input type="url" defaultValue="www.finishingco.com" placeholder="Website"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
            ) : (
              <p className="text-gray-700">www.finishingco.com</p>
            )}
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gray-400 flex-shrink-0 mt-2" />
            {isEditing ? (
              <textarea defaultValue="Cairo, Egypt" placeholder="Address"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 resize-none h-12" />
            ) : (
              <p className="text-gray-700">Cairo, Egypt</p>
            )}
          </div>
        </div>
      </div>

      {/* Area We Work In */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-black text-gray-900">📍 Area We Work In</h3>
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {workAreas.map(area => (
                <span key={area} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-2">
                  {area}
                  <button onClick={() => setWorkAreas(workAreas.filter(a => a !== area))} className="hover:text-amber-900">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <select onChange={e => {
              if (e.target.value && !workAreas.includes(e.target.value)) {
                setWorkAreas([...workAreas, e.target.value]);
              }
              e.target.value = "";
            }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400">
              <option value="">+ Add Area</option>
              {WORK_AREAS.filter(a => !workAreas.includes(a)).map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {workAreas.length > 0 ? (
              workAreas.map(area => (
                <span key={area} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  {area}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">No areas selected</p>
            )}
          </div>
        )}
      </div>

      {/* Specializations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-black text-gray-900">Specializations</h3>
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {specializations.map(spec => (
                <span key={spec} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-2">
                  {spec}
                  <button onClick={() => setSpecializations(specializations.filter(s => s !== spec))} className="hover:text-amber-900">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <select onChange={e => {
              if (e.target.value && !specializations.includes(e.target.value)) {
                setSpecializations([...specializations, e.target.value]);
              }
              e.target.value = "";
            }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400">
              <option value="">+ Add Specialization</option>
              {KEMEWORK_CATEGORIES.filter(cat => !specializations.includes(cat)).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {specializations.map(spec => (
            <span key={spec} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
              {spec}
            </span>
            ))}
          </div>
        )}
      </div>

      {/* Social Links */}
      {isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-black text-gray-900">Social Links</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "facebook", icon: Facebook, placeholder: "Facebook URL", color: "text-blue-600" },
              { key: "instagram", icon: Instagram, placeholder: "Instagram URL", color: "text-pink-500" },
              { key: "linkedin", icon: Linkedin, placeholder: "LinkedIn URL", color: "text-blue-700" },
              { key: "youtube", icon: Youtube, placeholder: "YouTube URL", color: "text-red-600" },
              { key: "twitter", icon: MessageCircle, placeholder: "Twitter/X URL", color: "text-sky-500" },
              { key: "whatsapp", icon: MessageCircle, placeholder: "WhatsApp Number", color: "text-green-500" },
            ].map(({ key, icon: Icon, placeholder, color }) => (
              <div key={key} className="relative">
                <Icon size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${color}`} />
                <input className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" value={form[key]} onChange={set(key)} placeholder={placeholder} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change Password */}
      {isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-black text-gray-900">Change Password</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Current Password</label>
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" type="password" value={form.currentPassword} onChange={set("currentPassword")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">New Password</label>
                <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" type="password" value={form.newPassword} onChange={set("newPassword")} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Confirm Password</label>
                <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" type="password" value={form.confirmPassword} onChange={set("confirmPassword")} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Preferences */}
      {isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-black text-gray-900">Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { key: "notifyTaskMatches", label: "New tasks match my specializations" },
              { key: "notifyNewTasks", label: "New tasks in my category" },
              { key: "notifyMessages", label: "New message received" },
              { key: "notifyBidUpdates", label: "Bid status updated" },
              { key: "notifyRenewal", label: "Subscription renewal reminder" },
              { key: "notifyMarketing", label: "Marketing & promotional emails" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={form[key]} onChange={set(key)} className="w-4 h-4 accent-amber-500" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      </div>
      );
      }
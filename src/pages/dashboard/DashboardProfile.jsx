import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Camera, Save, Link as LinkIcon, Facebook, Instagram, Linkedin, Youtube, MessageCircle, X } from "lucide-react";

const INPUT = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors";
const LABEL = "block text-xs font-bold text-gray-600 mb-1.5";
const SECTION = "bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4";

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

export default function DashboardProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.full_name?.split(" ")[0] || "",
    lastName: user?.full_name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "", whatsapp: "", bio: "", slug: "",
    country: "", province: "", city: "", address: "",
    company: "", license: "", website: "", linkedin: "",
    facebook: "", instagram: "", twitter: "", youtube: "",
    currentPassword: "", newPassword: "", confirmPassword: "",
    notifyMatches: true, notifyViews: true, notifyMessages: true,
    notifyStatus: true, notifyRenewal: true, notifyMarketing: false,
  });
  const [specializations, setSpecializations] = useState(["Interior Design", "Carpentry"]);
  const [workAreas, setWorkAreas] = useState(["Cairo", "New Cairo"]);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Cover */}
            <div className="h-24 bg-gradient-to-r from-[#1a1a2e] to-[#0077B6] relative">
              <button className="absolute top-2 right-2 w-7 h-7 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center">
                <Camera size={13} />
              </button>
            </div>
            {/* Avatar */}
            <div className="px-5 pb-5">
              <div className="relative -mt-8 mb-3 w-fit">
                <div className="w-16 h-16 rounded-full bg-[#1a1a2e] text-white font-black text-xl flex items-center justify-center border-4 border-white shadow">
                  {(form.firstName[0] || "U").toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center">
                  <Camera size={11} />
                </button>
              </div>
              <p className="font-black text-gray-900 text-lg">{form.firstName} {form.lastName}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-1">Member since {new Date(user?.created_date || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
              <a href={`/u/${form.slug || "your-profile"}`} className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                <LinkIcon size={11} /> Public Profile Link
              </a>
            </div>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Info */}
          <div className={SECTION}>
            <h2 className="font-black text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={LABEL}>First Name</label><input className={INPUT} value={form.firstName} onChange={set("firstName")} /></div>
              <div><label className={LABEL}>Last Name</label><input className={INPUT} value={form.lastName} onChange={set("lastName")} /></div>
              <div><label className={LABEL}>Email</label><input className={INPUT} type="email" value={form.email} onChange={set("email")} /></div>
              <div><label className={LABEL}>Phone</label><input className={INPUT} value={form.phone} onChange={set("phone")} /></div>
              <div><label className={LABEL}>WhatsApp</label><input className={INPUT} value={form.whatsapp} onChange={set("whatsapp")} /></div>
              <div><label className={LABEL}>Profile URL Slug</label><input className={INPUT} value={form.slug} onChange={set("slug")} placeholder="your-name" /></div>
            </div>
            <div><label className={LABEL}>Bio</label><textarea className={INPUT + " resize-none"} rows={3} value={form.bio} onChange={set("bio")} placeholder="Tell others about yourself..." /></div>
          </div>

          {/* Location */}
          <div className={SECTION}>
            <h2 className="font-black text-gray-900">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={LABEL}>Country</label><input className={INPUT} value={form.country} onChange={set("country")} /></div>
              <div><label className={LABEL}>Province</label><input className={INPUT} value={form.province} onChange={set("province")} /></div>
              <div><label className={LABEL}>City</label><input className={INPUT} value={form.city} onChange={set("city")} /></div>
              <div><label className={LABEL}>Address</label><input className={INPUT} value={form.address} onChange={set("address")} /></div>
            </div>
          </div>

          {/* Areas I Work In */}
          <div className={SECTION}>
            <h2 className="font-black text-gray-900">📍 Areas I Work In</h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {workAreas.map(area => (
                  <span key={area} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-2">
                    {area}
                    <button onClick={() => setWorkAreas(workAreas.filter(a => a !== area))} className="hover:text-blue-900">
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
                className={INPUT}>
                <option value="">+ Add Area</option>
                {WORK_AREAS.filter(a => !workAreas.includes(a)).map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Specializations */}
          <div className={SECTION}>
            <h2 className="font-black text-gray-900">Specializations</h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {specializations.map(spec => (
                  <span key={spec} className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-2">
                    {spec}
                    <button onClick={() => setSpecializations(specializations.filter(s => s !== spec))} className="hover:text-orange-900">
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
                className={INPUT}>
                <option value="">+ Add Specialization</option>
                {KEMEWORK_CATEGORIES.filter(cat => !specializations.includes(cat)).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Social Links */}
          <div className={SECTION}>
            <h2 className="font-black text-gray-900">Social Links</h2>
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
                  <input className={INPUT + " pl-8"} value={form[key]} onChange={set(key)} placeholder={placeholder} />
                </div>
              ))}
            </div>
          </div>

          {/* Change Password */}
          <div className={SECTION}>
            <h2 className="font-black text-gray-900">Change Password</h2>
            <div className="grid grid-cols-1 gap-4">
              <div><label className={LABEL}>Current Password</label><input className={INPUT} type="password" value={form.currentPassword} onChange={set("currentPassword")} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={LABEL}>New Password</label><input className={INPUT} type="password" value={form.newPassword} onChange={set("newPassword")} /></div>
                <div><label className={LABEL}>Confirm Password</label><input className={INPUT} type="password" value={form.confirmPassword} onChange={set("confirmPassword")} /></div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className={SECTION}>
            <h2 className="font-black text-gray-900">Notification Preferences</h2>
            <div className="space-y-3">
              {[
                { key: "notifyMatches", label: "New property matches my buy requests" },
                { key: "notifyViews", label: "Someone viewed my property" },
                { key: "notifyMessages", label: "New message received" },
                { key: "notifyStatus", label: "Property status changed" },
                { key: "notifyRenewal", label: "Subscription renewal reminder" },
                { key: "notifyMarketing", label: "Marketing & promotional emails" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={form[key]} onChange={set(key)} className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
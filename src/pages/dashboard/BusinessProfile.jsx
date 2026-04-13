import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import QRGeneratorWidget from "@/components/qr/QRGeneratorWidget";
import { CheckCircle, XCircle, Upload, MapPin, Star, Eye, Phone, MessageCircle, Home, Award } from "lucide-react";

const INPUT = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors";
const LABEL = "block text-xs font-bold text-gray-600 mb-1.5";
const SECTION = "bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4";

const SPECIALIZATIONS = ["Residential", "Commercial", "Luxury", "Industrial", "Land", "Retail", "Office Spaces", "Hotels & Resorts", "Off-Plan", "Investment Properties"];
const SERVICE_AREAS = ["Cairo", "Giza", "New Cairo", "Sheikh Zayed", "Maadi", "Zamalek", "Alexandria", "North Coast", "Hurghada", "Ain Sokhna"];

const MOCK_LISTINGS = [
  { id: 1, title: "Modern Apartment New Cairo", price: "$120,000", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&q=70", purpose: "Sale" },
  { id: 2, title: "Villa Sheikh Zayed", price: "$380,000", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=70", purpose: "Sale" },
  { id: 3, title: "Studio in Maadi", price: "$700/mo", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=70", purpose: "Rent" },
];

function PublicView({ user }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-40 bg-gradient-to-r from-[#1a1a2e] to-[#0077B6]" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4 flex-wrap gap-3">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black text-[#1a1a2e]">
              {(user?.full_name?.[0] || "A").toUpperCase()}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                <MessageCircle size={14} /> WhatsApp
              </button>
              <button className="flex items-center gap-1.5 bg-[#0077B6] hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                <Phone size={14} /> Call
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-gray-900">{user?.full_name || "Your Name"}</h2>
              <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                <CheckCircle size={11} /> Verified
              </span>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">Agent</span>
            </div>
            <p className="text-gray-500 text-sm">Kemedar Real Estate · Cairo, Egypt</p>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />)}
              <span className="text-sm font-bold text-gray-800 ml-1">4.9</span>
              <span className="text-sm text-gray-400">(127 reviews)</span>
            </div>
            <p className="text-gray-600 text-sm mt-2">Specializing in residential and luxury properties across Cairo. 8+ years of experience helping buyers and sellers achieve their real estate goals.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-100">
            {[{ label: "Properties", value: "34" }, { label: "Projects", value: "5" }, { label: "Years Active", value: "8" }, { label: "Transactions", value: "120+" }].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div>
        <h3 className="font-black text-gray-900 mb-4">My Listings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_LISTINGS.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <img src={p.image} alt={p.title} className="w-full h-36 object-cover" />
              <div className="p-3">
                <p className="font-bold text-gray-900 text-sm line-clamp-1">{p.title}</p>
                <p className="font-black text-orange-500 text-sm mt-1">{p.price}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${p.purpose === "Sale" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{p.purpose}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditProfile({ user }) {
  const [form, setForm] = useState({
    companyName: "", licenseNumber: "", realEstateLicense: "", yearsInBusiness: "",
    numAgents: "", specializations: [], serviceAreas: [],
    bio: "", phone: "", whatsapp: "",
  });
  const [verificationStatus] = useState("not_verified");

  const toggleArray = (key, val) => setForm(f => ({
    ...f,
    [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val]
  }));
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="space-y-5">
      {/* Business Info */}
      <div className={SECTION}>
        <h3 className="font-black text-gray-900">Business Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Company / Agency Name</label><input className={INPUT} value={form.companyName} onChange={set("companyName")} /></div>
          <div><label className={LABEL}>Commercial License Number</label><input className={INPUT} value={form.licenseNumber} onChange={set("licenseNumber")} /></div>
          <div><label className={LABEL}>Real Estate License Number</label><input className={INPUT} value={form.realEstateLicense} onChange={set("realEstateLicense")} /></div>
          <div><label className={LABEL}>Years in Business</label><input className={INPUT} type="number" value={form.yearsInBusiness} onChange={set("yearsInBusiness")} /></div>
          <div><label className={LABEL}>Number of Agents</label><input className={INPUT} type="number" value={form.numAgents} onChange={set("numAgents")} /></div>
          <div><label className={LABEL}>Phone</label><input className={INPUT} value={form.phone} onChange={set("phone")} /></div>
          <div className="col-span-2"><label className={LABEL}>Bio / Description</label><textarea className={INPUT + " resize-none"} rows={3} value={form.bio} onChange={set("bio")} /></div>
        </div>
        <div>
          <label className={LABEL}>Specializations</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {SPECIALIZATIONS.map(s => (
              <button key={s} type="button" onClick={() => toggleArray("specializations", s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${form.specializations.includes(s) ? "bg-orange-500 border-orange-500 text-white" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={LABEL}>Service Areas</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {SERVICE_AREAS.map(a => (
              <button key={a} type="button" onClick={() => toggleArray("serviceAreas", a)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${form.serviceAreas.includes(a) ? "bg-blue-500 border-blue-500 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verification */}
      <div className={SECTION}>
        <h3 className="font-black text-gray-900">Verification — KEMEDAR VERI</h3>
        <div className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl ${verificationStatus === "verified" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-start gap-3 flex-1">
            {verificationStatus === "verified"
              ? <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-0.5" />
              : <XCircle size={24} className="text-red-400 flex-shrink-0 mt-0.5" />}
            <div>
              <p className="font-bold text-gray-900">{verificationStatus === "verified" ? "Your profile is Verified ✅" : "Not Yet Verified ❌"}</p>
              <p className="text-sm text-gray-500">{verificationStatus === "verified" ? "Buyers trust verified professionals more." : "Verification increases client trust and listing visibility."}</p>
            </div>
          </div>
          {verificationStatus !== "verified" && (
            <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm flex-shrink-0 transition-colors w-full sm:w-auto">
              <Award size={14} /> Request Verification
            </button>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-700">Upload Documents</p>
          {["Commercial License", "National ID", "Real Estate Certificate"].map(doc => (
            <div key={doc} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">{doc}</span>
              <label className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold cursor-pointer hover:text-blue-700">
                <Upload size={13} /> Upload
                <input type="file" className="hidden" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
        Save Business Profile
      </button>
    </div>
  );
}

export default function BusinessProfile() {
  const { user } = useAuth();
  const [tab, setTab] = useState("edit");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black text-gray-900">Business Profile</h1>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[{ id: "public", label: "👁 Public View" }, { id: "edit", label: "✏️ Edit Profile" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "public" ? <PublicView user={user} /> : <EditProfile user={user} />}

      {/* Agent Profile QR Code */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-900 mb-1">📱 Your Agent Profile QR Code</h3>
        <p className="text-gray-500 text-sm mb-4">Share your QR code on business cards and marketing materials. Clients scan it to view your full profile instantly.</p>
        {user && <QRGeneratorWidget targetType="agent_profile" targetId={user.id} targetTitle={user.full_name} mode="full" />}
      </div>
    </div>
  );
}
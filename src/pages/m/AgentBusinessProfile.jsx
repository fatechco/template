import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Upload } from "lucide-react";

export default function AgentBusinessProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    displayName: "John Doe",
    bio: "Experienced real estate agent specializing in luxury properties",
    phone: "+20123456789",
    whatsapp: "+20123456789",
    email: "john@example.com",
    languages: ["Arabic", "English"],
    licenseNumber: "REL-2023-001",
    agencyAffiliation: "Premium Realty",
    yearsExperience: 8,
    serviceAreas: ["Cairo", "New Cairo", "Heliopolis"],
    specializations: ["Residential", "Luxury"],
    linkedIn: "linkedin.com/in/johndoe",
    facebook: "facebook.com/johndoe",
    verificationStatus: "not_verified",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const LANGUAGES = ["Arabic", "English", "French", "German"];
  const SERVICE_AREAS = ["Cairo", "New Cairo", "Heliopolis", "Zamalek", "Sheikh Zayed"];
  const SPECIALIZATIONS = ["Residential", "Commercial", "Luxury", "Off-Plan", "Rental"];

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Business Profile</h1>
      </div>

      {/* Preview Link */}
      <div className="px-4 pt-3 pb-4">
        <button className="text-orange-600 text-xs font-bold hover:underline">👁️ Preview Public Profile</button>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 flex gap-4">
        {["personal", "professional", "verification"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === tab
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {/* PERSONAL TAB */}
        {activeTab === "personal" && (
          <div className="space-y-4">
            {/* Profile Photo */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Profile Photo</label>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <button className="mt-2 text-orange-600 text-xs font-bold flex items-center gap-1 hover:underline">
                <Upload size={14} /> Change Photo
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => handleInputChange("fullName", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* Display Name */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={e => handleInputChange("displayName", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={e => handleInputChange("bio", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => handleInputChange("phone", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">WhatsApp</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={e => handleInputChange("whatsapp", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleInputChange("email", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* Languages */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Languages</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleArrayToggle("languages", lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      formData.languages.includes(lang)
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg mt-4">Save Changes</button>
          </div>
        )}

        {/* PROFESSIONAL TAB */}
        {activeTab === "professional" && (
          <div className="space-y-4">
            {/* License Number */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">License Number</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={e => handleInputChange("licenseNumber", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* Agency Affiliation */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Agency Affiliation</label>
              <input
                type="text"
                value={formData.agencyAffiliation}
                onChange={e => handleInputChange("agencyAffiliation", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* Years Experience */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Years of Experience</label>
              <div className="flex items-center gap-3">
                <button className="px-3 py-2 bg-gray-100 rounded-lg font-bold">−</button>
                <span className="text-lg font-bold">{formData.yearsExperience}</span>
                <button className="px-3 py-2 bg-gray-100 rounded-lg font-bold">+</button>
              </div>
            </div>

            {/* Service Areas */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Service Areas</label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_AREAS.map(area => (
                  <button
                    key={area}
                    onClick={() => handleArrayToggle("serviceAreas", area)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      formData.serviceAreas.includes(area)
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Specializations</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map(spec => (
                  <button
                    key={spec}
                    onClick={() => handleArrayToggle("specializations", spec)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      formData.specializations.includes(spec)
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">LinkedIn</label>
              <input
                type="text"
                value={formData.linkedIn}
                onChange={e => handleInputChange("linkedIn", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Facebook</label>
              <input
                type="text"
                value={formData.facebook}
                onChange={e => handleInputChange("facebook", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg mt-4">Save Changes</button>
          </div>
        )}

        {/* VERIFICATION TAB */}
        {activeTab === "verification" && (
          <div className="space-y-4">
            {formData.verificationStatus === "not_verified" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 space-y-3">
                <p className="font-bold text-yellow-900">⚠️ Not Verified</p>
                <p className="text-sm text-yellow-800">Get verified to build trust with buyers and rank higher in search results.</p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">National ID</p>
                      <button className="text-orange-600 text-xs font-bold mt-1">📤 Upload</button>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Real Estate License</p>
                      <button className="text-orange-600 text-xs font-bold mt-1">📤 Upload</button>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Profile Photo</p>
                      <button className="text-orange-600 text-xs font-bold mt-1">📤 Upload</button>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg mt-4">Request Verification ($150)</button>
              </div>
            )}

            {formData.verificationStatus === "pending" && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="font-bold text-blue-900">⏳ Verification Pending</p>
                <p className="text-sm text-blue-800 mt-2">Your documents are under review by the Kemedar team. This usually takes 2-3 business days.</p>
              </div>
            )}

            {formData.verificationStatus === "verified" && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <p className="font-bold text-green-900">✅ Verified Agent</p>
                <p className="text-sm text-green-800 mt-2">Verified on: March 15, 2024</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
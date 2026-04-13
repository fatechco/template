import { useState, useRef } from "react";

export default function Step4CompleteProfile({ form, update }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
        update({ profilePhoto: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const roleType = form.selectedRoles?.[0]; // Get first selected role
  
  const renderRoleFields = () => {
    if (!roleType) return null;

    // Kemedar roles: agent, agency, developer, franchise_owner
    if (["agent", "agency", "developer", "franchise_owner"].includes(roleType)) {
      return (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {roleType === "franchise_owner" ? "Organization" : "Company"} Name
            </label>
            <input
              type="text"
              placeholder="e.g. Kemedar Cairo"
              value={form.companyName}
              onChange={(e) => update({ companyName: e.target.value })}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {roleType === "developer" ? "License #" : "License / ID"}
            </label>
            <input
              type="text"
              placeholder="License number"
              value={form.licenseNumber}
              onChange={(e) => update({ licenseNumber: e.target.value })}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50"
            />
          </div>
        </div>
      );
    }

    // Kemework roles: professional, finishing_company
    if (["professional", "finishing_company"].includes(roleType)) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Specialization</label>
            <select
              value={form.specialization}
              onChange={(e) => update({ specialization: e.target.value })}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50"
            >
              <option value="">Select category</option>
              <option value="plumbing">🚿 Plumbing</option>
              <option value="electrical">⚡ Electrical</option>
              <option value="carpentry">🪚 Carpentry</option>
              <option value="painting">🎨 Painting</option>
              <option value="hvac">🌡️ HVAC</option>
              <option value="cleaning">🧹 Cleaning</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Years of Experience</label>
            <input
              type="number"
              placeholder="5"
              value={form.experience}
              onChange={(e) => update({ experience: e.target.value })}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50"
            />
          </div>
        </div>
      );
    }

    // Kemetro: product_seller
    if (roleType === "product_seller") {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Store Name</label>
            <input
              type="text"
              placeholder="e.g. Home Essentials"
              value={form.storeName}
              onChange={(e) => update({ storeName: e.target.value })}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Business Type</label>
            <select
              value={form.businessType}
              onChange={(e) => update({ businessType: e.target.value })}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50"
            >
              <option value="">Select type</option>
              <option value="wholesale">Wholesale</option>
              <option value="retail">Retail</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Complete Your Profile</h2>
        <p className="text-gray-500 text-sm mt-1">Add a photo and role-specific details</p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex flex-col items-center gap-3">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-200 to-orange-100 flex items-center justify-center cursor-pointer hover:from-orange-300 hover:to-orange-200 transition-all border-2 border-dashed border-orange-300"
        >
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-2xl">📷</div>
              <p className="text-xs text-orange-700 font-semibold mt-1">Add photo</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        <p className="text-xs text-gray-500">Tap to add or change photo</p>
      </div>

      {/* Role-Specific Fields */}
      {renderRoleFields()}

      {/* Years of Experience (shared) */}
      {["agent", "agency", "developer"].includes(roleType) && (
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Years of Experience</label>
          <input
            type="number"
            placeholder="5"
            value={form.experience}
            onChange={(e) => update({ experience: e.target.value })}
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50"
          />
        </div>
      )}
    </div>
  );
}
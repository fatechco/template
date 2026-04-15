"use client";
// @ts-nocheck
import { Save } from "lucide-react";
import { useState } from "react";

export default function GeneralSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Basic Settings</h2>
        
        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Site Name</label>
          <input type="text" defaultValue="Kemedar" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Site Tagline</label>
          <input type="text" defaultValue="Your trusted real estate platform" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Contact Email</label>
            <input type="email" defaultValue="support@kemedar.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Support Phone</label>
            <input type="tel" defaultValue="+20 100 123 4567" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Default Country</label>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
              <option>Egypt</option>
              <option>Saudi Arabia</option>
              <option>UAE</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Default Currency</label>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
              <option>EGP</option>
              <option>SAR</option>
              <option>AED</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Default Language</label>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
              <option>English</option>
              <option>Arabic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Upload Limits</h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Max Images per Property</label>
            <input type="number" defaultValue="20" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Max Videos per Property</label>
            <input type="number" defaultValue="5" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Properties per Page</label>
            <input type="number" defaultValue="20" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Branding</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Site Logo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors cursor-pointer">
              <p className="text-sm text-gray-600">📤 Click to upload or drag & drop</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Favicon</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors cursor-pointer">
              <p className="text-sm text-gray-600">📤 Click to upload or drag & drop</p>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900">Maintenance Mode</p>
          <p className="text-sm text-gray-600 mt-1">Site will be unavailable to users except admins</p>
        </div>
        <button className="w-12 h-7 rounded-full bg-gray-300 transition-colors flex items-center">
          <div className="w-6 h-6 bg-white rounded-full"></div>
        </button>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700">
          <Save size={16} /> {saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
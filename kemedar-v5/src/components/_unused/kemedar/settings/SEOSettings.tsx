"use client";
// @ts-nocheck
import { Save } from "lucide-react";
import { useState } from "react";

export default function SEOSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Meta Tags */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Meta Tags</h2>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Meta Title Template</label>
          <input type="text" defaultValue="{page_title} - Kemedar" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          <p className="text-xs text-gray-600 mt-1">{"Use {page_title}, {location} variables"}</p>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Meta Description Template</label>
          <textarea className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none resize-none h-24" defaultValue="Find properties on Kemedar. Buy, sell, and rent properties in Egypt."></textarea>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Analytics & Tracking</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Google Analytics ID</label>
            <input type="text" placeholder="UA-XXXXXXXXX-X" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Facebook Pixel ID</label>
            <input type="text" placeholder="123456789" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Sitemap & Robots */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Sitemap & Robots</h2>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-bold text-gray-900">Auto-generate Sitemap</p>
            <p className="text-xs text-gray-600 mt-1">Automatically create XML sitemap daily</p>
          </div>
          <button className="w-12 h-7 rounded-full bg-green-500 transition-colors flex items-center">
            <div className="w-6 h-6 bg-white rounded-full ml-auto mr-0.5"></div>
          </button>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Robots.txt Content</label>
          <textarea className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none resize-none h-32 font-mono text-xs" defaultValue="User-agent: *&#10;Allow: /&#10;Disallow: /admin/&#10;Sitemap: https://kemedar.com/sitemap.xml"></textarea>
        </div>
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
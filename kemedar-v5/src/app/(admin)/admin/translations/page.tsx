"use client";

import { useState } from "react";
import { Search, Download, Upload, Globe, Filter } from "lucide-react";

export default function AdminTranslationsPage() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [localeFilter, setLocaleFilter] = useState("ar");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Translations</h1>
          <p className="text-sm text-slate-500 mt-1">Manage UI translations for 19 languages</p>
        </div>
        <div className="flex gap-2">
          <button className="border bg-white px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 hover:bg-slate-50">
            <Upload className="w-4 h-4" /> Import Excel
          </button>
          <button className="border bg-white px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 hover:bg-slate-50">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search translation keys..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
          </div>
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All Modules</option>
            <option value="common">Common</option>
            <option value="kemedar">Kemedar</option>
            <option value="kemetro">Kemetro</option>
            <option value="kemework">Kemework</option>
            <option value="admin">Admin</option>
          </select>
          <select value={localeFilter} onChange={(e) => setLocaleFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="ar">Arabic (AR)</option>
            <option value="en">English (EN)</option>
            <option value="fr">French (FR)</option>
            <option value="ur">Urdu (UR)</option>
            <option value="tr">Turkish (TR)</option>
          </select>
        </div>
      </div>

      {/* Translation table placeholder */}
      <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
        <Globe className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <h3 className="font-semibold text-slate-600 mb-1">Translation Management</h3>
        <p className="text-sm">Connect the /api/v1/translations endpoint to load and edit translations here.</p>
        <p className="text-sm mt-2">Supports 19 languages including RTL (Arabic, Urdu, Farsi)</p>
      </div>
    </div>
  );
}

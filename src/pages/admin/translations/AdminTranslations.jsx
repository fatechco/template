import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  Download, Upload, RefreshCw, Plus, Search, Trash2,
  Globe, FileSpreadsheet, CheckCircle, AlertCircle, Loader2
} from "lucide-react";

const SUPPORTED_LANGS = ['en','ar','tr','fr','ru','id','vi','de','ur','hi','bn','zh','es','pt','it','th','ja','ko','fa'];
const MODULES = ['common','kemedar','kemetro','kemework','about','terms','privacy'];

const LANG_LABELS = {
  en: '🇬🇧 EN', ar: '🇸🇦 AR', tr: '🇹🇷 TR', fr: '🇫🇷 FR',
  ru: '🇷🇺 RU', id: '🇮🇩 ID', vi: '🇻🇳 VI', de: '🇩🇪 DE',
  ur: '🇵🇰 UR', hi: '🇮🇳 HI', bn: '🇧🇩 BN', zh: '🇨🇳 ZH',
  es: '🇪🇸 ES', pt: '🇧🇷 PT', it: '🇮🇹 IT', th: '🇹🇭 TH',
  ja: '🇯🇵 JA', ko: '🇰🇷 KO', fa: '🇮🇷 FA',
};

function CoverageBar({ translation }) {
  const filled = SUPPORTED_LANGS.filter(l => translation[l] && translation[l].trim() !== '').length;
  const pct = Math.round((filled / SUPPORTED_LANGS.length) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-bold tabular-nums ${pct === 100 ? 'text-green-600' : pct > 50 ? 'text-orange-500' : 'text-red-400'}`}>{pct}%</span>
    </div>
  );
}

export default function AdminTranslations() {
  const [activeTab, setActiveTab] = useState('ui'); // ui | locations
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

  // Import state
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importFile, setImportFile] = useState(null);

  // Export state
  const [exporting, setExporting] = useState(false);

  // Add new key modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState({ lang_key: '', module: 'common', en: '' });
  const [adding, setAdding] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const data = await base44.entities.Translation.list('-created_date', 2000);
    setTranslations(data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = translations.filter(t => {
    if (moduleFilter && t.module !== moduleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (t.lang_key || '').toLowerCase().includes(q) ||
        (t.en || '').toLowerCase().includes(q) ||
        (t.ar || '').toLowerCase().includes(q);
    }
    return true;
  });

  // Stats
  const totalKeys = translations.length;
  const fullyTranslated = translations.filter(t => SUPPORTED_LANGS.every(l => t[l] && t[l].trim())).length;
  const missingAr = translations.filter(t => !t.ar || !t.ar.trim()).length;

  // Export
  const handleExport = async (type = 'ui') => {
    setExporting(true);
    const res = await base44.functions.invoke('exportTranslations', {
      type,
      module_filter: moduleFilter,
    });
    // The function returns binary xlsx — we need to download it
    // Since SDK wraps response, trigger via direct fetch approach
    setExporting(false);
    alert('Export triggered. Go to Admin → Code → Functions → exportTranslations to get the direct download URL, or use the import flow after downloading.');
  };

  // Export via direct API URL
  const handleExportDirect = async (type) => {
    setExporting(true);
    try {
      // Use fetch directly to get binary
      const appId = import.meta.env.VITE_APP_ID || '';
      // Trigger via base44 functions and handle blob
      const res = await base44.functions.invoke('exportTranslations', { type, module_filter: moduleFilter });
      // If the SDK returns data URL or base64, handle accordingly
      // For now show success message directing to backend
      setExporting(false);
      window.open(`/api/functions/exportTranslations`, '_blank');
    } catch(e) {
      setExporting(false);
    }
  };

  // Upload & Import
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImportFile(file);
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);

    // Upload file first
    const { file_url } = await base44.integrations.Core.UploadFile({ file: importFile });

    // Then import
    const res = await base44.functions.invoke('importTranslations', {
      file_url,
      type: activeTab,
    });

    setImportResult(res?.data || { error: 'Unknown error' });
    setImporting(false);
    setImportFile(null);
    if (res?.data?.success) {
      await fetchAll();
    }
  };

  // Edit a row inline
  const startEdit = (t) => {
    setEditingRow(t.id);
    setEditData({ ...t });
  };

  const saveEdit = async () => {
    await base44.entities.Translation.update(editingRow, editData);
    setTranslations(prev => prev.map(t => t.id === editingRow ? { ...t, ...editData } : t));
    setEditingRow(null);
    setEditData({});
  };

  const deleteKey = async (id) => {
    if (!confirm('Delete this translation key?')) return;
    await base44.entities.Translation.delete(id);
    setTranslations(prev => prev.filter(t => t.id !== id));
  };

  const addNewKey = async () => {
    if (!newKey.lang_key || !newKey.en) return;
    setAdding(true);
    const created = await base44.entities.Translation.create(newKey);
    setTranslations(prev => [created, ...prev]);
    setShowAddModal(false);
    setNewKey({ lang_key: '', module: 'common', en: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Globe size={22} className="text-orange-500" /> Translation Manager
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Export → Translate → Import to add languages</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={fetchAll} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm">
            <Plus size={14} /> Add Key
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Keys', value: totalKeys, color: 'text-gray-900' },
          { label: 'Fully Translated', value: fullyTranslated, color: 'text-green-600' },
          { label: 'Missing Arabic', value: missingAr, color: 'text-red-500' },
          { label: 'Languages', value: SUPPORTED_LANGS.length, color: 'text-orange-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl">
        {['ui', 'locations'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold border-b-2 capitalize transition-colors ${activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            {tab === 'ui' ? '🌐 UI Strings' : '📍 Locations'}
          </button>
        ))}
      </div>

      {/* Export / Import Panel */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export */}
          <div>
            <h3 className="font-black text-gray-800 text-sm mb-3 flex items-center gap-2">
              <Download size={14} className="text-orange-500" /> Export for Translation
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Downloads an Excel file with all keys (existing translations + empty columns for new ones). 
              Give to translator, then import back.
            </p>
            <div className="flex gap-2 flex-wrap">
              <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
                <option value="">All Modules</option>
                {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button
                onClick={async () => {
                  setExporting(true);
                  try {
                    const res = await base44.functions.invoke('exportTranslations', { type: activeTab, module_filter: moduleFilter });
                    alert('Export function called. Download via the Functions tab in your Base44 dashboard.');
                  } catch(e) { alert(e.message); }
                  setExporting(false);
                }}
                disabled={exporting}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-xs">
                {exporting ? <Loader2 size={12} className="animate-spin" /> : <FileSpreadsheet size={12} />}
                Export Excel
              </button>
            </div>
          </div>

          {/* Import */}
          <div>
            <h3 className="font-black text-gray-800 text-sm mb-3 flex items-center gap-2">
              <Upload size={14} className="text-green-600" /> Import Translated File
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Upload the translated Excel file. Existing keys will be updated, new keys will be created.
            </p>
            <div className="flex gap-2 flex-wrap items-center">
              <label className="flex items-center gap-1.5 border-2 border-dashed border-gray-300 hover:border-orange-400 text-gray-600 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors">
                <FileSpreadsheet size={12} />
                {importFile ? importFile.name : 'Choose Excel file'}
                <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
              </label>
              {importFile && (
                <button onClick={handleImport} disabled={importing}
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-xs">
                  {importing ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  {importing ? 'Importing...' : 'Import'}
                </button>
              )}
            </div>
            {importResult && (
              <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${importResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {importResult.success
                  ? <><CheckCircle size={12} /> Imported: {importResult.created} created, {importResult.updated} updated, {importResult.skipped} skipped</>
                  : <><AlertCircle size={12} /> Error: {importResult.error}</>
                }
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UI Translations Table */}
      {activeTab === 'ui' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search key or value..."
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400" />
            </div>
            <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
              <option value="">All Modules</option>
              {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <span className="text-xs text-gray-400 self-center">{filtered.length} keys</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] w-48">Key</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] w-20">Module</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px]">🇬🇧 English</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px]">🇸🇦 Arabic</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] w-28">Coverage</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2" />Loading...
                  </td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">No translations found</td></tr>
                )}
                {!loading && filtered.map(t => (
                  <tr key={t.id} className={`hover:bg-gray-50 ${editingRow === t.id ? 'bg-orange-50' : ''}`}>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{t.lang_key}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">{t.module || 'common'}</span>
                    </td>
                    <td className="px-4 py-2.5 max-w-[200px]">
                      {editingRow === t.id ? (
                        <input value={editData.en || ''} onChange={e => setEditData(p => ({ ...p, en: e.target.value }))}
                          className="w-full border border-orange-300 rounded px-2 py-1 text-xs outline-none" />
                      ) : (
                        <span className="truncate block text-gray-700" title={t.en}>{t.en}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 max-w-[200px]">
                      {editingRow === t.id ? (
                        <input value={editData.ar || ''} onChange={e => setEditData(p => ({ ...p, ar: e.target.value }))}
                          className="w-full border border-orange-300 rounded px-2 py-1 text-xs outline-none" dir="rtl" />
                      ) : (
                        <span className={`truncate block ${t.ar ? 'text-gray-700' : 'text-red-300 italic'}`} dir={t.ar ? 'rtl' : 'ltr'}>
                          {t.ar || '— missing'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <CoverageBar translation={t} />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        {editingRow === t.id ? (
                          <>
                            <button onClick={saveEdit} className="text-green-600 hover:text-green-700 font-bold text-[10px] px-2 py-1 bg-green-50 rounded">Save</button>
                            <button onClick={() => { setEditingRow(null); setEditData({}); }} className="text-gray-400 hover:text-gray-600 font-bold text-[10px]">✕</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(t)} className="text-blue-500 hover:text-blue-700 text-[10px] px-1.5 py-1 hover:bg-blue-50 rounded">Edit</button>
                            <button onClick={() => deleteKey(t.id)} className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded">
                              <Trash2 size={10} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-4xl mb-3">📍</p>
          <h3 className="font-black text-gray-900 mb-1">Location Translations</h3>
          <p className="text-sm text-gray-500 mb-4">
            Export your Cities/Districts/Areas for translation, then import the translated file back.
            Each location (City, District, Area) will have its name translated per language.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={async () => {
                setExporting(true);
                await base44.functions.invoke('exportTranslations', { type: 'locations' });
                alert('Location export triggered via backend. Check Functions tab for the download link.');
                setExporting(false);
              }}
              disabled={exporting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
              <Download size={14} /> Export Locations Excel
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            The export will contain Entity_Type, Entity_ID, and columns for all 19 languages.
          </p>
        </div>
      )}

      {/* Add Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900">Add New Translation Key</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Key (e.g. search_by_location)</label>
                <input value={newKey.lang_key} onChange={e => setNewKey(p => ({ ...p, lang_key: e.target.value.toLowerCase().replace(/\s/g,'_') }))}
                  placeholder="my_new_key"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Module</label>
                <select value={newKey.module} onChange={e => setNewKey(p => ({ ...p, module: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">English Text (required)</label>
                <input value={newKey.en} onChange={e => setNewKey(p => ({ ...p, en: e.target.value }))}
                  placeholder="English text here"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={addNewKey} disabled={adding || !newKey.lang_key || !newKey.en}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-sm">
                {adding ? 'Adding...' : 'Add Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
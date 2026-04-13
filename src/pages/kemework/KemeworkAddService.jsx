import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X, Plus, Upload, Trash2, ArrowLeft, Settings, Search, Tag, User } from "lucide-react";

const CATEGORIES = [
  "Home Design & Remodeling", "Architects & Designers", "Interior Designers",
  "General Contractors", "Electrical Services", "Plumbing Services",
  "Painting & Decorating", "Carpentry & Woodwork", "Flooring & Tiling",
  "HVAC & Air Conditioning", "Landscaping & Gardening", "Cleaning Services",
  "Security & Smart Home", "Photography", "Engineering & Consulting",
];

const CURRENCIES = ["USD", "AED", "SAR", "EGP", "JOD", "KWD", "QAR"];

function ProgressBar({ step }) {
  const steps = ["Overview", "Media", "Pricing", "Preview"];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all ${i < step ? "text-white" : i === step ? "text-white" : "bg-gray-100 text-gray-400"}`}
                style={i <= step ? { background: "#C41230" } : {}}>
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span className={`text-xs mt-1.5 font-semibold whitespace-nowrap ${i === step ? "text-gray-900" : "text-gray-400"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-0.5 mx-3 mt-[-14px]" style={{ background: i < step ? "#C41230" : "#e5e7eb" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function TagInput({ tags, setTags, placeholder }) {
  const [input, setInput] = useState("");
  const add = () => { if (input.trim() && !tags.includes(input.trim())) { setTags([...tags, input.trim()]); setInput(""); } };
  return (
    <div className="flex flex-wrap gap-1.5 min-h-[44px] border border-gray-200 rounded-xl px-3 py-2 focus-within:border-red-400 bg-white">
      {tags.map(t => (
        <span key={t} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#5C2D0E" }}>
          {t} <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}><X size={10} /></button>
        </span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder={tags.length === 0 ? placeholder : ""} className="flex-1 min-w-[100px] text-sm outline-none bg-transparent" />
    </div>
  );
}

function Step1({ data, setData }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Service Title (English) <span className="text-red-500">*</span></label>
        <input value={data.titleEn} onChange={e => setData(d => ({ ...d, titleEn: e.target.value }))} maxLength={100} placeholder="e.g. Professional Interior Design Package" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400" />
        <p className="text-xs text-gray-400 mt-1 text-right">{data.titleEn.length}/100</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Service Title (Arabic) <span className="text-gray-400 font-normal">(optional)</span></label>
        <input dir="rtl" value={data.titleAr} onChange={e => setData(d => ({ ...d, titleAr: e.target.value }))} placeholder="مثال: باقة التصميم الداخلي الاحترافي" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400" />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Category <span className="text-red-500">*</span></label>
        <select value={data.category} onChange={e => setData(d => ({ ...d, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 bg-white">
          <option value="">Select a category</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Tags</label>
        <TagInput tags={data.tags} setTags={v => setData(d => ({ ...d, tags: v }))} placeholder="Add keywords and press Enter..." />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Service Description (English) <span className="text-red-500">*</span></label>
        <textarea rows={6} value={data.descEn} onChange={e => setData(d => ({ ...d, descEn: e.target.value }))} placeholder="Describe your service in detail. What do you offer? What's your process? What results can clients expect?" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 resize-none" />
        <p className={`text-xs mt-1 ${data.descEn.length < 100 ? "text-red-400" : "text-green-600"}`}>{data.descEn.length}/100 minimum</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Service Description (Arabic) <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea dir="rtl" rows={4} value={data.descAr} onChange={e => setData(d => ({ ...d, descAr: e.target.value }))} placeholder="أضف وصفاً للخدمة بالعربية..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 resize-none" />
      </div>
    </div>
  );
}

function Step2({ data, setData }) {
  const handleThumb = (e) => {
    const file = e.target.files?.[0];
    if (file) setData(d => ({ ...d, thumbnail: file }));
  };
  const handleGallery = (e) => {
    const files = Array.from(e.target.files || []);
    setData(d => ({ ...d, gallery: [...d.gallery, ...files].slice(0, 8) }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
        💡 <strong>Tip:</strong> Add examples of your previous work to attract more clients. High-quality images significantly increase bookings.
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Main Thumbnail <span className="text-red-500">*</span></label>
        <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${data.thumbnail ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-red-400 hover:bg-red-50/30"}`}>
          {data.thumbnail ? (
            <div className="flex flex-col items-center gap-2">
              <img src={URL.createObjectURL(data.thumbnail)} alt="" className="w-32 h-24 object-cover rounded-xl" />
              <p className="text-xs font-semibold text-green-700">✅ {data.thumbnail.name}</p>
              <p className="text-xs text-gray-400">Click to change</p>
            </div>
          ) : (
            <>
              <Upload size={28} className="text-gray-400 mb-2" />
              <p className="text-sm font-bold text-gray-600">Upload Main Image</p>
              <p className="text-xs text-gray-400 mt-1">This is the first image clients see. JPG, PNG, min 800×600</p>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleThumb} className="hidden" />
        </label>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Gallery Images <span className="text-gray-400 font-normal">(up to 8)</span></label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-red-400 transition-all">
          <Upload size={24} className="text-gray-400 mb-2" />
          <p className="text-sm font-bold text-gray-600">Add Portfolio Images</p>
          <p className="text-xs text-gray-400 mt-1">Show your previous work — JPG, PNG</p>
          <input type="file" multiple accept="image/*" onChange={handleGallery} className="hidden" />
        </label>
        {data.gallery.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {data.gallery.map((f, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setData(d => ({ ...d, gallery: d.gallery.filter((_, j) => j !== i) }))} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PackageEditor({ pkg, setPkg }) {
  const addFeature = () => setPkg({ ...pkg, features: [...pkg.features, { text: "", included: true }] });
  const updateFeature = (i, key, val) => {
    const f = [...pkg.features];
    f[i] = { ...f[i], [key]: val };
    setPkg({ ...pkg, features: f });
  };
  const removeFeature = (i) => setPkg({ ...pkg, features: pkg.features.filter((_, j) => j !== i) });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Package Name</label>
          <input value={pkg.name} onChange={e => setPkg({ ...pkg, name: e.target.value })} placeholder='e.g. "Basic", "Standard"' className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Price</label>
          <div className="flex gap-2">
            <select value={pkg.currency} onChange={e => setPkg({ ...pkg, currency: e.target.value })} className="border border-gray-200 rounded-xl px-2 py-2.5 text-xs outline-none bg-white">
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="number" value={pkg.price} onChange={e => setPkg({ ...pkg, price: e.target.value })} placeholder="0" className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Delivery Days</label>
          <input type="number" value={pkg.delivery} onChange={e => setPkg({ ...pkg, delivery: e.target.value })} placeholder="e.g. 7" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Revisions</label>
          <input type="number" value={pkg.revisions} onChange={e => setPkg({ ...pkg, revisions: e.target.value })} placeholder="e.g. 2" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">Package Description</label>
        <textarea rows={3} value={pkg.description} onChange={e => setPkg({ ...pkg, description: e.target.value })} placeholder="Brief description of what this package includes..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 resize-none" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-gray-700">What's Included</label>
          {pkg.features.length < 10 && (
            <button type="button" onClick={addFeature} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color: "#C41230", background: "#FFF5F5" }}>
              <Plus size={12} /> Add Feature
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {pkg.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="checkbox" checked={f.included} onChange={e => updateFeature(i, "included", e.target.checked)} className="accent-red-700 w-4 h-4 flex-shrink-0" />
              <input value={f.text} onChange={e => updateFeature(i, "text", e.target.value)} placeholder={`Feature ${i + 1}`} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400" />
              <button type="button" onClick={() => removeFeature(i)} className="text-gray-300 hover:text-red-500 flex-shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
          {pkg.features.length === 0 && <p className="text-xs text-gray-400 italic">No features added yet. Click "+ Add Feature" to start.</p>}
        </div>
      </div>
    </div>
  );
}

function Step3({ data, setData }) {
  const [activePkg, setActivePkg] = useState(0);
  const updatePkg = (i, pkg) => {
    const pkgs = [...data.packages];
    pkgs[i] = pkg;
    setData(d => ({ ...d, packages: pkgs }));
  };

  return (
    <div>
      <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-5">
        {data.packages.map((p, i) => (
          <button key={i} type="button" onClick={() => setActivePkg(i)} className="flex-1 py-3 text-sm font-bold transition-colors" style={{ background: activePkg === i ? "#C41230" : "transparent", color: activePkg === i ? "#fff" : "#374151" }}>
            {p.name || `Package ${i + 1}`}
          </button>
        ))}
      </div>
      <PackageEditor pkg={data.packages[activePkg]} setPkg={pkg => updatePkg(activePkg, pkg)} />
    </div>
  );
}

function Step4({ data }) {
  const pkg = data.packages[0];
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
        👀 This is a preview of how your service will appear to clients.
      </div>

      {/* Service Card Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow overflow-hidden max-w-sm">
        <div className="h-44 bg-gray-100 flex items-center justify-center">
          {data.thumbnail ? (
            <img src={URL.createObjectURL(data.thumbnail)} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-300 text-4xl">🖼</span>
          )}
        </div>
        <div className="p-4">
          <p className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{data.titleEn || "Your Service Title"}</p>
          <p className="text-xs text-gray-500 mb-1">⭐ New · 0 reviews</p>
          <p className="text-xs text-gray-400 mb-3">{data.category || "Category"}</p>
          <p className="font-black text-base" style={{ color: "#C41230" }}>
            {pkg.price ? `From ${pkg.currency} ${pkg.price}` : "Price not set"}
          </p>
        </div>
      </div>

      {/* Package summary */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <h3 className="font-black text-gray-900 text-sm mb-3">Packages Summary</h3>
        {data.packages.map((p, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm font-semibold text-gray-700">{p.name || `Package ${i + 1}`}</span>
            <span className="text-sm font-black" style={{ color: "#C41230" }}>{p.price ? `${p.currency} ${p.price}` : "—"}</span>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="text-sm text-amber-800">
          📋 <strong>Review Note:</strong> Your service will be reviewed by the Kemework team within 24 hours before going live.
        </p>
      </div>
    </div>
  );
}

function SuccessPage({ onReset }) {
  return (
    <div className="text-center py-12">
      <div className="text-7xl mb-4">✅</div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Service Submitted for Review!</h2>
      <p className="text-gray-500 mb-6">Our team will review your service within 24 hours and notify you once it's approved.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/kemework" className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: "#C41230" }}>Go to Kemework Home →</Link>
        <button onClick={onReset} className="px-6 py-3 rounded-xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400">Add Another Service</button>
      </div>
    </div>
  );
}

const INITIAL_PKG = (name) => ({ name, currency: "USD", price: "", delivery: "", revisions: "", description: "", features: [] });

export default function KemeworkAddService() {
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);

  const [data, setData] = useState({
    titleEn: "", titleAr: "", category: "", tags: [],
    descEn: "", descAr: "",
    thumbnail: null, gallery: [],
    packages: [INITIAL_PKG("Basic"), INITIAL_PKG("Standard"), INITIAL_PKG("Premium")],
  });

  const canNext = [
    data.titleEn.length > 0 && data.category && data.descEn.length >= 100,
    !!data.thumbnail,
    true,
    true,
  ];

  const handleSubmit = (asDraft) => setSuccess(true);

  const navigate = useNavigate();
  const { pathname } = window.location;

  const BOTTOM_TABS = [
    { id: 'settings', label: 'Settings', icon: Settings, path: '/kemework' },
    { id: 'find',     label: 'Find',     icon: Search,   path: '/kemework/find-professionals' },
    { id: 'add',      label: 'Add',      icon: Plus,     path: '/kemework/add-service', fab: true },
    { id: 'buy',      label: 'Tasks',    icon: Tag,      path: '/kemework/tasks' },
    { id: 'account',  label: 'Account',  icon: User,     path: '/kemework' },
  ];

  if (success) return (
    <div className="min-h-screen pb-20 flex items-center justify-center px-4" style={{ background: "#F8F5F0" }}>
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg">
        <SuccessPage onReset={() => {
          setSuccess(false); setStep(0);
          setData({ titleEn: "", titleAr: "", category: "", tags: [], descEn: "", descAr: "", thumbnail: null, gallery: [], packages: [INITIAL_PKG("Basic"), INITIAL_PKG("Standard"), INITIAL_PKG("Premium")] });
        }} />
      </div>

      {/* Bottom Nav */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-end z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", minHeight: 64 }}
      >
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = pathname.startsWith(tab.path) && tab.id !== "account";

          if (tab.fab) {
            return (
              <button key={tab.id} onClick={() => navigate(tab.path)} className="flex-1 flex flex-col items-center justify-end pb-2" style={{ minHeight: 64 }}>
                <div className="w-14 h-14 rounded-full bg-[#FF6B00] flex items-center justify-center -mt-5" style={{ boxShadow: "0 4px 20px rgba(255,107,0,0.45)" }}>
                  <Icon size={26} color="white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-[#6B7280] mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button key={tab.id} onClick={() => navigate(tab.path)} className="flex-1 flex flex-col items-center justify-center py-2 transition-colors" style={{ minHeight: 64 }}>
              <Icon size={24} color={active ? "#FF6B00" : "#9CA3AF"} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] mt-0.5 font-medium ${active ? "text-[#FF6B00]" : "text-[#9CA3AF]"}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: "#F8F5F0" }}>
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-[760px] mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors mb-3">
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-xl font-black text-gray-900">Add a Service</h1>
          <p className="text-sm text-gray-500">Create a service offering for clients to order</p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 py-8">
        <ProgressBar step={step} />

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
          <h2 className="font-black text-gray-900 text-lg mb-5">
            {["Service Overview", "Service Media", "Pricing Packages", "Preview & Publish"][step]}
          </h2>
          {step === 0 && <Step1 data={data} setData={setData} />}
          {step === 1 && <Step2 data={data} setData={setData} />}
          {step === 2 && <Step3 data={data} setData={setData} />}
          {step === 3 && <Step4 data={data} />}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors">
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "#C41230" }}>
              Continue →
            </button>
          ) : (
            <div className="flex gap-3 flex-1">
              <button onClick={() => handleSubmit(true)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors">
                Save as Draft
              </button>
              <button onClick={() => handleSubmit(false)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all" style={{ background: "#C41230" }}>
                Submit for Approval →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-end z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", minHeight: 64 }}
      >
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = pathname.startsWith(tab.path) && tab.id !== "account";

          if (tab.fab) {
            return (
              <button key={tab.id} onClick={() => navigate(tab.path)} className="flex-1 flex flex-col items-center justify-end pb-2" style={{ minHeight: 64 }}>
                <div className="w-14 h-14 rounded-full bg-[#FF6B00] flex items-center justify-center -mt-5" style={{ boxShadow: "0 4px 20px rgba(255,107,0,0.45)" }}>
                  <Icon size={26} color="white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-[#6B7280] mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button key={tab.id} onClick={() => navigate(tab.path)} className="flex-1 flex flex-col items-center justify-center py-2 transition-colors" style={{ minHeight: 64 }}>
              <Icon size={24} color={active ? "#FF6B00" : "#9CA3AF"} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] mt-0.5 font-medium ${active ? "text-[#FF6B00]" : "text-[#9CA3AF]"}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
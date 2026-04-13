import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, ChevronLeft } from "lucide-react";

const CATEGORIES = [
  "Home Design & Remodeling", "Architects & Designers", "Interior Designers",
  "General Contractors", "Electrical Services", "Plumbing Services",
  "Painting & Decorating", "Carpentry & Woodwork", "Flooring & Tiling",
  "Roofing Services", "HVAC & Air Conditioning", "Landscaping & Gardening",
  "Cleaning Services", "Security & Smart Home", "Pest Control",
  "Moving & Packing", "Photography", "Legal Services",
  "Engineering & Consulting", "Other Services",
];

const SKILLS_LIST = [
  "Electrical Wiring", "Plumbing", "Carpentry", "Tiling", "Painting",
  "Interior Design", "3D Rendering", "AutoCAD", "Landscaping", "Irrigation",
  "AC Installation", "Renovation", "Waterproofing", "Roofing", "Masonry",
];

const CURRENCIES = ["USD", "AED", "SAR", "EGP", "JOD", "KWD", "QAR"];
const COUNTRIES = ["Egypt", "UAE", "Saudi Arabia", "Jordan", "Kuwait", "Qatar", "Bahrain", "Oman"];
const CITIES = {
  Egypt: ["Cairo", "Alexandria", "Giza", "Luxor", "Aswan"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"],
  Jordan: ["Amman", "Irbid", "Zarqa", "Aqaba"],
  Kuwait: ["Kuwait City", "Hawalli", "Salmiya"],
  Qatar: ["Doha", "Al Wakra", "Al Khor"],
  Bahrain: ["Manama", "Riffa", "Muharraq"],
  Oman: ["Muscat", "Salalah", "Sohar"],
};

function ProgressBar({ step }) {
  const steps = ["Details", "Location", "Review"];
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                i < step ? "text-white" : i === step ? "text-white" : "bg-gray-100 text-gray-400"
              }`}
              style={i <= step ? { background: "#C41230" } : {}}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-semibold ${i === step ? "text-gray-900" : "text-gray-400"}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TagInput({ tags, setTags, suggestions = [], placeholder }) {
  const [input, setInput] = useState("");
  const [showSugg, setShowSugg] = useState(false);
  const filtered = suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s));

  const add = (tag) => {
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setInput("");
    setShowSugg(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1 min-h-[40px] border border-gray-200 rounded-lg px-2 py-1.5 focus-within:border-red-400 bg-white">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#5C2D0E" }}>
            {t} <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}><X size={9} /></button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setShowSugg(true);
          }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(input.trim());
            }
          }}
          onFocus={() => setShowSugg(true)}
          onBlur={() => setTimeout(() => setShowSugg(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] text-xs outline-none bg-transparent"
        />
      </div>
      {showSugg && (input || filtered.length > 0) && filtered.length > 0 && (
        <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
          {filtered.slice(0, 6).map(s => (
            <button key={s} type="button" onMouseDown={() => add(s)} className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Step1({ data, setData }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">Task Title *</label>
        <input
          maxLength={100}
          value={data.title}
          onChange={e => setData(d => ({ ...d, title: e.target.value }))}
          placeholder='e.g. Paint living room'
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-red-400"
        />
        <p className="text-[10px] text-gray-400 mt-0.5 text-right">{data.title.length}/100</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">Category *</label>
        <select value={data.category} onChange={e => setData(d => ({ ...d, category: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-red-400 bg-white">
          <option value="">Select category</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">Description *</label>
        <textarea
          rows={3}
          value={data.description}
          onChange={e => setData(d => ({ ...d, description: e.target.value }))}
          placeholder="Describe your task..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-red-400 resize-none"
        />
        <p className={`text-[10px] mt-0.5 ${data.description.length < 100 ? "text-red-400" : "text-green-600"}`}>
          {data.description.length}/100 min
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">Skills Required</label>
        <TagInput tags={data.skills} setTags={v => setData(d => ({ ...d, skills: v }))} suggestions={SKILLS_LIST} placeholder="Add skills..." />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">Budget Type *</label>
        <div className="flex gap-2">
          {["fixed", "hourly", "open"].map(t => (
            <label key={t} className={`flex-1 flex items-center justify-center px-2 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${data.budgetType === t ? "border-red-600 bg-red-50" : "border-gray-200"}`}>
              <input type="radio" name="budgetType" value={t} checked={data.budgetType === t} onChange={() => setData(d => ({ ...d, budgetType: t }))} className="hidden" />
              <span className="capitalize">{t === "fixed" ? "Fixed" : t === "hourly" ? "Hourly" : "Open"}</span>
            </label>
          ))}
        </div>
      </div>

      {(data.budgetType === "fixed" || data.budgetType === "hourly") && (
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">Budget Range</label>
          <div className="flex gap-1 items-end">
            <select value={data.currency} onChange={e => setData(d => ({ ...d, currency: e.target.value }))} className="border border-gray-200 rounded-lg px-2 py-2 text-xs outline-none bg-white">
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="number" value={data.budgetMin} onChange={e => setData(d => ({ ...d, budgetMin: e.target.value }))} placeholder="Min" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-red-400" />
            <span className="text-gray-400 text-sm pb-2">–</span>
            <input type="number" value={data.budgetMax} onChange={e => setData(d => ({ ...d, budgetMax: e.target.value }))} placeholder="Max" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-red-400" />
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">Deadline</label>
        <input
          type="date"
          value={data.deadline}
          min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
          onChange={e => setData(d => ({ ...d, deadline: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-red-400"
        />
      </div>

      <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <input type="checkbox" checked={data.isBiddable} onChange={e => setData(d => ({ ...d, isBiddable: e.target.checked }))} className="accent-red-700" />
        <span className="text-xs font-semibold text-gray-700">Accept bids from professionals</span>
      </label>

      <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <input type="checkbox" checked={data.isPrivate} onChange={e => setData(d => ({ ...d, isPrivate: e.target.checked }))} className="accent-red-700" />
        <span className="text-xs font-semibold text-gray-700">Keep this task private</span>
      </label>
    </div>
  );
}

function Step2({ data, setData }) {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setData(d => ({ ...d, images: [...d.images, ...files].slice(0, 5) }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">Country</label>
        <select value={data.country} onChange={e => setData(d => ({ ...d, country: e.target.value, city: "" }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-red-400 bg-white">
          <option value="">Select country</option>
          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">City</label>
        <select value={data.city} onChange={e => setData(d => ({ ...d, city: e.target.value }))} disabled={!data.country} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-red-400 bg-white disabled:opacity-50">
          <option value="">Select city</option>
          {(CITIES[data.country] || []).map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">Address (optional)</label>
        <input value={data.address} onChange={e => setData(d => ({ ...d, address: e.target.value }))} placeholder="e.g. Maadi" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-red-400" />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">Upload Images (up to 5)</label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-red-400 transition-all">
          <p className="text-xs font-bold text-gray-600">📷 Choose Photos</p>
          <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
        </label>
        {data.images.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {data.images.map((f, i) => (
              <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setData(d => ({ ...d, images: d.images.filter((_, j) => j !== i) }))} className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[8px]">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Step3({ data, setData }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <p className="text-xs font-black text-gray-900 mb-2">Task Summary</p>
        {[
          { label: "Title", value: data.title },
          { label: "Category", value: data.category },
          { label: "Budget", value: data.budgetType === "open" ? "Open" : `${data.currency} ${data.budgetMin}–${data.budgetMax}` },
          { label: "Location", value: [data.city, data.country].filter(Boolean).join(", ") || "—" },
          { label: "Images", value: `${data.images.length} uploaded` },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-[11px] text-gray-600 font-semibold">{row.label}</span>
            <span className="text-[11px] text-gray-800 font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-bold text-gray-900 mb-2">How would you like to proceed?</p>
        <div className="flex gap-2">
          {[
            { key: "self", icon: "🙋", title: "Choose Pro", desc: "Post & receive bids" },
            { key: "kemedar", icon: "🏗", title: "Let Kemedar Help", desc: "Expert supervision" },
          ].map(opt => (
            <label key={opt.key} className={`flex-1 flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all ${data.track === opt.key ? "border-red-600 bg-red-50" : "border-gray-200"}`}>
              <input type="radio" name="track" value={opt.key} checked={data.track === opt.key} onChange={() => setData(d => ({ ...d, track: opt.key }))} className="hidden" />
              <span className="text-xl mb-1">{opt.icon}</span>
              <span className="text-[11px] font-bold text-gray-900">{opt.title}</span>
              <span className="text-[10px] text-gray-500">{opt.desc}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={data.agreed} onChange={e => setData(d => ({ ...d, agreed: e.target.checked }))} className="mt-0.5 accent-red-700 w-3 h-3 flex-shrink-0" />
        <span className="text-[11px] text-gray-600">I agree to Kemework's Terms of Service</span>
      </label>
    </div>
  );
}

function SuccessScreen({ taskRef, onReset }) {
  return (
    <div className="text-center py-8">
      <div className="text-5xl mb-3">✅</div>
      <h2 className="text-lg font-black text-gray-900 mb-1">Task Posted!</h2>
      <p className="text-xs text-gray-500 mb-4">Your task is now visible to professionals.</p>
      <div className="inline-block bg-gray-100 rounded-lg px-3 py-1.5 font-bold text-gray-700 text-sm mb-4">
        Ref: <span style={{ color: "#C41230" }}>KW-{taskRef}</span>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={onReset} className="w-full px-4 py-2.5 rounded-lg font-bold text-sm text-white" style={{ background: "#C41230" }}>
          Post Another Task
        </button>
      </div>
    </div>
  );
}

export default function KemeworkMobilePostTask() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [taskRef] = useState(() => Math.floor(10000 + Math.random() * 90000).toString());

  const [data, setData] = useState({
    title: "", category: "", description: "", skills: [], tags: [],
    budgetType: "fixed", currency: "USD", budgetMin: "", budgetMax: "",
    deadline: "", isBiddable: true, isPrivate: false,
    country: "", city: "", address: "", images: [],
    track: "self", agreed: false,
  });

  const canNext = [
    data.title.length > 0 && data.category && data.description.length >= 100,
    true,
    data.track && data.agreed,
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <SuccessScreen taskRef={taskRef} onReset={() => {
          setSuccess(false);
          setStep(0);
          setData({ title: "", category: "", description: "", skills: [], tags: [], budgetType: "fixed", currency: "USD", budgetMin: "", budgetMax: "", deadline: "", isBiddable: true, isPrivate: false, country: "", city: "", address: "", images: [], track: "self", agreed: false });
        }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-1 text-gray-900">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-black text-gray-900">Post a Task</h1>
          <p className="text-[11px] text-gray-500">Step {step + 1} of 3</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-28">
        <ProgressBar step={step} />

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <h2 className="font-black text-gray-900 text-sm mb-4">
            {step === 0 ? "Task Details" : step === 1 ? "Location & Photos" : "Review & Post"}
          </h2>
          {step === 0 && <Step1 data={data} setData={setData} />}
          {step === 1 && <Step2 data={data} setData={setData} />}
          {step === 2 && <Step3 data={data} setData={setData} />}
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 max-w-lg mx-auto">
          <div className="flex gap-3 p-4">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-lg font-bold text-sm border-2 border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                ← Back
              </button>
            )}
            {step < 2 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]} className="flex-1 py-3 rounded-lg font-bold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95" style={{ background: canNext[step] ? "#C41230" : "#CCCCCC" }}>
                Next
              </button>
            ) : (
              <button onClick={() => setSuccess(true)} disabled={!canNext[2]} className="flex-1 py-3 rounded-lg font-bold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95" style={{ background: canNext[2] ? (data.track === "kemedar" ? "#D4A017" : "#C41230") : "#CCCCCC", color: data.track === "kemedar" && canNext[2] ? "#1a1a2e" : "#fff" }}>
                {data.track === "kemedar" ? "Send to Kemedar ✓" : "Post Task ✓"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Check, ChevronDown, X, Plus, Calendar, Upload, Pencil, ChevronLeft } from "lucide-react";

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
  const steps = ["Task Details", "Location & Media", "Review & Post"];
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

function TagInput({ tags, setTags, suggestions = [], placeholder }) {
  const [input, setInput] = useState("");
  const [showSugg, setShowSugg] = useState(false);
  const filtered = suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s));

  const add = (tag) => {
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setInput(""); setShowSugg(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 min-h-[44px] border border-gray-200 rounded-xl px-3 py-2 focus-within:border-red-400 bg-white">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#5C2D0E" }}>
            {t} <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}><X size={10} /></button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setShowSugg(true); }}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(input.trim()); } }}
          onFocus={() => setShowSugg(true)}
          onBlur={() => setTimeout(() => setShowSugg(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] text-sm outline-none bg-transparent"
        />
      </div>
      {showSugg && (input || filtered.length > 0) && filtered.length > 0 && (
        <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
          {filtered.slice(0, 8).map(s => (
            <button key={s} type="button" onMouseDown={() => add(s)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">{s}</button>
          ))}
          {input.trim() && !suggestions.includes(input.trim()) && (
            <button type="button" onMouseDown={() => add(input.trim())} className="w-full text-left px-4 py-2 text-sm text-red-700 font-bold hover:bg-red-50">
              + Add "{input.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Step1({ data, setData }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Task Title <span className="text-red-500">*</span></label>
        <input
          maxLength={100}
          value={data.title}
          onChange={e => setData(d => ({ ...d, title: e.target.value }))}
          placeholder='e.g. Paint living room walls'
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{data.title.length}/100</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Category <span className="text-red-500">*</span></label>
        <select value={data.category} onChange={e => setData(d => ({ ...d, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 bg-white">
          <option value="">Select a category</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Description <span className="text-red-500">*</span></label>
        <textarea
          rows={5}
          value={data.description}
          onChange={e => setData(d => ({ ...d, description: e.target.value }))}
          placeholder="Describe your task in detail. Include specific requirements, materials needed, expected outcome..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 resize-none"
        />
        <p className={`text-xs mt-1 ${data.description.length < 100 ? "text-red-400" : "text-green-600"}`}>
          {data.description.length}/100 minimum characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Skills Required</label>
        <TagInput tags={data.skills} setTags={v => setData(d => ({ ...d, skills: v }))} suggestions={SKILLS_LIST} placeholder="Search or add skills..." />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Tags</label>
        <TagInput tags={data.tags} setTags={v => setData(d => ({ ...d, tags: v }))} placeholder="Add relevant keywords..." />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">Budget Type <span className="text-red-500">*</span></label>
        <div className="flex flex-wrap gap-3">
          {["fixed", "hourly", "open"].map(t => (
            <label key={t} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${data.budgetType === t ? "border-red-600 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="budgetType" value={t} checked={data.budgetType === t} onChange={() => setData(d => ({ ...d, budgetType: t }))} className="accent-red-700" />
              <span className="text-sm font-semibold capitalize">{t === "fixed" ? "Fixed Budget" : t === "hourly" ? "Hourly Rate" : "Open to Offers"}</span>
            </label>
          ))}
        </div>
      </div>

      {(data.budgetType === "fixed" || data.budgetType === "hourly") && (
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1.5">Budget Range</label>
          <div className="flex gap-3 items-center">
            <select value={data.currency} onChange={e => setData(d => ({ ...d, currency: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white">
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="number" value={data.budgetMin} onChange={e => setData(d => ({ ...d, budgetMin: e.target.value }))} placeholder="Min" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
            <span className="text-gray-400 text-sm">—</span>
            <input type="number" value={data.budgetMax} onChange={e => setData(d => ({ ...d, budgetMax: e.target.value }))} placeholder="Max" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Deadline</label>
        <input
          type="date"
          value={data.deadline}
          min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
          onChange={e => setData(d => ({ ...d, deadline: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-bold text-gray-800 text-sm">Accept Bids from Professionals</p>
            <p className="text-xs text-gray-400 mt-0.5">Allow professionals to submit bids for your task</p>
          </div>
          <button type="button" onClick={() => setData(d => ({ ...d, isBiddable: !d.isBiddable }))} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${data.isBiddable ? "bg-red-600" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.isBiddable ? "left-6" : "left-0.5"}`} />
          </button>
        </label>
        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-bold text-gray-800 text-sm">Private Task</p>
            <p className="text-xs text-gray-400 mt-0.5">Only visible to professionals you invite</p>
          </div>
          <button type="button" onClick={() => setData(d => ({ ...d, isPrivate: !d.isPrivate }))} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${data.isPrivate ? "bg-red-600" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.isPrivate ? "left-6" : "left-0.5"}`} />
          </button>
        </label>
      </div>
    </div>
  );
}

function Step2({ data, setData }) {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setData(d => ({ ...d, images: [...d.images, ...files].slice(0, 10) }));
  };
  const handleAttachments = (e) => {
    const files = Array.from(e.target.files || []);
    setData(d => ({ ...d, attachments: [...d.attachments, ...files].slice(0, 5) }));
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Country</label>
        <select value={data.country} onChange={e => setData(d => ({ ...d, country: e.target.value, city: "" }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 bg-white">
          <option value="">Select country</option>
          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">City</label>
        <select value={data.city} onChange={e => setData(d => ({ ...d, city: e.target.value }))} disabled={!data.country} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 bg-white disabled:opacity-50">
          <option value="">Select city</option>
          {(CITIES[data.country] || []).map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Address / Neighborhood <span className="text-gray-400 font-normal">(optional)</span></label>
        <input value={data.address} onChange={e => setData(d => ({ ...d, address: e.target.value }))} placeholder="e.g. Maadi, South of Cairo" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400" />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Upload Images <span className="text-gray-400 font-normal">(up to 10)</span></label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition-all">
          <Upload size={28} className="text-gray-400 mb-2" />
          <p className="text-sm font-bold text-gray-600">📷 Take Photo / 🖼 Choose from Gallery</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
          <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
        </label>
        {data.images.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {data.images.map((f, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setData(d => ({ ...d, images: d.images.filter((_, j) => j !== i) }))} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">Upload Attachments <span className="text-gray-400 font-normal">(up to 5 — PDF, DOC, DWG)</span></label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-red-400 transition-all">
          <p className="text-sm font-bold text-gray-600">📎 Choose Files</p>
          <p className="text-xs text-gray-400 mt-1">PDF, DOC, DWG up to 20MB each</p>
          <input type="file" multiple accept=".pdf,.doc,.docx,.dwg" onChange={handleAttachments} className="hidden" />
        </label>
        {data.attachments.length > 0 && (
          <div className="flex flex-col gap-2 mt-3">
            {data.attachments.map((f, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📎</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{f.name}</p>
                    <p className="text-xs text-gray-400">{(f.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                <button type="button" onClick={() => setData(d => ({ ...d, attachments: d.attachments.filter((_, j) => j !== i) }))} className="text-gray-400 hover:text-red-600"><X size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Step3({ data, setData, onEditStep }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <h3 className="font-black text-gray-900 text-sm mb-4">Task Summary</h3>
        {[
          { label: "Title", value: data.title, step: 0 },
          { label: "Category", value: data.category, step: 0 },
          { label: "Description", value: data.description.slice(0, 80) + "...", step: 0 },
          { label: "Skills", value: data.skills.join(", ") || "—", step: 0 },
          { label: "Budget", value: data.budgetType === "open" ? "Open to Offers" : `${data.currency} ${data.budgetMin} – ${data.budgetMax}`, step: 0 },
          { label: "Deadline", value: data.deadline || "—", step: 0 },
          { label: "Location", value: [data.city, data.country].filter(Boolean).join(", ") || "—", step: 1 },
          { label: "Images", value: `${data.images.length} uploaded`, step: 1 },
          { label: "Attachments", value: `${data.attachments.length} uploaded`, step: 1 },
        ].map(row => (
          <div key={row.label} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0 gap-4">
            <span className="text-xs text-gray-500 font-semibold flex-shrink-0 w-24">{row.label}</span>
            <span className="text-xs text-gray-800 flex-1 line-clamp-1">{row.value}</span>
            <button type="button" onClick={() => onEditStep(row.step)} className="text-gray-400 hover:text-red-600 flex-shrink-0"><Pencil size={12} /></button>
          </div>
        ))}
      </div>

      {/* Track selection */}
      <div>
        <p className="text-sm font-black text-gray-900 mb-3">How would you like to handle this task?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "self", icon: "🙋", title: "I'll Choose My Professional", desc: "Post publicly and receive bids from professionals on Kemework", badge: "Track 1" },
            { key: "kemedar", icon: "🏗", title: "Let Kemedar Handle It", desc: "Assign to Kemedar's expert team with full supervision and quality guarantee", badge: "Track 2" },
          ].map(opt => (
            <label key={opt.key} className={`flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all ${data.track === opt.key ? "border-red-600 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="track" value={opt.key} checked={data.track === opt.key} onChange={() => setData(d => ({ ...d, track: opt.key }))} className="hidden" />
              <span className="text-3xl mb-2">{opt.icon}</span>
              <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full mb-2 w-fit text-white" style={{ background: opt.key === "self" ? "#C41230" : "#D4A017", color: opt.key === "kemedar" ? "#1a1a2e" : "#fff" }}>{opt.badge}</span>
              <p className="font-black text-gray-900 text-sm mb-1">{opt.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>
            </label>
          ))}
        </div>
        {data.track === "kemedar" && (
          <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            🏗 A Kemedar representative will contact you within 24 hours to discuss your task requirements and arrange supervision.
          </p>
        )}
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={data.agreed} onChange={e => setData(d => ({ ...d, agreed: e.target.checked }))} className="mt-0.5 accent-red-700 w-4 h-4 flex-shrink-0" />
        <span className="text-sm text-gray-600">
          I agree to Kemework's <Link to="/kemework/terms" className="font-bold" style={{ color: "#C41230" }}>Terms of Service</Link> and understand that my task information will be visible to registered professionals.
        </span>
      </label>
    </div>
  );
}

function SuccessPage({ taskRef, onReset }) {
  return (
    <div className="text-center py-12">
      <div className="text-7xl mb-4">✅</div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Task Posted Successfully!</h2>
      <p className="text-gray-500 mb-2">Your task has been published and is now visible to professionals.</p>
      <div className="inline-block bg-gray-100 rounded-xl px-5 py-2 font-black text-gray-700 text-lg mb-6">
        Task Reference: <span style={{ color: "#C41230" }}>KW-{taskRef}</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={`/kemework/tasks`} className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: "#C41230" }}>View My Task →</Link>
        <button onClick={onReset} className="px-6 py-3 rounded-xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400">Post Another Task</button>
      </div>
    </div>
  );
}

export default function KemeworkPostTask() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [taskRef] = useState(() => Math.floor(10000 + Math.random() * 90000).toString());

  const [data, setData] = useState({
    title: "", category: "", description: "", skills: [], tags: [],
    budgetType: "fixed", currency: "USD", budgetMin: "", budgetMax: "",
    deadline: "", isBiddable: true, isPrivate: false,
    country: "", city: "", address: "", images: [], attachments: [],
    track: "self", agreed: false,
  });

  const canNext = [
    data.title.length > 0 && data.category && data.description.length >= 100 && data.budgetType,
    true,
    data.track && data.agreed,
  ];

  const handleSubmit = async () => {
    try {
      const user = await base44.auth.me().catch(() => null);
      await base44.entities.KemeworkTask.create({
        title: data.title,
        description: data.description,
        status: "open",
        clientUserId: user?.id || null,
        category: data.category,
        skills: data.skills,
        tags: data.tags,
        budgetType: data.budgetType,
        currency: data.currency,
        budgetMin: data.budgetMin ? parseFloat(data.budgetMin) : null,
        budgetMax: data.budgetMax ? parseFloat(data.budgetMax) : null,
        deadline: data.deadline || null,
        isBiddable: data.isBiddable,
        isPrivate: data.isPrivate,
        country: data.country,
        city: data.city,
        address: data.address,
        track: data.track,
      });
    } catch (e) {
      console.error("Task post error:", e);
    }
    setSuccess(true);
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F8F5F0" }}>
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg">
        <SuccessPage taskRef={taskRef} onReset={() => { setSuccess(false); setStep(0); setData({ title: "", category: "", description: "", skills: [], tags: [], budgetType: "fixed", currency: "USD", budgetMin: "", budgetMax: "", deadline: "", isBiddable: true, isPrivate: false, country: "", city: "", address: "", images: [], attachments: [], track: "self", agreed: false }); }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-900">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-black text-gray-900">Post a Task</h1>
          <p className="text-xs text-gray-500">Get quotes from verified professionals</p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 py-8">
        <ProgressBar step={step} />

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
          <h2 className="font-black text-gray-900 text-lg mb-5">
            {step === 0 ? "Task Details" : step === 1 ? "Location & Media" : "Review & Post"}
          </h2>
          {step === 0 && <Step1 data={data} setData={setData} />}
          {step === 1 && <Step2 data={data} setData={setData} />}
          {step === 2 && <Step3 data={data} setData={setData} onEditStep={setStep} />}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors">
              ← Back
            </button>
          )}
          {step < 2 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "#C41230" }}>
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canNext[2]} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: data.track === "kemedar" ? "#D4A017" : "#C41230", color: data.track === "kemedar" ? "#1a1a2e" : "#fff" }}>
              {data.track === "kemedar" ? "Send to Kemedar →" : "Post My Task →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
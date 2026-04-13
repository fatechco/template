import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

// ── Step 1: Basics ──────────────────────────────────────────────────────────
function BuildStep1Basics({ form, update }) {
  const PROJECT_TYPES = [
    { id: "apartment_finishing", label: "🏠 Apartment Finishing" },
    { id: "villa_finishing", label: "🏡 Villa Finishing" },
    { id: "office_fitting", label: "🏢 Office Fitting" },
    { id: "retail_fitout", label: "🏪 Retail Fit-out" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Project Basics</h2>
        <p className="text-gray-500 text-sm">Tell us about your project so we can generate an accurate BOQ.</p>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Project Name <span className="text-gray-400 font-normal">(optional)</span></label>
        <input type="text" placeholder="e.g. My New Apartment – New Cairo" value={form.projectName}
          onChange={e => update({ projectName: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Project Type</label>
        <div className="grid grid-cols-2 gap-3">
          {PROJECT_TYPES.map(t => (
            <button key={t.id} onClick={() => update({ projectType: t.id })}
              className={`py-3 px-4 rounded-xl border-2 text-sm font-bold text-left transition-all ${form.projectType === t.id ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-700 hover:border-teal-300"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Total Area (m²)</label>
        <input type="number" min={30} max={2000} value={form.totalAreaSqm}
          onChange={e => update({ totalAreaSqm: Number(e.target.value) })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Bedrooms", key: "numberOfRooms", min: 1, max: 10 },
          { label: "Bathrooms", key: "numberOfBathrooms", min: 1, max: 8 },
          { label: "Living Rooms", key: "numberOfLivingRooms", min: 1, max: 4 },
          { label: "Kitchens", key: "numberOfKitchens", min: 1, max: 3 },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">{f.label}</label>
            <input type="number" min={f.min} max={f.max} value={form[f.key]}
              onChange={e => update({ [f.key]: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Floor Number</label>
        <input type="number" min={0} max={50} value={form.floorNumber}
          onChange={e => update({ floorNumber: Number(e.target.value) })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
        <p className="text-xs text-gray-400 mt-1">Used to estimate material transport costs</p>
      </div>
    </div>
  );
}

// ── Step 2: Floor Plan ───────────────────────────────────────────────────────
function BuildStep2FloorPlan({ form, update }) {
  const [uploading, setUploading] = useState(false);
  const PLAN_TYPES = [
    { id: "no_plan_estimate", label: "📐 No plan — estimate by area", desc: "AI will estimate room sizes from total area" },
    { id: "upload_plan", label: "📤 Upload floor plan", desc: "AI extracts rooms from your PDF/image" },
    { id: "manual_rooms", label: "✏️ Enter rooms manually", desc: "Specify each room's dimensions yourself" },
  ];
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    update({ floorPlanUrl: file_url, floorPlanType: "upload_plan" });
    setUploading(false);
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Floor Plan</h2>
        <p className="text-gray-500 text-sm">A floor plan improves BOQ accuracy. You can also proceed without one.</p>
      </div>
      <div className="space-y-3">
        {PLAN_TYPES.map(t => (
          <button key={t.id} onClick={() => update({ floorPlanType: t.id })}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${form.floorPlanType === t.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`}>
            <p className="font-bold text-gray-900 text-sm">{t.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
          </button>
        ))}
      </div>
      {form.floorPlanType === "upload_plan" && (
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-6 text-center">
          {form.floorPlanUrl ? (
            <div>
              <p className="text-teal-600 font-bold text-sm mb-2">✅ Floor plan uploaded</p>
              <button onClick={() => update({ floorPlanUrl: null })} className="text-xs text-red-500 underline">Remove</button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <p className="text-gray-500 text-sm mb-2">{uploading ? "Uploading..." : "Click to upload PDF or image"}</p>
              <p className="text-xs text-gray-400">Supports PDF, PNG, JPG</p>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}
        </div>
      )}
      {form.floorPlanType === "manual_rooms" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          ℹ️ Manual room entry is available on the next step. Continue to proceed.
        </div>
      )}
    </div>
  );
}

// ── Step 3: Style ────────────────────────────────────────────────────────────
function BuildStep3Style({ form, update }) {
  const LEVELS = [
    { id: "economy", label: "💰 Economy", desc: "Budget-friendly materials, functional finish" },
    { id: "standard", label: "⭐ Standard", desc: "Good quality, most popular choice" },
    { id: "premium", label: "💎 Premium", desc: "High-end materials and finishes" },
  ];
  const FLOORING = [
    { id: "ceramic_tiles", label: "Ceramic Tiles" },
    { id: "porcelain_tiles", label: "Porcelain Tiles" },
    { id: "marble", label: "Marble" },
    { id: "engineered_wood", label: "Engineered Wood" },
    { id: "vinyl", label: "Vinyl / SPC" },
  ];
  const WALL = [
    { id: "paint_only", label: "Paint Only" },
    { id: "paint_with_tiles_wet_areas", label: "Paint + Tiles (Wet Areas)" },
    { id: "wallpaper_accent", label: "Wallpaper Accent" },
    { id: "full_tiles", label: "Full Wall Tiles" },
  ];
  const KITCHEN = [
    { id: "standard_ready_made", label: "Standard Ready-Made" },
    { id: "semi_custom", label: "Semi-Custom" },
    { id: "fully_custom", label: "Fully Custom" },
  ];
  const BATHROOM = [
    { id: "standard_branded", label: "Standard Branded" },
    { id: "premium_branded", label: "Premium Branded" },
    { id: "luxury", label: "Luxury" },
  ];
  const updatePref = (key, val) => update({ finishingPreferences: { ...form.finishingPreferences, [key]: val } });
  const chipClass = (active) => `px-4 py-2 rounded-full text-xs font-bold border transition-all ${active ? "bg-teal-500 text-white border-teal-500" : "border-gray-200 text-gray-700 hover:border-teal-300"}`;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Style & Preferences</h2>
        <p className="text-gray-500 text-sm">Choose your finishing level and material preferences.</p>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Finishing Level</label>
        <div className="space-y-2">
          {LEVELS.map(l => (
            <button key={l.id} onClick={() => update({ finishingLevel: l.id })}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${form.finishingLevel === l.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`}>
              <p className="font-bold text-gray-900 text-sm">{l.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{l.desc}</p>
            </button>
          ))}
        </div>
      </div>
      {[
        { label: "Flooring Material", key: "flooringMaterial", opts: FLOORING },
        { label: "Wall Finish", key: "wallFinish", opts: WALL },
        { label: "Kitchen Style", key: "kitchenStyle", opts: KITCHEN },
        { label: "Bathroom Style", key: "bathroomStyle", opts: BATHROOM },
      ].map(({ label, key, opts }) => (
        <div key={key}>
          <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
          <div className="flex flex-wrap gap-2">
            {opts.map(o => (
              <button key={o.id} onClick={() => updatePref(key, o.id)} className={chipClass(form.finishingPreferences?.[key] === o.id)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="space-y-3">
        {[
          { key: "includeLabor", label: "Include labor cost estimates", desc: "Add estimated contractor rates to BOQ" },
          { key: "includeContingency", label: "Include 10% contingency buffer", desc: "Recommended for unexpected costs" },
        ].map(o => (
          <label key={o.key} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
            <input type="checkbox" checked={!!form[o.key]} onChange={e => update({ [o.key]: e.target.checked })} className="accent-teal-500 mt-0.5 w-4 h-4" />
            <div>
              <p className="font-bold text-gray-800 text-sm">{o.label}</p>
              <p className="text-xs text-gray-500">{o.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// ── Step 4: Review & Generate ────────────────────────────────────────────────
function BuildStep4Generate({ form }) {
  const fmt = v => v?.toString().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "—";
  const rows = [
    { label: "Project Name", value: form.projectName || `${fmt(form.projectType)} – ${form.totalAreaSqm}m²` },
    { label: "Type", value: fmt(form.projectType) },
    { label: "Total Area", value: `${form.totalAreaSqm} m²` },
    { label: "Bedrooms / Bathrooms", value: `${form.numberOfRooms} / ${form.numberOfBathrooms}` },
    { label: "Floor Plan", value: fmt(form.floorPlanType) },
    { label: "Finishing Level", value: fmt(form.finishingLevel) },
    { label: "Flooring", value: fmt(form.finishingPreferences?.flooringMaterial) },
    { label: "Wall Finish", value: fmt(form.finishingPreferences?.wallFinish) },
    { label: "Labor Estimates", value: form.includeLabor ? "Yes" : "No" },
    { label: "Contingency Buffer", value: form.includeContingency ? "10%" : "None" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Ready to Generate!</h2>
        <p className="text-gray-500 text-sm">Review your project details before we create your full BOQ with 3 budget scenarios.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {rows.map((r, i) => (
          <div key={i} className={`flex items-center justify-between px-5 py-3 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
            <span className="text-gray-500 font-medium">{r.label}</span>
            <span className="font-bold text-gray-900">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
        <p className="font-black text-teal-800 mb-2">🤖 What happens next?</p>
        <ul className="space-y-1.5 text-sm text-teal-700">
          <li>✅ AI calculates exact material quantities per room</li>
          <li>✅ Matches items to Kemetro product catalog</li>
          <li>✅ Generates Economy, Standard & Premium scenarios</li>
          <li>✅ Provides saving tips and contractor estimates</li>
        </ul>
        <p className="text-xs text-teal-500 mt-3">Takes about 20–30 seconds</p>
      </div>
    </div>
  );
}

// ── Generating Screen ────────────────────────────────────────────────────────
const GENERATING_STEPS = [
  "Analyzing floor plan & room dimensions...",
  "Calculating material quantities per room...",
  "Matching items to Kemetro catalog...",
  "Generating Economy, Standard & Premium scenarios...",
  "Adding saving tips and labor estimates...",
  "Finalizing your BOQ...",
];

function BuildGenerating() {
  const [stepIndex, setStepIndex] = useState(0);
  useState(() => {
    const timer = setInterval(() => setStepIndex(i => (i + 1) % GENERATING_STEPS.length), 4000);
    return () => clearInterval(timer);
  });
  return (
    <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-center">
        <h2 className="text-2xl font-black text-teal-800 mb-2">🤖 Generating Your BOQ...</h2>
        <p className="text-teal-600 text-sm">{GENERATING_STEPS[stepIndex]}</p>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-500 max-w-sm text-center">
        AI is calculating material quantities, matching to Kemetro catalog, and comparing 3 budget scenarios. This takes about 20–30 seconds.
      </div>
    </div>
  );
}

// ── Main Wizard ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Project Basics" },
  { id: 2, label: "Floor Plan" },
  { id: 3, label: "Style & Preferences" },
  { id: 4, label: "Generate BOQ" },
];

export default function KemetroBuildWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    projectName: "",
    projectType: "apartment_finishing",
    totalAreaSqm: 150,
    numberOfRooms: 3,
    numberOfBathrooms: 2,
    numberOfLivingRooms: 1,
    numberOfKitchens: 1,
    floorNumber: 3,
    cityId: "",
    districtId: "",
    floorPlanUrl: null,
    floorPlanType: "no_plan_estimate",
    extractedRooms: [],
    aiExtractionConfidence: 0,
    manualRooms: [],
    finishingLevel: "standard",
    finishingPreferences: {
      flooringMaterial: "porcelain_tiles",
      wallFinish: "paint_with_tiles_wet_areas",
      kitchenStyle: "standard_ready_made",
      bathroomStyle: "standard_branded",
    },
    includeLabor: false,
    includeContingency: true,
    contingencyPercent: 10,
  });

  const update = (data) => setForm(prev => ({ ...prev, ...data }));

  const generateEstimatedRooms = (f) => {
    const rooms = [];
    const totalArea = f.totalAreaSqm;
    const livingArea = Math.round(totalArea * 0.18);
    rooms.push({ roomId: "living", roomType: "living_room", roomTypeAr: "غرفة المعيشة", widthM: 5, lengthM: livingArea / 5, heightM: 3, areaSqm: livingArea, perimeterM: 2 * (5 + livingArea / 5), floorAreaSqm: livingArea, wallAreaSqm: 2 * (5 + livingArea / 5) * 3, ceilingAreaSqm: livingArea, windowCount: 2, windowTotalAreaSqm: 3.6, doorCount: 1, doorTotalAreaSqm: 1.9, netWallAreaSqm: 2 * (5 + livingArea / 5) * 3 - 3.6 - 1.9 });
    const bedroomArea = Math.round((totalArea * 0.45) / f.numberOfRooms);
    for (let i = 0; i < f.numberOfRooms; i++) {
      rooms.push({ roomId: `bedroom_${i + 1}`, roomType: i === 0 ? "master_bedroom" : "bedroom", roomTypeAr: i === 0 ? "غرفة رئيسية" : `غرفة ${i + 1}`, widthM: 4, lengthM: bedroomArea / 4, heightM: 3, areaSqm: bedroomArea, perimeterM: 2 * (4 + bedroomArea / 4), floorAreaSqm: bedroomArea, wallAreaSqm: 2 * (4 + bedroomArea / 4) * 3, ceilingAreaSqm: bedroomArea, windowCount: 1, windowTotalAreaSqm: 1.8, doorCount: 1, doorTotalAreaSqm: 1.9, netWallAreaSqm: 2 * (4 + bedroomArea / 4) * 3 - 1.8 - 1.9 });
    }
    const bathroomArea = 6;
    for (let i = 0; i < f.numberOfBathrooms; i++) {
      rooms.push({ roomId: `bathroom_${i + 1}`, roomType: "bathroom", roomTypeAr: `حمام ${i + 1}`, widthM: 2, lengthM: 3, heightM: 3, areaSqm: bathroomArea, perimeterM: 10, floorAreaSqm: bathroomArea, wallAreaSqm: 30, ceilingAreaSqm: bathroomArea, windowCount: 1, windowTotalAreaSqm: 0.6, doorCount: 1, doorTotalAreaSqm: 1.9, netWallAreaSqm: 30 - 0.6 - 1.9 });
    }
    rooms.push({ roomId: "kitchen", roomType: "kitchen", roomTypeAr: "مطبخ", widthM: 3, lengthM: 4, heightM: 3, areaSqm: 12, perimeterM: 14, floorAreaSqm: 12, wallAreaSqm: 42, ceilingAreaSqm: 12, windowCount: 1, windowTotalAreaSqm: 1.2, doorCount: 1, doorTotalAreaSqm: 1.9, netWallAreaSqm: 42 - 1.2 - 1.9 });
    return rooms;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const projectNumber = `KBP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const shareToken = Math.random().toString(36).substring(2, 12);
    let project;
    try {
      project = await base44.entities.BuildProject.create({
        projectNumber,
        projectName: form.projectName || `${form.projectType.replace(/_/g, " ")} - ${form.totalAreaSqm}m²`,
        projectType: form.projectType,
        totalAreaSqm: form.totalAreaSqm,
        numberOfRooms: form.numberOfRooms,
        numberOfBathrooms: form.numberOfBathrooms,
        floorNumber: form.floorNumber,
        cityId: form.cityId,
        districtId: form.districtId,
        floorPlanUrl: form.floorPlanUrl,
        floorPlanType: form.floorPlanType,
        extractedRooms: form.extractedRooms?.length > 0 ? form.extractedRooms : form.manualRooms,
        aiExtractionConfidence: form.aiExtractionConfidence,
        finishingLevel: form.finishingLevel,
        finishingPreferences: form.finishingPreferences,
        includeLabor: form.includeLabor,
        includeContingency: form.includeContingency,
        contingencyPercent: form.contingencyPercent,
        boqStatus: "generating",
        currency: "EGP",
        shareToken,
        isPublic: false,
      });
      const rooms = form.extractedRooms?.length > 0 ? form.extractedRooms : form.manualRooms?.length > 0 ? form.manualRooms : generateEstimatedRooms(form);
      base44.functions.invoke("generateBuildBOQ", {
        projectId: project.id,
        rooms,
        finishingLevel: form.finishingLevel,
        preferences: form.finishingPreferences,
        projectType: form.projectType,
        totalAreaSqm: form.totalAreaSqm,
        floorPlanUrl: form.floorPlanUrl || null,
      }).catch(err => console.log("BOQ generation running async:", err.message));
      setTimeout(() => navigate(`/kemetro/build/${project.id}/boq`), 500);
    } catch (err) {
      console.error(err);
      if (project) navigate(`/kemetro/build/${project.id}/boq`);
    }
  };

  if (generating) return <BuildGenerating />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">🏗️ Kemetro Build™</span>
            <span className="text-xs text-gray-400">Step {step} of {STEPS.length}</span>
          </div>
          <div className="flex gap-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all ${s.id <= step ? "bg-teal-500" : "bg-gray-200"}`} />
                <p className={`text-[10px] mt-1 font-semibold ${s.id === step ? "text-teal-600" : "text-gray-400"}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {step === 1 && <BuildStep1Basics form={form} update={update} />}
        {step === 2 && <BuildStep2FloorPlan form={form} update={update} />}
        {step === 3 && <BuildStep3Style form={form} update={update} />}
        {step === 4 && <BuildStep4Generate form={form} onGenerate={handleGenerate} />}

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
              ← Back
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(s => s + 1)} className="flex-1 bg-teal-500 hover:bg-teal-400 text-white font-black py-3 rounded-xl transition-colors">
              Continue →
            </button>
          ) : (
            <button onClick={handleGenerate} className="flex-1 bg-teal-500 hover:bg-teal-400 text-white font-black py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2">
              🤖 Generate My BOQ Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
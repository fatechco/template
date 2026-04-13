import { useState, useEffect } from "react";
import { Sparkles, Languages, Info, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StepShell from "./StepShell";

function Label({ children, required }) {
  return <label className="text-sm font-bold text-gray-700 mb-1 block">{children}{required && <span className="text-red-500 ml-0.5">*</span>}</label>;
}

function ServiceCheckBox({ checked, onChange, title, price, desc }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${checked ? "border-[#FF6B00] bg-orange-50" : "border-gray-200 bg-white hover:border-orange-200"}`}
      onClick={() => onChange(!checked)}>
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${checked ? "bg-[#FF6B00] border-[#FF6B00]" : "border-gray-300"}`}>
        {checked && <span className="text-white text-[10px] font-black">✓</span>}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-black ${checked ? "text-[#FF6B00]" : "text-gray-900"}`}>{title}</p>
          {price && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{price}</span>}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function buildPropertySummary(form) {
  const parts = [];
  if (form.category_id) parts.push(`Category ID: ${form.category_id}`);
  if (form.purpose) parts.push(`Purpose: ${form.purpose}`);
  if (form.suitable_for_ids?.length) parts.push(`Suitable for: ${form.suitable_for_ids.join(", ")}`);
  if (form.address) parts.push(`Address: ${form.address}`);
  if (form.area_size) parts.push(`Area: ${form.area_size} ${form.area_unit || "SqM"}`);
  if (form.beds) parts.push(`Bedrooms: ${form.beds}`);
  if (form.baths) parts.push(`Bathrooms: ${form.baths}`);
  if (form.floor_number) parts.push(`Floor: ${form.floor_number}`);
  if (form.total_floors) parts.push(`Total floors: ${form.total_floors}`);
  if (form.year_built) parts.push(`Year built: ${form.year_built}`);
  if (form.furnished_id) parts.push(`Furnished: ${form.furnished_id}`);
  if (form.price_amount) parts.push(`Price: ${form.price_amount} ${form.currency_id || ""}`);
  if (form.is_negotiable === "yes") parts.push("Price is negotiable");
  if (form.amenity_ids?.length) parts.push(`Amenities: ${form.amenity_ids.join(", ")}`);
  if (form.frontage_ids?.length) parts.push(`Frontage: ${form.frontage_ids.join(", ")}`);
  if (form.scene_view_ids?.length) parts.push(`Views: ${form.scene_view_ids.join(", ")}`);
  if (form.publisher_type_id) parts.push(`Publisher type: ${form.publisher_type_id}`);
  return parts.join("\n");
}

function generateBasicTitle(form) {
  const parts = [];
  if (form.beds) parts.push(`${form.beds}-Bedroom`);
  if (form.category_id) parts.push("Property");
  if (form.area_size) parts.push(`| ${form.area_size} ${form.area_unit || "SqM"}`);
  if (form.purpose) parts.push(`| ${form.purpose}`);
  return parts.join(" ") || "Property Listing";
}

function generateBasicDescription(form) {
  const lines = [];
  lines.push(`A ${form.beds || ""}${form.beds ? "-bedroom " : ""}property${form.area_size ? ` spanning ${form.area_size} ${form.area_unit || "SqM"}` : ""}.`);
  if (form.address) lines.push(`Located at ${form.address}.`);
  if (form.floor_number) lines.push(`On floor ${form.floor_number}${form.total_floors ? ` of ${form.total_floors}` : ""}.`);
  if (form.price_amount) lines.push(`Listed ${form.purpose || "for sale"} at ${Number(form.price_amount).toLocaleString()} ${form.currency_id || ""}.`);
  if (form.amenity_ids?.length) lines.push(`Features include: ${form.amenity_ids.slice(0, 6).join(", ")}.`);
  return lines.join(" ");
}

function AIButton({ onClick, loading, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700 hover:border-purple-400 hover:shadow-sm"
    >
      {loading ? <RefreshCw size={13} className="animate-spin" /> : <Icon size={13} />}
      {children}
    </button>
  );
}

export default function Step6Description({ form, updateForm, onNext, onBack, errors, setErrors }) {
  const [improvingTitle, setImprovingTitle] = useState(false);
  const [improvingDesc, setImprovingDesc] = useState(false);
  const [translatingTitle, setTranslatingTitle] = useState(false);
  const [translatingDesc, setTranslatingDesc] = useState(false);

  // Auto-generate title & description on mount if empty
  useEffect(() => {
    if (!form.title?.trim()) {
      updateForm({ title: generateBasicTitle(form) });
    }
    if (!form.description?.trim()) {
      updateForm({ description: generateBasicDescription(form) });
    }
  }, []);

  const propertySummary = buildPropertySummary(form);

  const improveTitle = async () => {
    setImprovingTitle(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a real estate listing copywriter. Based on this property info, write one compelling, concise property listing title in English (max 120 chars). Return ONLY the title, no quotes.\n\nProperty info:\n${propertySummary}\n\nCurrent title: ${form.title}`,
    });
    updateForm({ title: result.slice(0, 120) });
    setImprovingTitle(false);
  };

  const improveDescription = async () => {
    setImprovingDesc(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a real estate listing copywriter. Based on this property info, write a professional, detailed property description in English (200-400 words). Highlight key features, location benefits, and selling points. Return ONLY the description text.\n\nProperty info:\n${propertySummary}\n\nCurrent description: ${form.description}`,
    });
    updateForm({ description: result });
    setImprovingDesc(false);
  };

  const translateTitle = async () => {
    if (!form.title?.trim()) return;
    setTranslatingTitle(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Translate this real estate listing title to Arabic. Return ONLY the Arabic translation, nothing else.\n\nTitle: ${form.title}`,
    });
    updateForm({ title_ar: result.slice(0, 120) });
    setTranslatingTitle(false);
  };

  const translateDescription = async () => {
    if (!form.description?.trim()) return;
    setTranslatingDesc(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Translate this real estate listing description to Arabic. Return ONLY the Arabic translation, nothing else.\n\nDescription: ${form.description}`,
    });
    updateForm({ description_ar: result });
    setTranslatingDesc(false);
  };

  const validate = () => {
    const e = {};
    if (!form.title?.trim()) e.title = "Please enter a title in English";
    if (!form.description?.trim()) e.description = "Please enter a description";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <StepShell title="Step 6 — Title, Description & Services" subtitle="AI has pre-filled your listing. Improve or translate with one click." onNext={() => { if (validate()) onNext(); }} onBack={onBack}>

      {/* English Title */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label required>Property Title (English)</Label>
          <AIButton onClick={improveTitle} loading={improvingTitle} icon={Sparkles}>
            Improve with AI
          </AIButton>
        </div>
        {errors?.title && <p className="text-red-500 text-xs mb-1">{errors.title}</p>}
        <input type="text" placeholder="e.g. Luxury 3-Bedroom Apartment with Lake View in New Cairo"
          value={form.title || ""} onChange={e => updateForm({ title: e.target.value })} maxLength={120}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        <p className="text-xs text-gray-400 mt-1 text-right">{(form.title || "").length}/120</p>
      </div>

      {/* English Description */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label required>Property Description (English)</Label>
          <AIButton onClick={improveDescription} loading={improvingDesc} icon={Sparkles}>
            Improve with AI
          </AIButton>
        </div>
        {errors?.description && <p className="text-red-500 text-xs mb-1">{errors.description}</p>}
        <textarea rows={6} placeholder="Describe the property in detail — location highlights, finishing quality, nearby amenities, unique selling points..."
          value={form.description || ""} onChange={e => updateForm({ description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
        <p className="text-xs text-gray-400 mt-1 text-right">{(form.description || "").length} characters</p>
      </div>

      {/* Arabic Section */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🇸🇦</span>
            <span className="text-sm font-black text-gray-800">Arabic <span className="text-gray-400 font-normal text-xs">(optional)</span></span>
          </div>
          <div className="flex gap-2">
            <AIButton onClick={translateTitle} loading={translatingTitle} icon={Languages}>
              Translate Title
            </AIButton>
            <AIButton onClick={translateDescription} loading={translatingDesc} icon={Languages}>
              Translate Description
            </AIButton>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Property Title (Arabic)</Label>
            <input type="text" dir="rtl" placeholder="مثال: شقة فاخرة 3 غرف بإطلالة بحيرة في القاهرة الجديدة"
              value={form.title_ar || ""} onChange={e => updateForm({ title_ar: e.target.value })} maxLength={120}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-right" />
          </div>
          <div>
            <Label>Property Description (Arabic)</Label>
            <textarea rows={5} dir="rtl" placeholder="صف العقار بالتفصيل..."
              value={form.description_ar || ""} onChange={e => updateForm({ description_ar: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none text-right" />
          </div>
        </div>
      </div>

      {/* Writing tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3">
        <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• AI pre-fills based on your previous steps — review and edit as needed</li>
          <li>• Use "Improve with AI" to get professional copywriting</li>
          <li>• Use "Translate" buttons to generate Arabic versions on demand</li>
          <li>• Aim for at least 150 words for better visibility in search</li>
        </ul>
      </div>

      {/* Paid services */}
      <div className="border-t border-gray-100 pt-5">
        <label className="text-sm font-bold text-gray-700 mb-3 block">Paid Services Interest <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
        <div className="flex flex-col gap-3">
          <ServiceCheckBox
            checked={form.interested_in_veri || false}
            onChange={v => updateForm({ interested_in_veri: v })}
            title="KEMEDAR VERI — Verify My Property Listing"
            price="$100"
            desc="Get your property officially inspected and verified by Kemedar for maximum buyer trust and top search placement."
          />
          <ServiceCheckBox
            checked={form.interested_in_campaign || false}
            onChange={v => updateForm({ interested_in_campaign: v })}
            title="KEMEDAR Campaign — Full Marketing Management"
            desc="Let our team run targeted campaigns on social media, email newsletters, and Kemedar's partner network."
          />
          <ServiceCheckBox
            checked={form.interested_in_listing || false}
            onChange={v => updateForm({ interested_in_listing: v })}
            title="KEMEDAR Listing — Premium Listing Placement"
            price="$50"
            desc="Get featured placement at the top of search results and on the Kemedar homepage for maximum exposure."
          />
          <ServiceCheckBox
            checked={form.pref_key_service || false}
            onChange={v => updateForm({ pref_key_service: v })}
            title="KEY WITH KEMEDAR — Managed Property Viewings"
            desc="Allow Kemedar to manage property viewings, key handover, and buyer scheduling on your behalf."
          />
        </div>
      </div>
    </StepShell>
  );
}
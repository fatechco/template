import { useState } from "react";
import { CheckCircle, Upload, Plus, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 text-sm last:border-0">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-bold text-right ml-4">{String(value)}</span>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h4 className="font-black text-gray-800 text-sm mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-[#FF6B00] rounded-full" />{icon && <span>{icon}</span>}{title}
      </h4>
      {children}
    </div>
  );
}

function SuccessPage({ code, onAddAnother }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-lg mx-auto">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={44} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Project Submitted!</h2>
      <p className="text-gray-500 text-sm mb-4">Your project is under review and will be published shortly.</p>
      {code && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 mb-6 inline-block">
          <p className="text-xs text-gray-500 mb-0.5">Project Reference</p>
          <p className="font-black text-[#FF6B00] text-lg tracking-widest">{code}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/" className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md">
          <Eye size={15} /> Go Home
        </a>
        <button onClick={onAddAnother} className="flex items-center justify-center gap-2 border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
          <Plus size={15} /> Add Another Project
        </button>
      </div>
    </div>
  );
}

export default function ProjStep6Preview({ form, onBack, onGoToStep }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    const ref = "PROJ-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const project = await base44.entities.Project.create({
      title: form.project_title,
      title_ar: form.project_title_ar,
      slogan: form.project_slogan,
      description: form.project_description,
      description_ar: form.project_description_ar,
      project_type: form.project_type,
      country_id: form.country_id,
      province_id: form.province_id,
      city_id: form.city_id,
      district_id: form.district_id,
      area_id: form.area_id,
      address: form.address,
      latitude: parseFloat(form.latitude) || null,
      longitude: parseFloat(form.longitude) || null,
      logo_image: form.logo_url,
      featured_image: form.featured_image_url,
      image_gallery: form.image_gallery,
      slider_gallery: form.slider_images,
      brochure_file: form.brochure_url,
      floor_plan_file: form.floor_plan_url,
      vr_video_link: form.vr_video_link,
      kemamap_link: form.interactive_map_link,
      youtube_links: [form.youtube_link_1, form.youtube_link_2].filter(Boolean),
      total_area: parseFloat(form.total_area) || null,
      built_area: parseFloat(form.built_area) || null,
      green_land_area: parseFloat(form.green_area) || null,
      total_units: parseInt(form.total_units) || null,
      delivery_date: form.delivery_date,
      amenity_ids: form.amenity_ids || [],
      developer_company_id: form.developer_id,
      marketing_agent_id: form.marketing_agent_id,
      is_active: true,
    });

    // Save distance records
    if (form.nearby_distances && project?.id) {
      const distEntries = Object.entries(form.nearby_distances).filter(([_, v]) => v.value > 0);
      for (const [fieldId, d] of distEntries) {
        await base44.entities.ProjectDistance.create({
          projectId: project.id,
          distanceFieldId: fieldId,
          distanceValue: d.value,
          distanceUnit: d.unit || "km",
          transportMode: d.unit === "min" ? (d.transportMode || "driving") : null,
        }).catch(() => {});
      }
    }

    setCode(ref);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) return <SuccessPage code={code} onAddAnother={() => window.location.reload()} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center flex-shrink-0">
          <Eye size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black">Step 6 — Preview & Submit</p>
          <p className="text-gray-400 text-xs">Review your project listing before publishing.</p>
        </div>
      </div>

      {form.featured_image_url ? (
        <div className="relative h-52 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <img src={form.featured_image_url} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-5">
            <div>
              <h2 className="text-white font-black text-xl">{form.project_title || "Untitled Project"}</h2>
              {form.project_slogan && <p className="text-white/60 text-sm italic mt-0.5">"{form.project_slogan}"</p>}
            </div>
            {form.logo_url && <img src={form.logo_url} className="ml-auto w-14 h-14 rounded-xl object-cover border-2 border-white shadow" alt="" />}
          </div>
        </div>
      ) : (
        <div className="h-28 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center">
          <p className="text-gray-400 text-sm">{form.project_title || "Untitled Project"}</p>
        </div>
      )}

      {/* Key facts bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          {[
            { label: "Type", value: form.project_type },
            { label: "Status", value: form.project_status },
            { label: "Total Units", value: form.total_units },
            { label: "Total Area", value: form.total_area ? `${form.total_area} ${form.total_area_unit || "SqM"}` : null },
            { label: "Delivery", value: form.delivery_date },
          ].filter(f => f.value).map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center bg-orange-50 rounded-xl px-4 py-2 text-center min-w-[80px]">
              <p className="font-black text-gray-900 text-sm">{String(value)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section title="Location" icon="📍">
          <Row label="Address" value={form.address} />
          <Row label="GPS" value={form.latitude ? `${form.latitude}, ${form.longitude}` : null} />
        </Section>

        <Section title="Project Details" icon="🏗️">
          <Row label="Project Type" value={form.project_type} />
          <Row label="Suitable For" value={(form.suitable_for || []).join(", ")} />
          <Row label="Finishing" value={form.project_finishing} />
          <Row label="Status" value={form.project_status} />
          <Row label="Total Units" value={form.total_units} />
          <Row label="Total Area" value={form.total_area ? `${form.total_area} ${form.total_area_unit}` : null} />
          <Row label="Built Area" value={form.built_area ? `${form.built_area} ${form.built_area_unit}` : null} />
          <Row label="Green Area" value={form.green_area ? `${form.green_area} ${form.green_area_unit}` : null} />
          <Row label="Delivery" value={form.delivery_date} />
        </Section>
      </div>

      {(form.unit_composition || []).length > 0 && (
        <Section title="Unit Composition" icon="🏠">
          <div className="flex flex-col gap-1">
            {form.unit_composition.map((u, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center font-black text-[#FF6B00] text-xs">{u.count}</span>
                <span className="text-gray-700 font-medium">{u.category} units</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {form.project_title && (
        <Section title="Description" icon="📝">
          <p className="text-sm font-black text-gray-900 mb-2">{form.project_title}</p>
          {form.project_description && <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{form.project_description}</p>}
        </Section>
      )}

      {form.amenity_ids?.length > 0 && (
        <Section title="Amenities" icon="✨">
          <div className="flex flex-wrap gap-2">
            {form.amenity_ids.map(a => <span key={a} className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B00]">{a}</span>)}
          </div>
        </Section>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-3">
        <button onClick={() => onGoToStep ? onGoToStep(1) : onBack()} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-400 transition-colors">
          ← Edit from Start
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:border-gray-400 transition-colors">← Back</button>
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 bg-[#FF6B00] hover:bg-[#e55f00] disabled:opacity-60 text-white rounded-xl text-sm font-black transition-colors shadow-lg">
            {submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</> : <><Upload size={15} /> Publish Project</>}
          </button>
        </div>
      </div>
    </div>
  );
}
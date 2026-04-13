import { useState } from "react";
import { Upload, X, Link as LinkIcon, Image } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StepShell from "./StepShell";
import VisionCheckButton from "@/components/vision/VisionCheckButton";
import VoiceRecorder from "./VoiceRecorder";
import DigitalTwinSection from "./DigitalTwinSection";

function FileUploadField({ label, required, accept, preview, onUpload, hint }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onUpload(file_url);
    } catch {
      // fallback: use object URL for preview
      onUpload(URL.createObjectURL(file));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-xs font-bold text-gray-700 mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
      </label>
      {preview ? (
        <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 group">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <button onClick={() => onUpload("")} className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={12} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 bg-gray-50 hover:bg-orange-50/30 cursor-pointer transition-all">
          {uploading ? (
            <div className="w-5 h-5 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload size={18} className="text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">Click to upload</span>
            </>
          )}
          <input type="file" accept={accept || "image/*"} className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
        </label>
      )}
    </div>
  );
}

function GalleryUpload({ urls, onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    setUploading(true);
    const newUrls = [];
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        newUrls.push(file_url);
      } catch {
        newUrls.push(URL.createObjectURL(file));
      }
    }
    onUpdate([...urls, ...newUrls]);
    setUploading(false);
  };

  return (
    <div>
      <label className="text-xs font-bold text-gray-700 mb-1 block">Image Gallery <span className="text-gray-400 font-normal">(multiple images)</span></label>
      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group flex-shrink-0">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => onUpdate(urls.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={9} />
            </button>
          </div>
        ))}
        <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50/30 transition-all flex-shrink-0">
          {uploading ? <div className="w-4 h-4 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" /> : <><Upload size={14} className="text-gray-400" /><span className="text-[10px] text-gray-400 mt-0.5">Add</span></>}
          <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(Array.from(e.target.files))} />
        </label>
      </div>
    </div>
  );
}

function TextLinkField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-700 mb-1 block">{label}</label>
      <div className="relative">
        <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="url" placeholder={placeholder || "https://"} value={value} onChange={e => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
      </div>
    </div>
  );
}

const SINGLE_IMAGE_FIELDS = [
  { key: "street_image_url", label: "Street Image" },
  { key: "entrance_image_url", label: "Building Entrance" },
  { key: "hall_image_url", label: "Building Hall" },
  { key: "elevator_image_url", label: "Elevator" },
  { key: "prop_entrance_image_url", label: "Property Entrance" },
  { key: "reception_image_url", label: "Reception Area" },
  { key: "room1_image_url", label: "Room 1" },
  { key: "kitchen_image_url", label: "Kitchen" },
  { key: "bathroom_image_url", label: "Bathroom" },
  { key: "balcony_image_url", label: "Balcony / View" },
];

export default function Step2Media({ form, updateForm, onNext, onBack, errors, setErrors }) {
  const validate = () => {
    const e = {};
    if (!form.featured_image_url) e.featured_image = "Please upload a main image";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <StepShell title="Step 2 — Media & Files" subtitle="Upload photos, documents and video links." onNext={() => { if (validate()) onNext(); }} onBack={onBack}>
      {/* Main image */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Thumbnail / Main Image <span className="text-red-500">*</span></label>
        {errors.featured_image && <p className="text-red-500 text-xs mb-2">{errors.featured_image}</p>}
        {form.featured_image_url ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
            <img src={form.featured_image_url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => updateForm({ featured_image_url: "" })} className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white">
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-orange-200 hover:border-[#FF6B00] bg-orange-50/20 cursor-pointer transition-all">
            <Image size={28} className="text-[#FF6B00] mb-2" />
            <span className="text-sm font-bold text-gray-500">Click to upload main image</span>
            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 10MB</span>
            <input type="file" accept="image/*" className="hidden" onChange={async e => {
              const file = e.target.files?.[0]; if (!file) return;
              try { const { file_url } = await base44.integrations.Core.UploadFile({ file }); updateForm({ featured_image_url: file_url }); }
              catch { updateForm({ featured_image_url: URL.createObjectURL(file) }); }
            }} />
          </label>
        )}
      </div>

      {/* Gallery */}
      <GalleryUpload urls={form.image_gallery_urls || []} onUpdate={urls => updateForm({ image_gallery_urls: urls })} />

      {/* Vision Check */}
      {(form.featured_image_url || (form.image_gallery_urls || []).length > 0) && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-purple-800">✨ Check Photo Quality with AI</p>
            <p className="text-xs text-purple-600 mt-0.5">Kemedar Vision™ will analyze your uploaded photos and give quality recommendations.</p>
          </div>
          <VisionCheckButton imageUrls={[form.featured_image_url, ...(form.image_gallery_urls || [])]} />
        </div>
      )}

      {/* Docs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadField label="Brochure" hint="PDF or DOC" accept=".pdf,.doc,.docx"
          preview={form.brochure_url && form.brochure_url.includes("image") ? form.brochure_url : ""}
          onUpload={url => updateForm({ brochure_url: url })} />
        <FileUploadField label="Floor Plan" hint="image or PDF" accept="image/*,.pdf"
          preview={form.floor_plan_url} onUpload={url => updateForm({ floor_plan_url: url })} />
        <FileUploadField label="Legal Contract / Documents" hint="PDF" accept=".pdf"
          preview="" onUpload={url => updateForm({ legal_doc_url: url })} />
      </div>

      {/* Digital Twin — VR Tour */}
      <DigitalTwinSection
        vrLink={form.vr_video_link || ""}
        onVrLinkChange={v => updateForm({ vr_video_link: v })}
      />

      {/* Interior images grid */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-3 block">Interior & Exterior Photos</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SINGLE_IMAGE_FIELDS.map(f => (
            <FileUploadField key={f.key} label={f.label} preview={form[f.key]} onUpload={url => updateForm({ [f.key]: url })} />
          ))}
        </div>
      </div>

      {/* Voice Recording */}
      <VoiceRecorder value={form.voice_recording_url || ""} onChange={url => updateForm({ voice_recording_url: url })} />

      {/* YouTube links */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-3 block">YouTube Video Links</label>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(n => (
            <TextLinkField key={n} label={`YouTube Link ${n}`} value={form[`youtube_link_${n}`]}
              onChange={v => updateForm({ [`youtube_link_${n}`]: v })} placeholder="https://youtube.com/watch?v=..." />
          ))}
        </div>
      </div>
    </StepShell>
  );
}
import { useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StepShell from "@/components/create-property/StepShell";
import VisionCheckButton from "@/components/vision/VisionCheckButton";

function Label({ children }) {
  return <label className="text-sm font-bold text-gray-700 mb-1 block">{children}</label>;
}

function SingleUpload({ label, value, onUpload, accept = "image/*", previewType = "image" }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onUpload(file_url);
    setUploading(false);
  };
  return (
    <div>
      <Label>{label}</Label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          {previewType === "image" ? (
            <img src={value} className="w-full h-32 object-cover" alt="" />
          ) : (
            <div className="h-16 flex items-center px-4 gap-2">
              <span className="text-2xl">📄</span>
              <span className="text-xs text-gray-600 truncate flex-1">{value.split("/").pop()}</span>
            </div>
          )}
          <button onClick={() => onUpload("")} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"><X size={13} /></button>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-400 bg-gray-50 hover:bg-orange-50/20 transition-all ${previewType === "image" ? "h-32" : "h-16"}`}>
          {uploading ? <div className="w-5 h-5 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" /> : <><Upload size={18} className="text-gray-400 mb-1" /><span className="text-xs text-gray-400">Upload {label}</span></>}
          <input type="file" accept={accept} className="hidden" onChange={handleFile} />
        </label>
      )}
    </div>
  );
}

function MultiUpload({ label, values, onAdd, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onAdd(file_url);
    }
    setUploading(false);
  };
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {(values || []).map((url, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
            <img src={url} className="w-full h-full object-cover" alt="" />
            <button onClick={() => onRemove(i)} className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"><X size={11} /></button>
          </div>
        ))}
        <label className={`w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50/20 transition-all`}>
          {uploading ? <div className="w-4 h-4 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" /> : <><Plus size={16} className="text-gray-400" /><span className="text-[10px] text-gray-400 mt-0.5">Add</span></>}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
        </label>
      </div>
    </div>
  );
}

export default function ProjStep2Media({ form, updateForm, onNext, onBack }) {
  const addToGallery = (url) => updateForm({ image_gallery: [...(form.image_gallery || []), url] });
  const removeFromGallery = (i) => updateForm({ image_gallery: form.image_gallery.filter((_, idx) => idx !== i) });
  const addToSlider = (url) => updateForm({ slider_images: [...(form.slider_images || []), url] });
  const removeFromSlider = (i) => updateForm({ slider_images: form.slider_images.filter((_, idx) => idx !== i) });

  return (
    <StepShell title="Step 2 — Media & Files" subtitle="Upload project images, documents, and links." onNext={onNext} onBack={onBack}>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SingleUpload label="Logo Image" value={form.logo_url || ""} onUpload={url => updateForm({ logo_url: url })} />
        <SingleUpload label="Featured / Main Image" value={form.featured_image_url || ""} onUpload={url => updateForm({ featured_image_url: url })} />
      </div>

      <MultiUpload label="Image Slider (multiple)" values={form.slider_images} onAdd={addToSlider} onRemove={removeFromSlider} />
      <MultiUpload label="Image Gallery (multiple)" values={form.image_gallery} onAdd={addToGallery} onRemove={removeFromGallery} />

      {/* Vision Check */}
      {(form.featured_image_url || (form.image_gallery || []).length > 0 || (form.slider_images || []).length > 0) && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-purple-800">✨ Check Photo Quality with AI</p>
            <p className="text-xs text-purple-600 mt-0.5">Kemedar Vision™ will analyze your uploaded photos and give quality recommendations.</p>
          </div>
          <VisionCheckButton imageUrls={[form.featured_image_url, ...(form.slider_images || []), ...(form.image_gallery || [])]} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SingleUpload label="Brochure (PDF)" value={form.brochure_url || ""} onUpload={url => updateForm({ brochure_url: url })} accept=".pdf" previewType="file" />
        <SingleUpload label="Floor Plan (PDF/Image)" value={form.floor_plan_url || ""} onUpload={url => updateForm({ floor_plan_url: url })} accept=".pdf,image/*" previewType="file" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "VR Tour Link (Kemetour)", key: "vr_video_link", placeholder: "https://kemetour.com/..." },
          { label: "Interactive Map Link (KemeMap)", key: "interactive_map_link", placeholder: "https://kememap.com/..." },
          { label: "YouTube Video Link 1", key: "youtube_link_1", placeholder: "https://youtube.com/watch?v=..." },
          { label: "YouTube Video Link 2", key: "youtube_link_2", placeholder: "https://youtube.com/watch?v=..." },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <Label>{label}</Label>
            <input type="url" placeholder={placeholder} value={form[key] || ""}
              onChange={e => updateForm({ [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          </div>
        ))}
      </div>
    </StepShell>
  );
}
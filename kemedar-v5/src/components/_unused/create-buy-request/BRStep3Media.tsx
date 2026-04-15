"use client";
// @ts-nocheck
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import StepShell from "@/components/create-property/StepShell";
import AIGenerateButton from "@/components/ai/AIGenerateButton";

function Label({ children, required }) {
  return <label className="text-sm font-bold text-gray-700 mb-1 block">{children}{required && <span className="text-red-500 ml-1">*</span>}</label>;
}

function ImageUpload({ label, value, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await /* integration Core.UploadFile TODO */ ({ file });
    onUpload(file_url);
    setUploading(false);
  };
  return (
    <div>
      <Label>{label}</Label>
      {value ? (
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200">
          <img src={value} className="w-full h-full object-cover" alt="" />
          <button onClick={() => onUpload("")} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"><X size={13} /></button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-400 bg-gray-50 hover:bg-orange-50/30 transition-all">
          {uploading ? <div className="w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" /> : <><Upload size={20} className="text-gray-400 mb-1" /><span className="text-xs text-gray-400 font-medium">Click to upload</span></>}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      )}
    </div>
  );
}

export default function BRStep3Media({ form, updateForm, onNext, onBack, errors, setErrors }) {
  const validate = () => {
    const e = {};
    if (!form.request_title?.trim()) e.request_title = "Please enter a title";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <StepShell title="Step 3 — Media & Description" subtitle="Describe your request and optionally attach media." onNext={() => { if (validate()) onNext(); }} onBack={onBack}>

      <div>
        <Label required>Request Title</Label>
        {errors?.request_title && <p className="text-red-500 text-xs mb-1">{errors.request_title}</p>}
        <div className="flex gap-2 items-start">
          <input type="text" placeholder="e.g. Looking for 3-bed apartment in New Cairo under 2.5M EGP"
            value={form.request_title || ""} onChange={e => updateForm({ request_title: e.target.value })} maxLength={120}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          <AIGenerateButton
            formType="buyRequest" fieldType="title" formData={form}
            onGenerated={(v) => updateForm({ request_title: v.slice(0, 120) })}
            requiredFields={["category_ids", "purpose"]} requiredLabels={["category", "purpose"]}
          />
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">{(form.request_title || "").length}/120</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <Label>Description</Label>
          <AIGenerateButton
            formType="buyRequest" fieldType="description" formData={form}
            onGenerated={(v) => updateForm({ description: v })}
            requiredFields={["category_ids", "purpose"]} requiredLabels={["category", "purpose"]}
            variant="header"
          />
        </div>
        <textarea rows={5} placeholder="Describe what you're looking for — must-have features, preferred floor, view, finishing, timeline, etc."
          value={form.description || ""} onChange={e => updateForm({ description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
      </div>

      <ImageUpload label="Upload Reference Image (optional)"
        value={form.image_url || ""}
        onUpload={url => updateForm({ image_url: url })} />

      <div>
        <Label>Video Link (MP4 URL, optional)</Label>
        <input type="url" placeholder="https://example.com/video.mp4"
          value={form.video_link || ""} onChange={e => updateForm({ video_link: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
      </div>
    </StepShell>
  );
}
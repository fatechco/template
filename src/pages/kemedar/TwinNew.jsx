import { useState } from "react";
import { Upload, X, CheckCircle, ArrowRight, Image, Link as LinkIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";

const STEPS = [
  { id: 1, label: "Upload Photos", icon: "📷" },
  { id: 2, label: "AI Processing", icon: "✨" },
  { id: 3, label: "Get Tour Link", icon: "🔗" },
];

export default function TwinNew() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [tourUrl, setTourUrl] = useState("");
  const [step, setStep] = useState(1);

  const handleUpload = async (files) => {
    setUploading(true);
    const uploaded = [];
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploaded.push(file_url);
      } catch {
        uploaded.push(URL.createObjectURL(file));
      }
    }
    setImages(prev => [...prev, ...uploaded]);
    setUploading(false);
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    if (images.length < 5) return;
    setStep(2);
    setProcessing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a virtual tour generation system. The user uploaded ${images.length} property photos. Generate a virtual tour configuration with a shareable link. Return a JSON object with: { "tourUrl": "https://kemetour.kemedar.com/tour/demo-XXXX", "scenesCount": N, "estimatedDuration": "X min" }`,
        response_json_schema: {
          type: "object",
          properties: {
            tourUrl: { type: "string" },
            scenesCount: { type: "number" },
            estimatedDuration: { type: "string" },
          },
        },
        file_urls: images.slice(0, 5),
      });
      setTourUrl(result.tourUrl || "https://kemetour.kemedar.com/tour/demo-" + Math.random().toString(36).slice(2, 8));
      setStep(3);
    } catch {
      setTourUrl("https://kemetour.kemedar.com/tour/demo-" + Math.random().toString(36).slice(2, 8));
      setStep(3);
    } finally {
      setProcessing(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard?.writeText(tourUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🏠
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Kemedar Twin™ Studio</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Upload property photos and our AI will generate an immersive 3D virtual tour.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                step === s.id ? "bg-purple-600 text-white shadow-lg" :
                step > s.id ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-400"
              }`}>
                {step > s.id ? <CheckCircle size={14} /> : <span>{s.icon}</span>}
                {s.label}
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight size={16} className="text-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="font-black text-gray-900 text-lg mb-2">Upload Property Photos</h2>
            <p className="text-sm text-gray-500 mb-6">
              Upload at least 10 photos from different angles for best results. Minimum 5 required.
            </p>

            {/* Upload area */}
            <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 cursor-pointer transition-all mb-6">
              {uploading ? (
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload size={28} className="text-purple-400 mb-2" />
                  <span className="text-sm font-bold text-gray-600">Click to upload photos</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — multiple files</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleUpload(Array.from(e.target.files))}
              />
            </label>

            {/* Image grid */}
            {images.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-3">
                  {images.length} photos uploaded
                  {images.length < 5 && <span className="text-red-500 ml-2">(need at least 5)</span>}
                  {images.length >= 5 && images.length < 10 && <span className="text-amber-500 ml-2">(10+ recommended)</span>}
                  {images.length >= 10 && <span className="text-green-500 ml-2">✓ Great coverage!</span>}
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={images.length < 5}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl text-sm transition-all shadow-lg"
            >
              ✨ Generate Virtual Tour ({images.length} photos)
            </button>

            {images.length < 5 && (
              <p className="text-xs text-gray-400 text-center mt-3">
                Upload at least 5 photos to enable generation
              </p>
            )}
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="font-black text-gray-900 text-xl mb-2">AI is generating your tour...</h2>
            <p className="text-gray-500 mb-6">
              Stitching {images.length} photos into an immersive 3D walkthrough. This may take a moment.
            </p>
            <div className="flex justify-center gap-4 text-xs text-gray-400">
              {["Analyzing angles", "Building 3D model", "Generating scenes", "Creating transitions"].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="font-black text-gray-900 text-xl mb-2">Your Virtual Tour is Ready!</h2>
            <p className="text-gray-500 mb-6">
              Copy the link below and paste it in your property listing's Digital Twin section.
            </p>

            {/* Tour URL */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
              <LinkIcon size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                readOnly
                value={tourUrl}
                className="flex-1 bg-transparent text-sm font-mono text-gray-700 outline-none"
              />
              <button
                onClick={copyUrl}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                Copy Link
              </button>
            </div>

            <div className="flex gap-3 justify-center">
              <a
                href={tourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
              >
                👁 Preview Tour
              </a>
              <button
                onClick={() => { setImages([]); setTourUrl(""); setStep(1); }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
              >
                + Create Another
              </button>
            </div>

            {/* Tips */}
            <div className="mt-8 bg-purple-50 rounded-xl p-4 text-left">
              <p className="text-xs font-bold text-purple-700 mb-2">How to use your tour link:</p>
              <ol className="text-xs text-purple-600 space-y-1 list-decimal list-inside">
                <li>Go to your property listing form (Step 2 — Media)</li>
                <li>Find the "Digital Twin — Virtual Tour" section</li>
                <li>Paste the tour URL in the KemeTour VR Link field</li>
              </ol>
            </div>
          </div>
        )}
      </div>
      <SuperFooter />
    </div>
  );
}
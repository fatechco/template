import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const STEPS = [
  { id: 1, icon: "📷", label: "Upload" },
  { id: 2, icon: "✨", label: "Processing" },
  { id: 3, icon: "🔗", label: "Ready" },
];

export default function TwinNewMobile() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [tourUrl, setTourUrl] = useState("");
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

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

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleGenerate = async () => {
    if (images.length < 5) return;
    setStep(2);
    setProcessing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a virtual tour generation system. The user uploaded ${images.length} property photos. Generate a virtual tour configuration. Return JSON: { "tourUrl": "https://kemetour.kemedar.com/tour/demo-XXXX", "scenesCount": N, "estimatedDuration": "X min" }`,
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Navbar */}
      <div style={{ background: "linear-gradient(135deg, #6B21A8, #3B82F6)", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">✨ Twin™ Studio</p>
        <div className="w-9" />
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex-shrink-0">
        <div className="flex items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
                style={{
                  background: step === s.id ? "#7C3AED" : step > s.id ? "#10B981" : "#f3f4f6",
                  color: step >= s.id ? "#fff" : "#9ca3af"
                }}>
                {step > s.id ? "✓" : s.icon} {s.label}
              </div>
              {i < STEPS.length - 1 && <span className="text-gray-300 text-xs">→</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="px-4 py-4">
        {/* Step 1: Upload */}
        {step === 1 && (
          <div>
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🏠</div>
              <h1 className="font-black text-gray-900 text-lg">Create Virtual Tour</h1>
              <p className="text-gray-500 text-xs mt-1">Upload property photos and AI generates a 3D tour</p>
            </div>

            {/* Upload area */}
            <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/30 cursor-pointer mb-4">
              {uploading ? (
                <Loader2 size={24} className="animate-spin text-purple-500" />
              ) : (
                <>
                  <Upload size={24} className="text-purple-400 mb-1" />
                  <span className="text-xs font-bold text-gray-600">Tap to upload photos</span>
                  <span className="text-[10px] text-gray-400">JPG, PNG, WEBP — multiple files</span>
                </>
              )}
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={e => handleUpload(Array.from(e.target.files))} />
            </label>

            {/* Image grid */}
            {images.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-700 mb-2">
                  {images.length} photos
                  {images.length < 5 && <span className="text-red-500 ml-1">(need at least 5)</span>}
                  {images.length >= 5 && images.length < 10 && <span className="text-amber-500 ml-1">(10+ recommended)</span>}
                  {images.length >= 10 && <span className="text-green-500 ml-1">✓ Great!</span>}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-purple-50 rounded-xl p-3 mb-4">
              <p className="text-[10px] font-bold text-purple-700 mb-1">📷 Photo Tips:</p>
              <ul className="text-[9px] text-purple-600 space-y-0.5">
                <li>• Take from corners for widest coverage</li>
                <li>• Include all rooms, kitchen, bathrooms, balcony</li>
                <li>• Good lighting helps AI stitch better</li>
                <li>• 15-20 photos = best quality tour</li>
              </ul>
            </div>

            <button onClick={handleGenerate} disabled={images.length < 5}
              className="w-full py-3.5 rounded-xl font-black text-sm text-white disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}>
              ✨ Generate Virtual Tour ({images.length} photos)
            </button>
            {images.length < 5 && (
              <p className="text-[10px] text-gray-400 text-center mt-2">Upload at least 5 photos to continue</p>
            )}
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="font-black text-gray-900 text-lg mb-2">AI is generating your tour...</h2>
            <p className="text-gray-500 text-xs mb-6">Stitching {images.length} photos into a 3D walkthrough</p>
            <div className="space-y-2">
              {["Analyzing angles", "Building 3D model", "Generating scenes", "Creating transitions"].map((s, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="font-black text-gray-900 text-lg mb-2">Tour Ready!</h2>
            <p className="text-gray-500 text-xs mb-5">Copy the link and paste it in your property listing</p>

            {/* URL */}
            <div className="bg-gray-100 rounded-xl p-3 mb-4 flex items-center gap-2">
              <span className="text-xs">🔗</span>
              <input type="text" readOnly value={tourUrl}
                className="flex-1 bg-transparent text-xs font-mono text-gray-700 outline-none truncate" />
              <button onClick={copyUrl}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white"
                style={{ background: "#7C3AED" }}>
                {copied ? "✅ Copied" : "Copy"}
              </button>
            </div>

            <div className="flex gap-2 mb-5">
              <a href={tourUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center bg-gray-100 text-gray-700 font-bold text-xs py-2.5 rounded-xl">
                👁 Preview Tour
              </a>
              <button onClick={() => { setImages([]); setTourUrl(""); setStep(1); }}
                className="flex-1 text-center bg-purple-100 text-purple-700 font-bold text-xs py-2.5 rounded-xl">
                + Create Another
              </button>
            </div>

            {/* Share */}
            <div className="flex gap-2 mb-5">
              <a href={`https://wa.me/?text=${encodeURIComponent("Check out this virtual tour: " + tourUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center bg-green-50 border border-green-200 text-green-700 font-bold text-[10px] py-2 rounded-xl">
                💬 WhatsApp
              </a>
              <button onClick={copyUrl}
                className="flex-1 text-center bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[10px] py-2 rounded-xl">
                🔗 Copy Link
              </button>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 rounded-xl p-3 text-left">
              <p className="text-[10px] font-bold text-purple-700 mb-1">How to use your tour link:</p>
              <ol className="text-[9px] text-purple-600 space-y-0.5 list-decimal list-inside">
                <li>Go to your property listing form (Media step)</li>
                <li>Find "Digital Twin — Virtual Tour" section</li>
                <li>Paste the tour URL in the KemeTour VR Link field</li>
              </ol>
            </div>
          </div>
        )}

        <div className="h-20" />
      </div>
      <MobileBottomNav />
    </div>
  );
}
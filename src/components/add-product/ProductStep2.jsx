import { X } from "lucide-react";

export default function ProductStep2({ form, update }) {
  const handleMainPhoto = (e) => {
    const file = e.target.files[0];
    if (file) update({ main_photo_url: URL.createObjectURL(file) });
  };

  const handleGalleryPhoto = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    update({ gallery_urls: [...form.gallery_urls, ...urls].slice(0, 10) });
  };

  const removeGallery = (i) => {
    update({ gallery_urls: form.gallery_urls.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-6">
      <p className="font-black text-gray-900 text-base">Photos & Media</p>

      {/* Main photo */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">
          Main Thumbnail <span className="text-red-500">*</span>
        </label>
        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 overflow-hidden" style={{ height: 180 }}>
          {form.main_photo_url ? (
            <img src={form.main_photo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8">
              <span className="text-4xl">📷</span>
              <p className="text-sm font-bold text-gray-700">Tap to add main product photo</p>
              <p className="text-xs text-gray-400">Required — shown in search results</p>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleMainPhoto} />
        </label>
      </div>

      {/* Gallery */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">
          Gallery <span className="text-gray-400 font-normal">({form.gallery_urls.length}/10)</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {form.gallery_urls.map((url, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: "1" }}>
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeGallery(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
              >
                <X size={10} color="white" />
              </button>
            </div>
          ))}
          {form.gallery_urls.length < 10 && (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50" style={{ aspectRatio: "1" }}>
              <span className="text-2xl">+</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryPhoto} />
            </label>
          )}
        </div>
      </div>

      {/* Brochure */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Product Specs / Brochure (optional)</label>
        <label className="flex items-center gap-3 w-full border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer bg-gray-50">
          <span className="text-2xl">📄</span>
          <div>
            <p className="text-sm font-bold text-gray-700">
              {form.brochure_url ? "Document attached ✓" : "Upload product specs"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">PDF, DOCX up to 10MB</p>
          </div>
          <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => {
            if (e.target.files[0]) update({ brochure_url: e.target.files[0].name });
          }} />
        </label>
      </div>

      {/* Video */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Video Link (optional)</label>
        <input
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={form.video_link}
          onChange={(e) => update({ video_link: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>
    </div>
  );
}
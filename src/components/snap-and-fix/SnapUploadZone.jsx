import { useRef } from "react";
import { Link } from "react-router-dom";

const isMobile = () => /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

export default function SnapUploadZone({ onImageSelected }) {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("video/")) {
      const frame = await extractVideoFrame(file);
      const previewUrl = URL.createObjectURL(frame);
      onImageSelected(frame, previewUrl);
    } else {
      const previewUrl = URL.createObjectURL(file);
      onImageSelected(file, previewUrl);
    }
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  if (isMobile()) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-56px)]" style={{ background: "#0F766E" }}>
        {/* Top 60% */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
          <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 24 }}>📷</div>
          <p className="text-white font-black text-center" style={{ fontSize: 24, marginBottom: 10 }}>
            Point at the problem
          </p>
          <p className="text-white text-center" style={{ fontSize: 15, opacity: 0.7 }}>
            Tap to open camera
          </p>
        </div>

        {/* Bottom 40% */}
        <div className="px-5 pb-10 space-y-3">
          <button
            onClick={() => cameraRef.current?.click()}
            className="w-full font-bold text-center transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "white",
              color: "#0F766E",
              borderRadius: 16,
              height: 56,
              fontSize: 16,
            }}
          >
            📸 Open Camera
          </button>

          <button
            onClick={() => galleryRef.current?.click()}
            className="w-full font-bold text-center transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "transparent",
              color: "white",
              border: "2px solid rgba(255,255,255,0.6)",
              borderRadius: 14,
              height: 48,
              fontSize: 15,
            }}
          >
            🖼️ Choose from Gallery
          </button>

          <div className="text-center pt-1">
            <Link
              to="/kemework/post-task"
              className="font-medium"
              style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}
            >
              ✏️ Describe it manually instead
            </Link>
          </div>
        </div>

        {/* Hidden inputs */}
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
        <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
      </div>
    );
  }

  // Desktop
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div
        className="flex flex-col items-center text-center"
        style={{
          background: "white",
          borderRadius: 24,
          border: "2px dashed #0F766E",
          padding: "48px 40px",
        }}
      >
        <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 20 }}>📷</div>
        <h2 className="font-black text-gray-900" style={{ fontSize: 20, marginBottom: 8 }}>
          Upload a photo of the issue
        </h2>
        <p className="text-gray-400" style={{ fontSize: 14, marginBottom: 32 }}>
          Supports JPG, PNG, HEIC — max 10MB
        </p>

        <div className="flex flex-wrap gap-3 justify-center w-full">
          <button
            onClick={() => cameraRef.current?.click()}
            className="font-bold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "#0F766E",
              color: "white",
              borderRadius: 10,
              height: 44,
              padding: "0 24px",
              fontSize: 14,
            }}
          >
            📷 Take Photo
          </button>

          <button
            onClick={() => galleryRef.current?.click()}
            className="font-bold transition-all hover:bg-teal-50 active:scale-95"
            style={{
              background: "transparent",
              color: "#0F766E",
              border: "2px solid #0F766E",
              borderRadius: 10,
              height: 44,
              padding: "0 24px",
              fontSize: 14,
            }}
          >
            🖼️ Choose from Gallery
          </button>

          <button
            onClick={() => videoRef.current?.click()}
            className="font-bold transition-all hover:bg-gray-50 active:scale-95"
            style={{
              background: "transparent",
              color: "#6B7280",
              border: "2px solid #E5E7EB",
              borderRadius: 10,
              height: 44,
              padding: "0 24px",
              fontSize: 14,
            }}
          >
            🎥 Upload Video Clip
          </button>
        </div>

        <Link
          to="/kemework/post-task"
          className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✏️ Describe it manually instead
        </Link>
      </div>

      {/* Hidden inputs */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}

async function extractVideoFrame(videoFile) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.src = URL.createObjectURL(videoFile);
    video.addEventListener("loadeddata", () => {
      video.currentTime = 0.5;
    });
    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        resolve(new File([blob], "frame.jpg", { type: "image/jpeg" }));
        URL.revokeObjectURL(video.src);
      }, "image/jpeg", 0.92);
    });
    video.load();
  });
}
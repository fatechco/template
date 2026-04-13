import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SnapUploadZone from "@/components/snap-and-fix/SnapUploadZone";
import SnapPhotoPreview from "@/components/snap-and-fix/SnapPhotoPreview";
import SnapLoadingOverlay from "@/components/snap-and-fix/SnapLoadingOverlay";
import SnapFailureState from "@/components/snap-and-fix/SnapFailureState";
import KemeworkShellWrapper from "@/components/snap-and-fix/KemeworkShellWrapper";

function generateSessionToken() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function SnapAndFix() {
  const navigate = useNavigate();
  const [step, setStep] = useState("upload"); // upload | preview | loading | failure
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [userNote, setUserNote] = useState("");
  const [locationText, setLocationText] = useState("");
  const [cityId, setCityId] = useState(null);
  const [failureMessage, setFailureMessage] = useState("");
  const [failureDetails, setFailureDetails] = useState("");
  const [user, setUser] = useState(null);
  const sessionToken = useRef(generateSessionToken());

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u?.city_id) setCityId(u.city_id);
      if (u?.city_name) setLocationText(u.city_name);
    }).catch(() => {});
  }, []);

  const handleImageSelected = (file, previewUrl) => {
    setImageFile(file);
    setImagePreviewUrl(previewUrl);
    setStep("preview");
  };

  const handleDiagnose = async (note, location, locCityId) => {
    setStep("loading");
    try {
      const base64 = await fileToBase64(imageFile);
      const mediaType = imageFile.type || "image/jpeg";
      const res = await base44.functions.invoke("processSnapAndFix", {
        imageBase64: base64,
        mediaType,
        userNote: note || null,
        userId: user?.id || null,
        sessionToken: sessionToken.current,
        locationText: location || null,
        cityId: locCityId || null,
      });
      if (res?.data?.session) {
        navigate(`/kemework/snap/review/${res.data.session.id}`);
      } else {
        throw new Error("No session returned");
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Analysis failed";
      const isUnrecognizable = msg.includes("couldn't diagnose") || msg.includes("unrecognizable");
      setFailureMessage(isUnrecognizable
        ? "We couldn't diagnose this photo"
        : "Something went wrong");
      setFailureDetails(msg);
      setStep("failure");
    }
  };

  const handleRetake = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setUserNote("");
    setFailureMessage("");
    setFailureDetails("");
    sessionToken.current = generateSessionToken();
    setStep("upload");
  };

  return (
    <KemeworkShellWrapper>
      <div className="min-h-screen" style={{ background: "#F0FDFA" }}>
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
          <Link to="/kemework" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <span className="font-black text-gray-900" style={{ fontSize: 17 }}>Snap & Fix</span>
          <button className="text-gray-400 hover:text-gray-700">
            <HelpCircle size={20} />
          </button>
        </div>

        {/* Step content */}
        {step === "upload" && (
          <SnapUploadZone onImageSelected={handleImageSelected} />
        )}

        {step === "preview" && (
          <SnapPhotoPreview
            imagePreviewUrl={imagePreviewUrl}
            userNote={userNote}
            setUserNote={setUserNote}
            locationText={locationText}
            setLocationText={setLocationText}
            cityId={cityId}
            setCityId={setCityId}
            onRetake={handleRetake}
            onDiagnose={handleDiagnose}
          />
        )}

        {step === "loading" && (
          <SnapLoadingOverlay
            imagePreviewUrl={imagePreviewUrl}
            onCancel={handleRetake}
          />
        )}

        {step === "failure" && (
          <SnapFailureState
            message={failureMessage}
            details={failureDetails}
            onRetry={handleRetake}
          />
        )}
      </div>
    </KemeworkShellWrapper>
  );
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
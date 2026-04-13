import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Camera, CheckCircle, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import VerificationChecklist from "@/components/twin/VerificationChecklist";

export default function VerificationTour() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [property, setProperty] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [screenshots, setScreenshots] = useState([]);
  const [notes, setNotes] = useState("");
  const [decision, setDecision] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [sessionData, propData] = await Promise.all([
          base44.entities.LiveTourSession.filter({ id: sessionId }),
          base44.entities.Property.filter({})
        ]);
        if (sessionData.length) {
          setSession(sessionData[0]);
          const prop = propData.find(p => p.id === sessionData[0].propertyId);
          if (prop) setProperty(prop);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [sessionId]);

  const handleScreenshot = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || screenshots.length >= 4) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (typeof dataUrl === "string") {
          setScreenshots(prev => [...prev, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleItem = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSubmitVerification = async () => {
    if (!decision) return;

    try {
      await base44.entities.LiveTourSession.update(sessionId, {
        verificationRequested: true,
        verificationStatus: decision,
        verificationCompletedBy: (await base44.auth.me())?.id,
        verificationCompletedAt: new Date().toISOString(),
        verificationNotes: notes
      });

      // If verified, add badge to property
      if (decision === "verified" && property) {
        await base44.entities.VirtualTour.update(property.id, {
          franchiseOwnerVerified: true,
          franchiseOwnerNotes: notes
        });
      }

      navigate("/dashboard/kemedar/franchise/area-properties?verified=true");
    } catch (err) {
      console.error(err);
    }
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const canSubmit = decision && checkedCount >= 6 && screenshots.length >= 2;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Verification Tour</h1>
              <p className="text-gray-600 text-sm">{property?.title || "Property"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* LEFT: Checklist */}
          <div className="col-span-2">
            <VerificationChecklist
              checkedItems={checkedItems}
              onItemToggle={handleToggleItem}
              screenshots={screenshots}
              onScreenshot={handleScreenshot}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              capture="environment"
            />
          </div>

          {/* RIGHT: Summary & Decision */}
          <div className="space-y-4">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">Progress</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Checklist</span>
                  <span className="text-sm font-bold text-orange-600">{checkedCount}/8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Screenshots</span>
                  <span className="text-sm font-bold text-orange-600">{screenshots.length}/4</span>
                </div>
              </div>
            </div>

            {/* Decision Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">Verification Decision</p>
              <div className="space-y-2">
                <button
                  onClick={() => setDecision("verified")}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left font-semibold ${
                    decision === "verified"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-700 hover:border-green-300"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  ✅ Verified
                </button>
                <button
                  onClick={() => setDecision("needs_review")}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left font-semibold ${
                    decision === "needs_review"
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 text-gray-700 hover:border-yellow-300"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  ⚠️ Needs Review
                </button>
                <button
                  onClick={() => setDecision("rejected")}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left font-semibold ${
                    decision === "rejected"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-700 hover:border-red-300"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  ❌ Rejected
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any observations or issues found..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitVerification}
              disabled={!canSubmit}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                canSubmit
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {decision === "verified" ? "✅ Mark as Verified" : decision === "rejected" ? "❌ Reject Property" : "⚠️ Mark for Review"}
            </button>

            {!canSubmit && (
              <p className="text-xs text-gray-500 text-center">
                Complete checklist (6+ items) + add 2+ screenshots to submit
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
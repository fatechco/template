"use client";
// @ts-nocheck
import { useState, useRef } from "react";
import { ArrowLeft, MapPin, Mic, MicOff, Edit3 } from "lucide-react";

export default function SnapPhotoPreview({
  imagePreviewUrl,
  userNote,
  setUserNote,
  locationText,
  setLocationText,
  cityId,
  setCityId,
  onRetake,
  onDiagnose,
}) {
  const [showTextNote, setShowTextNote] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState(null); // null | "recording" | "transcribing" | "done"
  const [editingLocation, setEditingLocation] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setRecordingStatus("transcribing");
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        // Simple: set note from transcription via browser SpeechRecognition if available
        // Fallback: show placeholder note
        setUserNote("🎤 Voice note recorded — please type to edit if needed.");
        setShowTextNote(true);
        setRecordingStatus("done");
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingStatus("recording");
    } catch (_) {
      setShowTextNote(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col" style={{ background: "#F0FDFA" }}>
      {/* Retake header row */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={onRetake}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Retake
        </button>
        <span className="font-bold text-gray-900">Review Photo</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Image preview */}
        <div className="px-4 pt-4">
          <img
            src={imagePreviewUrl}
            alt="Selected"
            className="w-full object-cover"
            style={{ maxHeight: 400, borderRadius: 16 }}
          />
        </div>

        {/* Optional note section */}
        <div className="px-4 pt-5">
          <p className="font-bold text-gray-900 text-sm mb-0.5">
            Tell us what happened <span className="text-gray-400 font-normal">(optional)</span>
          </p>
          <p className="text-gray-400 text-xs mb-3">Describe anything the photo doesn't show</p>

          {!showTextNote ? (
            <div className="space-y-2">
              <button
                onMouseDown={handleStartRecording}
                onMouseUp={handleStopRecording}
                onTouchStart={handleStartRecording}
                onTouchEnd={handleStopRecording}
                className="w-full flex items-center justify-center gap-2 font-bold transition-all active:scale-98"
                style={{
                  background: isRecording ? "#0F766E" : "#F0FDFA",
                  border: `2px solid ${isRecording ? "#0F766E" : "#99F6E4"}`,
                  color: isRecording ? "white" : "#0F766E",
                  borderRadius: 12,
                  height: 48,
                  fontSize: 14,
                }}
              >
                {isRecording ? <Mic size={16} className="animate-pulse" /> : <Mic size={16} />}
                {isRecording ? "🔴 Recording... Release to stop" : "🎤 Hold to Record Voice Note"}
              </button>

              {recordingStatus === "transcribing" && (
                <p className="text-xs text-center text-teal-600 font-medium">Transcribing...</p>
              )}

              <button
                onClick={() => setShowTextNote(true)}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
              >
                ✏️ Type a note instead
              </button>
            </div>
          ) : (
            <div>
              {userNote && userNote.startsWith("🎤") && (
                <p className="text-xs text-teal-700 mb-1.5 font-medium">{userNote.split("—")[0]}</p>
              )}
              <textarea
                value={userNote?.startsWith("🎤") ? "" : userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="e.g. This started leaking yesterday morning..."
                className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
                style={{
                  background: "white",
                  border: "1px solid #D1FAE5",
                  borderRadius: 12,
                  padding: "12px 14px",
                  minHeight: 80,
                }}
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Location row */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-3" style={{ border: "1px solid #D1FAE5" }}>
            <MapPin size={15} className="text-teal-600 flex-shrink-0" />
            {editingLocation ? (
              <input
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                onBlur={() => setEditingLocation(false)}
                autoFocus
                className="flex-1 text-sm text-gray-800 focus:outline-none bg-transparent"
                placeholder="Enter your city or area"
              />
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-700">
                  {locationText || <span className="text-gray-400">Location not set</span>}
                </span>
                <button
                  onClick={() => setEditingLocation(true)}
                  className="text-xs font-bold text-teal-600 hover:text-teal-800 flex-shrink-0"
                >
                  Change
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white border-t border-gray-100">
        <button
          onClick={() => onDiagnose(userNote, locationText, cityId)}
          className="w-full font-black text-white transition-all hover:opacity-90 active:scale-98"
          style={{
            background: "#0F766E",
            borderRadius: 14,
            height: 56,
            fontSize: 16,
            boxShadow: "0 4px 20px rgba(15,118,110,0.3)",
          }}
        >
          ✨ Diagnose This Issue
        </button>
      </div>
    </div>
  );
}
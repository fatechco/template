"use client";
// @ts-nocheck
import { useState, useRef } from "react";
import { Mic, Square, Trash2, Play, Pause } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const MAX_SECONDS = 60;

export default function VoiceRecorder({ value, onChange }) {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const durationRef = useRef(0);

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    clearInterval(timerRef.current);
    setRecording(false);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorder.current = recorder;
    chunks.current = [];
    setDuration(0);
    durationRef.current = 0;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    recorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      clearInterval(timerRef.current);
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      setUploading(true);
      const file = new File([blob], "voice-recording.webm", { type: "audio/webm" });
      const { file_url } = await /* integration Core.UploadFile TODO */ ({ file });
      onChange(file_url);
      setUploading(false);
    };

    recorder.start();
    setRecording(true);
    timerRef.current = setInterval(() => {
      durationRef.current += 1;
      setDuration(durationRef.current);
      if (durationRef.current >= MAX_SECONDS) {
        stopRecording();
      }
    }, 1000);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // Has a recording
  if (value) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
        <label className="text-sm font-bold text-gray-700 mb-2 block">🎙️ Voice Recording</label>
        <div className="flex items-center gap-3">
          <button onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#FF6B00] hover:bg-orange-600 text-white flex items-center justify-center flex-shrink-0 transition-colors">
            {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
          <audio ref={audioRef} src={value} onEnded={() => setPlaying(false)} className="hidden" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800">Voice message recorded</p>
            <p className="text-xs text-gray-500">Tap play to listen</p>
          </div>
          <button onClick={() => { onChange(""); setPlaying(false); }}
            className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Recording / idle state
  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
      <label className="text-sm font-bold text-gray-700 mb-1 block">🎙️ Voice Recording <span className="text-gray-400 font-normal">(max 1 min)</span></label>
      <p className="text-xs text-gray-500 mb-3">Record a voice message describing your property details — rooms, condition, features, etc.</p>

      {uploading ? (
        <div className="flex items-center justify-center gap-2 py-3">
          <div className="w-5 h-5 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600">Uploading recording...</span>
        </div>
      ) : recording ? (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
              <Mic size={20} className="text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-600">Recording... {formatTime(duration)}</p>
            <div className="w-full h-1 bg-red-200 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${(duration / MAX_SECONDS) * 100}%` }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">{MAX_SECONDS - duration}s remaining</p>
          </div>
          <button onClick={stopRecording}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
            <Square size={14} /> Stop
          </button>
        </div>
      ) : (
        <button onClick={startRecording}
          className="flex items-center gap-2 bg-white hover:bg-orange-50 border border-orange-200 hover:border-[#FF6B00] text-gray-700 font-bold px-4 py-2.5 rounded-xl text-sm transition-all w-full justify-center">
          <Mic size={16} className="text-[#FF6B00]" /> Tap to Start Recording
        </button>
      )}
    </div>
  );
}
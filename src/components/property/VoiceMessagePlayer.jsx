import { useState, useRef } from "react";
import { Play, Pause, Mic } from "lucide-react";

export default function VoiceMessagePlayer({ url }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  if (!url) return null;

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Owner Voice Message
      </h3>
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
        <button onClick={toggle}
          className="w-11 h-11 rounded-full bg-[#FF6B00] hover:bg-orange-600 text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-md">
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Mic size={13} className="text-[#FF6B00]" />
            <span className="text-sm font-bold text-gray-800">Voice description from the owner</span>
          </div>
          {/* Progress bar */}
          <div className="relative w-full h-1.5 bg-orange-200 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              if (!audioRef.current) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              audioRef.current.currentTime = pct * audioRef.current.duration;
            }}>
            <div className="absolute inset-y-0 left-0 bg-[#FF6B00] rounded-full transition-all"
              style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-500">{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span className="text-[10px] text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={url}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onTimeUpdate={() => {
            const a = audioRef.current;
            if (a && a.duration) setProgress((a.currentTime / a.duration) * 100);
          }}
          onEnded={() => { setPlaying(false); setProgress(0); }}
          className="hidden"
        />
      </div>
    </div>
  );
}
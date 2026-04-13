import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Zap, Clock, CheckCircle } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

export default function SnapAndFix() {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <p className="font-black text-gray-900 text-sm">Snap & Fix™</p>
        <div className="w-6" />
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-4 py-10 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full" />
        <div className="relative z-10">
          <div className="text-5xl mb-3 text-center">📸</div>
          <h1 className="text-2xl font-black text-center mb-2">Snap & Fix™</h1>
          <p className="text-purple-100 text-sm text-center mb-6 leading-relaxed">
            Take a photo of your home problem. Get instant AI diagnosis and connect with professionals instantly.
          </p>
          <button onClick={() => setShowUpload(true)}
            className="w-full flex items-center justify-center gap-2 bg-white text-purple-700 font-black py-3.5 rounded-2xl text-base">
            <Camera size={18} /> Start Diagnosis
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 py-6 space-y-3">
        {[
          { icon: <Zap size={18} className="text-yellow-500" />, title: "Instant AI Diagnosis", desc: "Identify the problem in seconds" },
          { icon: <Clock size={18} className="text-blue-500" />, title: "Quick Professional Match", desc: "Connected to pre-vetted pros instantly" },
          { icon: <CheckCircle size={18} className="text-green-500" />, title: "Smart Materials List", desc: "Auto-generated shopping list from Kemetro" },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 shadow-sm">
            {f.icon}
            <div>
              <p className="font-bold text-gray-900 text-sm">{f.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="px-4 py-6">
        <h2 className="font-black text-gray-900 text-base mb-4">How It Works</h2>
        <div className="space-y-3">
          {[
            { n: "1", icon: "📸", title: "Snap a Photo", desc: "Take a clear photo of the issue — plumbing, electrical, paint, etc." },
            { n: "2", icon: "🤖", title: "AI Analyzes", desc: "Our AI instantly identifies the problem and severity level" },
            { n: "3", icon: "👷", title: "Pro Match", desc: "Connected to vetted professionals in your area who can help" },
            { n: "4", icon: "🛒", title: "Shop Materials", desc: "Auto-generated materials list — shop everything on Kemetro" },
          ].map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">{s.n}</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{s.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-4">
        <button onClick={() => setShowUpload(true)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl text-base transition-all active:scale-95">
          📸 Take Your First Photo
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">No credit card needed • Free diagnosis</p>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">Take a Photo</h3>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl bg-gray-50 hover:bg-gray-100">
                <Camera size={32} className="text-purple-600" />
                <span className="text-xs font-bold text-gray-700">Camera</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl bg-gray-50 hover:bg-gray-100">
                <span className="text-3xl">🖼️</span>
                <span className="text-xs font-bold text-gray-700">Gallery</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}
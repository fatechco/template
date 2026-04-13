import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Map, Maximize2, Share2, Calendar, Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MOCK_SCENES = [
  { id: "s1", label: "🛋️ Living Room", thumbnail: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&q=60", photo: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80", hotspots: [{ x: 70, y: 50, type: "navigation", label: "Go to Kitchen →", targetId: "s2" }, { x: 30, y: 60, type: "info", label: "Marble Flooring", content: "Italian imported marble" }] },
  { id: "s2", label: "🍳 Kitchen", thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=60", photo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80", hotspots: [{ x: 20, y: 55, type: "navigation", label: "← Back to Living", targetId: "s1" }, { x: 60, y: 45, type: "info", label: "German Appliances", content: "Bosch appliances fully equipped" }] },
  { id: "s3", label: "🛏️ Master Bedroom", thumbnail: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=60", photo: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80", hotspots: [{ x: 80, y: 70, type: "measurement", label: "Room Width: 5.2m" }] },
  { id: "s4", label: "🚿 Bathroom", thumbnail: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=60", photo: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80", hotspots: [] },
  { id: "s5", label: "🌇 Balcony", thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=60", photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80", hotspots: [{ x: 50, y: 40, type: "info", label: "City View", content: "Panoramic view of New Cairo" }] }
];

export default function VirtualTourViewer() {
  const { tourId } = useParams();
  const [currentScene, setCurrentScene] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [saved, setSaved] = useState(false);

  const scene = MOCK_SCENES[currentScene];

  const navigateToScene = (sceneIndex) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentScene(sceneIndex);
      setTransitioning(false);
      setActiveHotspot(null);
    }, 350);
  };

  const handleHotspotClick = (hotspot) => {
    if (hotspot.type === "navigation") {
      const targetIndex = MOCK_SCENES.findIndex(s => s.id === hotspot.targetId);
      if (targetIndex !== -1) navigateToScene(targetIndex);
    } else {
      setActiveHotspot(activeHotspot?.label === hotspot.label ? null : hotspot);
    }
  };

  const hotspotStyles = {
    navigation: "bg-orange-500 text-white border-2 border-white shadow-lg",
    info: "bg-blue-500 text-white border-2 border-white shadow-lg",
    measurement: "bg-yellow-400 text-gray-900 border-2 border-white shadow-lg"
  };

  const hotspotIcons = { navigation: "→", info: "i", measurement: "📏" };

  return (
    <div className="fixed inset-0 bg-black flex flex-col text-white overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link 
              to="/"
              className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs font-bold text-orange-400">✨ Kemedar Twin™</p>
              <p className="text-sm font-bold truncate max-w-xs">Luxury Apartment — New Cairo</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFloorPlan(!showFloorPlan)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${showFloorPlan ? 'bg-orange-500' : 'bg-white/20 hover:bg-white/30'}`}
            >
              🗺 Floor Plan
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-xs font-bold transition-colors"
            >
              🤝 Make Offer
            </button>
          </div>
        </div>
      </div>

      {/* Main Scene Viewer */}
      <div className="flex-1 relative overflow-hidden">
        <img
          key={scene.id}
          src={scene.photo}
          alt={scene.label}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-350 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Scene Label */}
        {!transitioning && (
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-6 py-2 text-lg font-bold opacity-0 animate-pulse">
            {scene.label}
          </div>
        )}

        {/* Hotspots */}
        {!transitioning && scene.hotspots.map((hotspot, idx) => (
          <button
            key={idx}
            onClick={() => handleHotspotClick(hotspot)}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
            className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all cursor-pointer hover:scale-110 ${hotspotStyles[hotspot.type]}`}
          >
            {hotspotIcons[hotspot.type]}
          </button>
        ))}

        {/* Active Hotspot Info */}
        {activeHotspot && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 rounded-xl shadow-2xl p-4 min-w-48 max-w-64 z-20">
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>
            <p className="font-black mb-1">{activeHotspot.label}</p>
            <p className="text-sm text-gray-600">{activeHotspot.content}</p>
          </div>
        )}

        {/* Floor Plan Overlay */}
        {showFloorPlan && (
          <div className="absolute bottom-28 left-4 w-44 bg-white/95 rounded-xl overflow-hidden shadow-2xl z-10">
            <p className="text-gray-900 text-xs font-black px-3 py-2 bg-gray-100">Floor Plan</p>
            <div className="p-2 space-y-1 max-h-36 overflow-y-auto">
              {MOCK_SCENES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => navigateToScene(idx)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    idx === currentScene ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar */}
        {showSidebar && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-sm z-20 overflow-y-auto">
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl z-10"
            >
              ✕
            </button>
            <div className="p-6 pt-8 text-gray-900">
              <img
                src="https://images.unsplash.com/photo-1560184897-ae75f418493e?w=300&q=80"
                className="w-full h-28 object-cover rounded-xl mb-4"
                alt="property"
              />
              <h3 className="font-black text-lg">Luxury Apartment — New Cairo</h3>
              <p className="text-orange-600 font-black text-2xl mb-1">3,500,000 EGP</p>
              <p className="text-sm text-gray-500 mb-4">3 BR • 2 BA • 185 m² • New Cairo</p>

              <div className="space-y-3">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
                  🤝 Make an Offer
                </button>
                <button className="w-full border-2 border-gray-300 hover:border-orange-500 text-gray-700 font-bold py-3 rounded-xl transition-colors">
                  💬 Message Owner
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors">
                  📅 Book Live Tour
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar — Room Navigation */}
      <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-end gap-3 px-4 pb-4 pt-10 overflow-x-auto no-scrollbar">
          {MOCK_SCENES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => navigateToScene(idx)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 transition-all ${
                idx === currentScene ? 'scale-110' : 'opacity-70 hover:opacity-90'
              }`}
            >
              <div className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentScene ? 'border-orange-500' : 'border-transparent'
              }`}>
                <img src={s.thumbnail} alt={s.label} className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] font-bold whitespace-nowrap">{s.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
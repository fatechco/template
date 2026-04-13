import { useState } from "react";
import { Play, Clock, Eye } from "lucide-react";

const CATEGORIES = ["All", "Getting Started", "Properties", "Kemework", "Kemetro", "Franchise", "Agents"];

const VIDEOS = [
  {
    id: 1,
    category: "Getting Started",
    title: "Welcome to Kemedar — Platform Overview",
    desc: "A complete walkthrough of the Kemedar platform and all its modules.",
    duration: "5:32",
    views: "24K",
    thumb: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
    youtubeId: null,
  },
  {
    id: 2,
    category: "Properties",
    title: "How to List Your Property in 5 Minutes",
    desc: "Step-by-step guide to creating a property listing with photos, location, and pricing.",
    duration: "5:14",
    views: "18K",
    thumb: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80",
    youtubeId: null,
  },
  {
    id: 3,
    category: "Properties",
    title: "VERI Verification — Boost Your Listing",
    desc: "Learn how the VERI service certifies your property and increases buyer trust.",
    duration: "3:45",
    views: "11K",
    thumb: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    youtubeId: null,
  },
  {
    id: 4,
    category: "Kemework",
    title: "Finding & Hiring Professionals on Kemework",
    desc: "How to post a task and receive bids from verified professionals in your area.",
    duration: "4:20",
    views: "9K",
    thumb: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    youtubeId: null,
  },
  {
    id: 5,
    category: "Kemetro",
    title: "Buying in Bulk on Kemetro Marketplace",
    desc: "How to post RFQs, compare seller quotes, and place bulk orders efficiently.",
    duration: "6:10",
    views: "7K",
    thumb: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80",
    youtubeId: null,
  },
  {
    id: 6,
    category: "Agents",
    title: "Agent Dashboard — Managing Clients & Listings",
    desc: "Everything an agent needs to know to manage their business on Kemedar.",
    duration: "7:55",
    views: "15K",
    thumb: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
    youtubeId: null,
  },
  {
    id: 7,
    category: "Franchise",
    title: "Becoming a Franchise Owner — Area Management",
    desc: "How franchise owners manage their area, users, and business operations.",
    duration: "8:30",
    views: "5K",
    thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    youtubeId: null,
  },
  {
    id: 8,
    category: "Getting Started",
    title: "Setting Up Your Account & Profile",
    desc: "How to complete your profile, get verified, and configure your preferences.",
    duration: "3:18",
    views: "21K",
    thumb: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80",
    youtubeId: null,
  },
];

function VideoCard({ video, onPlay }) {
  return (
    <div
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#FF6B00]/50 hover:bg-white/10 transition-all cursor-pointer group"
      onClick={() => onPlay(video)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img src={video.thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={20} className="text-white ml-1" fill="white" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
          <Clock size={10} /> {video.duration}
        </div>
        <div className="absolute top-2 left-2 bg-[#FF6B00] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
          {video.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-black text-white mb-1.5 leading-snug group-hover:text-[#FF6B00] transition-colors">{video.title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{video.desc}</p>
        <div className="flex items-center gap-1 text-gray-500 text-[11px]">
          <Eye size={12} /> <span>{video.views} views</span>
        </div>
      </div>
    </div>
  );
}

function VideoModal({ video, onClose }) {
  if (!video) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={onClose}>
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/10 w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Video placeholder (no real YouTube ID, show thumbnail with play overlay) */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <img src={video.thumb} alt={video.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-2xl mb-3">
              <Play size={30} className="text-white ml-1" fill="white" />
            </div>
            <p className="text-white text-sm font-bold">Video Player</p>
            <p className="text-gray-400 text-xs mt-1">Connect your YouTube videos to enable playback</p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-white font-black text-base mb-1">{video.title}</p>
              <p className="text-gray-400 text-sm">{video.desc}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl font-bold flex-shrink-0 px-2">✕</button>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock size={11} /> {video.duration}</span>
            <span className="flex items-center gap-1"><Eye size={11} /> {video.views} views</span>
            <span className="bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-0.5 rounded-full font-bold">{video.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoLibrary() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState(null);

  const filtered = VIDEOS.filter(v => activeCategory === "All" || v.category === activeCategory);

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap justify-center mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === cat
                ? "bg-[#FF6B00] text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map(video => (
          <VideoCard key={video.id} video={video} onPlay={setActiveVideo} />
        ))}
      </div>

      {/* Modal */}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </>
  );
}
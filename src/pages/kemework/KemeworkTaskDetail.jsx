import { useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Bookmark, ChevronRight, X, Download, Share2, Mail, Copy, Check, ArrowLeft } from "lucide-react";
import SnapAndFixBadge from "@/components/snap-and-fix/SnapAndFixBadge";
import SnapDiagnosisInfoCard from "@/components/snap-and-fix/SnapDiagnosisInfoCard";
import SnapMaterialsProCard from "@/components/snap-and-fix/SnapMaterialsProCard";

const TASK = {
  id: 1, slug: "full-kitchen-renovation-cairo-2025",
  title: "Full Kitchen Renovation with New Cabinets and Countertops",
  category: "Home Remodeling", status: "Open",
  city: "Cairo", country: "Egypt", hoursAgo: 2,
  budgetMin: 2000, budgetMax: 5000,
  deadline: "Apr 15, 2026", views: 143, totalBids: 7,
  biddable: true, isPrivate: false,
  description: `We are looking for an experienced contractor to completely renovate our 15sqm kitchen. The scope of work includes:

- Removal of all existing kitchen cabinets and countertops
- Installation of new custom-built kitchen cabinets (upper and lower)
- New quartz or marble countertops installation
- Tiling of kitchen floor and backsplash (tiles will be provided by client)
- Installation of new sink and faucet
- Painting of kitchen walls and ceiling
- Lighting fixtures installation

The kitchen is located on the 3rd floor of a residential apartment building. We expect the work to take approximately 3-4 weeks. All materials for cabinets and countertops will be selected jointly with the contractor.

Professional must have prior kitchen renovation experience and provide references. Must be able to start within 2 weeks of task assignment.`,
  skills: ["Kitchen Renovation", "Carpentry", "Tiling", "Painting", "Plumbing", "Electrical"],
  images: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  ],
  attachments: [
    { name: "Kitchen_Floor_Plan.pdf", size: "1.2 MB" },
    { name: "Reference_Design.jpg", size: "450 KB" },
  ],
  client: {
    name: "Mohamed Al-Rashid", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70",
    city: "Cairo", country: "Egypt", rating: 4.8, tasksPosted: 12, totalSpent: 15000,
    verified: true, emailVerified: true,
  },
  bids: [
    { id: 1, pro: { name: "Ahmed Hassan", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=70", rating: 4.9, reviews: 127 }, amount: 3200, days: 25, letter: "I have over 8 years of kitchen renovation experience in Cairo. I've completed 45+ similar projects and can provide full references. My approach is..." },
    { id: 2, pro: { name: "Kareem Saad", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=70", rating: 4.6, reviews: 89 }, amount: 2800, days: 30, letter: "Experienced carpenter and contractor specializing in kitchen renovations. I work with a dedicated team of tilers and painters..." },
  ],
};

const SIMILAR = [
  { id: 2, title: "Bathroom Renovation - Full Makeover", category: "Plumbing", city: "Cairo", budgetMin: 1500, budgetMax: 3000, bids: 5, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=70" },
  { id: 3, title: "Living Room Remodeling & Painting", category: "Painting", city: "Giza", budgetMin: 800, budgetMax: 1800, bids: 9, image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&q=70" },
  { id: 4, title: "Bedroom Wardrobes & Built-ins", category: "Carpentry", city: "Alexandria", budgetMin: 1200, budgetMax: 2500, bids: 3, image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300&q=70" },
  { id: 5, title: "Tiles Installation - 3 Rooms", category: "Flooring", city: "Cairo", budgetMin: 400, budgetMax: 900, bids: 11, image: "https://images.unsplash.com/photo-1562092086-c3dc5e94f1f0?w=300&q=70" },
];

function Gallery({ images }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden mb-3 bg-gray-100 cursor-pointer" style={{ height: 300 }} onClick={() => setLightbox(true)}>
        <img src={images[active]} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
          <span className="bg-white/90 rounded-full px-4 py-2 text-xs font-bold text-gray-800">🔍 View Full Size</span>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {images.map((img, i) => (
          <img key={i} src={img} alt="" onClick={() => setActive(i)} className={`w-16 h-16 rounded-xl object-cover flex-shrink-0 cursor-pointer border-2 transition-all ${active === i ? "border-red-600" : "border-transparent hover:border-gray-300"}`} />
        ))}
      </div>
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <img src={images[active]} alt="" className="max-h-[90vh] max-w-full rounded-xl" />
          <button className="absolute top-4 right-4 text-white"><X size={28} /></button>
        </div>
      )}
    </div>
  );
}

function ShareRow() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 mb-2">Share This Task:</p>
      <div className="flex gap-2 flex-wrap">
        {[
          { icon: "📧", label: "Email", href: `mailto:?body=${encodeURIComponent(window.location.href)}` },
          { icon: "f", label: "Facebook", href: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
          { icon: "🐦", label: "Twitter", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}` },
          { icon: "in", label: "LinkedIn", href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
          { icon: "💬", label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(window.location.href)}` },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 transition-colors">{s.icon}</a>
        ))}
        <button onClick={copy} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} className="text-gray-600" />}
        </button>
      </div>
    </div>
  );
}

export default function KemeworkTaskDetail() {
  const { slug } = useParams();
  const task = TASK;
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bid, setBid] = useState({ amount: "", days: "", letter: "" });
  const bidRef = useRef(null);

  const isLoggedIn = true; // mock
  const isPro = false; // mock
  const isOwner = false; // mock

  const descShort = task.description.slice(0, 300);
  const descFull = task.description;

  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      {/* Back Button */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-[1400px] mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* Title + meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {task.isSnapAndFix && <SnapAndFixBadge />}
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-3">{task.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: "#C41230" }}>{task.category}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-50 text-green-700">{task.status}</span>
                <span className="text-xs text-gray-500">⏰ Posted {task.hoursAgo}h ago</span>
                <span className="text-xs text-gray-500">📍 {task.city}, {task.country}</span>
              </div>
            </div>

            {/* Snap & Fix diagnostic info — shown prominently for AI-diagnosed tasks */}
            {task.isSnapAndFix && task._snapData && (
              <SnapDiagnosisInfoCard task={task} />
            )}

            {/* Gallery */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <Gallery images={task.images} />
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-900 text-base mb-3">Project Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {expanded ? descFull : descShort + (descFull.length > 300 ? "..." : "")}
              </p>
              {descFull.length > 300 && (
                <button onClick={() => setExpanded(e => !e)} className="mt-3 text-sm font-bold" style={{ color: "#C41230" }}>
                  {expanded ? "Show Less ↑" : "Read More ↓"}
                </button>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-900 text-base mb-3">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {task.skills.map(s => (
                  <span key={s} className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: "#5C2D0E" }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Snap & Fix: Materials card for pros */}
            {task.isSnapAndFix && task._snapData && (
              <SnapMaterialsProCard task={task} />
            )}

            {/* Bids section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-900 text-base mb-4">Bids ({task.totalBids})</h2>
              {isOwner && task.bids.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {task.bids.map(b => (
                    <div key={b.id} className="border border-gray-100 rounded-xl p-4 flex gap-4">
                      <img src={b.pro.avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-gray-900 text-sm">{b.pro.name}</p>
                          <span className="text-xs text-gray-500">⭐ {b.pro.rating} ({b.pro.reviews})</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{b.letter}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="font-bold text-green-700">${b.amount.toLocaleString()}</span>
                          <span>{b.days} days delivery</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50">View</button>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: "#C41230" }}>Accept</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isOwner && task.bids.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-3xl mb-2">📬</p>
                  <p className="font-bold text-gray-600">No bids yet.</p>
                  <p className="text-sm">Be the first to submit a bid!</p>
                </div>
              ) : isPro ? (
                <div ref={bidRef} className="border-2 border-dashed rounded-2xl p-6" style={{ borderColor: "#C41230" }}>
                  <h3 className="font-black text-gray-900 mb-4">Submit Your Bid</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Bid Amount (USD)</label>
                      <input type="number" value={bid.amount} onChange={e => setBid(b => ({ ...b, amount: e.target.value }))} placeholder="e.g. 2500" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Delivery Days</label>
                      <input type="number" value={bid.days} onChange={e => setBid(b => ({ ...b, days: e.target.value }))} placeholder="e.g. 21" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Cover Letter (min 100 chars)</label>
                    <textarea value={bid.letter} onChange={e => setBid(b => ({ ...b, letter: e.target.value }))} rows={5} placeholder="Introduce yourself and explain your approach to this project..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400 resize-none" />
                    <p className="text-xs text-gray-400 mt-1">{bid.letter.length}/100 characters minimum</p>
                  </div>
                  <button className="w-full py-3 rounded-xl font-bold text-white text-sm" style={{ background: "#C41230" }}>Submit Bid →</button>
                </div>
              ) : isLoggedIn && !isPro ? (
                <div className="text-center py-6 border border-gray-100 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-3">You are logged in as a client. Register as a professional to bid.</p>
                  <Link to="/kemework/register" className="text-sm font-bold" style={{ color: "#C41230" }}>Register as Professional →</Link>
                </div>
              ) : (
                <div className="text-center py-6 border border-gray-100 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-4">You need to login as a professional to bid on this task.</p>
                  <div className="flex justify-center gap-3">
                    <Link to="/m/login" className="px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:bg-gray-50">Sign In</Link>
                    <Link to="/kemework/register" className="px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: "#C41230" }}>Register as Professional</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-4 lg:h-fit">
            {/* Task Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-4">
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">Budget</p>
                <p className="text-3xl font-black" style={{ color: "#C41230" }}>${task.budgetMin.toLocaleString()} – ${task.budgetMax.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2.5 mb-5 text-sm text-gray-600">
                {[
                  { icon: "📋", label: "Category", value: task.category },
                  { icon: "📍", label: "Location", value: `${task.city}, ${task.country}` },
                  { icon: "⏰", label: "Posted", value: `${task.hoursAgo}h ago` },
                  { icon: "📅", label: "Deadline", value: task.deadline },
                  { icon: "👁", label: "Views", value: task.views },
                  { icon: "📬", label: "Bids", value: task.totalBids },
                  { icon: "🔖", label: "Status", value: task.status },
                ].map(d => (
                  <div key={d.label} className="flex justify-between">
                    <span className="text-gray-500">{d.icon} {d.label}</span>
                    <span className="font-semibold text-gray-800">{d.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setBookmarked(b => !b)} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${bookmarked ? "text-white border-amber-500" : "border-gray-300 text-gray-700 hover:border-gray-400"}`} style={bookmarked ? { background: "#F59E0B" } : {}}>
                  <Bookmark size={15} className={bookmarked ? "fill-white" : ""} /> {bookmarked ? "Bookmarked" : "Bookmark Task"}
                </button>
                <button onClick={() => setShowAssignModal(true)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all" style={{ background: "#D4A017", color: "#1a1a2e" }}>
                  🏗 Assign Task to Kemedar
                </button>
                {isPro ? (
                  <button onClick={() => setShowBidModal(true)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white transition-all" style={{ background: "#C41230" }}>
                    📬 Bid Now
                  </button>
                ) : (
                  <button onClick={() => setShowBidModal(true)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white transition-all" style={{ background: "#C41230" }}>
                    📬 Bid Now
                  </button>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <ShareRow />
              </div>
            </div>

            {/* About Client */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 text-sm mb-3">About This Client</h3>
              <div className="flex items-center gap-3 mb-3">
                <img src={task.client.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-black text-gray-900 text-sm">{task.client.name}</p>
                  <p className="text-xs text-gray-500">⭐ {task.client.rating} · 📍 {task.client.city}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-xs text-gray-600">
                <div className="flex justify-between"><span>📋 Tasks Posted</span><span className="font-bold">{task.client.tasksPosted}</span></div>
                <div className="flex justify-between"><span>💰 Total Spent</span><span className="font-bold">${task.client.totalSpent.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>🔖 Status</span><span className="font-bold text-green-600">Verified</span></div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                {task.client.verified && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">✅ Verified</span>}
                {task.client.emailVerified && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">📧 Email Verified</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Tasks */}
        <div className="mt-8">
          <h2 className="text-xl font-black text-gray-900 mb-4">Similar Tasks</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {SIMILAR.map(t => (
              <Link key={t.id} to={`/kemework/task/${t.id}`} className="flex-shrink-0 w-64 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow block">
                <img src={t.image} alt="" className="w-full h-36 object-cover" />
                <div className="p-4">
                  <p className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">{t.title}</p>
                  <p className="text-xs text-gray-400 mb-1">📍 {t.city} · {t.bids} bids</p>
                  <p className="font-black text-sm" style={{ color: "#C41230" }}>${t.budgetMin.toLocaleString()} – ${t.budgetMax.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAssignModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Assign Task to Kemedar</h3>
            <p className="text-sm text-gray-500 mb-5">Our team will contact you to discuss your requirements and assign the best professional.</p>
            <input type="text" placeholder="Your Full Name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 outline-none" />
            <input type="tel" placeholder="Phone Number" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 outline-none" />
            <textarea rows={3} placeholder="Additional notes..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 outline-none resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setShowAssignModal(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-700">Cancel</button>
              <button className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: "#D4A017", color: "#1a1a2e" }}>Submit Request →</button>
            </div>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBidModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowBidModal(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} className="text-gray-400" />
            </button>
            <h3 className="font-black text-gray-900 text-lg mb-1">Submit Your Bid</h3>
            <p className="text-xs text-gray-400 mb-4">{task.title}</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Bid Amount (USD)</label>
                <input type="number" value={bid.amount} onChange={e => setBid(b => ({ ...b, amount: e.target.value }))} placeholder="e.g. 2500" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Delivery Days</label>
                <input type="number" value={bid.days} onChange={e => setBid(b => ({ ...b, days: e.target.value }))} placeholder="e.g. 21" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Cover Letter (min 100 chars)</label>
                <textarea value={bid.letter} onChange={e => setBid(b => ({ ...b, letter: e.target.value }))} rows={5} placeholder="Introduce yourself and explain your approach..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400 resize-none" />
                <p className="text-xs text-gray-400 mt-1">{bid.letter.length}/100 characters minimum</p>
              </div>
              <button className="w-full py-3 rounded-xl font-bold text-white text-sm" style={{ background: "#C41230" }}>Submit Bid →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
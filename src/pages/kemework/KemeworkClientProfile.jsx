import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Copy, Star } from "lucide-react";

const CLIENT = {
  username: "mohamed-alrashid",
  name: "Mohamed Al-Rashid",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  city: "Cairo", country: "Egypt", flag: "🇪🇬",
  rating: 4.8, totalReviews: 9,
  memberSince: "Mar 2023",
  bio: "Homeowner with a passion for quality interior design and home renovation. I've worked with multiple professionals through Kemework and value reliability and craftsmanship.",
  verified: true, emailVerified: true, identityVerified: true,
  totalSpent: 15000, tasksPosted: 12, tasksCompleted: 8,
  tasks: [
    { id: 1, title: "Full Kitchen Renovation with New Cabinets and Countertops", category: "Home Remodeling", posted: "2h ago", status: "Open", budgetMin: 2000, budgetMax: 5000, bids: 7 },
    { id: 2, title: "Apartment Electrical Rewiring - 3 Bedroom", category: "Electrical", posted: "3 days ago", status: "In Progress", budgetMin: 800, budgetMax: 1500, bids: 12 },
    { id: 3, title: "Garden Landscaping Design", category: "Landscaping", posted: "1 week ago", status: "Open", budgetMin: 1500, budgetMax: 4000, bids: 3 },
  ],
  reviews: [
    { id: 1, pro: "Ahmed Hassan", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=70", rating: 5, date: "Feb 2025", comment: "Great client! Very clear with requirements and prompt with payments. Highly recommend working with him." },
    { id: 2, pro: "Sara Mohamed", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=70", rating: 5, date: "Dec 2024", comment: "Professional and respectful. Provided all necessary access and materials on time." },
    { id: 3, pro: "Omar Khalid", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=70", rating: 4, date: "Oct 2024", comment: "Good client. Slight change in requirements mid-project but handled it well." },
  ],
};

function ShareRow() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 mb-2">Share Profile:</p>
      <div className="flex gap-2 flex-wrap">
        {["📧", "f", "🐦", "in", "💬"].map((icon, i) => (
          <button key={i} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 transition-colors">{icon}</button>
        ))}
        <button onClick={copy} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} className="text-gray-600" />}
        </button>
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  Open: "bg-green-50 text-green-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Completed: "bg-gray-100 text-gray-600",
  Closed: "bg-red-50 text-red-700",
};

export default function KemeworkClientProfile() {
  const { username } = useParams();
  const client = CLIENT;
  const [followed, setFollowed] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={client.avatar} alt={client.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow" />
              <div>
                <h1 className="text-2xl font-black text-gray-900 mb-0.5">{client.name}</h1>
                <p className="text-sm text-gray-500">{client.flag} {client.city}, {client.country}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-sm text-gray-600">⭐ {client.rating} ({client.totalReviews} reviews)</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">Member since {client.memberSince}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setFollowed(f => !f)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${followed ? "border-red-600 text-red-600" : "border-gray-300 text-gray-700"}`}>
              {followed ? "✓ Following" : "＋ Follow"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
            {[
              { label: "Tasks Posted", value: client.tasksPosted },
              { label: "Tasks Completed", value: client.tasksCompleted },
              { label: "Total Spent", value: `$${client.totalSpent.toLocaleString()}` },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-black text-gray-900 text-xl">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        {client.bio && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <h2 className="font-black text-gray-900 text-base mb-2">About</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{client.bio}</p>
          </div>
        )}

        {/* Open Tasks */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="font-black text-gray-900 text-base mb-4">Open Tasks ({client.tasks.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 text-xs font-bold text-gray-500">Title</th>
                  <th className="text-left py-2 pr-4 text-xs font-bold text-gray-500">Category</th>
                  <th className="text-left py-2 pr-4 text-xs font-bold text-gray-500">Posted</th>
                  <th className="text-left py-2 pr-4 text-xs font-bold text-gray-500">Status</th>
                  <th className="text-left py-2 pr-4 text-xs font-bold text-gray-500">Budget</th>
                  <th className="text-left py-2 text-xs font-bold text-gray-500">Bids</th>
                </tr>
              </thead>
              <tbody>
                {client.tasks.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <Link to={`/kemework/task/${t.id}`} className="font-semibold text-gray-900 hover:text-red-700 line-clamp-1 block max-w-[200px]">{t.title}</Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">{t.category}</td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">{t.posted}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[t.status] || "bg-gray-100 text-gray-600"}`}>{t.status}</span>
                    </td>
                    <td className="py-3 pr-4 text-xs font-semibold text-gray-700">${t.budgetMin.toLocaleString()}–${t.budgetMax.toLocaleString()}</td>
                    <td className="py-3 text-xs text-gray-500">{t.bids} bids</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="font-black text-gray-900 text-base mb-4">Reviews ({client.reviews.length})</h2>
          {client.reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">💬</p>
              <p className="font-semibold text-gray-500">No reviews yet</p>
              <p className="text-sm">Professionals will leave reviews after completing tasks.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {client.reviews.map(r => (
                <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={r.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{r.pro}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(n => <Star key={n} size={11} className={n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}</div>
                        <span className="text-xs text-gray-400">{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verifications + Share */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-black text-gray-900 text-sm mb-3">Verifications</h3>
            <div className="flex flex-col gap-2">
              {client.identityVerified && <div className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-600">✅</span> Identity Verified</div>}
              {client.emailVerified && <div className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-600">✅</span> Email Verified</div>}
              {client.verified && <div className="flex items-center gap-2 text-sm text-gray-700"><span className="text-blue-600">🔵</span> Profile Verified</div>}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <ShareRow />
          </div>
        </div>
      </div>
    </div>
  );
}
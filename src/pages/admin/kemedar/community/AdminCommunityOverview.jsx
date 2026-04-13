import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const TABS = [
  { label: "📊 Overview", to: "/admin/kemedar/community" },
  { label: "🏘 All Communities", to: "/admin/kemedar/community/all" },
  { label: "🚩 Moderation Queue", to: "/admin/kemedar/community/moderation" },
  { label: "👥 Member Requests", to: "/admin/kemedar/community/requests" },
  { label: "⚙️ Settings", to: "/admin/kemedar/community/settings" },
];

export default function AdminCommunityOverview() {
  const { pathname } = useLocation();
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Community.list("-created_date", 100),
      base44.entities.CommunityPost.filter({ status: "flagged" }),
      base44.entities.CommunityMember.filter({ role: "pending" }),
    ]).then(([c, p, m]) => { setCommunities(c); setPosts(p); setMembers(m); setLoading(false); });
  }, []);

  const activeTab = TABS.find(t => pathname === t.to)?.to || TABS[0].to;
  const activeComms = communities.filter(c => c.status === "active");
  const totalMembers = communities.reduce((s, c) => s + (c.totalMembers || 0), 0);
  const thisWeekPosts = communities.reduce((s, c) => s + (c.postsThisWeek || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">🏘 Community™ Admin</h1>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <Link key={t.to} to={t.to}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === t.to ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
            {t.to.includes("moderation") && posts.length > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] font-black px-1 py-0.5 rounded-full">{posts.length}</span>}
            {t.to.includes("requests") && members.length > 0 && <span className="ml-1 bg-orange-500 text-white text-[9px] font-black px-1 py-0.5 rounded-full">{members.length}</span>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Communities", val: loading ? "—" : activeComms.length, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Total Members", val: loading ? "—" : totalMembers.toLocaleString(), color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Posts This Week", val: loading ? "—" : thisWeekPosts, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending Moderation", val: loading ? "—" : posts.length + members.length, color: "text-red-600", bg: "bg-red-50" },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-white shadow-sm`}>
            <p className={`text-2xl font-black ${k.color}`}>{k.val}</p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Communities table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-black text-gray-900">Communities ({communities.length})</p>
          <Link to="/kemedar/community/create" className="text-xs bg-orange-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors">+ Create</Link>
        </div>
        {communities.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-400">No communities yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Community</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-right px-4 py-3">Members</th>
                  <th className="text-right px-4 py-3">Posts/Week</th>
                  <th className="text-left px-4 py-3">Privacy</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {communities.map(c => (
                  <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{c.communityName}</p>
                      {c.compoundName && <p className="text-[10px] text-gray-400">{c.compoundName}</p>}
                    </td>
                    <td className="px-4 py-3 capitalize text-xs text-gray-500">{c.communityType}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-800">{c.totalMembers || 0}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{c.postsThisWeek || 0}</td>
                    <td className="px-4 py-3 text-xs capitalize text-gray-500">{c.privacyLevel?.replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/kemedar/community/${c.id}`} className="text-xs text-orange-500 font-bold hover:underline">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Flagged posts */}
      {posts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-black text-gray-900">🚩 Flagged Posts ({posts.length})</p>
          </div>
          {posts.map(p => (
            <div key={p.id} className="px-5 py-3 border-b border-gray-50 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{p.content?.substring(0, 100)}</p>
                <p className="text-xs text-gray-400">{p.postType} · Score: {p.aiModerationScore || "?"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => base44.entities.CommunityPost.update(p.id, { status: "published" }).then(() => setPosts(prev => prev.filter(x => x.id !== p.id)))}
                  className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded-lg hover:bg-green-200">✅ Keep</button>
                <button onClick={() => base44.entities.CommunityPost.update(p.id, { status: "removed" }).then(() => setPosts(prev => prev.filter(x => x.id !== p.id)))}
                  className="text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-200">🗑 Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending requests */}
      {members.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-black text-gray-900">⏳ Pending Member Requests ({members.length})</p>
          </div>
          {members.map(m => (
            <div key={m.id} className="px-5 py-3 border-b border-gray-50 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{m.userName}</p>
                <p className="text-xs text-gray-400">Unit {m.unitNumber} · {m.ownershipType}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => base44.entities.CommunityMember.update(m.id, { role: "member", verificationStatus: "verified", approvedAt: new Date().toISOString() }).then(() => setMembers(prev => prev.filter(x => x.id !== m.id)))}
                  className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded-lg hover:bg-green-200">✅ Approve</button>
                <button onClick={() => base44.entities.CommunityMember.update(m.id, { role: "banned", verificationStatus: "rejected" }).then(() => setMembers(prev => prev.filter(x => x.id !== m.id)))}
                  className="text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-200">❌ Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
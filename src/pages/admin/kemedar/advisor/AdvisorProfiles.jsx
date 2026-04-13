import { useState } from "react";
import { Search, X, Download } from "lucide-react";

const PURPOSE_BADGE = { buy: "bg-orange-100 text-orange-700", rent: "bg-blue-100 text-blue-700", invest: "bg-green-100 text-green-700" };
const URGENCY_BADGE = { immediate: "bg-red-100 text-red-700", soon: "bg-orange-100 text-orange-700", planning: "bg-teal-100 text-teal-700", exploring: "bg-gray-100 text-gray-600" };

const MOCK_PROFILES = Array.from({ length: 20 }, (_, i) => ({
  id: `ADV-${1000 + i}`,
  user: ["Ahmed Hassan", "Sara Mohamed", "Anonymous Guest", "Karim Ali", "Nour Hassan", "Mohamed Samir", "Layla Nour", "Omar Rashid", "Rana Adel", "Tarek Youssef"][i % 10],
  email: i % 3 === 2 ? null : `user${i + 1}@email.com`,
  purpose: ["buy", "rent", "invest"][i % 3],
  propertyTypes: [["Apartment"], ["Villa", "Duplex"], ["Studio"], ["Apartment", "Penthouse"], ["Land"]][i % 5],
  budget: ["1.5–2.5M EGP", "5–8K/mo", "3–5M EGP", "8–12K/mo", "2–3M EGP"][i % 5],
  urgency: ["immediate", "soon", "planning", "exploring"][i % 4],
  locations: [["New Cairo", "5th Settlement"], ["Sheikh Zayed"], ["Maadi", "Zamalek"], ["Heliopolis"], ["6th October"]][i % 5],
  completion: [100, 87, 62, 100, 50, 75, 100, 88, 44, 95][i % 10],
  matches: [12, 8, 0, 24, 3, 18, 6, 15, 0, 9][i % 10],
  notified: i % 3 !== 0,
  reportGenerated: i % 4 !== 3,
  isGuest: i % 3 === 2,
  isActive: i % 6 !== 5,
  created: `2026-03-${String((i % 20) + 1).padStart(2, "0")}`,
  lastActivity: `${i + 1} ${i === 0 ? "hr" : "hrs"} ago`,
  householdCount: 2 + (i % 4),
  hasPets: i % 4 === 1,
  worksFromHome: i % 3 === 0,
  mustHave: ["Elevator", "Parking", "Balcony", "Security", "Pool"].slice(0, (i % 3) + 1),
  noGo: ["Ground Floor", "Near Highway"][i % 2 === 0 ? 0 : 1] ? [["Ground Floor", "Near Highway"][i % 2]] : [],
}));

const DETAIL_TABS = ["📋 Survey", "🏘️ Matches", "🔔 Notifications", "📊 Report", "📅 Activity"];

function ProfilePanel({ profile, onClose }) {
  const [tab, setTab] = useState(0);

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-[560px] bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-5 flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-white/20 text-white text-xs font-black flex items-center justify-center">
                {profile.isGuest ? "?" : profile.user.slice(0, 2).toUpperCase()}
              </div>
              <h2 className="text-white font-black text-lg">{profile.user}</h2>
              {profile.isGuest && <span className="bg-white/20 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">GUEST</span>}
            </div>
            {profile.email && <p className="text-purple-200 text-xs">{profile.email}</p>}
            <p className="text-purple-200 text-xs mt-0.5">Profile ID: {profile.id} · Created: {profile.created}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={18} /></button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-white">{profile.completion}%</p>
            <p className="text-purple-200 text-[10px]">Complete</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-orange-300">{profile.matches}</p>
            <p className="text-purple-200 text-[10px]">Matches</p>
          </div>
          <div>
            <span className={`font-black px-2 py-0.5 rounded-full text-xs capitalize ${PURPOSE_BADGE[profile.purpose]}`}>{profile.purpose}</span>
          </div>
          <div>
            <span className={`font-black px-2 py-0.5 rounded-full text-xs capitalize ${URGENCY_BADGE[profile.urgency]}`}>{profile.urgency}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto flex-shrink-0">
        {DETAIL_TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`flex-shrink-0 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${tab === i ? "border-purple-500 text-purple-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {tab === 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Purpose", profile.purpose], ["Urgency", profile.urgency],
                ["Property Types", profile.propertyTypes.join(", ")], ["Budget", profile.budget],
                ["Household", `${profile.householdCount} people`], ["Pets", profile.hasPets ? "Yes" : "No"],
                ["WFH", profile.worksFromHome ? "Yes" : "No"], ["Top Areas", profile.locations.join(", ")],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{k}</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5 capitalize">{v}</p>
                </div>
              ))}
            </div>
            {profile.mustHave.length > 0 && (
              <div>
                <p className="text-xs font-black text-gray-700 mb-2">Must-Have Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.mustHave.map(f => <span key={f} className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✅ {f}</span>)}
                </div>
              </div>
            )}
            {profile.noGo.length > 0 && (
              <div>
                <p className="text-xs font-black text-gray-700 mb-2">No-Go Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.noGo.map(f => <span key={f} className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">❌ {f}</span>)}
                </div>
              </div>
            )}
          </>
        )}

        {tab === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-gray-700">{profile.matches} matches found</p>
              <button className="text-xs text-orange-500 font-bold hover:underline">View all →</button>
            </div>
            {Array.from({ length: Math.min(profile.matches, 5) }, (_, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=50&q=60" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">Property #{1000 + i} — New Cairo</p>
                  <p className="text-[11px] text-gray-400">2.3M EGP · Apartment</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-orange-600">{85 + i}%</p>
                  <p className="text-[10px] text-gray-400">score</p>
                </div>
              </div>
            ))}
            {profile.matches === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-2xl mb-2">🏠</p>
                <p className="text-sm font-semibold">No matches yet</p>
                <p className="text-xs">Survey needs to be complete</p>
              </div>
            )}
          </div>
        )}

        {tab === 2 && (
          <div className="space-y-3">
            {profile.notified ? (
              Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${["bg-red-100 text-red-700", "bg-blue-100 text-blue-700", "bg-teal-100 text-teal-700", "bg-green-100 text-green-700"][i]}`}>
                      {["Instant Alert", "Daily Digest", "Weekly Summary", "Price Drop"][i]}
                    </span>
                    <span className="text-[10px] text-gray-400">{i + 1} day{i > 0 ? "s" : ""} ago</span>
                  </div>
                  <p className="text-xs text-gray-700">Property matched at {85 + i * 2}% score</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                    <span>{i % 2 === 0 ? "✅ Opened" : "— Not opened"}</span>
                    <span>{i % 4 === 0 ? "✅ Clicked" : ""}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-2xl mb-2">🔔</p>
                <p className="text-sm font-semibold">No notifications sent yet</p>
              </div>
            )}
          </div>
        )}

        {tab === 3 && (
          <div>
            {profile.reportGenerated ? (
              <div className="space-y-3">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="font-black text-purple-800 text-sm mb-1">✅ AI Report Generated</p>
                  <p className="text-xs text-purple-600">Generated on {profile.created}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[["Report Sections", "7"], ["Properties Shown", profile.matches.toString()], ["Languages", "Arabic"], ["Share Token", "abc123..."]].map(([k, v]) => (
                    <div key={k} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400">{k}</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full border border-orange-200 text-orange-600 font-bold py-2.5 rounded-xl text-sm hover:bg-orange-50">
                  👁 Preview Report
                </button>
                <button className="w-full border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
                  🔄 Regenerate Report
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-2xl mb-2">📊</p>
                <p className="text-sm font-semibold mb-3">No report generated yet</p>
                <button className="bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-600">
                  🤖 Generate Report Now
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 4 && (
          <div className="space-y-2">
            {[
              ["Survey completed", profile.created, "text-green-600"],
              ["First match found", profile.created, "text-orange-600"],
              ["Report generated", profile.created, "text-purple-600"],
              ["Notification sent", `${profile.lastActivity}`, "text-blue-600"],
              ["User viewed match", `${profile.lastActivity}`, "text-gray-600"],
            ].map(([event, time, color], i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${color.replace("text-", "bg-")}`} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-700">{event}</p>
                  <p className="text-[11px] text-gray-400">{time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex-shrink-0 border-t border-gray-100 p-4 flex gap-2">
        <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs hover:bg-gray-50">
          🤖 Regenerate
        </button>
        <button className="flex-1 border border-orange-200 text-orange-600 font-bold py-2 rounded-xl text-xs hover:bg-orange-50">
          🔔 Send Alert
        </button>
        <button className="flex-1 border border-red-200 text-red-500 font-bold py-2 rounded-xl text-xs hover:bg-red-50">
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

export default function AdvisorProfiles() {
  const [search, setSearch] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("all");
  const [filterCompletion, setFilterCompletion] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const filtered = MOCK_PROFILES.filter(p => {
    const matchSearch = !search || p.user.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search);
    const matchPurpose = filterPurpose === "all" || p.purpose === filterPurpose;
    const matchCompletion = filterCompletion === "all"
      || (filterCompletion === "complete" && p.completion === 100)
      || (filterCompletion === "partial" && p.completion < 100);
    return matchSearch && matchPurpose && matchCompletion;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Advisor Profiles</h1>
          <p className="text-gray-500 text-sm">{filtered.length} profiles in the system</p>
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user, ID..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-400" />
        </div>
        <select value={filterPurpose} onChange={e => setFilterPurpose(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="all">All Purposes</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
          <option value="invest">Invest</option>
        </select>
        <select value={filterCompletion} onChange={e => setFilterCompletion(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="all">All</option>
          <option value="complete">Complete (100%)</option>
          <option value="partial">Partial</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Profile", "Purpose", "Type", "Budget", "Urgency", "Locations", "Completion", "Matches", "Notified", "Created", ""].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-bold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedProfile(p)}>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
                        {p.isGuest ? "?" : p.user.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{p.user}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`font-bold px-2 py-0.5 rounded-full capitalize ${PURPOSE_BADGE[p.purpose]}`}>{p.purpose}</span>
                  </td>
                  <td className="px-3 py-3 text-gray-600">{p.propertyTypes.join(", ")}</td>
                  <td className="px-3 py-3 font-bold text-gray-700">{p.budget}</td>
                  <td className="px-3 py-3">
                    <span className={`font-bold px-2 py-0.5 rounded-full capitalize ${URGENCY_BADGE[p.urgency]}`}>{p.urgency}</span>
                  </td>
                  <td className="px-3 py-3 text-gray-500 max-w-[120px] truncate">{p.locations.join(", ")}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.completion === 100 ? "bg-green-500" : "bg-orange-400"}`} style={{ width: `${p.completion}%` }} />
                      </div>
                      <span className="font-bold text-gray-600">{p.completion}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="bg-orange-100 text-orange-700 font-black px-2 py-0.5 rounded-full">{p.matches}</span>
                  </td>
                  <td className="px-3 py-3">
                    {p.notified ? <span className="text-green-600 font-bold">✅</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-3 py-3 text-gray-400">{p.created}</td>
                  <td className="px-3 py-3">
                    <button className="text-[10px] border border-purple-200 text-purple-600 px-2 py-1 rounded-lg hover:bg-purple-50 font-bold">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-gray-400">
                    <p className="text-2xl mb-2">🤖</p>
                    <p className="font-bold">No profiles match this filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProfile && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedProfile(null)} />
          <ProfilePanel profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
        </>
      )}
    </div>
  );
}
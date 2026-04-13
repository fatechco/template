import { useNavigate, useLocation } from "react-router-dom";

function useMobileProfilePath(type, person) {
  const loc = useLocation();
  const isMobile = loc.pathname.startsWith("/m");
  if (!isMobile) return `/${type}-profile/${person.id}`;
  if (type === "agent") return `/m/agent-profile/${person.id}`;
  if (type === "agency") return `/m/agency-profile/${person.id}`;
  if (type === "developer") return `/m/developer-profile/${person.id}`;
  if (type === "franchise") return `/m/franchise-owner-profile/${person.id}`;
  if (type === "professional") return `/m/kemework/profile/${person.id}`;
  return `/${type}-profile/${person.id}`;
}

export function AgentCard({ person }) {
  const navigate = useNavigate();
  const profilePath = useMobileProfilePath("agent", person);
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={person.avatar}
            alt={person.name}
            className="w-16 h-16 rounded-full object-cover bg-gray-200"
          />
          {person.verified && (
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-[9px]">✓</span>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-gray-900 text-base truncate">{person.name}</span>
          </div>
          {person.agency && <p className="text-[13px] text-gray-500 truncate">{person.agency}</p>}
          <p className="text-xs text-gray-400 mt-0.5">📍 {person.city}, {person.country}</p>
          <p className="text-xs text-gray-500 mt-0.5">⭐ {person.rating} ({person.reviews} reviews)</p>
          <div className="mt-1.5">
            <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {person.properties} Properties
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-sm font-bold">💬 Chat</button>
        <button onClick={() => navigate(profilePath)} className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-sm font-bold">👤 View Profile</button>
      </div>
    </div>
  );
}

export function DeveloperCard({ person }) {
  const navigate = useNavigate();
  const profilePath = useMobileProfilePath("developer", person);
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          <img src={person.avatar} alt={person.name} className="w-16 h-16 rounded-xl object-cover bg-gray-200 border border-gray-100" />
          {person.verified && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-[9px]">✓</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-base truncate">{person.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">📍 {person.city}, {person.country}</p>
          <p className="text-xs text-gray-500 mt-0.5">⭐ {person.rating} · Est. {person.established}</p>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{person.projects} Projects</span>
            <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{person.properties} Units</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-sm font-bold">💬 Chat</button>
        <button onClick={() => navigate(profilePath)} className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-sm font-bold">🏗 View Projects</button>
      </div>
    </div>
  );
}

export function FranchiseOwnerCard({ person }) {
  const navigate = useNavigate();
  const profilePath = useMobileProfilePath("franchise", person);
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          <img src={person.avatar} alt={person.name} className="w-16 h-16 rounded-full object-cover bg-gray-200" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-base truncate">{person.name}</p>
          <p className="text-sm font-bold text-orange-600 mt-0.5">🗺 {person.coverage}</p>
          <p className="text-xs text-gray-400 mt-0.5">📍 {person.province}, {person.country}</p>
          {person.languages && <p className="text-xs text-gray-400 mt-0.5">🗣 {person.languages.join(", ")}</p>}
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-sm font-bold">📞 Contact</button>
        <button onClick={() => navigate(profilePath)} className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-sm font-bold">👤 View Profile</button>
      </div>
    </div>
  );
}

export function AgencyCard({ person }) {
  const navigate = useNavigate();
  const profilePath = useMobileProfilePath("agency", person);
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          <img src={person.logo} alt={person.name} className="w-16 h-16 rounded-xl object-cover bg-gray-200 border border-gray-100" />
          {person.verified && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-[9px]">✓</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-base truncate">{person.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">📍 {person.city}, {person.country}</p>
          <p className="text-xs text-gray-500 mt-0.5">⭐ {person.rating} ({person.reviews} reviews)</p>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{person.agents} Agents</span>
            <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{person.properties} Props</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-sm font-bold">💬 Chat</button>
        <button onClick={() => navigate(profilePath)} className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-sm font-bold">🏢 View Agency</button>
      </div>
    </div>
  );
}

export function ProfessionalCard({ person }) {
  const navigate = useNavigate();
  const profilePath = useMobileProfilePath("professional", person);
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          <img src={person.avatar} alt={person.name} className="w-16 h-16 rounded-full object-cover bg-gray-200" />
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${person.available ? "bg-green-500" : "bg-red-400"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-black text-gray-900 text-base truncate">{person.name}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${person.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
              {person.available ? "🟢 Available" : "🔴 Busy"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {person.specializations?.slice(0, 3).map(s => (
              <span key={s} className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">⭐ {person.rating} · {person.jobs} jobs · 📍 {person.city}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-sm font-bold">💬 Message</button>
        <button onClick={() => navigate(profilePath)} className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold">📋 Assign Task</button>
      </div>
    </div>
  );
}
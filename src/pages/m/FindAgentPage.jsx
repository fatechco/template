import { useState } from "react";
import PeopleSearchTemplate from "@/components/find-people/PeopleSearchTemplate";
import { AgentCard } from "@/components/find-people/PersonCard";
import MobileFilterBottomSheet from "@/components/mobile-v2/MobileFilterBottomSheet";

const MOCK_AGENTS = Array.from({ length: 18 }, (_, i) => ({
  id: String(i + 1),
  username: `agent-${i + 1}`,
  name: ["Ahmed Hassan", "Sara Mohamed", "Khaled Ali", "Mona Ibrahim", "Omar Sherif", "Layla Nasser"][i % 6],
  agency: ["Elite Properties", "Nile Realty", "Cairo Homes", "Sky Estates", null, "Premier RE"][i % 6],
  city: ["Cairo", "Giza", "Alexandria", "New Cairo"][i % 4],
  country: "Egypt",
  rating: (4.2 + (i % 8) * 0.1).toFixed(1),
  reviews: 12 + i * 3,
  properties: 8 + i * 2,
  verified: i % 3 !== 2,
  avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
}));

const SPECIALIZATIONS = ["Residential", "Commercial", "Luxury", "Off-Plan", "Rental"];
const LANGUAGES = ["Arabic", "English", "French", "German", "Russian"];

function AgentExtraFilters(open, onClose, filters, setFilters) {
  const [specs, setSpecs] = useState([]);
  const [langs, setLangs] = useState([]);
  const toggle = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  return (
    <MobileFilterBottomSheet
      open={open}
      onClose={onClose}
      onApply={() => { setFilters(f => ({ ...f, specializations: specs, languages: langs })); onClose(); }}
      onReset={() => { setSpecs([]); setLangs([]); }}
    >
      <div className="mb-5">
        <p className="font-black text-gray-900 text-sm mb-3">Specialization</p>
        <div className="flex flex-wrap gap-2">
          {SPECIALIZATIONS.map(s => (
            <button key={s} onClick={() => toggle(specs, setSpecs, s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${specs.includes(s) ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="font-black text-gray-900 text-sm mb-3">Languages</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(l => (
            <button key={l} onClick={() => toggle(langs, setLangs, l)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${langs.includes(l) ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </MobileFilterBottomSheet>
  );
}

export default function FindAgentPage() {
  return (
    <PeopleSearchTemplate
      title="Find Agent"
      placeholder="Search by name, city..."
      results={MOCK_AGENTS}
      totalCount={MOCK_AGENTS.length}
      renderCard={(person) => <AgentCard key={person.id} person={person} />}
      extraFilters={true}
      extraFilterSheet={AgentExtraFilters}
    />
  );
}
import { useState } from "react";
import PeopleSearchTemplate from "@/components/find-people/PeopleSearchTemplate";
import { ProfessionalCard } from "@/components/find-people/PersonCard";
import MobileFilterBottomSheet from "@/components/mobile-v2/MobileFilterBottomSheet";

const MOCK_PROS = Array.from({ length: 16 }, (_, i) => ({
  id: String(i + 1),
  username: `pro-${i + 1}`,
  name: ["Ahmed Fathy", "Hassan Nour", "Karim Saleh", "Wael Mahmoud", "Sami Ibrahim", "Bassem Ali"][i % 6],
  specializations: [
    ["Electrician", "AC Tech"],
    ["Plumber", "Sanitary"],
    ["Painter", "Gypsum"],
    ["Carpenter", "Furniture"],
    ["Contractor", "Renovation"],
    ["AC Tech", "Appliances"],
  ][i % 6],
  rating: (4.0 + (i % 9) * 0.11).toFixed(1),
  jobs: 20 + i * 5,
  city: ["Cairo", "Giza", "Alexandria"][i % 3],
  available: i % 3 !== 1,
  avatar: `https://i.pravatar.cc/150?img=${i + 50}`,
}));

const SPECS = ["Electrician", "Plumber", "Painter", "Carpenter", "AC Tech", "Contractor", "Tiler", "Welder", "Other"];

function ProfExtraFilters(open, onClose, filters, setFilters) {
  const [specs, setSpecs] = useState([]);
  const [avail, setAvail] = useState(null);
  const toggle = (val) => setSpecs(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  return (
    <MobileFilterBottomSheet
      open={open}
      onClose={onClose}
      onApply={() => { setFilters(f => ({ ...f, specializations: specs, availability: avail })); onClose(); }}
      onReset={() => { setSpecs([]); setAvail(null); }}
    >
      <div className="mb-5">
        <p className="font-black text-gray-900 text-sm mb-3">Specialization</p>
        <div className="flex flex-wrap gap-2">
          {SPECS.map(s => (
            <button key={s} onClick={() => toggle(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${specs.includes(s) ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="font-black text-gray-900 text-sm mb-3">Availability</p>
        <div className="flex gap-2">
          {["Available now", "Available this week"].map(opt => (
            <button key={opt} onClick={() => setAvail(avail === opt ? null : opt)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${avail === opt ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </MobileFilterBottomSheet>
  );
}

export default function FindProfessionalPage() {
  return (
    <PeopleSearchTemplate
      title="Find Professional"
      placeholder="Search by name, skill, city..."
      results={MOCK_PROS}
      totalCount={MOCK_PROS.length}
      renderCard={(person) => <ProfessionalCard key={person.id} person={person} />}
      extraFilters={true}
      extraFilterSheet={ProfExtraFilters}
    />
  );
}
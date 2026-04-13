import PeopleSearchTemplate from "@/components/find-people/PeopleSearchTemplate";
import { AgencyCard } from "@/components/find-people/PersonCard";

const MOCK_AGENCIES = Array.from({ length: 16 }, (_, i) => ({
  id: String(i + 1),
  username: `agency-${i + 1}`,
  name: ["Coldwell Banker", "RE/MAX Egypt", "JLL Egypt", "Nawy Real Estate", "ERA Egypt", "Sotheby's Realty", "CBRE Egypt", "Knight Frank"][i % 8],
  city: ["New Cairo", "Sheikh Zayed", "Downtown Cairo", "6th October", "Alexandria", "Giza"][i % 6],
  country: "Egypt",
  agents: 8 + i * 3,
  properties: 40 + i * 12,
  rating: (4.0 + (i % 10) * 0.1).toFixed(1),
  reviews: 20 + i * 5,
  verified: i % 3 !== 1,
  logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(["CB","RM","JL","NW","ER","SR","CB","KF"][i % 8])}&background=FF6B00&color=fff&size=80`,
}));

export default function FindAgencyPage() {
  return (
    <PeopleSearchTemplate
      title="Find Agency"
      placeholder="Search by agency name, city..."
      results={MOCK_AGENCIES}
      totalCount={MOCK_AGENCIES.length}
      renderCard={(person) => <AgencyCard key={person.id} person={person} />}
    />
  );
}
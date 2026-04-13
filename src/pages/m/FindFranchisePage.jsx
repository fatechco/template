import PeopleSearchTemplate from "@/components/find-people/PeopleSearchTemplate";
import { FranchiseOwnerCard } from "@/components/find-people/PersonCard";

const MOCK_FO = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  username: `franchise-${i + 1}`,
  name: ["Mohamed Al-Sayed", "Rania Khalil", "Tarek Mansour", "Dina Farouk", "Youssef Gamal", "Heba Samir"][i % 6],
  coverage: ["New Cairo – 5th Settlement", "Maadi & Degla", "Zamalek & Garden City", "Sheikh Zayed", "6th October", "Heliopolis & Nasr City"][i % 6],
  province: ["Cairo Governorate", "Giza Governorate"][i % 2],
  country: "Egypt",
  languages: [["Arabic", "English"], ["Arabic", "French"], ["Arabic", "English", "German"]][i % 3],
  avatar: `https://i.pravatar.cc/150?img=${i + 30}`,
}));

export default function FindFranchisePage() {
  return (
    <PeopleSearchTemplate
      title="Find Franchise Owner"
      placeholder="Search by name, coverage area..."
      results={MOCK_FO}
      totalCount={MOCK_FO.length}
      renderCard={(person) => <FranchiseOwnerCard key={person.id} person={person} />}
    />
  );
}
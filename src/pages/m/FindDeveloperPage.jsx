import PeopleSearchTemplate from "@/components/find-people/PeopleSearchTemplate";
import { DeveloperCard } from "@/components/find-people/PersonCard";

const MOCK_DEVS = Array.from({ length: 14 }, (_, i) => ({
  id: String(i + 1),
  username: `developer-${i + 1}`,
  name: ["Palm Hills", "SODIC", "Emaar Misr", "Ora Developers", "Hyde Park", "Mountain View"][i % 6],
  city: ["Cairo", "Giza", "New Cairo", "6th October"][i % 4],
  country: "Egypt",
  rating: (4.3 + (i % 7) * 0.1).toFixed(1),
  projects: 3 + i,
  properties: 50 + i * 30,
  established: 2005 + (i % 15),
  verified: i % 4 !== 3,
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(["Palm Hills", "SODIC", "Emaar Misr", "Ora", "Hyde Park", "Mountain View"][i % 6])}&background=FF6B00&color=fff&size=128`,
}));

export default function FindDeveloperPage() {
  return (
    <PeopleSearchTemplate
      title="Find Developer"
      placeholder="Search by company, city..."
      results={MOCK_DEVS}
      totalCount={MOCK_DEVS.length}
      renderCard={(person) => <DeveloperCard key={person.id} person={person} />}
    />
  );
}
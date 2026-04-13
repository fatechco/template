import { base44 } from "@/api/base44Client";
import ProfilePageBase from "@/components/profiles/ProfilePageBase";

const MOCK = Array.from({ length: 15 }, (_, i) => ({
  id: `agency-${i}`,
  name: ["Coldwell Banker Egypt", "RE/MAX Egypt", "JLL Egypt", "Savills Middle East", "Nawy Real Estate", "Aqarmap Broker", "Century 21 Egypt", "Better Homes", "Engel & Völkers", "Cushman & Wakefield", "CBRE Egypt", "Knight Frank", "Allsopp & Allsopp", "Harbor Real Estate", "Sky Homes"][i],
  city_name: ["New Cairo", "Sheikh Zayed", "Downtown Cairo", "Heliopolis", "5th Settlement", "Maadi", "New Cairo", "Sheikh Zayed", "Downtown", "6th October", "New Cairo", "Maadi", "Sheikh Zayed", "Heliopolis", "New Cairo"][i],
  properties_count: [142, 98, 215, 76, 183, 67, 112, 88, 54, 199, 143, 71, 93, 130, 58][i],
  agents_count: [28, 19, 45, 12, 37, 9, 22, 16, 8, 41, 29, 14, 18, 25, 10][i],
}));

export default function FindAgencies() {
  return (
    <ProfilePageBase
      title="Find Real Estate Agencies"
      subtitle="Browse top real estate agencies and their listings"
      icon="🏢"
      type="agency"
      mockData={MOCK}
      fetchFn={() => base44.entities.User.filter({ role: "agency" }, "-created_date", 100)}
    />
  );
}
import { base44 } from "@/api/base44Client";
import ProfilePageBase from "@/components/profiles/ProfilePageBase";

const MOCK = Array.from({ length: 12 }, (_, i) => ({
  id: `dev-${i}`,
  name: ["Emaar Misr", "Palm Hills Developments", "Ora Developers", "Madinet Masr", "Hyde Park Developments", "Sabbour Consulting", "Mountain View", "Sodic", "Talaat Moustafa", "City Edge", "Dorra Group", "Hassan Allam Properties"][i],
  city_name: ["New Cairo", "Sheikh Zayed", "New Cairo", "New Cairo", "New Cairo", "Sheikh Zayed", "October", "Sheikh Zayed", "New Cairo", "October", "Maadi", "New Cairo"][i],
  projects_count: [12, 9, 7, 15, 6, 11, 8, 14, 20, 5, 9, 13][i],
  properties_count: [5000, 3200, 1800, 4500, 900, 2700, 2200, 3800, 8000, 1100, 2100, 3500][i],
}));

export default function FindDevelopers() {
  return (
    <ProfilePageBase
      title="Find Real Estate Developers"
      subtitle="Discover top developers and their flagship projects"
      icon="🏗️"
      type="developer"
      mockData={MOCK}
      fetchFn={() => base44.entities.User.filter({ role: "developer" }, "-created_date", 100)}
    />
  );
}
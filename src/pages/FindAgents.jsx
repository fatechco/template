import { base44 } from "@/api/base44Client";
import ProfilePageBase from "@/components/profiles/ProfilePageBase";

const MOCK = Array.from({ length: 18 }, (_, i) => ({
  id: `agent-${i}`,
  full_name: ["Ahmed Hassan", "Sara Mohamed", "Omar Khalil", "Nour Adel", "Karim Samir", "Layla Farouk", "Mohamed Ali", "Hana Gamal", "Youssef Nagi", "Dina Sherif", "Tarek Mansour", "Rania Fathy", "Khaled Adel", "Mona Saad", "Amr Helmy", "Yasmine Omar", "Sherif Lotfy", "Nihal Hassan"][i],
  agency_name: ["Coldwell Banker", "RE/MAX", "JLL Egypt", "Nawy", "Savills", null, "Coldwell Banker", "Aqarmap", null, "RE/MAX", "JLL Egypt", null, "Nawy", "Savills", null, "Coldwell Banker", "RE/MAX", "JLL Egypt"][i],
  city_name: ["New Cairo", "Sheikh Zayed", "Maadi", "Heliopolis", "Downtown", "6th October", "New Cairo", "Maadi", "Sheikh Zayed", "Heliopolis", "New Cairo", "Downtown", "Maadi", "6th October", "Sheikh Zayed", "Heliopolis", "New Cairo", "Maadi"][i],
  properties_count: [34, 21, 58, 15, 42, 27, 39, 12, 67, 8, 44, 19, 31, 55, 23, 11, 48, 36][i],
  rating: [4.8, 4.5, 4.9, 4.2, 4.7, 4.4, 4.6, 4.1, 4.8, 4.3, 4.7, 4.5, 4.6, 4.9, 4.2, 4.4, 4.8, 4.3][i],
}));

export default function FindAgents() {
  return (
    <ProfilePageBase
      title="Find Real Estate Agents"
      subtitle="Connect with certified real estate agents across the region"
      icon="🏡"
      type="agent"
      mockData={MOCK}
      fetchFn={() => base44.entities.User.filter({ role: "agent" }, "-created_date", 100)}
    />
  );
}
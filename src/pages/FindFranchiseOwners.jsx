import { base44 } from "@/api/base44Client";
import ProfilePageBase from "@/components/profiles/ProfilePageBase";

const MOCK = Array.from({ length: 12 }, (_, i) => ({
  id: `franchise-${i}`,
  full_name: ["Mohamed Samy", "Hana Kamel", "Tarek Fouad", "Dina Mostafa", "Walid Nour", "Rana Ashraf", "Hesham Farid", "Mona Gamal", "Sherif Abdel", "Nadia Samir", "Amr Tawfik", "Laila Rushdi"][i],
  province_name: ["Cairo", "Giza", "Alexandria", "Cairo", "Giza", "Alexandria", "Cairo", "Giza", "Cairo", "Alexandria", "Cairo", "Giza"][i],
  city_name: ["New Cairo", "Sheikh Zayed", "Smouha", "Heliopolis", "6th October", "Roushdy", "Maadi", "Dokki", "Nasr City", "Sidi Gaber", "Zamalek", "Haram"][i],
  area_covered: ["New Cairo, Mostakbal City", "Sheikh Zayed, 6th October", "Alexandria West", "Heliopolis, Nasr City", "6th October, Hadayek October", "Alexandria East", "Maadi, Tagamoa", "Dokki, Agouza", "Nasr City, Heliopolis", "Alexandria North", "Zamalek, Garden City", "Haram, Giza"][i],
}));

export default function FindFranchiseOwners() {
  return (
    <ProfilePageBase
      title="Find Franchise Owners"
      subtitle="Connect with certified Kemedar franchise partners near you"
      icon="🤝"
      type="franchise"
      mockData={MOCK}
      fetchFn={() => base44.entities.User.filter({ role: "franchise_owner" }, "-created_date", 100)}
    />
  );
}
import LocationsTemplate from "@/components/admin/kemedar/locations/LocationsTemplate";

export default function DistrictsPage() {
  return (
    <LocationsTemplate
      title="Districts"
      columns={["City", "Name (EN)", "Name (AR)", "Areas", "Properties", "Active"]}
      mockData={[
        { id: 1, city: "Cairo", nameEn: "Zamalek", nameAr: "الزمالك", count: 45, active: true },
        { id: 2, city: "Cairo", nameEn: "Nasr City", nameAr: "مدينة نصر", count: 78, active: true },
      ]}
    />
  );
}
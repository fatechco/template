import LocationsTemplate from "@/components/admin/kemedar/locations/LocationsTemplate";

export default function AreasPage() {
  return (
    <LocationsTemplate
      title="Areas"
      columns={["City", "District", "Name (EN)", "Name (AR)", "Properties", "Active"]}
      mockData={[
        { id: 1, city: "Cairo", district: "Zamalek", nameEn: "Island 2000", nameAr: "جزيرة 2000", count: 23, active: true },
        { id: 2, city: "Cairo", district: "Nasr City", nameEn: "First Settlement", nameAr: "التجمع الأول", count: 34, active: true },
      ]}
    />
  );
}
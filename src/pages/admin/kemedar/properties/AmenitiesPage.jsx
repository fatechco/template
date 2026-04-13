import PropertySettingsTemplate from "@/components/admin/kemedar/properties/PropertySettingsTemplate";

export default function AmenitiesPage() {
  return (
    <PropertySettingsTemplate
      title="Amenities"
      columns={["Icon", "Name (EN)", "Name (AR)", "Category", "Count"]}
      mockData={[
        { id: 1, icon: "🏊", nameEn: "Swimming Pool", nameAr: "حمام السباحة", category: "Recreation", count: 234 },
        { id: 2, icon: "🅿️", nameEn: "Parking", nameAr: "موقف سيارات", category: "Facilities", count: 567 },
      ]}
    />
  );
}
import PropertySettingsTemplate from "@/components/admin/kemedar/properties/PropertySettingsTemplate";

export default function DistanceFieldsPage() {
  return (
    <PropertySettingsTemplate
      title="Distance Fields"
      columns={["Name (EN)", "Name (AR)", "Unit", "Sort"]}
      mockData={[
        { id: 1, nameEn: "Near Metro", nameAr: "بالقرب من المترو", unit: "km", sort: 1 },
        { id: 2, nameEn: "Near School", nameAr: "بالقرب من المدرسة", unit: "km", sort: 2 },
        { id: 3, nameEn: "Beach Distance", nameAr: "مسافة الشاطئ", unit: "km", sort: 3 },
      ]}
    />
  );
}
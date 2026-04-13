import PropertySettingsTemplate from "@/components/admin/kemedar/properties/PropertySettingsTemplate";

export default function SuitableForPage() {
  return (
    <PropertySettingsTemplate
      title="Suitable For"
      columns={["Name (EN)", "Name (AR)", "Count"]}
      mockData={[
        { id: 1, nameEn: "Families", nameAr: "العائلات", count: 234 },
        { id: 2, nameEn: "Investors", nameAr: "المستثمرون", count: 156 },
      ]}
    />
  );
}
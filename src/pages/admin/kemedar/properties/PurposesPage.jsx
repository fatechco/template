import PropertySettingsTemplate from "@/components/admin/kemedar/properties/PropertySettingsTemplate";

export default function PurposesPage() {
  return (
    <PropertySettingsTemplate
      title="Purposes"
      columns={["Name (EN)", "Name (AR)", "Slug", "Count"]}
      mockData={[
        { id: 1, nameEn: "Sale", nameAr: "بيع", slug: "sale", count: 456 },
        { id: 2, nameEn: "Rent", nameAr: "إيجار", slug: "rent", count: 789 },
      ]}
    />
  );
}
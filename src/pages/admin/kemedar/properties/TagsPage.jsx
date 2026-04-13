import PropertySettingsTemplate from "@/components/admin/kemedar/properties/PropertySettingsTemplate";

export default function TagsPage() {
  return (
    <PropertySettingsTemplate
      title="Tags"
      columns={["Name", "Usage Count"]}
      mockData={[
        { id: 1, nameEn: "Luxury", count: 145 },
        { id: 2, nameEn: "Budget", count: 234 },
        { id: 3, nameEn: "Modern", count: 189 },
      ]}
    />
  );
}
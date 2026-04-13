import PropertySettingsTemplate from "@/components/admin/kemedar/properties/PropertySettingsTemplate";

export default function CategoriesPage() {
  return (
    <PropertySettingsTemplate
      title="Categories"
      columns={["Icon", "Name (EN)", "Name (AR)", "Slug", "Count", "Status"]}
      mockData={[
        { id: 1, icon: "🏠", nameEn: "Villa", nameAr: "فيلا", slug: "villa", count: 234, active: true },
        { id: 2, icon: "🏢", nameEn: "Apartment", nameAr: "شقة", slug: "apartment", count: 567, active: true },
        { id: 3, icon: "🏬", nameEn: "Office", nameAr: "مكتب", slug: "office", count: 89, active: true },
      ]}
    />
  );
}
import LocationsTemplate from "@/components/admin/kemedar/locations/LocationsTemplate";

export default function ProvincesPage() {
  return (
    <LocationsTemplate
      title="Provinces"
      columns={["Country", "Name (EN)", "Name (AR)", "Cities", "Properties", "Active"]}
      mockData={[
        { id: 1, country: "🇪🇬 Egypt", nameEn: "Cairo", nameAr: "القاهرة", count: 234, active: true },
        { id: 2, country: "🇪🇬 Egypt", nameEn: "Giza", nameAr: "الجيزة", count: 156, active: true },
      ]}
    />
  );
}
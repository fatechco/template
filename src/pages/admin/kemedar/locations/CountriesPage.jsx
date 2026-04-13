import LocationsTemplate from "@/components/admin/kemedar/locations/LocationsTemplate";

export default function CountriesPage() {
  return (
    <LocationsTemplate
      title="Countries"
      columns={["Flag", "Name (EN)", "Name (AR)", "Code", "Dial Code", "Provinces", "Cities", "Properties", "Active"]}
      mockData={[
        { id: 1, flag: "🇪🇬", nameEn: "Egypt", nameAr: "مصر", code: "EG", dialCode: "+20", count: 234, active: true },
        { id: 2, flag: "🇸🇦", nameEn: "Saudi Arabia", nameAr: "السعودية", code: "SA", dialCode: "+966", count: 156, active: true },
        { id: 3, flag: "🇦🇪", nameEn: "UAE", nameAr: "الإمارات", code: "AE", dialCode: "+971", count: 89, active: true },
      ]}
    />
  );
}
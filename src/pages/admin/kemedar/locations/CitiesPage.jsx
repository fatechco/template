import LocationsTemplate from "@/components/admin/kemedar/locations/LocationsTemplate";

export default function CitiesPage() {
  return (
    <LocationsTemplate
      title="Cities"
      columns={["Country", "Province", "Name (EN)", "Name (AR)", "Lat", "Lng", "Districts", "Properties", "Active"]}
      mockData={[
        { id: 1, country: "Egypt", province: "Cairo", nameEn: "Downtown", nameAr: "وسط البلد", lat: "30.0444", lng: "31.2357", count: 234, active: true },
        { id: 2, country: "Egypt", province: "Giza", nameEn: "6th October", nameAr: "السادس من أكتوبر", lat: "29.9669", lng: "30.8350", count: 156, active: true },
      ]}
    />
  );
}
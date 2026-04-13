export default function PropertyDetailsTable({ property }) {
  const rows = [
    ["Category", property.category_name || "—"],
    ["Purpose", property.purpose || "—"],
    ["Status", property.status_name || "—"],
    ["Furnished", property.furnished_name || "—"],
    ["Total Area", property.area_size ? `${property.area_size} m²` : "—"],
    ["Bedrooms", property.beds ?? "—"],
    ["Bathrooms", property.baths ?? "—"],
    ["Floor Number", property.floor_number ?? "—"],
    ["Total Floors", property.total_floors ?? "—"],
    ["Year Built", property.year_built ?? "—"],
    ["Reference ID", property.property_code || property.id?.slice(0, 8) || "—"],
    ["Delivery Date", property.delivery_date || "—"],
  ];

  const half = Math.ceil(rows.length / 2);
  const left = rows.slice(0, half);
  const right = rows.slice(half);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#FF6B00] rounded-full" />
        Property Details
      </h3>
      <div className="grid grid-cols-2 gap-x-8">
        {[left, right].map((col, ci) => (
          <div key={ci} className="divide-y divide-gray-100">
            {col.map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-500 font-medium">{label}</span>
                <span className="text-gray-900 font-bold text-right">{String(value)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
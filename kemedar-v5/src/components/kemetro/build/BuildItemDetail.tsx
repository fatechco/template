// @ts-nocheck
const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function BuildItemDetail({ item, scenario, onClose }) {
  const cost = item.totalCost?.[scenario] || item.totalCostRecommended || 0;
  const unitCost = item.unitCost?.[scenario] || item.unitCostRecommended || 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-black text-gray-900 text-base">{item.itemName}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{item.itemNameAr}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-lg">✕</button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {item.itemDescription && <p className="text-sm text-gray-600 leading-relaxed">{item.itemDescription}</p>}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Net Quantity", value: `${item.netQuantity} ${item.unit}` },
              { label: "Order Quantity", value: `${item.orderQuantity || item.netQuantity} ${item.unit}` },
              { label: "Waste Factor", value: `+${item.wastePercent || 0}%` },
              { label: "Unit Cost", value: `${fmt(unitCost)} EGP` },
              { label: "Total Cost", value: `${fmt(cost)} EGP`, highlight: true },
              { label: "Coverage", value: item.coveragePerUnit ? `${item.coveragePerUnit} m²/unit` : "—" },
            ].map(row => (
              <div key={row.label} className={`rounded-xl p-3 ${row.highlight ? "bg-teal-50" : "bg-gray-50"}`}>
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className={`font-black text-sm mt-0.5 ${row.highlight ? "text-teal-600" : "text-gray-900"}`}>{row.value}</p>
              </div>
            ))}
          </div>
          {item.searchKeyword && (
            <a href={`/kemetro/search?q=${encodeURIComponent(item.searchKeyword)}`} target="_blank" rel="noopener noreferrer" className="block w-full bg-teal-500 hover:bg-teal-400 text-white font-black py-3 rounded-xl text-sm text-center transition-colors">
              🔍 Find on Kemetro
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
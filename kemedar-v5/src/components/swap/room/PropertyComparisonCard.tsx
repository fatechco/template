// @ts-nocheck
export default function PropertyComparisonCard({ match, isUserA }) {
  const props = [
    {
      label: isUserA ? "Your Property (A)" : "Their Property (A)",
      propertyId: match.propertyAId,
      valueEGP: match.propertyAValueEGP,
      side: "a",
    },
    {
      label: isUserA ? "Their Property (B)" : "Your Property (B)",
      propertyId: match.propertyBId,
      valueEGP: match.propertyBValueEGP,
      side: "b",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-[#7C3AED] rounded-full" />
        Property Comparison
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {props.map(p => (
          <div key={p.side} className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{p.label}</p>
            <div className="w-full h-28 bg-gray-200 rounded-xl mb-2 flex items-center justify-center text-3xl overflow-hidden">
              🏠
            </div>
            <p className="text-xs font-bold text-gray-800 line-clamp-1">Property #{p.propertyId?.slice(0,8)}</p>
            {p.valueEGP && (
              <p className="text-[11px] text-[#7C3AED] font-bold mt-0.5">{Number(p.valueEGP).toLocaleString()} EGP</p>
            )}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-full">Verified</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full border border-gray-200 text-gray-700 font-bold text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        📅 Schedule a Viewing
      </button>
    </div>
  );
}
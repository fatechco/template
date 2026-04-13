import { useState, useRef } from "react";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=80&q=60";

export default function ProductPreview({ items, kitTitle }) {
  const [expanded, setExpanded] = useState(false);
  const bottomRef = useRef(null);
  const preview = items.slice(0, 6);
  const rest = items.slice(6);

  const handleSeeAll = () => {
    setExpanded(true);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6" ref={bottomRef}>
      <h3 className="font-black text-gray-900 text-base mb-4">
        What's in this kit ({items.length} products)
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-3">
        {(expanded ? items : preview).map(item => (
          <div key={item.id} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
              <img
                src={item.productImageUrl || FALLBACK_IMG}
                alt={item.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] text-gray-600 text-center line-clamp-2 leading-tight">
              {item.productName}
            </p>
          </div>
        ))}
      </div>

      {!expanded && rest.length > 0 && (
        <button onClick={handleSeeAll} className="text-blue-600 text-sm font-bold hover:underline">
          See all {items.length} products ↓
        </button>
      )}
    </div>
  );
}
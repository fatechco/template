import { useState } from "react";
import { ChevronDown } from "lucide-react";
import KemetroCartItem from "./KemetroCartItem.jsx";

export default function KemetroCartStoreGroup({
  storeName,
  items,
  onRemoveItem,
  onQuantityChange,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            size={20}
            className={`text-gray-600 transition-transform ${
              isOpen ? "rotate-0" : "-rotate-90"
            }`}
          />
          <span className="font-bold text-gray-900">Items from {storeName}</span>
        </div>
        <span className="text-sm font-semibold text-gray-600">
          Subtotal: ${subtotal.toFixed(2)}
        </span>
      </button>

      {/* Items */}
      {isOpen && (
        <div className="px-6">
          {items.map((item) => (
            <KemetroCartItem
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
              onQuantityChange={onQuantityChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
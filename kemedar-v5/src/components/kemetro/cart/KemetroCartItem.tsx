"use client";
// @ts-nocheck
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function KemetroCartItem({ item, onRemove, onQuantityChange }) {
  const [isSaved, setIsSaved] = useState(false);

  const lineTotal = (item.salePrice || item.price) * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b pb-4 last:border-0">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.thumbnailImage}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
        {item.variant && (
          <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
        )}
        <a
          href={`/kemetro/store/${item.storeId}`}
          className="text-xs text-blue-600 hover:underline mt-1"
        >
          {item.storeName}
        </a>
      </div>

      {/* Unit Price */}
      <div className="text-right min-w-fit">
        <p className="text-xs text-gray-500 mb-1">Unit Price</p>
        <p className="font-bold text-gray-900">
          ${item.salePrice || item.price}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1">
        <button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          className="text-gray-600 hover:text-gray-900 font-bold"
        >
          −
        </button>
        <span className="px-2 font-bold text-gray-900 min-w-8 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          className="text-gray-600 hover:text-gray-900 font-bold"
        >
          +
        </button>
      </div>

      {/* Line Total */}
      <div className="text-right min-w-fit">
        <p className="text-sm font-black text-gray-900">${lineTotal.toFixed(2)}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="text-xs text-blue-600 hover:underline"
        >
          {isSaved ? "Saved" : "Save"}
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
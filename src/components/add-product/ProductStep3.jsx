import { Minus, Plus } from "lucide-react";
import AIPriceWidget from "@/components/ai/AIPriceWidget";

const PRICE_UNITS = [
  { id: "per_piece", label: "Per Piece" },
  { id: "per_meter", label: "Per Meter" },
  { id: "per_sqm", label: "Per SqM" },
  { id: "per_kg", label: "Per KG" },
  { id: "per_ton", label: "Per Ton" },
  { id: "per_box", label: "Per Box" },
  { id: "per_roll", label: "Per Roll" },
  { id: "per_set", label: "Per Set" },
];
const CURRENCIES = ["USD", "EGP", "AED", "SAR", "EUR"];

export default function ProductStep3({ form, update }) {
  return (
    <div className="space-y-5">
      <p className="font-black text-gray-900 text-base">Pricing & Inventory</p>

      {/* AI Price Suggestion */}
      <AIPriceWidget
        formType="product"
        formData={form}
        onPriceSelected={(price) => update({ price: String(price) })}
        requiredFields={["category_id"]}
      />

      {/* Price */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Price <span className="text-red-500">*</span></label>
        <div className="flex gap-2">
          <select
            value={form.currency_id}
            onChange={(e) => update({ currency_id: e.target.value })}
            className="border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white w-24"
          >
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input
            type="number"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => update({ price: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-lg font-bold focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Price unit chips */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Price Unit</label>
        <div className="grid grid-cols-4 gap-2">
          {PRICE_UNITS.map((u) => (
            <button
              key={u.id}
              onClick={() => update({ price_unit: u.id })}
              className={`py-2 px-1 rounded-xl border-2 text-xs font-bold transition-all ${
                form.price_unit === u.id
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sale price toggle */}
      <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
        <div>
          <p className="text-sm font-bold text-gray-800">Sale Price</p>
          <p className="text-xs text-gray-400">Add a discounted sale price</p>
        </div>
        <button
          onClick={() => update({ has_sale: !form.has_sale })}
          className={`w-12 h-6 rounded-full transition-colors relative ${form.has_sale ? "bg-orange-600" : "bg-gray-200"}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.has_sale ? "left-7" : "left-1"}`} />
        </button>
      </div>
      {form.has_sale && (
        <input
          type="number"
          placeholder="Sale price"
          value={form.sale_price}
          onChange={(e) => update({ sale_price: e.target.value })}
          className="w-full border border-orange-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 bg-orange-50"
        />
      )}

      {/* Min order qty */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Minimum Order Quantity</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => update({ min_order_qty: Math.max(1, form.min_order_qty - 1) })}
            className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center"
          >
            <Minus size={16} />
          </button>
          <span className="text-xl font-black w-12 text-center">{form.min_order_qty}</span>
          <button
            onClick={() => update({ min_order_qty: form.min_order_qty + 1 })}
            className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center"
          >
            <Plus size={16} color="white" />
          </button>
        </div>
      </div>

      {/* Stock */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Stock Quantity</label>
          <input
            type="number"
            placeholder="Available stock"
            value={form.stock_qty}
            onChange={(e) => update({ stock_qty: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Low Stock Alert</label>
          <input
            type="number"
            placeholder="e.g. 5"
            value={form.low_stock_alert}
            onChange={(e) => update({ low_stock_alert: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, Tag } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const MOCK_CART = [
  {
    storeId: 1, storeName: "HomeStyle Store", storeLogo: "🏠",
    items: [
      { id: 1, name: "LED Desk Lamp - Modern Design", variant: "Color: White | Size: Standard", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&q=70", price: 45, originalPrice: 65, qty: 2, minOrder: 1, salePercent: 31, unit: "per piece" },
      { id: 2, name: "Ergonomic Office Chair with Lumbar Support", variant: "Color: Black | Model: Pro", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=200&q=70", price: 120, originalPrice: 150, qty: 1, minOrder: 1, salePercent: 20, unit: "per piece" },
    ]
  },
  {
    storeId: 2, storeName: "DecorPlus", storeLogo: "🪴",
    items: [
      { id: 3, name: "Ceramic Wall Mirror with Gold Frame 60×60", variant: "Size: 60×60 cm | Finish: Gold", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=70", price: 75, originalPrice: 75, qty: 2, minOrder: 1, salePercent: 0, unit: "per piece" },
    ]
  }
];

function QuantityStepper({ qty, onInc, onDec, min }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onDec} disabled={qty <= min}
        className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 disabled:opacity-40">
        <Minus size={12} />
      </button>
      <span className="w-8 text-center text-sm font-bold text-gray-900">{qty}</span>
      <button onClick={onInc}
        className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600">
        <Plus size={12} />
      </button>
    </div>
  );
}

function CartItem({ item, storeName, onQtyChange, onRemove }) {
  return (
    <div className="bg-white px-4 py-3 flex gap-3">
      {/* Image */}
      <div className="relative flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
        {item.salePercent > 0 && (
          <span className="absolute top-1 left-1 text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            -{item.salePercent}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-gray-900 line-clamp-2 leading-snug mb-0.5">{item.name}</p>
        <p className="text-[11px] text-gray-400 mb-0.5">{item.variant}</p>
        <p className="text-[11px] text-blue-500 mb-2">{storeName}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span className="text-[15px] font-black text-orange-600">${item.price}</span>
          {item.originalPrice > item.price && (
            <span className="text-[12px] text-gray-400 line-through">${item.originalPrice}</span>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mb-2">{item.unit}</p>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <QuantityStepper qty={item.qty} min={item.minOrder}
            onInc={() => onQtyChange(item.id, item.qty + 1)}
            onDec={() => onQtyChange(item.id, item.qty - 1)} />

          <div className="flex items-center gap-3">
            <span className="text-[13px] font-black text-gray-900">
              ${(item.price * item.qty).toFixed(2)}
            </span>
            <button onClick={() => onRemove(item.id)} className="p-1">
              <Trash2 size={15} className="text-gray-400" />
            </button>
          </div>
        </div>
        {item.minOrder > 1 && (
          <p className="text-[10px] text-red-500 font-bold mt-1">Min: {item.minOrder} pieces</p>
        )}
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, coupon, onCoupon, onCheckout, onContinue }) {
  const [code, setCode] = useState("");
  const shipping = subtotal > 200 ? 0 : 15;
  const discount = coupon ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  return (
    <div className="bg-white border-t border-gray-100 px-4 pt-4 pb-6 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      {/* Summary rows */}
      <div className="space-y-2 mb-3">
        {[
          ["Subtotal", `$${subtotal.toFixed(2)}`],
          ["Shipping", shipping === 0 ? "Free 🎉" : `$${shipping.toFixed(2)}`],
          ...(coupon ? [["Discount", `-$${discount.toFixed(2)}`]] : []),
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm">
            <span className="text-gray-500">{k}</span>
            <span className={k === "Discount" ? "text-green-600 font-bold" : "text-gray-900"}>{v}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <span className="font-black text-gray-900 text-base">Total</span>
          <span className="font-black text-orange-600 text-base">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <Tag size={14} className="text-gray-400" />
          <input value={code} onChange={e => setCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 text-sm bg-transparent outline-none" />
        </div>
        <button onClick={() => onCoupon(code)}
          className="px-4 bg-gray-900 text-white text-sm font-bold rounded-xl">Apply</button>
      </div>

      <button onClick={onCheckout}
        className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl text-base mb-2">
        Proceed to Checkout →
      </button>
      <button onClick={onContinue} className="w-full text-sm text-gray-500 font-bold py-2 text-center">
        Continue Shopping
      </button>

      {/* Trust badges */}
      <div className="flex justify-center gap-4 mt-3">
        {["🔒 Secure", "🚚 Fast Delivery", "🔄 Returns"].map(b => (
          <span key={b} className="text-[11px] text-gray-400 font-semibold">{b}</span>
        ))}
      </div>
    </div>
  );
}

function EmptyCart({ navigate }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-4xl">🛒</span>
      </div>
      <p className="font-black text-gray-800 text-lg mb-1">Your cart is empty</p>
      <p className="text-sm text-gray-500 mb-6">Browse products and add items to your cart</p>
      <button onClick={() => navigate("/m/find/product")}
        className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm">
        Browse Products
      </button>
    </div>
  );
}

export default function KemetroCartPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState(MOCK_CART);
  const [coupon, setCoupon] = useState(false);

  const allItems = stores.flatMap(s => s.items);
  const subtotal = allItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const updateQty = (itemId, newQty) => {
    setStores(prev => prev.map(store => ({
      ...store,
      items: store.items.map(item => item.id === itemId ? { ...item, qty: Math.max(item.minOrder, newQty) } : item)
    })));
  };

  const removeItem = (itemId) => {
    setStores(prev => prev.map(store => ({
      ...store,
      items: store.items.filter(item => item.id !== itemId)
    })).filter(store => store.items.length > 0));
  };

  const clearAll = () => setStores([]);

  return (
    <div className="min-h-screen bg-gray-50 max-w-[480px] mx-auto">
      <MobileTopBar title="My Cart" showBack
        rightAction={
          allItems.length > 0 && (
            <button onClick={clearAll} className="p-1"><Trash2 size={18} className="text-red-500" /></button>
          )
        } />

      {allItems.length === 0 ? (
        <EmptyCart navigate={navigate} />
      ) : (
        <div className="pb-64">
          {stores.map(store => (
            <div key={store.storeId} className="mb-3">
              {/* Store header */}
              <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2">
                <span className="text-lg">{store.storeLogo}</span>
                <div>
                  <p className="text-[13px] font-black text-gray-900">{store.storeName}</p>
                  <p className="text-[11px] text-gray-500">{store.items.length} item{store.items.length > 1 ? "s" : ""} from this store</p>
                </div>
              </div>
              {/* Items */}
              <div className="bg-white divide-y divide-gray-50">
                {store.items.map(item => (
                  <CartItem key={item.id} item={item} storeName={store.storeName}
                    onQtyChange={updateQty} onRemove={removeItem} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {allItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-30">
          <OrderSummary subtotal={subtotal} coupon={coupon}
            onCoupon={(code) => setCoupon(code === "SAVE10")}
            onCheckout={() => navigate("/m/kemetro/checkout")}
            onContinue={() => navigate("/m/find/product")} />
        </div>
      )}
      <MobileBottomNav />
    </div>
  );
}
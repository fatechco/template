import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";
import KemetroCartStoreGroup from "@/components/kemetro/cart/KemetroCartStoreGroup";
import KemetroCartSummary from "@/components/kemetro/cart/KemetroCartSummary";

const MOCK_CART_ITEMS = [
  {
    id: "1",
    name: "Premium Cement 50kg Bag",
    price: 8.75,
    salePrice: 7.50,
    quantity: 2,
    variant: "Standard",
    storeId: "store-1",
    storeName: "BuildRight Materials",
    thumbnailImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80",
  },
  {
    id: "2",
    name: "Steel Reinforcement Rod 10mm",
    price: 450,
    salePrice: 420,
    quantity: 1,
    variant: "10mm Diameter",
    storeId: "store-3",
    storeName: "Steel Direct",
    thumbnailImage: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&q=80",
  },
  {
    id: "3",
    name: "Premium Wall Paint 20L",
    price: 59.5,
    salePrice: 49.99,
    quantity: 3,
    variant: "Matt Finish",
    storeId: "store-1",
    storeName: "BuildRight Materials",
    thumbnailImage: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&q=80",
  },
  {
    id: "4",
    name: "Ceramic Floor Tiles 60x60",
    price: 31.5,
    salePrice: 28.50,
    quantity: 5,
    variant: "Glossy White",
    storeId: "store-2",
    storeName: "Tile Experts Co.",
    thumbnailImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
  },
];

export default function KemetroCart() {
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

  useEffect(() => {
    base44.auth.me().catch(() => {});
  }, []);

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const groupedByStore = cartItems.reduce((acc, item) => {
    const existing = acc.find((g) => g.storeId === item.storeId);
    if (existing) {
      existing.items.push(item);
    } else {
      acc.push({ storeId: item.storeId, storeName: item.storeName, items: [item] });
    }
    return acc;
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <KemetroHeader />
        <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add items to get started shopping</p>
          <a href="/kemetro" className="inline-block bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black px-8 py-3 rounded-lg transition-colors">
            Continue Shopping
          </a>
        </div>
        <KemetroFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {groupedByStore.map((group) => (
              <KemetroCartStoreGroup
                key={group.storeId}
                storeName={group.storeName}
                items={group.items}
                onRemoveItem={removeItem}
                onQuantityChange={updateQuantity}
              />
            ))}
          </div>
          <div>
            <KemetroCartSummary subtotal={subtotal} shipping={0} discount={0} />
          </div>
        </div>
      </div>
      <KemetroFooter />
    </div>
  );
}
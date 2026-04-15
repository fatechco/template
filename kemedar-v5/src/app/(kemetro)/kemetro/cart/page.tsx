"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

interface CartItem { id: string; title: string; price: number; quantity: number; image?: string; seller: string }

const MOCK_ITEMS: CartItem[] = [
  { id: "1", title: "Italian Marble Tile (60x60cm)", price: 450, quantity: 2, seller: "Cairo Tiles Co." },
  { id: "2", title: "Smart Door Lock - Fingerprint", price: 2800, quantity: 1, seller: "SmartHome EG" },
  { id: "3", title: "LED Ceiling Light Panel", price: 680, quantity: 3, seller: "LightHouse Store" },
];

export default function KemetroCartPage() {
  const [items, setItems] = useState<CartItem[]>(MOCK_ITEMS);

  const updateQty = (id: string, delta: number) =>
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (!items.length) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="bg-white border rounded-xl p-12 text-center">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
          <p className="text-slate-500 mb-4">Browse products and add items to your cart</p>
          <Link href="/kemetro/search" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs shrink-0">IMG</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.seller}</p>
                <p className="text-green-700 font-bold mt-1">{item.price.toLocaleString()} EGP</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 border rounded flex items-center justify-center hover:bg-slate-50"><Minus className="w-3 h-3" /></button>
                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 border rounded flex items-center justify-center hover:bg-slate-50"><Plus className="w-3 h-3" /></button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <div className="bg-white border rounded-xl p-5 h-fit sticky top-20">
          <h2 className="font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{subtotal.toLocaleString()} EGP</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className="text-green-600">Free</span></div>
            <div className="border-t pt-2 flex justify-between font-bold text-base"><span>Total</span><span>{subtotal.toLocaleString()} EGP</span></div>
          </div>
          <Link href="/kemetro/checkout" className="block text-center w-full bg-green-600 text-white py-2.5 rounded-lg font-medium mt-4 hover:bg-green-700">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

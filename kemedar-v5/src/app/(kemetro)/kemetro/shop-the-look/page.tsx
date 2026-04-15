"use client";

import { useState } from "react";
import Link from "next/link";
import { Palette, Eye, ShoppingCart, X } from "lucide-react";

interface Hotspot { id: string; x: number; y: number; product: { name: string; price: number; slug: string } }
interface LookImage { id: string; title: string; hotspots: Hotspot[] }

const LOOKS: LookImage[] = [
  {
    id: "1", title: "Modern Living Room",
    hotspots: [
      { id: "h1", x: 30, y: 40, product: { name: "Italian Marble Tile", price: 450, slug: "marble-tile" } },
      { id: "h2", x: 65, y: 25, product: { name: "LED Ceiling Light", price: 680, slug: "led-light" } },
      { id: "h3", x: 50, y: 70, product: { name: "Oak Wood Flooring", price: 320, slug: "oak-flooring" } },
    ],
  },
  {
    id: "2", title: "Luxury Kitchen",
    hotspots: [
      { id: "h4", x: 40, y: 35, product: { name: "Granite Countertop", price: 1200, slug: "granite" } },
      { id: "h5", x: 70, y: 60, product: { name: "Cabinet Hardware Set", price: 250, slug: "hardware" } },
    ],
  },
  {
    id: "3", title: "Master Bathroom",
    hotspots: [
      { id: "h6", x: 50, y: 50, product: { name: "Rain Shower Head", price: 890, slug: "shower" } },
    ],
  },
];

export default function ShopTheLookPage() {
  const [selected, setSelected] = useState<LookImage | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="text-center mb-8">
        <Palette className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Shop the Look</h1>
        <p className="text-slate-500 mt-2">See a property photo you love? Click hotspots to buy the exact materials</p>
      </div>

      {!selected ? (
        <div className="grid md:grid-cols-3 gap-4">
          {LOOKS.map((look) => (
            <button key={look.id} onClick={() => setSelected(look)} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition text-left">
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Eye className="w-8 h-8 text-slate-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{look.title}</h3>
                <p className="text-sm text-slate-500">{look.hotspots.length} products tagged</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => { setSelected(null); setActiveHotspot(null); }} className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Back to gallery</button>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white border rounded-xl overflow-hidden relative">
              <div className="h-80 bg-gradient-to-br from-slate-100 to-slate-200 relative">
                {selected.hotspots.map((h) => (
                  <button key={h.id} onClick={() => setActiveHotspot(h)} style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white shadow-md animate-pulse ${activeHotspot?.id === h.id ? "bg-purple-600" : "bg-green-500"}`}
                  />
                ))}
              </div>
              <div className="p-4">
                <h2 className="font-bold text-lg">{selected.title}</h2>
                <p className="text-sm text-slate-500">Click on hotspots to see products</p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold">Tagged Products</h3>
              {selected.hotspots.map((h) => (
                <div key={h.id} className={`bg-white border rounded-xl p-4 cursor-pointer transition ${activeHotspot?.id === h.id ? "border-purple-400 shadow-sm" : "hover:border-slate-300"}`}
                  onClick={() => setActiveHotspot(h)}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs shrink-0">IMG</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{h.product.name}</h4>
                      <p className="text-green-700 font-bold text-sm">{h.product.price.toLocaleString()} EGP</p>
                    </div>
                    <Link href={`/kemetro/product/${h.product.slug}`} className="text-green-600 hover:text-green-700">
                      <ShoppingCart className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

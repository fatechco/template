"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Search, Plus, Trash2, GripVertical, Settings2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ROLE_OPTIONS = [
  { value: "primary_floor_tile", label: "Primary Floor Tile" },
  { value: "accent_floor_tile", label: "Accent Floor Tile" },
  { value: "primary_wall_tile", label: "Primary Wall Tile" },
  { value: "accent_wall_tile", label: "Accent Wall Tile" },
  { value: "paint_wall", label: "Wall Paint" },
  { value: "paint_ceiling", label: "Ceiling Paint" },
  { value: "waterproofing", label: "Waterproofing" },
  { value: "adhesive", label: "Tile Adhesive" },
  { value: "grout", label: "Grout" },
  { value: "skirting_baseboard", label: "Skirting/Baseboard" },
  { value: "fixture_toilet", label: "Fixture — Toilet" },
  { value: "fixture_sink", label: "Fixture — Sink" },
  { value: "fixture_bathtub", label: "Fixture — Bathtub" },
  { value: "fixture_shower", label: "Fixture — Shower" },
  { value: "fixture_vanity", label: "Fixture — Vanity" },
  { value: "fixture_mirror", label: "Fixture — Mirror" },
  { value: "fixture_lighting", label: "Fixture — Lighting" },
  { value: "consumable", label: "Consumable" },
  { value: "decor_optional", label: "Optional Decor" },
];

export default function Step2Materials({ items, onChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await apiClient.list("/api/v1/kemetroproduct", 
        { is_active: true },
        "-created_date",
        20
      ).catch(() => []);
      const filtered = results.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 15));
      setSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addProduct = (product) => {
    if (items.find(i => i.productId === product.id)) return;
    const newItem = {
      id: `temp_${Date.now()}`,
      productId: product.id,
      productName: product.title || product.name,
      productImageUrl: product.images?.[0] || product.featured_image || "",
      productPriceEGP: product.price || product.priceEGP || 0,
      role: "",
      calculationRule: "",
      coveragePerUnit: null,
      wasteMarginPercent: 10,
      fixedQuantity: null,
      isOptional: false,
      displayOrder: items.length,
      stockQty: product.stock_quantity || 0,
    };
    setJustAdded(product.id);
    onChange([...items, newItem]);
    setTimeout(() => setJustAdded(null), 800);
  };

  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));

  const updateItem = (idx, key, val) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange(updated);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = [...items];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onChange(reordered.map((item, i) => ({ ...item, displayOrder: i })));
  };

  return (
    <div className="flex gap-5" style={{ minHeight: 500 }}>
      {/* LEFT: Search */}
      <div className="w-5/12 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900 text-sm mb-3">🔍 Search Kemetro Catalog</h3>
            <p className="text-xs text-gray-400 mb-3">Find products to include in your design</p>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tiles, paint, fixtures..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {searching && (
              <div className="py-8 text-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            )}
            {!searching && searchResults.length === 0 && searchQuery && (
              <p className="text-center text-gray-400 text-sm py-8">No products found</p>
            )}
            {!searching && searchResults.length === 0 && !searchQuery && (
              <p className="text-center text-gray-400 text-sm py-8">Search for products above</p>
            )}
            {searchResults.map(product => {
              const already = items.find(i => i.productId === product.id);
              return (
                <div key={product.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${already ? "border-green-200 bg-green-50" : "border-gray-100 hover:border-blue-200 hover:bg-blue-50"}`}>
                  <img
                    src={product.images?.[0] || product.featured_image || "https://images.unsplash.com/photo-1585770536735-27993a252541?w=80&q=60"}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 leading-tight truncate">{product.title || product.name}</p>
                    <p className="text-xs text-blue-600 font-bold mt-0.5">{(product.price || product.priceEGP || 0).toLocaleString()} EGP</p>
                    <p className={`text-[10px] font-bold mt-0.5 ${(product.stock_quantity || 0) > 10 ? "text-green-600" : "text-orange-500"}`}>
                      {(product.stock_quantity || 0) > 10 ? "✓ In Stock" : "⚠️ Low Stock"}
                    </p>
                  </div>
                  <button
                    onClick={() => addProduct(product)}
                    disabled={!!already}
                    className={`text-xs font-bold px-3 py-2 rounded-lg transition-all flex-shrink-0 ${
                      already
                        ? "bg-green-100 text-green-600 cursor-default"
                        : justAdded === product.id
                        ? "bg-blue-600 text-white scale-95"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {already ? "✓ Added" : <><Plus size={12} className="inline" /> Add</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Kit Products */}
      <div className="flex-1">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900 text-sm">🎨 Kit Products ({items.length} items)</h3>
            <p className="text-xs text-gray-400 mt-0.5">Drag to reorder</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {items.length === 0 ? (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-blue-200 rounded-2xl m-2">
                <div className="text-center p-8">
                  <div className="text-4xl mb-3">📦</div>
                  <p className="text-gray-500 text-sm font-medium">Search for products on the left</p>
                  <p className="text-gray-400 text-xs mt-1">and add them to your kit →</p>
                </div>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="kit-items">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                      {items.map((item, idx) => (
                        <Draggable key={item.id} draggableId={String(item.id)} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                snapshot.isDragging ? "border-blue-300 bg-blue-50 shadow-lg" : "border-gray-100 bg-white"
                              }`}
                            >
                              <div {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab flex-shrink-0">
                                <GripVertical size={16} />
                              </div>
                              <img
                                src={item.productImageUrl || "https://images.unsplash.com/photo-1585770536735-27993a252541?w=80&q=60"}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{item.productName}</p>
                                <select
                                  value={item.role}
                                  onChange={e => updateItem(idx, "role", e.target.value)}
                                  className="mt-1 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400 w-full"
                                >
                                  <option value="">Select role...</option>
                                  {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                </select>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.calculationRule ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                  {item.calculationRule ? "✅ Rules set" : "⚠️ Needs rules"}
                                </span>
                                <button onClick={() => removeItem(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
          {items.length > 0 && items.length < 3 && (
            <div className="px-4 pb-3">
              <p className="text-xs text-orange-500 font-bold bg-orange-50 rounded-xl px-3 py-2">
                ⚠️ Add at least {3 - items.length} more product{3 - items.length !== 1 ? "s" : ""} to continue
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
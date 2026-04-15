"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function LocationAutocomplete({ value, onChange, placeholder = "Search by location...", className = "" }) {
  const [input, setInput] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setInput(value || "");
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input.trim()) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const [cities, districts, areas] = await Promise.all([
          apiClient.list("/api/v1/city", {}, "-name", 100),
          apiClient.list("/api/v1/district", {}, "-name", 100),
          apiClient.list("/api/v1/area", {}, "-name", 100),
        ]);
        const q = input.toLowerCase();
        const results = [
          ...cities.filter(c => c.name?.toLowerCase().includes(q)).map(c => ({ name: c.name, type: "City" })),
          ...districts.filter(d => d.name?.toLowerCase().includes(q)).map(d => ({ name: d.name, type: "District" })),
          ...areas.filter(a => a.name?.toLowerCase().includes(q)).map(a => ({ name: a.name, type: "Area" })),
        ].slice(0, 8);
        setSuggestions(results);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, [input]);

  const select = (name) => {
    setInput(name);
    onChange(name);
    setSuggestions([]);
    setOpen(false);
  };

  const clear = () => {
    setInput("");
    onChange("");
    setSuggestions([]);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
        <MapPin size={15} className="text-gray-400 flex-shrink-0" />
        <input
          value={input}
          onChange={e => { setInput(e.target.value); if (!e.target.value) onChange(""); }}
          onFocus={() => { if (suggestions.length) setOpen(true); }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400"
        />
        {input && (
          <button onClick={clear} className="text-gray-300 hover:text-gray-500 text-xs">✕</button>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-52 overflow-y-auto">
          {suggestions.map((loc, i) => (
            <button
              key={i}
              onMouseDown={() => select(loc.name)}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-2"
            >
              <MapPin size={13} className="text-gray-300 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-900 font-medium">{loc.name}</p>
                <p className="text-[10px] text-gray-400">{loc.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
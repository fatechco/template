"use client";
// @ts-nocheck
import { useState } from "react";
import { List, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MOCK_PINS = [
  { id: "1", lat: 30.0444, lng: 31.2357, title: "Luxury Apartment", price: "EGP 2.5M", beds: 3, city: "New Cairo" },
  { id: "2", lat: 30.0600, lng: 31.2200, title: "Modern Villa", price: "EGP 12M", beds: 5, city: "Sheikh Zayed" },
  { id: "3", lat: 30.0300, lng: 31.2500, title: "Studio", price: "EGP 8K/mo", beds: 1, city: "Maadi" },
  { id: "4", lat: 30.0550, lng: 31.2450, title: "Penthouse", price: "EGP 5M", beds: 4, city: "Cairo" },
];

export default function PropertyMapView({ onBack, onPropertyClick }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="fixed inset-0 z-50 bg-gray-100">
      {/* Map */}
      <MapContainer
        center={[30.0444, 31.2357]}
        zoom={12}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {MOCK_PINS.map(pin => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            eventHandlers={{ click: () => setSelected(pin) }}
          />
        ))}
      </MapContainer>

      {/* List view button */}
      <button
        onClick={onBack}
        className="absolute top-14 left-1/2 -translate-x-1/2 z-[1000] bg-white shadow-lg px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-sm text-gray-900"
      >
        <List size={16} /> List View
      </button>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-[1000] w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center"
      >
        ←
      </button>

      {/* Mini property card slide-up */}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl p-5 shadow-2xl">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X size={16} className="text-gray-600" />
          </button>
          <p className="font-bold text-orange-600 text-xl mb-1">{selected.price}</p>
          <p className="font-bold text-gray-900 text-base">{selected.title}</p>
          <p className="text-sm text-gray-500 mb-4">📍 {selected.city} · 🛏 {selected.beds} beds</p>
          <button
            onClick={() => onPropertyClick(selected.id)}
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-2xl text-sm"
          >
            View Property
          </button>
        </div>
      )}
    </div>
  );
}
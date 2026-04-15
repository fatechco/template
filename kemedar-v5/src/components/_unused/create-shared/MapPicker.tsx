"use client";
// @ts-nocheck
import { useState } from "react";
import { MapPin } from "lucide-react";

export default function MapPicker({ form, updateForm }) {
  const [mapPin, setMapPin] = useState({ lat: form.latitude || 30.0444, lng: form.longitude || 31.2357 });

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lat = (30.5 - (y / rect.height) * 1.5).toFixed(6);
    const lng = (30.5 + (x / rect.width) * 2.5).toFixed(6);
    setMapPin({ lat, lng });
    updateForm({ latitude: lat, longitude: lng });
  };

  return (
    <div>
      <label className="text-sm font-bold text-gray-700 mb-1 block">Set Location on Map</label>
      <p className="text-xs text-gray-400 mb-2">Click on the map to drop a pin.</p>
      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 cursor-crosshair bg-gray-100" onClick={handleMapClick}>
        <iframe title="map" width="100%" height="100%"
          src={`https://maps.google.com/maps?q=${mapPin.lat},${mapPin.lng}&z=13&output=embed`}
          className="pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MapPin size={30} className="text-[#FF6B00] drop-shadow-lg" />
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
          {mapPin.lat} · {mapPin.lng}
        </div>
      </div>
      <div className="flex gap-3 mt-2">
        <input type="number" placeholder="Latitude" value={form.latitude || ""}
          onChange={e => { updateForm({ latitude: e.target.value }); setMapPin(p => ({ ...p, lat: e.target.value })); }}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
        <input type="number" placeholder="Longitude" value={form.longitude || ""}
          onChange={e => { updateForm({ longitude: e.target.value }); setMapPin(p => ({ ...p, lng: e.target.value })); }}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
      </div>
    </div>
  );
}
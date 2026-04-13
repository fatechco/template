import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom orange marker
const orangeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapClickHandler({ onMove }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

function DraggableMarker({ lat, lng, onMove }) {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const pos = marker.getLatLng();
        onMove(pos.lat, pos.lng);
      }
    },
  };

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={[lat, lng]}
      ref={markerRef}
      icon={orangeIcon}
    />
  );
}

// Geocode city/district/area name to coordinates
async function geocodeLocation(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
  );
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

export default function DraggableMapPicker({ lat, lng, onLocationChange, cityName, districtName, areaName, address }) {
  const [position, setPosition] = useState({ lat: lat || 30.0444, lng: lng || 31.2357 });
  const [geocoding, setGeocoding] = useState(false);

  // Auto-geocode when city/district/area changes
  useEffect(() => {
    const query = [areaName, districtName, cityName, "Egypt"].filter(Boolean).join(", ");
    if (!query || query === "Egypt") return;

    let cancelled = false;
    setGeocoding(true);
    geocodeLocation(query).then((result) => {
      if (!cancelled && result) {
        setPosition(result);
        onLocationChange(result.lat, result.lng);
      }
      if (!cancelled) setGeocoding(false);
    }).catch(() => { if (!cancelled) setGeocoding(false); });

    return () => { cancelled = true; };
  }, [cityName, districtName, areaName]);

  // Also geocode address if typed
  useEffect(() => {
    if (!address || address.length < 10) return;
    const timer = setTimeout(() => {
      const query = [address, cityName, "Egypt"].filter(Boolean).join(", ");
      geocodeLocation(query).then((result) => {
        if (result) {
          setPosition(result);
          onLocationChange(result.lat, result.lng);
        }
      }).catch(() => {});
    }, 1500);
    return () => clearTimeout(timer);
  }, [address]);

  // Sync from parent if lat/lng updated externally
  useEffect(() => {
    if (lat && lng && (lat !== position.lat || lng !== position.lng)) {
      setPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }
  }, [lat, lng]);

  const handleMove = (newLat, newLng) => {
    const roundedLat = parseFloat(newLat.toFixed(6));
    const roundedLng = parseFloat(newLng.toFixed(6));
    setPosition({ lat: roundedLat, lng: roundedLng });
    onLocationChange(roundedLat, roundedLng);
  };

  return (
    <div>
      <div className="relative w-full h-56 rounded-xl overflow-hidden border border-gray-200">
        {geocoding && (
          <div className="absolute top-2 left-2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-gray-600">Finding location...</span>
          </div>
        )}
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker lat={position.lat} lng={position.lng} onMove={handleMove} />
          <MapClickHandler onMove={handleMove} />
          <RecenterMap lat={position.lat} lng={position.lng} />
        </MapContainer>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <p className="text-[11px] text-gray-400 flex-1">
          📍 Drag the marker or click the map to set exact location
        </p>
        <span className="text-[10px] bg-gray-100 text-gray-500 font-mono px-2 py-1 rounded">
          {position.lat}, {position.lng}
        </span>
      </div>

      <div className="flex gap-3 mt-2">
        <div className="flex-1">
          <input type="number" step="any" placeholder="Latitude" value={lat || ""}
            onChange={e => handleMove(parseFloat(e.target.value) || 30.0444, position.lng)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div className="flex-1">
          <input type="number" step="any" placeholder="Longitude" value={lng || ""}
            onChange={e => handleMove(position.lat, parseFloat(e.target.value) || 31.2357)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
        </div>
      </div>
    </div>
  );
}
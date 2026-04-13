import { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const greenIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="32" height="48">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 9.941 16 32 16 32s16-22.059 16-32C32 7.163 24.837 0 16 0z" fill="#16A34A"/>
      <circle cx="16" cy="16" r="8" fill="white"/>
      <text x="16" y="20" font-size="10" text-anchor="middle" fill="#16A34A" font-weight="bold">♻</text>
    </svg>
  `),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

const CENTER = [30.0444, 31.2357]; // Cairo default

function RadiusCircle({ center, radiusKm }) {
  return <Circle center={center} radius={radiusKm * 1000} pathOptions={{ color: "#16A34A", fillColor: "#16A34A", fillOpacity: 0.06, weight: 2 }} />;
}

export default function SurplusMapView({ items }) {
  const [radiusKm, setRadiusKm] = useState(15);
  const [selected, setSelected] = useState(null);

  const itemsWithCoords = items.filter(i => i.latitude && i.longitude);

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 200px)", minHeight: 500 }}>
      {/* Radius slider overlay */}
      <div className="absolute top-4 left-4 z-[500] bg-white rounded-xl shadow-md px-4 py-3 border border-green-200 flex items-center gap-3">
        <span className="text-sm text-gray-700 font-semibold whitespace-nowrap">Radius: <span className="text-green-700 font-black">{radiusKm} km</span></span>
        <input type="range" min={5} max={100} step={5} value={radiusKm} onChange={e => setRadiusKm(Number(e.target.value))}
          className="w-28 accent-green-600" />
      </div>

      {/* Item count */}
      <div className="absolute top-4 right-4 z-[500] bg-white rounded-xl shadow-md px-3 py-2 border border-green-200 text-sm font-bold text-green-700">
        ♻️ {itemsWithCoords.length} items on map
      </div>

      {itemsWithCoords.length === 0 ? (
        <div className="flex items-center justify-center h-full bg-green-50">
          <div className="text-center">
            <div className="text-5xl mb-3">🗺️</div>
            <p className="text-gray-500 font-semibold">No items with location data yet</p>
          </div>
        </div>
      ) : (
        <MapContainer center={CENTER} zoom={11} style={{ width: "100%", height: "100%" }} zoomControl={true}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <RadiusCircle center={CENTER} radiusKm={radiusKm} />
          {itemsWithCoords.map(item => (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={greenIcon}
              eventHandlers={{ click: () => setSelected(item) }}
            >
              <Popup>
                <MiniCard item={item} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

function MiniCard({ item }) {
  const image = item.primaryImageUrl || (item.images && item.images[0]);
  return (
    <div className="w-52 text-left" style={{ fontFamily: "inherit" }}>
      {image && <img src={image} alt={item.title} className="w-full h-28 object-cover rounded-lg mb-2" />}
      <p className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{item.title}</p>
      <p className="text-green-700 font-black text-base mb-2">{Number(item.surplusPriceEGP || 0).toLocaleString()} EGP</p>
      <Link to={`/kemetro/surplus/${item.id}`}
        className="block w-full text-center py-2 rounded-lg text-white text-xs font-bold"
        style={{ background: "#16A34A" }}>
        Reserve →
      </Link>
    </div>
  );
}
import { useState } from "react";
import { MapPin } from "lucide-react";

export default function InspectionCheckin({ report, onComplete }) {
  const [status, setStatus] = useState("idle"); // idle | locating | warning | confirmed
  const [gpsData, setGpsData] = useState(null);
  const [distance, setDistance] = useState(null);

  const calcDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return null;
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  };

  const handleCheckin = () => {
    setStatus("locating");
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        const dist = calcDistance(lat, lng, report.gpsLat, report.gpsLng);
        const gps = { lat, lng, accuracy, distance: dist, startedAt: new Date().toISOString() };
        setGpsData(gps);
        setDistance(dist);
        if (dist && dist > 500) {
          setStatus("warning");
        } else {
          setStatus("confirmed");
        }
      },
      () => {
        const gps = { lat: null, lng: null, accuracy: null, distance: null, startedAt: new Date().toISOString() };
        setGpsData(gps);
        setStatus("confirmed");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const proceed = () => onComplete(gpsData);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 py-12 text-center">
      {status === "idle" && (
        <>
          <div className="text-7xl mb-6">📍</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Ready to start your inspection?</h2>
          <p className="text-gray-500 text-sm mb-1">Property: <span className="font-bold text-gray-700">{report.propertyId?.slice(0, 16) || "—"}</span></p>
          <p className="text-xs text-gray-400 mb-8">Tap below when you've arrived at the property</p>
          <button onClick={handleCheckin}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl text-lg transition-colors shadow-lg">
            📍 I Have Arrived — Check In
          </button>
        </>
      )}

      {status === "locating" && (
        <>
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
          <p className="font-bold text-gray-700">Getting your location...</p>
          <p className="text-xs text-gray-400 mt-2">Please wait, this may take a few seconds</p>
        </>
      )}

      {status === "warning" && (
        <>
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-black text-gray-900 mb-3">You appear to be far away</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 w-full max-w-sm text-left">
            <p className="text-sm font-bold text-amber-800 mb-1">📍 You are {distance}m from the property address</p>
            <p className="text-xs text-amber-700">Are you at the right location?</p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={proceed}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-colors">
              Yes, Proceed
            </button>
            <button onClick={() => window.open(`https://maps.google.com?q=${report.gpsLat},${report.gpsLng}`, "_blank")}
              className="w-full border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors">
              Open Maps for Directions
            </button>
          </div>
        </>
      )}

      {status === "confirmed" && (
        <>
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h2 className="text-xl font-black text-green-600 mb-2">Location confirmed</h2>
          <p className="text-gray-500 text-sm mb-1">{distance ? `${distance}m from property` : "GPS recorded"}</p>
          <p className="text-gray-400 text-xs mb-8">Inspection started at {new Date().toLocaleTimeString()}</p>
          <button onClick={proceed}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl text-lg transition-colors">
            Continue to Photos →
          </button>
        </>
      )}
    </div>
  );
}
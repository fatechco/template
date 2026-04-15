"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { CheckCircle2, Phone, Star, MapPin } from "lucide-react";

const MOCK_FO = {
  name: "Mohammed Hassan",
  rating: 4.8,
  inspections: 23,
  coverage: "Cairo East — Nasr City",
  phone: "+20 100 555 7788",
  avatar: null,
};

const TIME_SLOTS = ["Morning 9–12", "Afternoon 12–4", "Evening 4–7"];

function getDays(count) {
  const days = [];
  const d = new Date();
  for (let i = 1; i <= count; i++) {
    const next = new Date(d);
    next.setDate(d.getDate() + i);
    if (next.getDay() !== 5) days.push(next); // skip Fridays
    if (days.length >= 14) break;
  }
  return days;
}

export default function VerifyLevel4({ token, property, currentLevel, onComplete }) {
  const [showPhone, setShowPhone] = useState(false);
  const [paid, setPaid] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [inspectionVerdict] = useState(null); // would come from FOInspectionReport

  const locked = currentLevel < 3;
  const days = getDays(20);

  const handleBook = async () => {
    if (!selectedDay || !selectedSlot) return;
    setBooking(true);
    await apiClient.post("/api/v1/ai/appendVerificationRecord", {
      tokenId: token?.id,
      recordType: "fo_inspection_scheduled",
      actorType: "seller",
      actorLabel: "Seller",
      title: `Inspection scheduled for ${selectedDay.toDateString()} — ${selectedSlot}`,
      metaData: { scheduledDate: selectedDay.toISOString(), timeSlot: selectedSlot, foName: MOCK_FO.name },
    });
    setBooked(true);
    setBooking(false);
  };

  if (locked) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 opacity-50">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔍</span>
          <p className="font-black text-gray-400">Book a Physical Inspection</p>
          <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full">Unlocked at Level 3</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🔍</span>
          <p className="font-black text-gray-900">Book a Physical Inspection</p>
        </div>
        <p className="text-sm text-gray-500 mb-5">A Franchise Owner will visit and inspect your property. Required for Level 4.</p>

        {/* FO Card */}
        <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
            {MOCK_FO.name[0]}
          </div>
          <div className="flex-1">
            <p className="font-black text-gray-900 text-sm">{MOCK_FO.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} size={10} className={MOCK_FO.rating >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />)}
              <span className="text-xs text-gray-500 ml-1">{MOCK_FO.rating} ({MOCK_FO.inspections} inspections)</span>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin size={10} className="text-[#FF6B00]" />{MOCK_FO.coverage}</p>
            <button onClick={() => setShowPhone(!showPhone)} className="text-xs text-[#FF6B00] font-bold mt-1 flex items-center gap-1 hover:underline">
              <Phone size={10} />{showPhone ? MOCK_FO.phone : "Show Phone"}
            </button>
          </div>
          <span className="text-[10px] text-gray-400 bg-gray-200 px-2 py-1 rounded-full text-center leading-tight">Auto-assigned</span>
        </div>

        {/* Fee */}
        {!paid && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span>💰</span>
              <p className="font-bold text-orange-800">Inspection Fee: <span className="text-[#FF6B00]">600 EGP</span></p>
            </div>
            <p className="text-xs text-orange-600 mb-3">Paid securely to Kemedar · FO receives their share after completion</p>
            <div className="flex gap-2">
              <button onClick={() => setPaid(true)} className="flex-1 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-2.5 rounded-xl text-sm transition-colors">
                Pay Now — Card
              </button>
              <button onClick={() => setPaid(true)} className="flex-1 border-2 border-[#FF6B00] text-[#FF6B00] font-bold py-2.5 rounded-xl text-sm hover:bg-orange-50 transition-colors">
                Pay from Wallet
              </button>
            </div>
          </div>
        )}

        {/* Scheduling */}
        {paid && !booked && (
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">Select a Date</p>
            <div className="flex gap-2 flex-wrap mb-5">
              {days.map((d, i) => (
                <button key={i}
                  onClick={() => setSelectedDay(d)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedDay?.toDateString() === d.toDateString() ? "border-[#FF6B00] bg-orange-50 text-[#FF6B00]" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}>
                  <div>{d.toLocaleDateString("en", { weekday: "short" })}</div>
                  <div>{d.getDate()}/{d.getMonth() + 1}</div>
                </button>
              ))}
            </div>

            <p className="text-sm font-bold text-gray-700 mb-3">Select a Time Slot</p>
            <div className="flex gap-2 mb-5">
              {TIME_SLOTS.map(slot => (
                <button key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${selectedSlot === slot ? "border-[#FF6B00] bg-orange-50 text-[#FF6B00]" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}>
                  {slot}
                </button>
              ))}
            </div>

            <button
              onClick={handleBook}
              disabled={!selectedDay || !selectedSlot || booking}
              className="w-full bg-[#FF6B00] hover:bg-[#e55f00] disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3 rounded-xl text-sm transition-colors"
            >
              {booking ? "Booking..." : "📅 Book Inspection"}
            </button>
          </div>
        )}

        {/* Confirmed */}
        {booked && !inspectionVerdict && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="text-green-500" size={18} />
              <p className="font-black text-green-800">Inspection Confirmed</p>
            </div>
            <p className="text-sm text-green-700">📅 {selectedDay?.toDateString()} at {selectedSlot}</p>
            <p className="text-sm text-green-700">📍 {property?.address || "Property address"}</p>
            <p className="text-sm text-green-700">FO: {MOCK_FO.name}</p>
            <p className="text-xs text-green-600 mt-2">Please ensure someone is present at the property</p>
            <button className="mt-3 text-xs font-bold text-green-700 border border-green-300 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
              Add to Calendar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
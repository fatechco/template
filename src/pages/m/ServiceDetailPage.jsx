import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Heart, ChevronRight } from "lucide-react";

const MOCK_SERVICE = {
  slug: "service-1",
  name: "Ahmed Fathy",
  title: "Licensed Electrician – Full Wiring & Panels",
  rating: 4.9,
  reviews: 87,
  jobs: 210,
  city: "Cairo",
  available: true,
  verified: true,
  avatar: "https://i.pravatar.cc/150?img=50",
  cover: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  bio: "Licensed electrical engineer with 12 years experience. Specializing in residential and commercial wiring, panel upgrades, and smart home installations.\n\nAll work is guaranteed and fully compliant with Egyptian electrical standards.",
  specializations: ["Wiring", "Panels", "Lighting", "Solar", "Smart Home"],
  languages: ["Arabic", "English"],
  areas: ["New Cairo", "Maadi", "Heliopolis", "Downtown"],
  services: [
    { id: 1, name: "Full Apartment Wiring", price: "From EGP 3,000", duration: "2–3 days", description: "Complete wiring for apartments up to 200 sqm" },
    { id: 2, name: "Panel Upgrade", price: "EGP 800–1,500", duration: "1 day", description: "Main panel replacement and breaker installation" },
    { id: 3, name: "Lighting Installation", price: "EGP 50/point", duration: "Few hours", description: "Any type of light fixture installation" },
    { id: 4, name: "Smart Home Setup", price: "Custom quote", duration: "2–5 days", description: "Smart switches, automation, and integration" },
    { id: 5, name: "Emergency Repair", price: "EGP 200/hr", duration: "Varies", description: "Urgent electrical repairs and troubleshooting" },
  ],
  reviews_list: [
    { id: 1, name: "Sara M.", avatar: "https://i.pravatar.cc/150?img=5", stars: 5, date: "Mar 2026", text: "Excellent work! Fixed all our wiring issues professionally. Very clean and tidy." },
    { id: 2, name: "Khaled A.", avatar: "https://i.pravatar.cc/150?img=7", stars: 5, date: "Feb 2026", text: "Did a full panel upgrade for our villa. Great quality and finished on time." },
    { id: 3, name: "Omar F.", avatar: "https://i.pravatar.cc/150?img=12", stars: 4, date: "Jan 2026", text: "Good work, professional and polite. Will hire again." },
  ],
};

const BOOKING_STEPS = ["Service", "Date & Time", "Location", "Notes", "Confirm"];

function BookingSheet({ open, onClose, services }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  if (!open) return null;

  const isLast = step === BOOKING_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl flex flex-col" style={{ maxHeight: "85vh" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3" />

        {/* Step indicator */}
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex gap-1 mb-2">
            {BOOKING_STEPS.map((s, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? "bg-orange-600" : "bg-gray-200"}`} />
            ))}
          </div>
          <p className="font-black text-gray-900 text-base">{BOOKING_STEPS[step]}</p>
          <p className="text-xs text-gray-400">Step {step + 1} of {BOOKING_STEPS.length}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 0 && (
            <div className="space-y-3">
              {services.map(svc => (
                <button key={svc.id} onClick={() => setSelected(svc)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-colors ${selected?.id === svc.id ? "border-orange-600 bg-orange-50" : "border-gray-200 bg-white"}`}>
                  <p className="font-bold text-gray-900 text-sm">{svc.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{svc.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-orange-600">{svc.price}</span>
                    <span className="text-xs text-gray-400">⏱ {svc.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Preferred Date</p>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Preferred Time</p>
                <div className="grid grid-cols-3 gap-2">
                  {["8:00 AM","9:00 AM","10:00 AM","11:00 AM","1:00 PM","3:00 PM"].map(t => (
                    <button key={t} onClick={() => setTime(t)}
                      className={`py-2.5 rounded-xl text-xs font-bold border ${time === t ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Where should the professional come?</p>
              <div className="space-y-3">
                {["My Home Address", "Provider's Workshop"].map(opt => (
                  <button key={opt} onClick={() => setAddress(opt)}
                    className={`w-full text-left p-4 rounded-2xl border-2 ${address === opt ? "border-orange-600 bg-orange-50" : "border-gray-200"}`}>
                    <p className="font-bold text-sm text-gray-900">{opt}</p>
                  </button>
                ))}
                <textarea placeholder="Or enter your specific address..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none" rows={3} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">Additional Notes (optional)</p>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Describe the work needed, any special instructions..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none" rows={5} />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="font-black text-gray-900 text-sm mb-1">Booking Summary</p>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Service</span><span className="font-bold">{selected?.name || "—"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="font-bold">{date || "—"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Time</span><span className="font-bold">{time || "—"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Location</span><span className="font-bold">{address || "—"}</span></div>
                <div className="flex justify-between text-sm font-black mt-2 pt-2 border-t border-gray-200">
                  <span>Estimated Price</span><span className="text-orange-600">{selected?.price || "—"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl text-sm">Back</button>}
          <button onClick={() => isLast ? onClose() : setStep(s => s + 1)}
            className="flex-1 bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-sm">
            {isLast ? "✅ Confirm Booking" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("About");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [savedService, setSavedService] = useState(null);
  const service = MOCK_SERVICE;

  const TABS = ["About", "Services", "Reviews"];

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="relative" style={{ height: 180 }}>
        <img src={service.cover} alt="cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-black/30 rounded-full flex items-center justify-center">
          <ArrowLeft size={18} color="white" />
        </button>
        <button className="absolute top-4 right-4 w-9 h-9 bg-black/30 rounded-full flex items-center justify-center">
          <Share2 size={16} color="white" />
        </button>

        {/* Avatar centered at bottom of cover */}
        <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
          <div className="relative">
            <img src={service.avatar} alt={service.name} className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover" />
            {service.verified && (
              <div className="absolute bottom-0.5 right-0.5 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white text-[9px] font-bold">✓</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-12 pb-4 text-center px-4">
        <p className="font-black text-gray-900 text-xl">{service.name}</p>
        <p className="text-sm text-gray-500 mt-0.5">{service.title}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-sm font-bold text-amber-500">⭐ {service.rating}</span>
          <span className="text-sm text-gray-400">({service.reviews}) · {service.jobs} jobs</span>
        </div>
        <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${service.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
          {service.available ? "🟢 Available Now" : "🔴 Busy"}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mx-4 mb-3 bg-gray-100 rounded-2xl p-1">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "About" && (
        <div className="space-y-3 mx-4">
          <div className="bg-white rounded-2xl p-4">
            <p className="font-black text-gray-900 text-sm mb-2">About</p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{service.bio}</p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="font-black text-gray-900 text-sm mb-2.5">Specializations</p>
            <div className="flex flex-wrap gap-2">
              {service.specializations.map(s => (
                <span key={s} className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="font-black text-gray-900 text-sm mb-2.5">Languages</p>
            <div className="flex flex-wrap gap-2">
              {service.languages.map(l => (
                <span key={l} className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">🗣 {l}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="font-black text-gray-900 text-sm mb-2.5">Service Areas</p>
            {service.areas.map(area => (
              <p key={area} className="text-sm text-gray-600 py-1">📍 {area}</p>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Services" && (
        <div className="space-y-3 mx-4">
          {service.services.map(svc => (
            <div key={svc.id} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-black text-gray-900 text-sm">{svc.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{svc.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-black text-orange-600">{svc.price}</span>
                    <span className="text-xs text-gray-400">⏱ {svc.duration}</span>
                  </div>
                </div>
                <button onClick={() => { setSavedService(svc); setBookingOpen(true); }}
                  className="flex-shrink-0 bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Reviews" && (
        <div className="space-y-3 mx-4">
          <div className="bg-white rounded-2xl p-4 flex gap-4">
            <div className="text-center">
              <p className="text-4xl font-black text-gray-900">{service.rating}</p>
              <div className="flex gap-0.5 justify-center mt-1">{[1,2,3,4,5].map(i => <span key={i} className="text-orange-400 text-base">★</span>)}</div>
              <p className="text-xs text-gray-400 mt-1">{service.reviews} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5,4,3,2,1].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-2">{s}</span>
                  <span className="text-orange-400 text-[10px]">★</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${[78,14,5,2,1][i]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {service.reviews_list.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className={`text-xs ${i <= review.stars ? "text-amber-400" : "text-gray-200"}`}>★</span>)}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3" style={{ paddingBottom: "max(12px,env(safe-area-inset-bottom))" }}>
        <button onClick={() => setBookingOpen(true)} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl text-sm">
          📋 Book This Professional
        </button>
      </div>

      <BookingSheet open={bookingOpen} onClose={() => setBookingOpen(false)} services={service.services} />
    </div>
  );
}
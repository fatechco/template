import { useState } from "react";
import { Link } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const SHIPPER_TYPES = [
  { value: "Individual", icon: "🏍", label: "Individual Courier" },
  { value: "Vehicle Owner", icon: "🚐", label: "Vehicle Owner" },
  { value: "Company", icon: "🏢", label: "Company" },
  { value: "Freight Company", icon: "🚛", label: "Freight Company" },
];

const VEHICLE_TYPES = [
  { value: "Motorcycle", label: "Motorcycle", sub: "small parcels" },
  { value: "Small Van", label: "Small Van", sub: "up to 500kg" },
  { value: "Large Van", label: "Large Van", sub: "up to 2 tons" },
  { value: "Truck", label: "Truck", sub: "up to 10 tons" },
  { value: "Container Truck", label: "Container Truck", sub: "10+ tons" },
];

const WHO_CAN_JOIN = [
  { icon: "🏍", title: "Individual Couriers", desc: "Motorcycle or bicycle riders for small parcels and fast deliveries." },
  { icon: "🚐", title: "Van & Vehicle Owners", desc: "Small or large van owners for medium-volume local deliveries." },
  { icon: "🚛", title: "Freight Companies", desc: "Truck and container fleets for heavy or bulk shipments." },
  { icon: "🏢", title: "Shipping & Logistics Companies", desc: "Full-service logistics companies offering end-to-end delivery." },
];

const HOW_STEPS = [
  { num: "1️⃣", title: "Register Free", desc: "Submit your details and vehicle info through the registration form below." },
  { num: "2️⃣", title: "Get Verified", desc: "Kemetro reviews your profile within 48 hours and approves your account." },
  { num: "3️⃣", title: "Start Receiving Jobs", desc: "Accept shipment requests in your area and get paid per delivery." },
];

const EMPTY_FORM = {
  shipperType: "Individual",
  companyName: "",
  ownerName: "",
  email: "",
  phone: "",
  whatsapp: "",
  nationalId: "",
  vehicleTypes: [],
  maxWeightKg: "",
  hasRefrigeration: false,
  hasHeavyEquipment: false,
  country: "",
  cities: "",
  isInternational: false,
  internationalCountries: "",
  pricePerKm: "",
  pricePerKg: "",
  minShipmentPrice: "",
  currency: "USD",
  payoutMethod: "Bank Transfer",
  bankName: "",
  bankAccountName: "",
  bankIBAN: "",
  agreeTerms: false,
  agreeAccurate: false,
  agreeVerify: false,
};

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors";
const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

export default function KemetroShipperRegister() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleVehicle = (v) => {
    set("vehicleTypes", form.vehicleTypes.includes(v)
      ? form.vehicleTypes.filter((x) => x !== v)
      : [...form.vehicleTypes, v]);
  };

  const canSubmit = form.agreeTerms && form.agreeAccurate && form.agreeVerify
    && form.companyName && form.email && form.phone;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" }} className="py-20 px-4">
        <div className="max-w-[800px] mx-auto text-center space-y-6">
          <div className="text-6xl">🚚</div>
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Deliver with Kemetro —<br />Earn on Every Shipment
          </h1>
          <p className="text-teal-100 text-lg">
            Register as a Kemetro delivery partner and start receiving shipment requests from verified sellers.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {["💰 Competitive Pay Per Delivery", "📦 Steady Volume of Orders", "🗺 Work in Your Coverage Area"].map((pill) => (
              <span key={pill} className="border-2 border-white/60 text-white font-semibold px-4 py-2 rounded-full text-sm">{pill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* WHO CAN JOIN */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Who Can Join?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHO_CAN_JOIN.map((c) => (
              <div key={c.title} className="bg-[#F8FAFC] rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{c.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">{s.num}</div>
                <h3 className="font-black text-gray-900">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[700px] mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">Shipper Registration Form</h2>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="text-6xl">✅</div>
                <h3 className="text-2xl font-black text-gray-900">Registration Submitted!</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our team will verify your account within 48 hours and send you a confirmation to your email.
                </p>
                <Link to="/kemetro" className="inline-block mt-4 bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-8 py-3 rounded-xl transition-colors">Back to Kemetro</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">

                {/* Section 1 — Personal / Company Info */}
                <div className="space-y-5">
                  <h3 className="font-black text-gray-800 text-lg border-b border-gray-100 pb-2">1. Personal / Company Info</h3>

                  {/* Shipper Type */}
                  <div>
                    <label className={labelClass}>Shipper Type *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {SHIPPER_TYPES.map((t) => (
                        <button key={t.value} type="button" onClick={() => set("shipperType", t.value)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all text-left ${form.shipperType === t.value ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                          <span className="text-xl">{t.icon}</span> {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>{form.shipperType === "Individual" ? "Full Name" : "Company Name"} *</label>
                    <input required value={form.companyName} onChange={(e) => set("companyName", e.target.value)} className={inputClass} placeholder={form.shipperType === "Individual" ? "Your full name" : "Company or business name"} />
                  </div>

                  {form.shipperType !== "Individual" && (
                    <div>
                      <label className={labelClass}>Owner Name</label>
                      <input value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} className={inputClass} placeholder="Owner or manager name" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="you@email.com" />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} placeholder="+20 xxx xxx xxxx" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>WhatsApp Number</label>
                      <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputClass} placeholder="+20 xxx xxx xxxx" />
                    </div>
                    <div>
                      <label className={labelClass}>National ID / License No.</label>
                      <input value={form.nationalId} onChange={(e) => set("nationalId", e.target.value)} className={inputClass} placeholder="ID or license number" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Upload National ID or License</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center text-sm text-gray-400 hover:border-teal-300 transition-colors cursor-pointer">
                      <div className="text-2xl mb-1">📎</div>
                      <p className="font-medium">Click to upload or drag & drop</p>
                      <p className="text-xs mt-1">PNG, JPG, PDF up to 5MB</p>
                      <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf" />
                    </div>
                  </div>
                </div>

                {/* Section 2 — Vehicle & Capacity */}
                <div className="space-y-5">
                  <h3 className="font-black text-gray-800 text-lg border-b border-gray-100 pb-2">2. Vehicle & Capacity</h3>

                  <div>
                    <label className={labelClass}>Vehicle Types (select all that apply)</label>
                    <div className="space-y-2">
                      {VEHICLE_TYPES.map((v) => (
                        <label key={v.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input type="checkbox" checked={form.vehicleTypes.includes(v.value)} onChange={() => toggleVehicle(v.value)} className="w-4 h-4 accent-teal-600" />
                          <span className="font-semibold text-gray-800 text-sm">{v.label}</span>
                          <span className="text-gray-400 text-xs">({v.sub})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Maximum Weight Capacity (kg)</label>
                    <input type="number" value={form.maxWeightKg} onChange={(e) => set("maxWeightKg", e.target.value)} className={inputClass} placeholder="e.g. 1000" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <span className="text-sm font-bold text-gray-700">🧊 Refrigeration?</span>
                      <button type="button" onClick={() => set("hasRefrigeration", !form.hasRefrigeration)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${form.hasRefrigeration ? "bg-teal-500" : "bg-gray-200"}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.hasRefrigeration ? "left-6" : "left-0.5"}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <span className="text-sm font-bold text-gray-700">🏗 Heavy Equipment?</span>
                      <button type="button" onClick={() => set("hasHeavyEquipment", !form.hasHeavyEquipment)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${form.hasHeavyEquipment ? "bg-teal-500" : "bg-gray-200"}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.hasHeavyEquipment ? "left-6" : "left-0.5"}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 3 — Service Area */}
                <div className="space-y-5">
                  <h3 className="font-black text-gray-800 text-lg border-b border-gray-100 pb-2">3. Service Area</h3>

                  <div>
                    <label className={labelClass}>Country *</label>
                    <input value={form.country} onChange={(e) => set("country", e.target.value)} className={inputClass} placeholder="e.g. Egypt" />
                  </div>

                  <div>
                    <label className={labelClass}>Cities You Cover</label>
                    <input value={form.cities} onChange={(e) => set("cities", e.target.value)} className={inputClass} placeholder="e.g. Cairo, Giza, Alexandria" />
                    <p className="text-xs text-gray-400 mt-1">Separate multiple cities with commas</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <span className="text-sm font-bold text-gray-700">🌍 International Shipping?</span>
                    <button type="button" onClick={() => set("isInternational", !form.isInternational)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${form.isInternational ? "bg-teal-500" : "bg-gray-200"}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.isInternational ? "left-6" : "left-0.5"}`} />
                    </button>
                  </div>

                  {form.isInternational && (
                    <div>
                      <label className={labelClass}>Countries You Ship To</label>
                      <input value={form.internationalCountries} onChange={(e) => set("internationalCountries", e.target.value)} className={inputClass} placeholder="e.g. Saudi Arabia, UAE, Jordan" />
                      <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
                    </div>
                  )}
                </div>

                {/* Section 4 — Pricing */}
                <div className="space-y-5">
                  <h3 className="font-black text-gray-800 text-lg border-b border-gray-100 pb-2">4. Pricing</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Price per km</label>
                      <input type="number" value={form.pricePerKm} onChange={(e) => set("pricePerKm", e.target.value)} className={inputClass} placeholder="0.00" />
                    </div>
                    <div>
                      <label className={labelClass}>Price per kg</label>
                      <input type="number" value={form.pricePerKg} onChange={(e) => set("pricePerKg", e.target.value)} className={inputClass} placeholder="0.00" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Minimum Shipment Price</label>
                      <input type="number" value={form.minShipmentPrice} onChange={(e) => set("minShipmentPrice", e.target.value)} className={inputClass} placeholder="0.00" />
                    </div>
                    <div>
                      <label className={labelClass}>Currency</label>
                      <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className={inputClass}>
                        {["USD", "EGP", "SAR", "AED", "EUR", "GBP"].map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
                    💡 <strong>Note:</strong> Prices are used as base rates. Final price is agreed per shipment with the seller.
                  </p>
                </div>

                {/* Section 5 — Bank / Payment Info */}
                <div className="space-y-5">
                  <h3 className="font-black text-gray-800 text-lg border-b border-gray-100 pb-2">5. Bank / Payment Info</h3>

                  <div>
                    <label className={labelClass}>Preferred Payout Method</label>
                    <select value={form.payoutMethod} onChange={(e) => set("payoutMethod", e.target.value)} className={inputClass}>
                      <option>Bank Transfer</option>
                      <option>XeedWallet</option>
                      <option>Cash</option>
                    </select>
                  </div>

                  {form.payoutMethod === "Bank Transfer" && (
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Bank Name</label>
                        <input value={form.bankName} onChange={(e) => set("bankName", e.target.value)} className={inputClass} placeholder="e.g. National Bank of Egypt" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Account Holder Name</label>
                          <input value={form.bankAccountName} onChange={(e) => set("bankAccountName", e.target.value)} className={inputClass} placeholder="Full name on account" />
                        </div>
                        <div>
                          <label className={labelClass}>IBAN / Account Number</label>
                          <input value={form.bankIBAN} onChange={(e) => set("bankIBAN", e.target.value)} className={inputClass} placeholder="IBAN or account number" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 6 — Agreement */}
                <div className="space-y-4">
                  <h3 className="font-black text-gray-800 text-lg border-b border-gray-100 pb-2">6. Agreement</h3>
                  {[
                    { key: "agreeTerms", label: "I agree to Kemetro's Shipper Terms & Conditions" },
                    { key: "agreeAccurate", label: "I confirm that all information provided is accurate and truthful" },
                    { key: "agreeVerify", label: "I allow Kemetro to verify my submitted documents" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="w-4 h-4 mt-0.5 accent-teal-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>

                <button type="submit" disabled={!canSubmit}
                  className={`w-full py-4 rounded-xl font-black text-lg transition-all ${canSubmit ? "bg-[#FF6B00] hover:bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                  Submit Registration →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <KemetroFooter />
    </div>
  );
}
import { useState } from "react";
import { Save, CheckCircle, Upload, X } from "lucide-react";

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
  idDocument: null,
};

export default function KemetroShipperSetup() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleVehicle = (v) => {
    set("vehicleTypes", form.vehicleTypes.includes(v)
      ? form.vehicleTypes.filter((x) => x !== v)
      : [...form.vehicleTypes, v]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => set("idDocument", { name: file.name, size: file.size });
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => set("idDocument", null);

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Shipper Setup</h1>
          <p className="text-gray-600">Complete your profile to start receiving shipment requests</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            saved ? "bg-green-600 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"
          }`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Setup</>}
        </button>
      </div>

      <div className="space-y-6">
        {/* Section 1 — Personal / Company Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-black text-gray-900 text-lg">1. Personal / Company Info</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>Shipper Type</label>
              <div className="grid grid-cols-4 gap-3">
                {SHIPPER_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set("shipperType", t.value)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-xs font-bold transition-all text-left ${
                      form.shipperType === t.value ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-lg">{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{form.shipperType === "Individual" ? "Full Name" : "Company Name"} *</label>
                <input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} className={inputClass} placeholder={form.shipperType === "Individual" ? "Your full name" : "Company name"} />
              </div>
              {form.shipperType !== "Individual" && (
                <div>
                  <label className={labelClass}>Owner Name</label>
                  <input value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} className={inputClass} placeholder="Owner or manager name" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email Address *</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="you@email.com" />
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} placeholder="+20 xxx xxx xxxx" />
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
              {form.idDocument ? (
                <div className="flex items-center gap-3 p-4 border border-teal-200 rounded-xl bg-teal-50">
                  <div className="flex-1">
                    <p className="font-bold text-teal-900 text-sm">{form.idDocument.name}</p>
                    <p className="text-xs text-teal-600">{(form.idDocument.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button onClick={removeFile} className="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-teal-300 transition-colors">
                  <div className="text-3xl mb-2">📎</div>
                  <p className="font-bold text-gray-700 text-sm">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</p>
                  <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileUpload} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Section 2 — Vehicle & Capacity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-black text-gray-900 text-lg">2. Vehicle & Capacity</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>Vehicle Types (select all that apply)</label>
              <div className="space-y-2">
                {VEHICLE_TYPES.map((v) => (
                  <label key={v.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" checked={form.vehicleTypes.includes(v.value)} onChange={() => toggleVehicle(v.value)} className="w-4 h-4 accent-teal-600" />
                    <span className="font-bold text-gray-800 text-sm">{v.label}</span>
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
        </div>

        {/* Section 3 — Service Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-black text-gray-900 text-lg">3. Service Area</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>Country</label>
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
              </div>
            )}
          </div>
        </div>

        {/* Section 4 — Pricing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-black text-gray-900 text-lg">4. Pricing</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Price per km</label>
                <input type="number" value={form.pricePerKm} onChange={(e) => set("pricePerKm", e.target.value)} className={inputClass} placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Price per kg</label>
                <input type="number" value={form.pricePerKg} onChange={(e) => set("pricePerKg", e.target.value)} className={inputClass} placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Min Shipment Price</label>
                <input type="number" value={form.minShipmentPrice} onChange={(e) => set("minShipmentPrice", e.target.value)} className={inputClass} placeholder="0.00" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Currency</label>
              <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className={inputClass}>
                {["USD", "EGP", "SAR", "AED", "EUR", "GBP"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
              💡 <strong>Note:</strong> Prices are used as base rates. Final price is agreed per shipment with the seller.
            </p>
          </div>
        </div>

        {/* Section 5 — Bank / Payment Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-black text-gray-900 text-lg">5. Bank / Payment Info</h2>
          </div>
          <div className="p-6 space-y-5">
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
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
            saved ? "bg-green-600 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"
          }`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Setup</>}
        </button>
      </div>
    </div>
  );
}
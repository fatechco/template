import { useState } from "react";
import { Save, CheckCircle, Upload, X, ArrowLeft } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const SHIPPER_TYPES = [
  { value: "Individual", icon: "🏍", label: "Individual" },
  { value: "Vehicle Owner", icon: "🚐", label: "Vehicle Owner" },
  { value: "Company", icon: "🏢", label: "Company" },
  { value: "Freight Company", icon: "🚛", label: "Freight Co" },
];

const VEHICLE_TYPES = [
  { value: "Motorcycle", label: "Motorcycle", sub: "small parcels" },
  { value: "Small Van", label: "Small Van", sub: "up to 500kg" },
  { value: "Large Van", label: "Large Van", sub: "up to 2 tons" },
  { value: "Truck", label: "Truck", sub: "up to 10 tons" },
  { value: "Container Truck", label: "Container", sub: "10+ tons" },
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

export default function ShipperSetupMobile() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState("info");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleVehicle = (v) => {
    set("vehicleTypes", form.vehicleTypes.includes(v)
      ? form.vehicleTypes.filter((x) => x !== v)
      : [...form.vehicleTypes, v]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

  const TABS = [
    { id: "info", label: "Info" },
    { id: "vehicle", label: "Vehicle" },
    { id: "area", label: "Area" },
    { id: "pricing", label: "Pricing" },
    { id: "bank", label: "Bank" },
  ];

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500";
  const labelClass = "text-xs font-bold text-gray-600 block mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileTopBar
        title="Shipper Setup"
        showBack={true}
        rightAction={
          <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              saved ? "bg-green-600 text-white" : "bg-teal-600 text-white"
            }`}
          >
            {saved ? <><CheckCircle size={12} /> Saved</> : <><Save size={12} /> Save</>}
          </button>
        }
      />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-3 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === tab.id ? "bg-teal-600 text-white" : "bg-white text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Tab */}
        {activeTab === "info" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div>
              <label className={labelClass}>Shipper Type</label>
              <div className="grid grid-cols-2 gap-2">
                {SHIPPER_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => set("shipperType", t.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      form.shipperType === t.value ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="text-lg">{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>{form.shipperType === "Individual" ? "Full Name" : "Company Name"} *</label>
              <input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} className={inputClass} placeholder={form.shipperType === "Individual" ? "Your full name" : "Company name"} />
            </div>

            {form.shipperType !== "Individual" && (
              <div>
                <label className={labelClass}>Owner Name</label>
                <input value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} className={inputClass} placeholder="Owner name" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="you@email.com" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} placeholder="+20 xxx xxx xxxx" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>WhatsApp</label>
                <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputClass} placeholder="+20 xxx xxx xxxx" />
              </div>
              <div>
                <label className={labelClass}>National ID</label>
                <input value={form.nationalId} onChange={(e) => set("nationalId", e.target.value)} className={inputClass} placeholder="ID number" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Upload ID/License</label>
              {form.idDocument ? (
                <div className="flex items-center gap-3 p-3 border border-teal-200 rounded-xl bg-teal-50">
                  <div className="flex-1">
                    <p className="font-bold text-teal-900 text-xs">{form.idDocument.name}</p>
                    <p className="text-xs text-teal-600">{(form.idDocument.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button onClick={removeFile} className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer">
                  <div className="text-2xl mb-1">📎</div>
                  <p className="font-bold text-gray-700 text-xs">Tap to upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF</p>
                  <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileUpload} />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Vehicle Tab */}
        {activeTab === "vehicle" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div>
              <label className={labelClass}>Vehicle Types</label>
              <div className="space-y-2">
                {VEHICLE_TYPES.map((v) => (
                  <label key={v.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer">
                    <input type="checkbox" checked={form.vehicleTypes.includes(v.value)} onChange={() => toggleVehicle(v.value)} className="w-4 h-4 accent-teal-600" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{v.label}</p>
                      <p className="text-xs text-gray-400">{v.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Max Weight (kg)</label>
              <input type="number" value={form.maxWeightKg} onChange={(e) => set("maxWeightKg", e.target.value)} className={inputClass} placeholder="e.g. 1000" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <span className="text-xs font-bold text-gray-700">🧊 Refrigeration</span>
                <button type="button" onClick={() => set("hasRefrigeration", !form.hasRefrigeration)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.hasRefrigeration ? "bg-teal-500" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.hasRefrigeration ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <span className="text-xs font-bold text-gray-700">🏗 Heavy Equipment</span>
                <button type="button" onClick={() => set("hasHeavyEquipment", !form.hasHeavyEquipment)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.hasHeavyEquipment ? "bg-teal-500" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.hasHeavyEquipment ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Area Tab */}
        {activeTab === "area" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div>
              <label className={labelClass}>Country</label>
              <input value={form.country} onChange={(e) => set("country", e.target.value)} className={inputClass} placeholder="e.g. Egypt" />
            </div>

            <div>
              <label className={labelClass}>Cities You Cover</label>
              <input value={form.cities} onChange={(e) => set("cities", e.target.value)} className={inputClass} placeholder="Cairo, Giza, Alexandria" />
              <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <span className="text-sm font-bold text-gray-700">🌍 International?</span>
              <button type="button" onClick={() => set("isInternational", !form.isInternational)}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.isInternational ? "bg-teal-500" : "bg-gray-200"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.isInternational ? "left-5.5" : "left-0.5"}`} />
              </button>
            </div>

            {form.isInternational && (
              <div>
                <label className={labelClass}>Countries You Ship To</label>
                <input value={form.internationalCountries} onChange={(e) => set("internationalCountries", e.target.value)} className={inputClass} placeholder="Saudi Arabia, UAE" />
              </div>
            )}
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Price per km</label>
                <input type="number" value={form.pricePerKm} onChange={(e) => set("pricePerKm", e.target.value)} className={inputClass} placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Price per kg</label>
                <input type="number" value={form.pricePerKg} onChange={(e) => set("pricePerKg", e.target.value)} className={inputClass} placeholder="0.00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Min Shipment Price</label>
                <input type="number" value={form.minShipmentPrice} onChange={(e) => set("minShipmentPrice", e.target.value)} className={inputClass} placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Currency</label>
                <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className={inputClass}>
                  {["USD", "EGP", "SAR", "AED", "EUR", "GBP"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-600">
                💡 <strong>Note:</strong> Prices are base rates. Final price agreed per shipment.
              </p>
            </div>
          </div>
        )}

        {/* Bank Tab */}
        {activeTab === "bank" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div>
              <label className={labelClass}>Payout Method</label>
              <select value={form.payoutMethod} onChange={(e) => set("payoutMethod", e.target.value)} className={inputClass}>
                <option>Bank Transfer</option>
                <option>XeedWallet</option>
                <option>Cash</option>
              </select>
            </div>

            {form.payoutMethod === "Bank Transfer" && (
              <>
                <div>
                  <label className={labelClass}>Bank Name</label>
                  <input value={form.bankName} onChange={(e) => set("bankName", e.target.value)} className={inputClass} placeholder="e.g. National Bank of Egypt" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Account Holder Name</label>
                    <input value={form.bankAccountName} onChange={(e) => set("bankAccountName", e.target.value)} className={inputClass} placeholder="Full name" />
                  </div>
                  <div>
                    <label className={labelClass}>IBAN / Account Number</label>
                    <input value={form.bankIBAN} onChange={(e) => set("bankIBAN", e.target.value)} className={inputClass} placeholder="IBAN" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-20 left-0 right-0 max-w-[480px] mx-auto px-4">
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
            saved ? "bg-green-600 text-white" : "bg-teal-600 text-white"
          }`}
        >
          {saved ? "✓ Setup Saved!" : "💾 Save Setup"}
        </button>
      </div>
    </div>
  );
}
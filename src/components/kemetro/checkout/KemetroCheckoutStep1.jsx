import { useState } from "react";
import { ChevronDown } from "lucide-react";

const MOCK_SAVED_ADDRESSES = [
  {
    id: 1,
    label: "Home",
    fullName: "Ahmed Hassan",
    phone: "+20 123456789",
    address: "123 Nile Street, Cairo",
    city: "Cairo",
    province: "Cairo",
    country: "Egypt",
  },
  {
    id: 2,
    label: "Office",
    fullName: "Ahmed Hassan",
    phone: "+20 123456789",
    address: "456 Business Ave, Giza",
    city: "Giza",
    province: "Giza",
    country: "Egypt",
  },
];

export default function KemetroCheckoutStep1({ onAddressSelect, onNext }) {
  const [selectedAddress, setSelectedAddress] = useState(MOCK_SAVED_ADDRESSES[0].id);
  const [showNewForm, setShowNewForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    country: "Egypt",
    province: "",
    city: "",
    district: "",
    address: "",
    landmark: "",
    saveAddress: false,
  });

  const handleNewAddressChange = (field, value) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (showNewForm) {
      onAddressSelect({ ...newAddress, isNew: true });
    } else {
      const addr = MOCK_SAVED_ADDRESSES.find((a) => a.id === selectedAddress);
      onAddressSelect(addr);
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Saved Addresses */}
      {!showNewForm && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
          <div className="space-y-3">
            {MOCK_SAVED_ADDRESSES.map((addr) => (
              <label
                key={addr.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedAddress === addr.id
                    ? "border-[#FF6B00] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  value={addr.id}
                  checked={selectedAddress === addr.id}
                  onChange={(e) => setSelectedAddress(parseInt(e.target.value))}
                  className="mb-2"
                />
                <div className="font-bold text-gray-900">{addr.label}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {addr.fullName} | {addr.phone}
                </div>
                <div className="text-sm text-gray-600">
                  {addr.address}, {addr.city}, {addr.province}, {addr.country}
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={() => setShowNewForm(true)}
            className="mt-4 text-[#FF6B00] hover:underline font-semibold text-sm"
          >
            + Add New Address
          </button>
        </div>
      )}

      {/* New Address Form */}
      {showNewForm && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">New Address</h2>
            <button
              onClick={() => setShowNewForm(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newAddress.fullName}
                onChange={(e) => handleNewAddressChange("fullName", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B00]"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newAddress.phone}
                onChange={(e) => handleNewAddressChange("phone", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <select
                value={newAddress.country}
                onChange={(e) => handleNewAddressChange("country", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B00]"
              >
                <option>Egypt</option>
                <option>UAE</option>
              </select>
              <select
                value={newAddress.province}
                onChange={(e) => handleNewAddressChange("province", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B00]"
              >
                <option value="">Province</option>
                <option>Cairo</option>
                <option>Giza</option>
              </select>
              <select
                value={newAddress.city}
                onChange={(e) => handleNewAddressChange("city", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B00]"
              >
                <option value="">City</option>
                <option>Cairo</option>
                <option>Giza</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="District"
              value={newAddress.district}
              onChange={(e) => handleNewAddressChange("district", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B00]"
            />

            <textarea
              placeholder="Full Address"
              value={newAddress.address}
              onChange={(e) => handleNewAddressChange("address", e.target.value)}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B00]"
            />

            <input
              type="text"
              placeholder="Landmark (optional)"
              value={newAddress.landmark}
              onChange={(e) => handleNewAddressChange("landmark", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B00]"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newAddress.saveAddress}
                onChange={(e) => handleNewAddressChange("saveAddress", e.target.checked)}
              />
              <span className="text-sm text-gray-700">Save this address for future orders</span>
            </label>
          </div>
        </div>
      )}

      {/* Order Notes */}
      <div>
        <h3 className="font-bold text-gray-900 mb-2">Order Notes (Optional)</h3>
        <textarea
          placeholder="Add any special instructions for the seller or delivery..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B00]"
        />
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 rounded-lg transition-colors"
      >
        Continue to Payment →
      </button>
    </div>
  );
}
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { AlertCircle } from "lucide-react";

const BUSINESS_TYPES = ["Manufacturer", "Distributor", "Retailer", "Importer", "Service Provider"];

export default function KemetroSellerRegistration({ categories }) {
  const [formData, setFormData] = useState({
    fullName: "",
    storeName: "",
    storeNameAr: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    businessType: "",
    commercialRegNumber: "",
    taxNumber: "",
    categoryId: "",
    description: "",
    agreeToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.agreeToTerms) {
      setError("You must agree to Seller Terms");
      setLoading(false);
      return;
    }

    try {
      const user = await base44.auth.me();
      await base44.entities.KemetroStore.create({
        userId: user.id,
        storeName: formData.storeName,
        storeNameAr: formData.storeNameAr,
        email: formData.email,
        phone: formData.phone,
        address: formData.city,
        countryId: formData.country,
        cityId: formData.city,
        description: formData.description,
        slug: formData.storeName.toLowerCase().replace(/\s+/g, "-"),
        isActive: true,
      });

      setSuccess(true);
      setFormData({
        fullName: "",
        storeName: "",
        storeNameAr: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        businessType: "",
        commercialRegNumber: "",
        taxNumber: "",
        categoryId: "",
        description: "",
        agreeToTerms: false,
      });

      setTimeout(() => {
        window.location.href = "/kemetro/seller/dashboard";
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create store. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 p-8 shadow-lg">
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          ✓ Store created successfully! Redirecting to dashboard...
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-700">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Create Your Store</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
            placeholder="Your full name"
          />
        </div>

        {/* Store Names */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Store Name (English) *</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
              placeholder="Store name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Store Name (Arabic)</label>
            <input
              type="text"
              name="storeNameAr"
              value={formData.storeNameAr}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
              placeholder="اسم المتجر"
              dir="rtl"
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Phone / WhatsApp *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
              placeholder="+20 1234567890"
            />
          </div>
        </div>

        {/* Country and City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Country *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
            >
              <option value="">Select Country</option>
              <option value="egypt">Egypt</option>
              <option value="uae">UAE</option>
              <option value="saudi">Saudi Arabia</option>
              <option value="qatar">Qatar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
              placeholder="Your city"
            />
          </div>
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Business Type *</label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
          >
            <option value="">Select Business Type</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Registration Numbers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Commercial Reg. Number</label>
            <input
              type="text"
              name="commercialRegNumber"
              value={formData.commercialRegNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
              placeholder="Registration number"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Tax Number</label>
            <input
              type="text"
              name="taxNumber"
              value={formData.taxNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
              placeholder="Tax ID"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Primary Category *</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Store Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500"
            placeholder="Tell us about your store, products, and what makes you unique..."
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="w-4 h-4 mt-1 rounded accent-teal-600"
          />
          <label className="text-sm text-gray-700">
            I agree to Kemetro's Seller Terms & Conditions and acknowledge the commission rates and policies
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6B00] hover:bg-[#e55f00] disabled:opacity-50 text-white font-black py-3.5 rounded-lg transition-colors text-lg flex items-center justify-center gap-2"
        >
          {loading ? "Creating your store..." : "Create My Store →"}
        </button>
      </form>
    </div>
  );
}
"use client";
// @ts-nocheck
import { useState } from "react";
import { CheckCircle, Upload, Plus, Eye } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const CAT_LABELS = {
  apt: "Apartment", villa: "Villa", office: "Office", shop: "Shop", land: "Land",
  warehouse: "Warehouse", townhouse: "Townhouse", duplex: "Duplex", chalet: "Chalet",
  hotel: "Hotel Apt", clinic: "Clinic", building: "Building",
};

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 text-sm last:border-0">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-bold text-right ml-4">{String(value)}</span>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h4 className="font-black text-gray-800 text-sm mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-[#FF6B00] rounded-full" />{icon && <span>{icon}</span>}{title}
      </h4>
      {children}
    </div>
  );
}

function SuccessPage({ code, onAddAnother }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-lg mx-auto">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={44} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Buy Request Submitted!</h2>
      <p className="text-gray-500 text-sm mb-4">Agents and sellers matching your criteria will reach out to you.</p>
      {code && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 mb-6 inline-block">
          <p className="text-xs text-gray-500 mb-0.5">Request Reference</p>
          <p className="font-black text-[#FF6B00] text-lg tracking-widest">{code}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/" className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md">
          <Eye size={15} /> Go Home
        </a>
        <button onClick={onAddAnother} className="flex items-center justify-center gap-2 border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
          <Plus size={15} /> New Request
        </button>
      </div>
    </div>
  );
}

export default function BRStep5Preview({ form, onBack }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    const ref = "BR-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    await apiClient.post("/api/v1/buyrequest", {
      title: form.request_title,
      description: form.description,
      category_ids: form.category_ids,
      beds: parseInt(form.beds) || null,
      baths: parseInt(form.baths) || null,
      max_rooms: parseInt(form.max_rooms) || null,
      size_min: parseFloat(form.min_size) || null,
      budget_max: parseFloat(form.budget) || null,
      country_id: form.country_id,
      province_id: form.province_id,
      city_id: form.city_id,
      district_id: form.district_id,
      area_id: form.area_id,
      request_image: form.image_url,
      amenity_ids: form.amenity_ids || [],
      is_active: true,
    });
    setCode(ref);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) return <SuccessPage code={code} onAddAnother={() => window.location.reload()} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center flex-shrink-0">
          <Eye size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black">Step 5 — Preview & Submit</p>
          <p className="text-gray-400 text-xs">Review your buy request before submitting.</p>
        </div>
      </div>

      {form.image_url && (
        <div className="h-44 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <img src={form.image_url} className="w-full h-full object-cover" alt="" />
        </div>
      )}

      {form.request_title && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 text-lg">{form.request_title}</h2>
          {form.description && <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">{form.description}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section title="Property Requirements" icon="🏠">
          <Row label="Categories" value={(form.category_ids || []).map(c => CAT_LABELS[c] || c).join(", ")} />
          <Row label="Purpose" value={form.purpose} />
          <Row label="Max Rooms" value={form.max_rooms ? `${form.max_rooms}+` : null} />
          <Row label="Beds" value={form.beds ? `${form.beds}+` : null} />
          <Row label="Baths" value={form.baths ? `${form.baths}+` : null} />
          <Row label="Min Size" value={form.min_size ? `${form.min_size} ${form.size_unit}` : null} />
          <Row label="Budget" value={form.budget ? `${Number(form.budget).toLocaleString()} ${form.currency}` : null} />
        </Section>

        <Section title="Location" icon="📍">
          <Row label="Address" value={form.address} />
          <Row label="Landmark" value={form.landmark} />
          <Row label="Zip Code" value={form.zip_code} />
        </Section>
      </div>

      {form.amenity_ids?.length > 0 && (
        <Section title="Desired Amenities" icon="✨">
          <div className="flex flex-wrap gap-2">
            {form.amenity_ids.map(a => <span key={a} className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B00]">{a}</span>)}
          </div>
        </Section>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-3">
        <button onClick={onBack} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-400 transition-colors">
          ← Back
        </button>
        <button onClick={handleSubmit} disabled={submitting}
          className="flex items-center gap-2 px-8 py-3 bg-[#FF6B00] hover:bg-[#e55f00] disabled:opacity-60 text-white rounded-xl text-sm font-black transition-colors shadow-lg">
          {submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</> : <><Upload size={15} /> Submit Request</>}
        </button>
      </div>
    </div>
  );
}
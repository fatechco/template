"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { queueRequest } from "@/lib/api-queue";
import StepShell from "@/components/create-property/StepShell";
import DraggableMapPicker from "@/components/create-property/DraggableMapPicker";

const PROJECT_TYPES = [
  "Residential Compound", "Commercial Complex", "Mixed Use", "Touristic Resort",
  "Medical Complex", "Educational Campus", "Industrial Zone", "Business Park",
];

const SUITABLE_FOR = ["Residential", "Commercial", "Administrative", "Industrial", "Tourism", "Medical", "Educational"];

const EGYPT_COUNTRY_ID = "69d0b93e19cff6ef7d6a38a7";
const EGYPT_PROVINCE_ID = "69d0ba78b2324457d06b088f";

function Label({ children, required }) {
  return (
    <label className="text-sm font-bold text-gray-700 mb-1 block">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export default function ProjStep1Info({ form, updateForm, onNext, onBack, errors, setErrors }) {
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cityNames, setCityNames] = useState({});
  const [districtNames, setDistrictNames] = useState({});
  const [areaNames, setAreaNames] = useState({});
  const [loadingInit, setLoadingInit] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadInitial() {
      setLoadingInit(true);
      try {
        const ctrs = await queueRequest(() => apiClient.get("/api/v1/" + "country", "-name", 200));
        if (!cancelled) setCountries(ctrs || []);
      } catch { if (!cancelled) setCountries([]); }

      try {
        const provs = await queueRequest(() => apiClient.list("/api/v1/province", { country_id: EGYPT_COUNTRY_ID }));
        if (!cancelled) setProvinces(provs || []);
      } catch { if (!cancelled) setProvinces([]); }

      try {
        const cits = await queueRequest(() => apiClient.list("/api/v1/city", { province_id: EGYPT_PROVINCE_ID }));
        if (!cancelled) {
          setCities(cits || []);
          const names = {};
          (cits || []).forEach(x => { names[x.id] = x.name; });
          setCityNames(names);
        }
      } catch { if (!cancelled) setCities([]); }

      if (!cancelled) setLoadingInit(false);
    }
    loadInitial();
    return () => { cancelled = true; };
  }, []);

  const loadProvinces = async (countryId) => {
    if (!countryId) { setProvinces([]); return; }
    try { setProvinces(await queueRequest(() => apiClient.list("/api/v1/province", { country_id: countryId }))); } catch { setProvinces([]); }
  };

  const loadCities = async (provinceId) => {
    if (!provinceId) { setCities([]); return; }
    try {
      const c = await queueRequest(() => apiClient.list("/api/v1/city", { province_id: provinceId }));
      setCities(c);
      const names = {}; c.forEach(x => { names[x.id] = x.name; }); setCityNames(names);
    } catch { setCities([]); }
  };

  const loadDistricts = async (cityId) => {
    if (!cityId) { setDistricts([]); return; }
    try {
      const d = await queueRequest(() => apiClient.list("/api/v1/district", { city_id: cityId }));
      setDistricts(d);
      const names = {}; d.forEach(x => { names[x.id] = x.name; }); setDistrictNames(names);
    } catch { setDistricts([]); }
  };

  const loadAreas = async (districtId) => {
    if (!districtId) { setAreas([]); return; }
    try {
      const a = await queueRequest(() => apiClient.list("/api/v1/area", { district_id: districtId }));
      setAreas(a);
      const names = {}; a.forEach(x => { names[x.id] = x.name; }); setAreaNames(names);
    } catch { setAreas([]); }
  };

  const toggleSuitable = (val) => {
    const cur = form.suitable_for || [];
    updateForm({ suitable_for: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] });
  };

  const validate = () => {
    const e = {};
    if (!form.project_type) e.project_type = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <StepShell title="Step 1 — Project Info & Location" subtitle="Basic project details and geographic location." onNext={() => { if (validate()) onNext(); }} onBack={onBack} isFirst>

      {/* Project type */}
      <div>
        <Label required>Project Type</Label>
        {errors?.project_type && <p className="text-red-500 text-xs mb-1">{errors.project_type}</p>}
        <div className="flex flex-wrap gap-2 mb-2">
          {PROJECT_TYPES.map(t => (
            <button key={t} type="button" onClick={() => updateForm({ project_type: t })}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${form.project_type === t ? "border-[#FF6B00] bg-orange-50 text-[#FF6B00]" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"}`}>
              {t}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Or type a custom project type..."
          value={PROJECT_TYPES.includes(form.project_type) ? "" : form.project_type || ""}
          onChange={e => updateForm({ project_type: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 mt-1" />
      </div>

      {/* Suitable For */}
      <div>
        <Label>Suitable For</Label>
        <div className="flex flex-wrap gap-2">
          {SUITABLE_FOR.map(s => (
            <button key={s} type="button" onClick={() => toggleSuitable(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${(form.suitable_for || []).includes(s) ? "border-[#FF6B00] bg-[#FF6B00] text-white" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Location dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Country */}
        <div>
          <Label>Country</Label>
          <select
            value={form.country_id || EGYPT_COUNTRY_ID}
            onChange={e => {
              const v = e.target.value;
              updateForm({ country_id: v, province_id: "", city_id: "", district_id: "", area_id: "" });
              setCities([]); setDistricts([]); setAreas([]); setProvinces([]);
              loadProvinces(v);
            }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Select Country</option>
            {countries.length === 0 && <option value={EGYPT_COUNTRY_ID}>Egypt</option>}
            {countries.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* Province */}
        <div>
          <Label>Province / State</Label>
          <select
            value={form.province_id || EGYPT_PROVINCE_ID}
            onChange={e => {
              const v = e.target.value;
              updateForm({ province_id: v, city_id: "", district_id: "", area_id: "" });
              setDistricts([]); setAreas([]); setCities([]);
              loadCities(v);
            }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Select Province / State</option>
            {provinces.length === 0 && <option value={EGYPT_PROVINCE_ID}>Egypt</option>}
            {provinces.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* City */}
        <div>
          <Label>City</Label>
          <select
            value={form.city_id || ""}
            onChange={e => {
              const v = e.target.value;
              updateForm({ city_id: v, district_id: "", area_id: "" });
              setAreas([]); loadDistricts(v);
            }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Select City</option>
            {cities.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* District */}
        <div>
          <Label>District</Label>
          <select
            value={form.district_id || ""}
            onChange={e => {
              const v = e.target.value;
              updateForm({ district_id: v, area_id: "" });
              loadAreas(v);
            }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Select District</option>
            {districts.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* Area */}
        <div>
          <Label>Area / Neighborhood</Label>
          <select
            value={form.area_id || ""}
            onChange={e => updateForm({ area_id: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Select Area / Neighborhood</option>
            {areas.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* Address */}
        <div>
          <Label>Address</Label>
          <input type="text" placeholder="e.g. Ring Road, New Cairo"
            value={form.address || ""} onChange={e => updateForm({ address: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
      </div>

      {/* Map */}
      <div>
        <Label>Set Location on Map</Label>
        <DraggableMapPicker
          lat={form.latitude ? parseFloat(form.latitude) : null}
          lng={form.longitude ? parseFloat(form.longitude) : null}
          onLocationChange={(lat, lng) => updateForm({ latitude: lat, longitude: lng })}
          cityName={cityNames[form.city_id] || ""}
          districtName={districtNames[form.district_id] || ""}
          areaName={areaNames[form.area_id] || ""}
          address={form.address}
        />
      </div>

      {/* Direct Phone */}
      <div>
        <Label>Direct Phone Number <span className="text-gray-400 font-normal">(optional)</span></Label>
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="tel" placeholder="+20 100 000 0000"
            value={form.direct_phone || ""}
            onChange={e => updateForm({ direct_phone: e.target.value })}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
      </div>
    </StepShell>
  );
}
"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

function FieldLabel({ children }) {
  return <label className="text-sm font-bold text-gray-700 mb-1 block">{children}</label>;
}

export default function LocationCascade({ form, updateForm }) {
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => { apiClient.get("/api/v1/" + "country", "-name", 200).then(setCountries).catch(() => {}); }, []);
  useEffect(() => {
    if (form.country_id) apiClient.list("/api/v1/province", { country_id: form.country_id }).then(setProvinces).catch(() => {});
    else setProvinces([]);
  }, [form.country_id]);
  useEffect(() => {
    if (form.province_id) apiClient.list("/api/v1/city", { province_id: form.province_id }).then(setCities).catch(() => {});
    else setCities([]);
  }, [form.province_id]);
  useEffect(() => {
    if (form.city_id) apiClient.list("/api/v1/district", { city_id: form.city_id }).then(setDistricts).catch(() => {});
    else setDistricts([]);
  }, [form.city_id]);
  useEffect(() => {
    if (form.district_id) apiClient.list("/api/v1/area", { district_id: form.district_id }).then(setAreas).catch(() => {});
    else setAreas([]);
  }, [form.district_id]);

  const fields = [
    { label: "Country", key: "country_id", options: countries, onChange: v => updateForm({ country_id: v, province_id: "", city_id: "", district_id: "", area_id: "" }) },
    { label: "Province / State", key: "province_id", options: provinces, onChange: v => updateForm({ province_id: v, city_id: "", district_id: "", area_id: "" }) },
    { label: "City", key: "city_id", options: cities, onChange: v => updateForm({ city_id: v, district_id: "", area_id: "" }) },
    { label: "District", key: "district_id", options: districts, onChange: v => updateForm({ district_id: v, area_id: "" }) },
    { label: "Area / Neighborhood", key: "area_id", options: areas, onChange: v => updateForm({ area_id: v }) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map(({ label, key, options, onChange }) => (
        <div key={key}>
          <FieldLabel>{label}</FieldLabel>
          <select value={form[key] || ""} onChange={e => onChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
            <option value="">Select {label}</option>
            {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}
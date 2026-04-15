"use client";
// @ts-nocheck
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export default function ValuationStep2Location({ data, onChange, onNext, onBack }) {
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    apiClient.get("/api/v1/" + "country", 'name', 50).then(setCountries).catch(() => {});
  }, []);

  useEffect(() => {
    if (data.countryId) {
      apiClient.list("/api/v1/province", { country_id: data.countryId }, 'name', 50).then(setProvinces).catch(() => {});
      setProvinces([]); setCities([]); setDistricts([]); setAreas([]);
    }
  }, [data.countryId]);

  useEffect(() => {
    if (data.provinceId) {
      apiClient.list("/api/v1/city", { province_id: data.provinceId }, 'name', 100).then(setCities).catch(() => {});
    }
  }, [data.provinceId]);

  useEffect(() => {
    if (data.cityId) {
      apiClient.list("/api/v1/district", { city_id: data.cityId }, 'name', 100).then(setDistricts).catch(() => {});
    }
  }, [data.cityId]);

  useEffect(() => {
    if (data.districtId) {
      apiClient.list("/api/v1/area", { district_id: data.districtId }, 'name', 100).then(setAreas).catch(() => {});
    }
  }, [data.districtId]);

  const canProceed = data.countryId && data.cityId;

  const selectStyle = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white appearance-none";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Property Location</h2>
        <p className="text-sm font-semibold text-gray-500 mt-1">Location</p>
      </div>

      <div className="space-y-4">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
            <select
              value={data.countryId || ''}
              onChange={e => {
                const country = countries.find(c => c.id === e.target.value);
                onChange('countryId', e.target.value);
                onChange('countryName', country?.name || '');
                onChange('provinceId', ''); onChange('cityId', ''); onChange('districtId', ''); onChange('areaId', '');
              }}
              className={`${selectStyle} pl-9`}
            >
              <option value="">Select Country</option>
              {countries.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Province */}
        {data.countryId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Province / Governorate</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
              <select
                value={data.provinceId || ''}
                onChange={e => { onChange('provinceId', e.target.value); onChange('cityId', ''); onChange('districtId', ''); onChange('areaId', ''); }}
                className={`${selectStyle} pl-9`}
              >
                <option value="">Select Province</option>
                {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* City */}
        {data.provinceId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City / Area</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
              <select
                value={data.cityId || ''}
                onChange={e => {
                  const city = cities.find(c => c.id === e.target.value);
                  onChange('cityId', e.target.value);
                  onChange('cityName', city?.name || '');
                  onChange('districtId', ''); onChange('areaId', '');
                }}
                className={`${selectStyle} pl-9`}
              >
                <option value="">Select City</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* District */}
        {data.cityId && districts.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">District</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
              <select
                value={data.districtId || ''}
                onChange={e => {
                  const district = districts.find(d => d.id === e.target.value);
                  onChange('districtId', e.target.value);
                  onChange('districtName', district?.name || '');
                  onChange('areaId', '');
                }}
                className={`${selectStyle} pl-9`}
              >
                <option value="">Select District (optional)</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Area */}
        {data.districtId && areas.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sub-Area (optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
              <select
                value={data.areaId || ''}
                onChange={e => onChange('areaId', e.target.value)}
                className={`${selectStyle} pl-9`}
              >
                <option value="">Select Sub-Area</option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button onClick={onNext} disabled={!canProceed} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}
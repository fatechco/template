"use client";
// @ts-nocheck
import { Upload, Edit, Phone, Mail, MapPin, Award } from "lucide-react";
import { useState } from "react";

export default function ShipperMobileProfile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Ahmed Hassan",
    email: "ahmed@logistics.com",
    phone: "+20 100 123 4567",
    city: "Cairo",
    vehicle: "Toyota Hiace Van",
    experience: "5 years",
    rating: "4.9",
    trips: "248",
  });

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your profile information</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-3">AH</div>
        {!editing ? (
          <>
            <p className="font-bold text-gray-900 text-lg">{form.name}</p>
            <p className="text-xs text-gray-500 mt-1">{form.email}</p>
            <button onClick={() => setEditing(true)} className="mt-3 text-xs font-bold text-green-600 hover:underline">
              <Edit size={12} className="inline mr-1" /> Edit Profile
            </button>
          </>
        ) : (
          <div className="space-y-2 mt-3">
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
            <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
            <button onClick={handleSave} className="w-full bg-green-600 text-white font-bold py-2 rounded-lg text-sm">Save</button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <h3 className="font-bold text-gray-900 mb-3">Contact Information</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-bold text-gray-900">{form.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-bold text-gray-900">{form.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">City</p>
              <p className="font-bold text-gray-900">{form.city}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <h3 className="font-bold text-gray-900 mb-3">Vehicle & Experience</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Vehicle</p>
            <p className="font-bold text-gray-900 text-sm mt-1">{form.vehicle}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Experience</p>
            <p className="font-bold text-gray-900 text-sm mt-1">{form.experience}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <h3 className="font-bold text-gray-900 mb-3">Performance</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="font-black text-green-600 text-lg">{form.rating}★</p>
            <p className="text-xs text-gray-500 mt-1">Rating</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="font-black text-blue-600 text-lg">{form.trips}</p>
            <p className="text-xs text-gray-500 mt-1">Trips</p>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <p className="font-black text-purple-600 text-lg">100%</p>
            <p className="text-xs text-gray-500 mt-1">Success</p>
          </div>
        </div>
      </div>
    </div>
  );
}
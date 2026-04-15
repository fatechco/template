"use client";
// @ts-nocheck
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Step1BasicInfo({ form, update, errors }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Create Your Account</h2>
        <p className="text-gray-500 text-sm mt-1">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        
        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              placeholder="First"
              value={form.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
              className={`w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50 ${
                errors.firstName ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              placeholder="Last"
              value={form.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
              className={`w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50 ${
                errors.lastName ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
            className={`w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50 ${
              errors.email ? "border-2 border-red-500" : ""
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone with country code */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Phone *</label>
          <div className="flex gap-2">
            <select
              value={form.countryCode}
              onChange={(e) => update({ countryCode: e.target.value })}
              className="w-24 bg-gray-100 rounded-lg px-3 py-3 text-sm outline-none focus:bg-gray-50 font-semibold"
            >
              <option value="+20">🇪🇬 +20</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+61">🇦🇺 +61</option>
            </select>
            <input
              type="tel"
              placeholder="1001234567"
              value={form.phone}
              onChange={(e) => update({ phone: e.target.value })}
              className={`flex-1 bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:bg-gray-50 ${
                errors.phone ? "border-2 border-red-500" : ""
              }`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Password *</label>
          <div className="relative flex items-center bg-gray-100 rounded-lg px-4 h-12">
            <span className="text-lg">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => update({ password: e.target.value })}
              className="flex-1 ml-3 bg-transparent text-sm placeholder-gray-400 outline-none text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          
          {/* Strength indicator */}
          {form.password && (
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  form.password.length >= 12
                    ? "w-full bg-green-500"
                    : form.password.length >= 8
                    ? "w-2/3 bg-yellow-500"
                    : "w-1/3 bg-red-500"
                }`}
              />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Confirm Password *</label>
          <div className="relative flex items-center bg-gray-100 rounded-lg px-4 h-12">
            <span className="text-lg">🔒</span>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) => update({ confirmPassword: e.target.value })}
              className="flex-1 ml-3 bg-transparent text-sm placeholder-gray-400 outline-none text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-gray-400"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  );
}
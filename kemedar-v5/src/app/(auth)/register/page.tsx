"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, ChevronRight, ChevronLeft, Check, Building2, Hammer, ShoppingBag, User } from "lucide-react";

const ROLE_GROUPS = [
  {
    title: "General",
    icon: User,
    roles: [
      { value: "user", label: "Property Buyer/Renter", desc: "Looking to buy or rent property" },
    ],
  },
  {
    title: "Real Estate",
    icon: Building2,
    roles: [
      { value: "agent", label: "Real Estate Agent", desc: "Licensed real estate agent" },
      { value: "developer", label: "Property Developer", desc: "Real estate developer or builder" },
    ],
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    roles: [
      { value: "product_seller", label: "Product Seller", desc: "Sell building materials on Kemetro" },
      { value: "shipper", label: "Shipper", desc: "Delivery service provider" },
    ],
  },
  {
    title: "Services",
    icon: Hammer,
    roles: [
      { value: "kemework_professional", label: "Professional", desc: "Plumber, electrician, painter, etc." },
    ],
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", role: "user" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">K</div>
            <span className="text-2xl font-bold text-slate-900">Kemedar</span>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Create Account</h1>
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2].map((s) => (
              <div key={s} className={`w-20 h-1.5 rounded-full ${s <= step ? "bg-blue-600" : "bg-slate-200"}`} />
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-2">Step {step} of 2</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+20 1XX XXX XXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" placeholder="Min 8 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
              </div>
              <button onClick={() => { if (form.name && form.email && form.password) setStep(2); else setError("Please fill all fields"); }} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-1">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-2">Choose Your Role</h3>
              <div className="space-y-3">
                {ROLE_GROUPS.map((group) => (
                  <div key={group.title}>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                      <group.icon className="w-4 h-4" />
                      {group.title}
                    </div>
                    <div className="space-y-2">
                      {group.roles.map((role) => (
                        <button
                          key={role.value}
                          onClick={() => setForm({ ...form, role: role.value })}
                          className={`w-full text-left p-3 rounded-lg border transition ${form.role === role.value ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "hover:border-slate-300"}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{role.label}</div>
                              <div className="text-xs text-slate-500">{role.desc}</div>
                            </div>
                            {form.role === role.value && <Check className="w-5 h-5 text-blue-600" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 border py-2.5 rounded-lg font-medium hover:bg-slate-50 flex items-center justify-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

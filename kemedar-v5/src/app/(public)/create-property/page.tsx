"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCreateProperty } from "@/hooks/use-properties";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, Building2, MapPin, Camera, DollarSign, Settings, FileText, Eye } from "lucide-react";

const STEPS = [
  { icon: Building2, label: "Category" },
  { icon: MapPin, label: "Location" },
  { icon: Camera, label: "Media" },
  { icon: DollarSign, label: "Price" },
  { icon: Settings, label: "Features" },
  { icon: FileText, label: "Description" },
  { icon: Eye, label: "Preview" },
];

export default function CreatePropertyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, any>>({});
  const createMutation = useCreateProperty();

  if (!user) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to list a property</h1>
        <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    try {
      await createMutation.mutateAsync({ ...form, title: form.title || "New Property" });
      router.push("/dashboard/my-properties");
    } catch {}
  };

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">List a Property</h1>
      <div className="flex gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i < step ? "bg-green-600 text-white" : i === step ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-xs mt-1 hidden md:block text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="bg-white border rounded-xl p-6 mb-4">
        <h2 className="text-lg font-bold mb-4">Step {step + 1}: {STEPS[step].label}</h2>
        {step === 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">Property Category</label>
            <select value={form.categoryId || ""} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg">
              {["", "Apartment", "Villa", "Townhouse", "Duplex", "Penthouse", "Studio", "Office", "Shop", "Land"].map((c) => (
                <option key={c} value={c}>{c || "Select category..."}</option>
              ))}
            </select>
            <label className="block text-sm font-medium mb-1 mt-3">Purpose</label>
            <div className="flex gap-2">
              {["For Sale", "For Rent"].map((p) => (
                <button key={p} onClick={() => setForm({ ...form, purposeId: p })} className={`flex-1 py-2.5 rounded-lg border text-sm font-medium ${form.purposeId === p ? "bg-blue-600 text-white border-blue-600" : "hover:bg-slate-50"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <input type="text" placeholder="City" value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" />
            <input type="text" placeholder="Address" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" />
          </div>
        )}
        {step === 2 && (
          <div className="border-2 border-dashed rounded-xl p-8 text-center text-slate-400">
            <Camera className="w-10 h-10 mx-auto mb-2" />
            <p>Upload photos of your property</p>
            <input type="text" placeholder="Featured image URL" value={form.featuredImage || ""} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg mt-4 text-sm" />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <input type="number" placeholder="Price (EGP)" value={form.priceAmount || ""} onChange={(e) => setForm({ ...form, priceAmount: Number(e.target.value) })} className="w-full px-4 py-2.5 border rounded-lg" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isNegotiable || false} onChange={(e) => setForm({ ...form, isNegotiable: e.target.checked })} />
              Price is negotiable
            </label>
          </div>
        )}
        {step === 4 && <div className="text-slate-500 text-center py-4">Add amenities, area size, bedrooms, bathrooms</div>}
        {step === 5 && (
          <div className="space-y-3">
            <input type="text" placeholder="Property Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" />
            <textarea placeholder="Description" rows={4} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg resize-none" />
          </div>
        )}
        {step === 6 && (
          <div className="text-center py-4">
            <h3 className="font-bold text-lg mb-2">{form.title || "Untitled Property"}</h3>
            <p className="text-slate-500">{form.city || "Location not set"} &bull; {form.priceAmount ? `${form.priceAmount.toLocaleString()} EGP` : "Price not set"}</p>
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 border rounded-lg disabled:opacity-50 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />Back
        </button>
        {step < 6 ? (
          <button onClick={() => setStep(step + 1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1">
            Next<ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={createMutation.isPending} className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium disabled:opacity-50">
            {createMutation.isPending ? "Publishing..." : "Publish Property"}
          </button>
        )}
      </div>
    </div>
  );
}

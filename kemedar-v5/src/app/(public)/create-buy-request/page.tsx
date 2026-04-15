"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { FileText, CheckCircle, Loader2 } from "lucide-react";

export default function CreateBuyRequestPage() {
  const [form, setForm] = useState({ title: "", propertyType: "", minBudget: "", maxBudget: "", city: "", bedrooms: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: typeof form) => apiClient.post<any>("/api/v1/buy-requests", data),
    onSuccess: () => setSubmitted(true),
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div className="container mx-auto max-w-3xl py-16 px-4 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Request Submitted!</h1>
        <p className="text-slate-500">Agents matching your criteria will contact you soon.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold">Post a Buy Request</h1>
        <p className="text-slate-500 mt-2">Tell agents what you&apos;re looking for</p>
      </div>
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="What are you looking for?" className="w-full px-4 py-2.5 border rounded-lg" />
        <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className="w-full px-4 py-2.5 border rounded-lg">
          <option value="">Select property type...</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="office">Office</option>
          <option value="land">Land</option>
          <option value="shop">Shop / Commercial</option>
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" value={form.minBudget} onChange={(e) => update("minBudget", e.target.value)} placeholder="Min Budget (EGP)" className="px-4 py-2.5 border rounded-lg" />
          <input type="number" value={form.maxBudget} onChange={(e) => update("maxBudget", e.target.value)} placeholder="Max Budget (EGP)" className="px-4 py-2.5 border rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={form.city} onChange={(e) => update("city", e.target.value)} className="px-4 py-2.5 border rounded-lg">
            <option value="">Select city...</option>
            <option value="cairo">Cairo</option>
            <option value="giza">Giza</option>
            <option value="alexandria">Alexandria</option>
            <option value="hurghada">Hurghada</option>
          </select>
          <select value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className="px-4 py-2.5 border rounded-lg">
            <option value="">Bedrooms...</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
        </div>
        <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe your requirements in detail..." rows={3} className="w-full px-4 py-2.5 border rounded-lg resize-none" />
        <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || !form.title} className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
          {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Submit Request
        </button>
        {mutation.isError && <p className="text-red-500 text-sm text-center">Failed to submit. Please try again.</p>}
      </div>
    </div>
  );
}

"use client";

import { useMyDNA } from "@/hooks/use-scoring";
import { Dna, Home, MapPin, Heart, DollarSign, Loader2 } from "lucide-react";
import Link from "next/link";

const DNA_SECTIONS = [
  { key: "preferredTypes", label: "Preferred Property Types", icon: Home },
  { key: "preferredLocations", label: "Preferred Locations", icon: MapPin },
  { key: "lifestyleTraits", label: "Lifestyle Traits", icon: Heart },
  { key: "budgetProfile", label: "Budget Profile", icon: DollarSign },
];

export default function DnaPage() {
  const { data, isLoading } = useMyDNA();
  const dna = data;

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="text-center mb-8">
        <Dna className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Your Property DNA</h1>
        <p className="text-slate-500 mt-2">Your unique property preference profile built from your activity</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-rose-600 mx-auto" />
          <p className="text-sm text-slate-500 mt-3">Analyzing your profile...</p>
        </div>
      ) : dna ? (
        <div className="space-y-4">
          {DNA_SECTIONS.map((section) => {
            const Icon = section.icon;
            const values = dna[section.key];
            return (
              <div key={section.key} className="bg-white rounded-xl border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold">{section.label}</h3>
                </div>
                {Array.isArray(values) && values.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {values.map((v: string, i: number) => (
                      <span key={i} className="text-sm bg-rose-50 text-rose-700 px-3 py-1 rounded-full">{v}</span>
                    ))}
                  </div>
                ) : typeof values === "object" && values ? (
                  <div className="space-y-2 text-sm text-slate-600">
                    {Object.entries(values).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                        <span className="font-medium">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Not enough data yet</p>
                )}
              </div>
            );
          })}

          <div className="text-center mt-6">
            <Link href="/kemedar/advisor" className="text-sm text-rose-600 hover:underline">
              Update preferences with KemeAdvisor
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center text-slate-400">
          <Dna className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No DNA profile yet</h3>
          <p className="text-sm mt-1">Browse properties and use KemeAdvisor to build your profile</p>
          <Link href="/kemedar/advisor" className="inline-block mt-4 bg-rose-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-rose-700">
            Start KemeAdvisor
          </Link>
        </div>
      )}
    </div>
  );
}

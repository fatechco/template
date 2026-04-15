"use client";

import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { Shield, CheckCircle, Lock, Star, Award, Crown, Loader2, Upload } from "lucide-react";

const LEVELS = [
  { level: 1, name: "Basic", icon: Shield, color: "bg-slate-100 text-slate-600 border-slate-300", description: "Email and phone verified", features: ["Email verification", "Phone verification", "Basic profile"] },
  { level: 2, name: "Identity", icon: Lock, color: "bg-blue-50 text-blue-600 border-blue-300", description: "Government ID verified", features: ["National ID upload", "Selfie verification", "Address confirmation"] },
  { level: 3, name: "Professional", icon: Star, color: "bg-purple-50 text-purple-600 border-purple-300", description: "Professional credentials verified", features: ["License verification", "Company registration", "Professional references"] },
  { level: 4, name: "Trusted", icon: Award, color: "bg-amber-50 text-amber-600 border-amber-300", description: "Track record and reviews verified", features: ["Transaction history", "Community reviews", "Background check"] },
  { level: 5, name: "Elite", icon: Crown, color: "bg-yellow-50 text-yellow-700 border-yellow-400", description: "Highest trust level with premium benefits", features: ["Priority listings", "Reduced fees", "Elite badge", "Dedicated support"] },
];

export default function VerifyPage() {
  const { user } = useAuth();
  const { data: status, isLoading } = useQuery({
    queryKey: ["user-verification", user?.id],
    queryFn: () => apiClient.get<any>("/api/v1/verification/user/status"),
    enabled: !!user,
  });

  const currentLevel = status?.level ?? 0;

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Verify Pro</h1>
        <p className="text-slate-500 mt-2">Build trust with 5 levels of verification</p>
      </div>

      {/* Progress bar */}
      <div className="bg-white border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Your Level: <span className="text-blue-600">{currentLevel > 0 ? LEVELS[currentLevel - 1]?.name : "Unverified"}</span></span>
          <span className="text-sm text-slate-500">{currentLevel}/5</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${(currentLevel / 5) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {LEVELS.map((lvl) => {
          const Icon = lvl.icon;
          const isCompleted = currentLevel >= lvl.level;
          const isCurrent = currentLevel === lvl.level - 1;
          return (
            <div key={lvl.level} className={`border rounded-xl p-6 ${isCompleted ? "bg-green-50 border-green-200" : lvl.color}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm ${isCompleted ? "bg-green-500 text-white" : "bg-white"}`}>
                  {isCompleted ? <CheckCircle className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">Level {lvl.level}: {lvl.name}</h3>
                    {isCompleted && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Completed</span>}
                  </div>
                  <p className="text-sm opacity-80 mt-0.5">{lvl.description}</p>
                </div>
                {isCurrent ? (
                  <Link href="/dashboard/verification" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Start
                  </Link>
                ) : !isCompleted ? (
                  <button disabled className="bg-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm opacity-50 cursor-not-allowed">Locked</button>
                ) : null}
              </div>
              <div className="mt-4 pl-18">
                <ul className="flex flex-wrap gap-2">
                  {lvl.features.map((f) => (
                    <li key={f} className={`flex items-center gap-1 text-xs rounded-full px-3 py-1 ${isCompleted ? "bg-green-100/80" : "bg-white/50"}`}>
                      <CheckCircle className="w-3 h-3" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link href="/kemedar/score" className="text-sm text-blue-600 hover:underline">
          View your current Kemedar Score
        </Link>
      </div>
    </div>
  );
}

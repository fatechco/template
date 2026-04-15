"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api-client";
import { Shield, CheckCircle, Circle, Upload, FileCheck, Loader2 } from "lucide-react";

const LEVELS = [
  { level: 1, label: "Email Verified", description: "Confirm your email address" },
  { level: 2, label: "Phone Verified", description: "Verify your phone number via SMS" },
  { level: 3, label: "ID Verified", description: "Upload a government-issued ID" },
  { level: 4, label: "Address Verified", description: "Provide proof of address" },
  { level: 5, label: "Fully Verified", description: "Complete background check" },
];

export default function VerificationPage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState<number | null>(null);

  const { data: verificationData, isLoading } = useQuery({
    queryKey: ["verification-status"],
    queryFn: () => apiClient.get<any>("/api/v1/users/verification"),
  });

  const currentLevel = verificationData?.currentLevel ?? (user?.isVerified ? 1 : 0);
  const documents = verificationData?.documents || [];

  const handleVerify = async (level: number) => {
    if (level <= 2) {
      // Email/phone verification would trigger an OTP flow
      setUploading(level);
      setTimeout(() => setUploading(null), 1500);
      return;
    }
    // For document-based levels, trigger file upload
    setUploading(level);
    setTimeout(() => setUploading(null), 1500);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Verification</h1>
        <div className="animate-pulse space-y-4">
          <div className="bg-white border rounded-xl p-6 h-24" />
          <div className="bg-white border rounded-xl p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Verification</h1>

      {/* Status card */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="font-bold">Verification Status: Level {currentLevel}</h2>
            <p className="text-sm text-slate-500">Complete more steps to increase your trust level</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-2">
          {LEVELS.map((l) => (
            <div key={l.level} className={`h-2 flex-1 rounded-full ${l.level <= currentLevel ? "bg-green-500" : "bg-slate-200"}`} />
          ))}
        </div>
        <p className="text-xs text-slate-500 text-right">{currentLevel} / {LEVELS.length} completed</p>
      </div>

      {/* Verification steps */}
      <div className="bg-white border rounded-xl p-6">
        <div className="space-y-3">
          {LEVELS.map((l) => {
            const isDone = l.level <= currentLevel;
            const isCurrent = l.level === currentLevel + 1;
            const doc = documents.find((d: any) => d.level === l.level);

            return (
              <div key={l.level} className={`flex items-center gap-3 p-3 rounded-lg ${isDone ? "bg-green-50" : isCurrent ? "bg-blue-50" : "bg-slate-50"}`}>
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                )}
                <div className="flex-1">
                  <span className={isDone ? "text-slate-800 font-medium text-sm" : "text-slate-500 text-sm"}>{l.label}</span>
                  <p className="text-xs text-slate-400">{l.description}</p>
                  {doc && doc.status === "pending" && (
                    <span className="text-xs text-amber-600 flex items-center gap-1 mt-1"><FileCheck className="w-3 h-3" /> Document under review</span>
                  )}
                </div>
                {!isDone && (
                  <button
                    onClick={() => handleVerify(l.level)}
                    disabled={!isCurrent || uploading === l.level}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    {uploading === l.level ? <Loader2 className="w-3 h-3 animate-spin" /> : l.level > 2 ? <Upload className="w-3 h-3" /> : null}
                    {l.level > 2 ? "Upload" : "Verify"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

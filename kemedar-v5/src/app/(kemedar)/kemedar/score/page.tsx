"use client";

import { useMyScore } from "@/hooks/use-scoring";
import { Award, TrendingUp, Shield, Clock, Star } from "lucide-react";
import Link from "next/link";

const SCORE_FACTORS = [
  { key: "profile", label: "Profile Completeness", icon: Star },
  { key: "verification", label: "Verification Level", icon: Shield },
  { key: "activity", label: "Platform Activity", icon: TrendingUp },
  { key: "history", label: "Transaction History", icon: Clock },
];

export default function ScorePage() {
  const { data, isLoading } = useMyScore();
  const score = data;

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="text-center mb-8">
        <Award className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Kemedar Score</h1>
        <p className="text-slate-500 mt-2">Your trust and reliability score on the platform</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border p-12 animate-pulse">
          <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border p-8 text-center mb-6">
            <div className="w-32 h-32 mx-auto rounded-full border-8 border-amber-400 flex items-center justify-center mb-4">
              <div>
                <div className="text-4xl font-bold text-amber-600">{score?.totalScore ?? "—"}</div>
                <div className="text-xs text-slate-400">/ 1000</div>
              </div>
            </div>
            <div className="text-lg font-semibold">{score?.tier || "Newcomer"}</div>
            <p className="text-sm text-slate-500 mt-1">Keep improving to unlock more platform features</p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-bold mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              {SCORE_FACTORS.map((f) => {
                const Icon = f.icon;
                const val = score?.[f.key] ?? 0;
                return (
                  <div key={f.key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Icon className="w-4 h-4 text-amber-600" />{f.label}
                      </div>
                      <span className="text-sm font-bold">{val}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(100, val / 2.5)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link href="/kemedar/verify" className="text-sm text-amber-600 hover:underline">
              Improve your score with Verify Pro
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

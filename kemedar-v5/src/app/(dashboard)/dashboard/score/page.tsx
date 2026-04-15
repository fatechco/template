"use client";

import { Award } from "lucide-react";
import { useMyScore } from "@/hooks/use-scoring";

export default function ScorePage() {
  const { data: score } = useMyScore();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kemedar Score</h1>
      <div className="bg-white border rounded-xl p-8 text-center">
        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <div className="text-5xl font-bold text-blue-600 mb-2">{score?.totalScore ?? 0}</div>
        <p className="text-slate-500 mb-6">Your Kemedar Trust Score</p>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-lg font-bold">{score?.activityScore ?? 0}</div>
            <div className="text-xs text-slate-500">Activity</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-lg font-bold">{score?.verificationScore ?? 0}</div>
            <div className="text-xs text-slate-500">Verification</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-lg font-bold">{score?.reputationScore ?? 0}</div>
            <div className="text-xs text-slate-500">Reputation</div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
// @ts-nocheck
import { apiClient } from '@/lib/api-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ValuationResultActions({ valuation, onRecalculate }) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!valuation?.id) return;
    setSaving(true);
    try {
      if (valuation.valuationGoal === 'own_property') {
        await apiClient.post("/api/v1/valuationportfolio", {
          userId: valuation.userId,
          valuationId: valuation.id,
          portfolioType: 'portfolio',
          currentEstimate: valuation.estimatedPriceMid,
        });
        router.push('/dashboard/valuations');
      } else {
        router.push('/dashboard/valuations');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/kemedar/valuation/report/${valuation?.id}`;
    if (navigator.share) {
      navigator.share({ title: 'Property Valuation Report', url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-3">
      <button onClick={handleSave} disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
        <span>{valuation?.valuationGoal === 'own_property' ? '💾' : '📋'}</span>
        <span>{saving ? 'Saving...' : valuation?.valuationGoal === 'own_property' ? 'Save to Portfolio' : 'Save to My Valuations'}</span>
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={handleShare} className="border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
          <span>📤</span> Share Report
        </button>
        <button className="border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
          <span>🖨️</span> Download PDF
        </button>
      </div>
      <button onClick={onRecalculate} className="w-full text-center text-gray-400 hover:text-blue-600 text-sm py-2 transition-colors">
        🔄 Recalculate
      </button>
    </div>
  );
}
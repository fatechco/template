import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ValuationResultHero from '@/components/valuation/ValuationResultHero';
import ValuationGradeCard from '@/components/valuation/ValuationGradeCard';
import ValuationPriceTrends from '@/components/valuation/ValuationPriceTrends';
import ValuationMarketOverview from '@/components/valuation/ValuationMarketOverview';
import ValuationPriceChart from '@/components/valuation/ValuationPriceChart';
import ValuationROICalculator from '@/components/valuation/ValuationROICalculator';

export default function ValuationReport() {
  const { id } = useParams();
  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      base44.entities.PropertyValuation.filter({ id }).then(res => {
        setValuation(res?.[0] || null);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin text-4xl">⏳</div>
    </div>
  );

  if (!valuation) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-bold text-gray-700 text-xl">Valuation not found</p>
        <Link to="/kemedar/valuation" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">New Valuation →</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 print:py-4">
        {/* Report Header */}
        <div className="flex items-center justify-between mb-6 print:mb-4">
          <div className="flex items-center gap-3">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/0687980a4_kemedar-Logo-ar-6000.png" alt="Kemedar" className="h-8 object-contain" />
            <div>
              <p className="font-black text-gray-900 text-sm">Property Valuation Report</p>
              <p className="text-xs text-gray-400">Powered by Kemedar AI</p>
            </div>
          </div>
          <div className="print:hidden flex gap-2">
            <button onClick={() => window.print()} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">🖨️ Print</button>
          </div>
        </div>

        {/* Property Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Property Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {[
              ['Type', valuation.propertyType],
              ['Purpose', valuation.purpose],
              ['Area', `${valuation.totalArea} sqm`],
              ['Bedrooms', valuation.bedrooms],
              ['Bathrooms', valuation.bathrooms],
              ['Floor', valuation.floor],
              ['Finishing', valuation.finishing],
              ['View', valuation.viewType],
              ['Location', valuation.locationLabel || valuation.cityName],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <ValuationResultHero valuation={valuation} />
          <ValuationGradeCard valuation={valuation} />
          <ValuationPriceTrends valuation={valuation} />
          <ValuationMarketOverview valuation={valuation} />
          <ValuationPriceChart valuation={valuation} />
          <ValuationROICalculator valuation={valuation} />
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-xs text-yellow-800">
            <strong>Disclaimer:</strong> This valuation is an estimate based on market data from Kemedar listings. It is not a formal appraisal and should not be used as the sole basis for financial decisions.
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Generated: {new Date(valuation.calculatedAt || valuation.created_date).toLocaleDateString()} | Valid for 30 days
          </p>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center print:hidden">
          <p className="text-gray-500 text-sm mb-3">Want to value your own property?</p>
          <Link to="/kemedar/valuation" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            Get your own valuation →
          </Link>
        </div>
      </div>
    </div>
  );
}
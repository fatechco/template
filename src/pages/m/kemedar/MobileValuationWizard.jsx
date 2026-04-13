import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import ValuationStep1Goal from '@/components/valuation/ValuationStep1Goal';
import ValuationStep2Location from '@/components/valuation/ValuationStep2Location';
import ValuationStep3Details from '@/components/valuation/ValuationStep3Details';
import ValuationResultHero from '@/components/valuation/ValuationResultHero';
import ValuationGradeCard from '@/components/valuation/ValuationGradeCard';
import ValuationPriceTrends from '@/components/valuation/ValuationPriceTrends';
import ValuationMarketOverview from '@/components/valuation/ValuationMarketOverview';
import ValuationPriceChart from '@/components/valuation/ValuationPriceChart';
import ValuationROICalculator from '@/components/valuation/ValuationROICalculator';
import ValuationResultActions from '@/components/valuation/ValuationResultActions';

const INITIAL_DATA = {
  valuationGoal: '', propertyType: '', purpose: 'Sale',
  countryId: '', provinceId: '', cityId: '', districtId: '', areaId: '',
  countryName: '', cityName: '', districtName: '',
  totalArea: '', bedrooms: 2, bathrooms: 1, floor: 0,
  finishing: 'Finished', yearBuilt: '', viewType: 'Street',
  hasParking: false, hasPool: false, hasGarden: false,
};

export default function MobileValuationWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  const pct = Math.round((step / 4) * 100);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setStep(4);
    try {
      const response = await base44.functions.invoke('calculateValuation', data);
      setResult(response.data?.valuation);
    } catch (e) {
      setError('Failed to calculate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = () => { setStep(1); setData(INITIAL_DATA); setResult(null); };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileTopBar title="Property Valuation" showBack onBack={() => step > 1 && step < 4 ? setStep(s => s - 1) : navigate(-1)} />

      {/* Progress */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Step {step} of 4</span>
          <span className="font-bold text-blue-600">{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="px-4 py-5">
        {step === 1 && <ValuationStep1Goal data={data} onChange={handleChange} onNext={() => setStep(2)} />}
        {step === 2 && <ValuationStep2Location data={data} onChange={handleChange} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <ValuationStep3Details data={data} onChange={handleChange} onNext={handleCalculate} onBack={() => setStep(2)} />}
        {step === 4 && loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="text-5xl animate-bounce">🏠</div>
            <p className="font-bold text-gray-900">Calculating market value...</p>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}
        {step === 4 && !loading && error && (
          <div className="text-center py-12">
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button onClick={handleRecalculate} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold">Try Again</button>
          </div>
        )}
        {step === 4 && !loading && result && (
          <div className="space-y-4">
            <ValuationResultHero valuation={result} />
            <ValuationGradeCard valuation={result} />
            <ValuationPriceTrends valuation={result} />
            <ValuationMarketOverview valuation={result} />
            <ValuationPriceChart valuation={result} />
            <ValuationROICalculator valuation={result} />
            <ValuationResultActions valuation={result} onRecalculate={handleRecalculate} />
          </div>
        )}
      </div>
    </div>
  );
}
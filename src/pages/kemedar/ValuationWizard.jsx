import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import SiteHeader from '@/components/header/SiteHeader';
import SiteFooter from '@/components/home/SiteFooter';
import ValuationProgressBar from '@/components/valuation/ValuationProgressBar';
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

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="text-6xl animate-bounce">🏠</div>
      <div className="text-center">
        <p className="font-bold text-gray-900 text-lg">Calculating market value...</p>
        <p className="text-gray-500 text-sm mt-1">Analyzing location, demand & market trends</p>
      </div>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }} />
      </div>
    </div>
  );
}

export default function ValuationWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setStep(4);
    try {
      const response = await base44.functions.invoke('calculateValuation', data);
      setResult(response.data?.valuation);
    } catch (e) {
      setError('Failed to calculate valuation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = () => {
    setStep(1);
    setData(INITIAL_DATA);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900">Property Valuation</h1>
          <p className="text-gray-500 mt-1 text-sm">AI-powered market analysis in seconds</p>
        </div>

        <ValuationProgressBar currentStep={step} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {step === 1 && (
            <ValuationStep1Goal data={data} onChange={handleChange} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <ValuationStep2Location data={data} onChange={handleChange} onNext={() => setStep(3)} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <ValuationStep3Details data={data} onChange={handleChange} onNext={handleCalculate} onBack={() => setStep(2)} />
          )}
          {step === 4 && loading && <LoadingState />}
          {step === 4 && !loading && error && (
            <div className="text-center py-12 space-y-4">
              <p className="text-red-500 font-semibold">{error}</p>
              <button onClick={handleRecalculate} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold">Try Again</button>
            </div>
          )}
          {step === 4 && !loading && result && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-gray-900">Your Valuation Results</h2>
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
      <SiteFooter />
    </div>
  );
}
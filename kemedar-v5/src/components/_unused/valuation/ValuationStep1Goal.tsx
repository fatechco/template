// @ts-nocheck
export default function ValuationStep1Goal({ data, onChange, onNext }) {
  const selected = data.valuationGoal;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Choose your valuation goal</h2>
        <p className="text-gray-500 mt-1 text-sm">Select what you want to do with this valuation</p>
      </div>

      <div className="space-y-4">
        {/* Card A */}
        <button
          onClick={() => onChange('valuationGoal', 'own_property')}
          className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
            selected === 'own_property'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🏢</span>
            <div>
              <p className="font-bold text-gray-900 text-base">Value a property I own</p>
              <p className="text-gray-500 text-sm mt-0.5">Get the current market value of your property</p>
            </div>
            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === 'own_property' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
              {selected === 'own_property' && <span className="text-white text-xs">✓</span>}
            </div>
          </div>
        </button>
        {selected === 'own_property' && (
          <p className="text-sm text-gray-600 pl-2 flex items-center gap-2">
            <span className="text-yellow-500">●</span>
            The result will be saved in{' '}
            <a href="/dashboard/valuations" className="text-blue-600 hover:underline font-medium">My Portfolio</a>
          </p>
        )}

        {/* Card B */}
        <button
          onClick={() => onChange('valuationGoal', 'check_value')}
          className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
            selected === 'check_value'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🏘️</span>
            <div>
              <p className="font-bold text-gray-900 text-base">Check a property's value</p>
              <p className="text-gray-500 text-sm mt-0.5">Research market value before buying or investing</p>
            </div>
            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === 'check_value' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
              {selected === 'check_value' && <span className="text-white text-xs">✓</span>}
            </div>
          </div>
        </button>
        {selected === 'check_value' && (
          <p className="text-sm text-gray-600 pl-2 flex items-center gap-2">
            <span className="text-yellow-500">●</span>
            The result will be saved in{' '}
            <a href="/dashboard/valuations" className="text-blue-600 hover:underline font-medium">My Valuations</a>
          </p>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
      >
        Next
      </button>
    </div>
  );
}
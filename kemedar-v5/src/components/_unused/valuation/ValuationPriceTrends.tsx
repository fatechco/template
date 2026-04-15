// @ts-nocheck
import { formatCurrency, getPriceVsMarketLabel, getSizeVsMarketLabel } from './ValuationUtils';

export default function ValuationPriceTrends({ valuation }) {
  const priceInfo = getPriceVsMarketLabel(valuation.priceVsMarket || 0);
  const sizeInfo = getSizeVsMarketLabel(valuation.sizeVsMarket || 0);
  const locationLabel = valuation.districtName || valuation.cityName || 'this area';

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Prices & Trends</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price vs Market */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-900 text-sm leading-snug">
              {priceInfo.sentiment === 'negative' && `This property costs ${priceInfo.label}`}
              {priceInfo.sentiment === 'positive' && `This property costs ${priceInfo.label}`}
              {priceInfo.sentiment === 'neutral' && 'This property is priced at market average'}
            </p>
            <span className="text-3xl">{priceInfo.icon}</span>
          </div>
          <p className="text-xs text-gray-500">
            Average price: <span className="font-bold">{formatCurrency(valuation.marketAveragePricePerSqm)}/m²</span>
          </p>
        </div>

        {/* Size vs Market */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-900 text-sm leading-snug">
              {sizeInfo.sentiment === 'positive' && `This property is ${sizeInfo.label}`}
              {sizeInfo.sentiment === 'negative' && `This property is ${sizeInfo.label}`}
              {sizeInfo.sentiment === 'neutral' && 'This property is at average size'}
            </p>
            <span className="text-3xl">{sizeInfo.icon}</span>
          </div>
          <p className="text-xs text-gray-500">
            Average size: <span className="font-bold">{valuation.marketData?.avgSize || 'N/A'} sqm</span>
          </p>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 italic">
        The data displayed is based on average prices and sizes of all Kemedar listings that were live in {locationLabel}.
      </p>
    </div>
  );
}
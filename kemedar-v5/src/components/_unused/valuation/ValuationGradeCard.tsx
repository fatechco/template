// @ts-nocheck
import { GRADE_CONFIG } from './ValuationUtils';

export default function ValuationGradeCard({ valuation }) {
  const grade = valuation?.investmentGrade || 'B';
  const config = GRADE_CONFIG[grade] || GRADE_CONFIG['B'];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
      <div className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md"
        style={{ backgroundColor: config.color }}>
        {grade}
      </div>
      <div>
        <p className="font-bold text-gray-900 text-base">Investment Grade</p>
        <p className="text-gray-600 text-sm mt-0.5">{config.label}</p>
        {valuation.roiScore && (
          <p className="text-gray-400 text-xs mt-1">Overall Score: {valuation.roiScore}/100</p>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2 } from 'lucide-react';

const TAG_CONFIG = [
  { key: 'locations', icon: '📍', label: 'Location', color: 'bg-blue-100 text-blue-700 border-blue-200', render: v => v?.map(l => l.name).join(', ') || null },
  { key: 'budgetMax', icon: '💰', label: 'Max Budget', color: 'bg-green-100 text-green-700 border-green-200', render: (v, c) => v ? `Up to ${Number(v).toLocaleString()} ${c.currency || 'EGP'}` : null },
  { key: 'budgetMin', icon: '💰', label: 'Min Budget', color: 'bg-green-100 text-green-700 border-green-200', render: (v, c) => v ? `From ${Number(v).toLocaleString()} ${c.currency || 'EGP'}` : null },
  { key: 'bedroomsMin', icon: '🛏', label: 'Bedrooms', color: 'bg-orange-100 text-orange-700 border-orange-200', render: v => v != null ? `${v}+ beds` : null },
  { key: 'propertyType', icon: '🏠', label: 'Type', color: 'bg-gray-100 text-gray-700 border-gray-200', render: v => v || null },
  { key: 'purpose', icon: '🎯', label: 'Purpose', color: 'bg-purple-100 text-purple-700 border-purple-200', render: v => v || null },
  { key: 'finishing', icon: '🏗', label: 'Finishing', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', render: v => v || null },
  { key: 'urgency', icon: '📅', label: 'Timeline', color: 'bg-gray-100 text-gray-500 border-gray-200', render: v => v ? v.replace('3months', '3 months') : 'Not specified' },
];

export default function AIRequirementsCard({ criteria, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  if (!criteria) return null;

  const tags = TAG_CONFIG.map(t => {
    const value = t.render(criteria[t.key], criteria);
    if (!value) return null;
    return { ...t, value };
  }).filter(Boolean);

  const mustHaves = criteria.mustHaveAmenities || [];
  const niceToHaves = criteria.niceToHaveAmenities || [];

  return (
    <div className="bg-white rounded-2xl border border-purple-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-black text-gray-900 text-sm">Here's what I understood:</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-400 flex items-center gap-1 hover:text-gray-600"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Less' : 'More'}
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-xs text-purple-600 font-bold hover:text-purple-800"
            >
              <Edit2 size={12} /> Edit criteria
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${tag.color}`}>
            {tag.icon} {tag.label}: {tag.value}
          </span>
        ))}
        {mustHaves.map((a, i) => (
          <span key={`must-${i}`} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-teal-50 text-teal-700 border-teal-200">
            ✅ {a}
          </span>
        ))}
        {expanded && niceToHaves.map((a, i) => (
          <span key={`nice-${i}`} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-gray-50 text-gray-500 border-gray-200">
            💡 {a}
          </span>
        ))}
      </div>

      {criteria.userGoal && (
        <div className="mt-3 bg-purple-50 rounded-xl px-3 py-2 border border-purple-100">
          <p className="text-xs text-purple-700"><span className="font-bold">Goal:</span> {criteria.userGoal}</p>
        </div>
      )}
    </div>
  );
}
import { useNavigate } from 'react-router-dom';

export default function ConciergeCardBanner({ journey, propertyId }) {
  const navigate = useNavigate();

  if (!journey) return null;

  const handleClick = () => {
    navigate(`/dashboard/concierge/${journey.id}`);
  };

  if (journey.status === 'Completed') {
    return (
      <div
        onClick={handleClick}
        className="h-3 bg-green-500 text-white text-[10px] font-bold flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
      >
        ✅ Move-in complete
      </div>
    );
  }

  if (journey.status === 'Active') {
    return (
      <div
        onClick={handleClick}
        className="h-3 bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors"
      >
        🗝️ Concierge active — {Math.round(journey.completionPercentage || 0)}% complete
      </div>
    );
  }

  return null;
}
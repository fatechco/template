import { Link } from "react-router-dom";

export default function BuildGroupBuyBanner({ project }) {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">👥</div>
      <div className="flex-1">
        <p className="font-black text-white text-base">Group Buy Opportunity!</p>
        <p className="text-amber-100 text-sm">Your flooring order qualifies for bulk pricing. Join others in your area to save up to 30%.</p>
      </div>
      <Link
        to={`/kemetro/build/${project.id}/group-buy`}
        className="bg-white text-amber-600 font-black px-4 py-2 rounded-xl hover:bg-amber-50 transition-colors flex-shrink-0 text-sm"
      >
        Join Group →
      </Link>
    </div>
  );
}
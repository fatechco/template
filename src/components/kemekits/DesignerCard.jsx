import { Link } from "react-router-dom";

export default function DesignerCard({ designer, creatorName }) {
  const name = designer?.full_name || creatorName || "Designer";
  const firstName = name.split(" ")[0];
  const username = designer?.username || designer?.id;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border-l-4 border-blue-600">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-black text-xl overflow-hidden border-2 border-blue-200">
          {designer?.avatar ? (
            <img src={designer.avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            name[0].toUpperCase()
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-base">{name}</p>
          <p className="text-gray-400 text-xs mb-1">Kemework Interior Designer</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>⭐ {designer?.rating || "4.8"} ({designer?.reviewCount || "—"} reviews)</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mt-3 mb-4">
        Love this style? Work with <span className="font-bold text-gray-900">{firstName}</span> directly to install this exact design in your home.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => {}}
          className="flex-1 flex items-center justify-center gap-2 border border-blue-500 text-blue-600 font-bold text-sm py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
        >
          💬 Message Designer
        </button>
        {username && (
          <Link
            to={`/kemework/freelancer/${username}`}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            🎨 View Portfolio
          </Link>
        )}
      </div>
    </div>
  );
}
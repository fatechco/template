// @ts-nocheck
import { MapPin, Star, Phone, MessageCircle, Share2, ShieldCheck } from "lucide-react";

export default function ProfileHero({ name, subtitle, avatar, isCircle = true, coverBg, coverImage, location, rating, reviewCount, isVerified, isFeatured, roleBadge, stats = [], phone, onShowPhone, showPhone, children }) {
  return (
    <div className="mb-6">
      {/* Cover banner — standalone, fixed height */}
      <div className="w-full h-44 rounded-2xl overflow-hidden relative">
        {coverImage ? (
          <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: coverBg || "linear-gradient(135deg, #1a1a2e 0%, #FF6B00 100%)" }} />
        )}
        {isFeatured && (
          <span className="absolute top-4 right-4 bg-[#FF6B00] text-white text-xs font-bold px-3 py-1.5 rounded-full">⭐ FEATURED</span>
        )}
      </div>

      {/* Info card — fully below cover, no overlap */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 pt-5 pb-5 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Avatar */}
          <div className={`relative flex-shrink-0 w-16 h-16 ${isCircle ? "rounded-full" : "rounded-2xl"} border-2 border-gray-100 shadow overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600`}>
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-black text-2xl">
                {name?.[0]?.toUpperCase()}
              </div>
            )}
            {isVerified && (
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <ShieldCheck size={9} className="text-white" />
              </div>
            )}
          </div>

          {/* Name + subtitle + location + rating */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-gray-900 leading-tight">{name}</h1>
              {roleBadge && (
                <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold px-2.5 py-0.5 rounded-full">{roleBadge}</span>
              )}
              {isVerified && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={10} /> VERIFIED
                </span>
              )}
            </div>
            {subtitle && <p className="text-sm text-gray-500 mb-1.5">{subtitle}</p>}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#FF6B00]" />{location}
                </span>
              )}
              {rating > 0 && (
                <span className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={12} className={rating >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />
                  ))}
                  <span className="font-bold text-gray-700">{rating}</span>
                  {reviewCount > 0 && <span className="text-gray-400">({reviewCount} reviews)</span>}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={onShowPhone} className="flex items-center gap-2 border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
              <Phone size={14} /> {showPhone ? phone || "N/A" : "Show Number"}
            </button>
            <button className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
              <MessageCircle size={14} /> Chat
            </button>
            <button className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors">
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* Stats row */}
        {stats.length > 0 && (
          <div className="flex flex-wrap gap-6 pt-4 mt-4 border-t border-gray-100">
            {stats.map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className={`text-2xl font-black ${color || "text-[#FF6B00]"}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
import { Heart, MessageCircle, Share2, MapPin, Clock, Globe } from "lucide-react";
import { useState } from "react";

export default function KemetroStoreHeader({ store }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="relative h-64 bg-gray-300">
        <img
          src={store.coverImage}
          alt={store.storeName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Store Info Section */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="flex gap-8 items-start">
            {/* Logo */}
            <div className="relative -mt-20">
              <img
                src={store.logo}
                alt={store.storeName}
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            </div>

            {/* Store Details */}
            <div className="flex-1 pt-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-gray-900">{store.storeName}</h1>
                {store.isVerified && (
                  <span className="text-xl" title="Verified Store">
                    ✅
                  </span>
                )}
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-xl">⭐</span>
                  <span className="font-bold text-gray-900">{store.rating}</span>
                  <span className="text-gray-600">({store.totalReviews} reviews)</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{store.totalProducts} Products</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Member since {store.memberSince}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Ships to {store.shipsTo} countries</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                    isFollowing
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <Heart size={16} fill={isFollowing ? "currentColor" : "none"} />
                  {isFollowing ? "Following" : "Follow Store"}
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                  <MessageCircle size={16} />
                  Chat with Seller
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
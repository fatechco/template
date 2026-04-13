import { useState } from "react";
import { Eye, Calendar, Play, Camera } from "lucide-react";

export default function KemedarTwinWidget({ property, upcomingTour, hasVirtualTour, tourRecording }) {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white mb-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black mb-1">✨ Kemedar Twin™</h3>
          <p className="text-sm text-gray-300">Explore this property virtually</p>
        </div>
        
        <div className="flex gap-2 flex-wrap justify-end">
          {hasVirtualTour && (
            <a
              href={`/kemedar/tour/${property.id}`}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors"
            >
              <Eye className="w-4 h-4" />
              Virtual Tour
            </a>
          )}

          {upcomingTour && (
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors">
              <Calendar className="w-4 h-4" />
              {upcomingTour.date}
            </button>
          )}

          {tourRecording && (
            <a
              href={tourRecording.url}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors"
            >
              <Play className="w-4 h-4" />
              Watch Recording
            </a>
          )}

          {!hasVirtualTour && !upcomingTour && (
            <button className="flex items-center gap-2 border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
              📅 Request Tour
            </button>
          )}
        </div>
      </div>

      {hasVirtualTour && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-lg p-2 text-center text-xs">
            <p className="text-gray-300">3 Scenes</p>
            <p className="font-bold">Living • Kitchen • Bedroom</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center text-xs">
            <p className="text-gray-300">Views</p>
            <p className="font-bold">1,200+</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center text-xs">
            <p className="text-gray-300">Verified</p>
            <p className="font-bold">✅ Yes</p>
          </div>
        </div>
      )}
    </div>
  );
}
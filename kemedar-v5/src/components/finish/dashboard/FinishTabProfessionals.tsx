"use client";
// @ts-nocheck
import { useState } from "react";
import { ExternalLink, Star, Shield } from "lucide-react";

function fmt(n) { return new Intl.NumberFormat("en-EG").format(Math.round(n || 0)); }

const PHASE_PROS = [
  {
    phaseNumber: 1, phaseName: "Electrical Rough-In", trade: "Electrician",
    kemeworkCategorySlug: "electrician",
    assigned: { name: "Mohamed Saber", rating: 4.8, completedJobs: 47, accredited: true, avatar: "👷", status: "active", phone: "+201012345678" },
    payment: 5200, paymentStatus: "in_escrow",
    kemeworkOrderId: "KWO-1234",
    reviewSubmitted: false,
  },
  {
    phaseNumber: 2, phaseName: "Plumbing Rough-In", trade: "Plumber",
    kemeworkCategorySlug: "plumber",
    assigned: null,
    recommendations: [
      { name: "Hassan Ahmed", rating: 4.9, completedJobs: 62, accredited: true, reason: "5 similar projects in New Cairo", avatar: "👷" },
      { name: "Karim Fathy", rating: 4.7, completedJobs: 38, accredited: true, reason: "Specialized in villas, highly rated", avatar: "👷" },
      { name: "Omar Said", rating: 4.6, completedJobs: 29, accredited: false, reason: "Competitive rate, quick availability", avatar: "👷" },
    ],
    payment: 4800
  },
  {
    phaseNumber: 4, phaseName: "Tiling & Flooring", trade: "Tiler",
    kemeworkCategorySlug: "tiling",
    assigned: { name: "Ali Hassan", rating: 4.7, completedJobs: 55, accredited: true, avatar: "👷", status: "upcoming" },
    payment: 7800, paymentStatus: "not_due",
    reviewSubmitted: false,
  },
  {
    phaseNumber: 5, phaseName: "Painting", trade: "Painter",
    kemeworkCategorySlug: "painter",
    assigned: null,
    recommendations: [
      { name: "Sherif Amin", rating: 4.8, completedJobs: 91, accredited: true, reason: "Premium finish specialist", avatar: "🎨" },
    ],
    payment: 3600
  },
];

function AccreditedBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] bg-purple-100 text-purple-700 font-black px-1.5 py-0.5 rounded-full">
      <Shield size={8} /> ACCREDITED
    </span>
  );
}

export default function FinishTabProfessionals({ project, phases }) {
  const [hired, setHired] = useState({});
  const [reviewing, setReviewing] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const handleHire = (phaseNumber, rec) => {
    setHired(prev => ({ ...prev, [phaseNumber]: rec }));
  };

  const handleSubmitReview = (phasePro) => {
    setReviewing(null);
    setReviewText("");
  };

  return (
    <div className="space-y-4">
      {PHASE_PROS.map((pro, i) => {
        const assignedPro = pro.assigned || hired[pro.phaseNumber];
        return (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">Phase {pro.phaseNumber}</span>
              <p className="font-black text-gray-900 text-sm">{pro.phaseName}</p>
              <span className="ml-auto text-xs text-orange-600 font-bold">{pro.trade}</span>
            </div>

            {assignedPro ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">{assignedPro.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-gray-900">{assignedPro.name}</p>
                      {assignedPro.accredited && <AccreditedBadge />}
                    </div>
                    <p className="text-xs text-gray-500">⭐ {assignedPro.rating} · {assignedPro.completedJobs} jobs · {pro.trade}</p>
                    {pro.kemeworkOrderId && (
                      <p className="text-xs text-blue-500 mt-0.5">📋 Kemework Order: {pro.kemeworkOrderId}</p>
                    )}
                  </div>
                  {assignedPro.status === "active" && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-bold">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />Working
                    </span>
                  )}
                  {assignedPro.status === "upcoming" && (
                    <span className="text-xs text-blue-500 font-bold">🕐 Upcoming</span>
                  )}
                </div>

                <div className="flex gap-2 mb-3">
                  <a href={`/kemework/find-professionals?category=${pro.kemeworkCategorySlug}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs hover:bg-gray-50 text-center flex items-center justify-center gap-1">
                    <ExternalLink size={10} /> View Profile
                  </a>
                  <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs hover:bg-gray-50">💬 Message</button>
                  {assignedPro.status === "active" && !pro.reviewSubmitted && (
                    <button onClick={() => setReviewing(pro.phaseNumber)} className="flex-1 bg-yellow-50 border border-yellow-200 text-yellow-700 font-bold py-2 rounded-xl text-xs hover:bg-yellow-100">
                      ⭐ Review
                    </button>
                  )}
                </div>

                {/* Review modal inline */}
                {reviewing === pro.phaseNumber && (
                  <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-3 mb-3">
                    <p className="font-bold text-yellow-800 text-xs mb-2">Rate {assignedPro.name}</p>
                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setRating(s)}>
                          <Star size={20} className={s <= rating ? "text-yellow-500 fill-yellow-400" : "text-gray-300"} />
                        </button>
                      ))}
                    </div>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={2}
                      placeholder="Describe quality of work, punctuality..."
                      className="w-full border border-yellow-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-400 resize-none mb-2 bg-white" />
                    <div className="flex gap-2">
                      <button onClick={() => setReviewing(null)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-1.5 rounded-xl text-xs">Cancel</button>
                      <button onClick={() => handleSubmitReview(pro)} className="flex-1 bg-yellow-500 text-white font-bold py-1.5 rounded-xl text-xs">Submit Review</button>
                    </div>
                  </div>
                )}

                {/* Escrow payment */}
                <div className={`rounded-xl p-3 text-xs flex items-center justify-between ${pro.paymentStatus === "in_escrow" ? "bg-blue-50 border border-blue-100" : "bg-gray-50 border border-gray-100"}`}>
                  <div>
                    <span className="font-bold text-gray-900">💰 {fmt(pro.payment)} EGP</span>
                    <span className="text-gray-500 ml-2">
                      {pro.paymentStatus === "in_escrow" ? "· 🔒 In Escrow (releases on inspection)" : "· Not yet due"}
                    </span>
                  </div>
                  {pro.paymentStatus === "in_escrow" && (
                    <button className="text-[10px] border border-blue-200 text-blue-700 font-bold px-2 py-1 rounded-lg hover:bg-blue-100">
                      Release
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {/* Not hired yet */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold text-orange-800 mb-1">👷 Hire {pro.trade} via Kemework</p>
                  <p className="text-xs text-orange-600">AI selected top-rated accredited professionals for this phase:</p>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                  {(pro.recommendations || []).map((rec, j) => (
                    <div key={j} className="flex-shrink-0 w-44 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{rec.avatar}</span>
                        <div>
                          <p className="font-black text-gray-900 text-xs">{rec.name}</p>
                          <div className="flex items-center gap-1">
                            <Star size={9} className="text-yellow-500 fill-yellow-400" />
                            <span className="text-[10px] text-gray-500">{rec.rating} · {rec.completedJobs} jobs</span>
                          </div>
                        </div>
                      </div>
                      {rec.accredited && <div className="mb-2"><AccreditedBadge /></div>}
                      <p className="text-[10px] text-green-700 mb-2">✅ {rec.reason}</p>
                      <button
                        onClick={() => handleHire(pro.phaseNumber, rec)}
                        className="block w-full text-center text-[10px] bg-orange-500 text-white font-bold py-1.5 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Hire Now
                      </button>
                    </div>
                  ))}
                </div>
                <a
                  href={`/kemework/find-professionals?category=${pro.kemeworkCategorySlug}`}
                  target="_blank" rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-1 text-xs text-blue-600 font-bold hover:underline"
                >
                  <ExternalLink size={11} /> Browse all {pro.trade}s on Kemework
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
"use client";
// @ts-nocheck
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const EVENT_LABELS = {
  national_id_verified: "National ID verified",
  phone_verified: "Phone number verified",
  email_verified: "Email address verified",
  bank_statement_uploaded: "Bank statement uploaded",
  pre_approval_uploaded: "Pre-approval letter uploaded",
  escrow_first_deposit: "First escrow deposit made",
  escrow_deal_completed: "Escrow deal completed",
  deal_completed: "Deal completed",
  profile_completed: "Profile completed",
  community_verified_resident: "Community resident verified",
  community_review_written: "Community review published",
  offer_made_followed_through: "Offer made and followed through",
  offer_withdrawn_no_reason: "Offer withdrawn without reason",
  viewing_no_show: "Viewing no-show",
  response_ignored_48hrs: "Ignored message for 48+ hours",
  listing_inaccuracy_reported: "Listing inaccuracy reported",
  dispute_lost: "Dispute resolved against you",
  badge_earned: "Badge earned 🏅",
};

const GRADE_BANDS = [
  { y: 850, label: "Platinum", color: "#b8860b22" },
  { y: 700, label: "Gold", color: "#ffd70022" },
  { y: 550, label: "Silver", color: "#c0c0c022" },
  { y: 400, label: "Bronze", color: "#cd7f3222" },
  { y: 200, label: "Starter", color: "#80808022" },
];

export default function ScoreHistory({ events = [], currentScore }) {
  const [filter, setFilter] = useState("all");

  // Build chart data from events (last 6 months)
  const chartData = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEvents = events.filter(e => {
      const ed = new Date(e.created_date);
      return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
    });
    const lastEvent = monthEvents[monthEvents.length - 1];
    chartData.push({
      month: d.toLocaleDateString("en", { month: "short" }),
      score: lastEvent?.newScore || (i === 0 ? currentScore : null),
    });
  }

  // Fill gaps
  let lastScore = 0;
  for (const pt of chartData) {
    if (pt.score == null) pt.score = lastScore;
    else lastScore = pt.score;
  }

  const filtered = events.filter(e => {
    if (filter === "positive") return (e.scoreImpact || 0) > 0;
    if (filter === "negative") return (e.scoreImpact || 0) < 0;
    if (filter === "badges") return e.eventType === "badge_earned";
    return true;
  });

  return (
    <div>
      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <p className="font-black text-gray-900 mb-4">Score Trend — Last 6 Months</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 1000]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v} pts`, "Score"]} />
              <ReferenceLine y={850} stroke="#b8860b" strokeDasharray="3 3" label={{ value: "Platinum", fontSize: 10 }} />
              <ReferenceLine y={700} stroke="#ffd700" strokeDasharray="3 3" label={{ value: "Gold", fontSize: 10 }} />
              <ReferenceLine y={550} stroke="#c0c0c0" strokeDasharray="3 3" label={{ value: "Silver", fontSize: 10 }} />
              <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={3} dot={{ fill: "#f97316", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4">
        {[["all", "All"], ["positive", "✅ Positive"], ["negative", "❌ Negative"], ["badges", "🏅 Badges"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === val ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Events list */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">📊</p>
          <p className="font-bold">No events yet</p>
          <p className="text-sm">Start using the platform to build your score history</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.slice(0, 30).map(event => {
            const isPositive = (event.scoreImpact || 0) > 0;
            const isBadge = event.eventType === "badge_earned";
            return (
              <div key={event.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isBadge ? "bg-amber-100" : isPositive ? "bg-green-100" : "bg-red-100"}`}>
                  {isBadge ? "🏅" : isPositive ? "✅" : "❌"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {EVENT_LABELS[event.eventType] || event.description || event.eventType?.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(event.created_date).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
                    {event.previousScore != null && event.newScore != null && (
                      <span className="ml-2">{event.previousScore} → {event.newScore}</span>
                    )}
                  </p>
                  {event.decaysAt && !isPositive && (
                    <p className="text-[10px] text-gray-400">⏳ Decays on {new Date(event.decaysAt).toLocaleDateString()}</p>
                  )}
                </div>
                <span className={`text-sm font-black flex-shrink-0 ${isBadge ? "text-amber-600" : isPositive ? "text-green-600" : "text-red-500"}`}>
                  {isBadge ? "Badge" : isPositive ? `+${event.scoreImpact}` : event.scoreImpact} {!isBadge && "pts"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
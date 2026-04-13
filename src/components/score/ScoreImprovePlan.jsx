import { Link } from "react-router-dom";

const NEXT_GRADE = {
  Restricted: { next: "Starter", threshold: 200 },
  Starter:    { next: "Bronze",  threshold: 400 },
  Bronze:     { next: "Silver",  threshold: 550 },
  Silver:     { next: "Gold",    threshold: 700 },
  Gold:       { next: "Platinum", threshold: 850 },
  Platinum:   { next: null, threshold: 1000 },
};

const GRADE_ICONS = { Platinum: "💎", Gold: "🥇", Silver: "🥈", Bronze: "🥉", Starter: "⭐", Restricted: "⚠️" };

const QUICK_WINS = [
  { points: 50, time: "5 min", title: "Verify your National ID", desc: "Upload both sides of your ID for instant +50 pts", action: "Verify ID →", to: "/m/dashboard/kyc", key: "national_id" },
  { points: 40, time: "2 min", title: "Upload bank statement", desc: "Last 3 months bank statement adds to Financial Readiness", action: "Upload Statement →", to: "/m/dashboard/kyc", key: "bank" },
  { points: 30, time: "Instant", title: "Complete your profile", desc: "Add a photo and short bio to complete your profile", action: "Complete Profile →", to: "/m/dashboard/profile", key: "profile" },
  { points: 20, time: "Instant", title: "Verify your email", desc: "Simple email verification for quick points", action: "Verify Email →", to: "/m/dashboard/settings", key: "email" },
  { points: 50, time: "5 min", title: "Pass Escrow KYC", desc: "Complete Kemedar Escrow™ KYC for trust & points", action: "Start KYC →", to: "/dashboard/kyc", key: "kyc" },
];

const MEDIUM_TERM = [
  { points: 50, title: "Complete your first deal", desc: "Start a negotiation, make an offer, and complete via Escrow™", action: "Browse Properties →", to: "/search-properties" },
  { points: 30, title: "Join your area community", desc: "Become a verified member of your neighborhood community", action: "Find Community →", to: "/kemedar/community" },
  { points: 60, title: "Use Kemedar Escrow™", desc: "Complete a transaction via Kemedar Escrow™ for a major trust boost", action: "Learn About Escrow™ →", to: "/kemedar/escrow/new" },
  { points: 20, title: "Write a community review", desc: "Share your knowledge about your area — +20 pts per review", action: "Write Review →", to: "/kemedar/life-score" },
];

export default function ScoreImprovePlan({ score, pointsToNextGrade, nextGrade }) {
  const grade = score?.overallGrade || "Starter";
  const overall = score?.overallScore || 0;
  const gradeConfig = NEXT_GRADE[grade] || NEXT_GRADE.Starter;
  const pctToNext = gradeConfig.next
    ? Math.round((overall / gradeConfig.threshold) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Progress to next grade */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {gradeConfig.next ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{GRADE_ICONS[grade]}</span>
              <div className="flex-1">
                <p className="font-black text-gray-900">
                  {grade} Member — {overall} / {gradeConfig.threshold} for {gradeConfig.next}
                </p>
                <p className="text-sm text-gray-500">{pointsToNextGrade} more points to {gradeConfig.next} {GRADE_ICONS[gradeConfig.next]}</p>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, pctToNext)}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{overall} pts</span>
              <span>{pctToNext}% to {gradeConfig.next}</span>
              <span>{gradeConfig.threshold} pts</span>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-5xl mb-2">💎</p>
            <p className="font-black text-gray-900 text-xl">Maximum Grade Achieved!</p>
            <p className="text-gray-500">You're Platinum — the highest level on Kemedar</p>
          </div>
        )}
      </div>

      {/* Quick wins */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🚀</span>
          <div>
            <p className="font-black text-gray-900">Quick Wins</p>
            <p className="text-xs text-gray-500">Actions you can take right now to boost your score</p>
          </div>
        </div>
        <div className="space-y-3">
          {QUICK_WINS.map((win, i) => (
            <div key={i} className="bg-white rounded-2xl border border-l-4 border-l-teal-400 border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">⏱ {win.time}</span>
                  </div>
                  <p className="font-black text-gray-900 text-sm">{win.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{win.desc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-orange-600 text-lg">+{win.points}</p>
                  <p className="text-[10px] text-gray-400">points</p>
                </div>
              </div>
              <Link to={win.to} className="mt-3 inline-block text-xs bg-orange-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-orange-400 transition-colors">
                {win.action}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Medium term */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⭐</span>
          <div>
            <p className="font-black text-gray-900">Build Over Time</p>
            <p className="text-xs text-gray-500">Longer-term actions with bigger rewards</p>
          </div>
        </div>
        <div className="space-y-3">
          {MEDIUM_TERM.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-orange-600">+{item.points} pts</p>
                <Link to={item.to} className="text-xs text-orange-500 font-bold hover:underline">{item.action}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
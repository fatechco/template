import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";

function fmt(n) { return new Intl.NumberFormat("en-EG").format(Math.round(n || 0)); }

const STATUS_ICONS = {
  not_due: { icon: "⏳", color: "text-gray-500", bg: "bg-gray-50 border-gray-100" },
  due: { icon: "🔔", color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
  released: { icon: "✅", color: "text-green-600", bg: "bg-green-50 border-green-100" },
  disputed: { icon: "⚠️", color: "text-red-600", bg: "bg-red-50 border-red-100" },
};

const MOCK_PHASES_PAYMENTS = [
  { phaseName: "Electrical Rough-In", phaseNumber: 1, amount: 18500, status: "released", inspected: true, inspectedBy: "Ahmed FO", releaseDate: "2025-01-15" },
  { phaseName: "Plumbing Rough-In", phaseNumber: 2, amount: 12300, status: "released", inspected: true, inspectedBy: "Ahmed FO", releaseDate: "2025-01-28" },
  { phaseName: "Plastering & Gypsum", phaseNumber: 3, amount: 22100, status: "due", inspected: true, inspectedBy: "Ahmed FO" },
  { phaseName: "Tiling & Flooring", phaseNumber: 4, amount: 31500, status: "not_due", inspected: false },
  { phaseName: "Painting", phaseNumber: 5, amount: 14800, status: "not_due", inspected: false },
  { phaseName: "Kitchen & Bath Fixtures", phaseNumber: 6, amount: 28600, status: "not_due", inspected: false },
  { phaseName: "Final Snagging & Handover", phaseNumber: 7, amount: 16200, status: "not_due", inspected: false },
];

export default function FinishTabPayments({ project, phases }) {
  const [releasing, setReleasing] = useState(null);
  const [released, setReleased] = useState([]);

  const paymentData = MOCK_PHASES_PAYMENTS;
  const totalProject = paymentData.reduce((s, p) => s + p.amount, 0);
  const totalReleased = paymentData.filter(p => p.status === "released" || released.includes(p.phaseNumber)).reduce((s, p) => s + p.amount, 0);
  const totalInEscrow = totalProject - totalReleased;
  const pct = Math.round((totalReleased / totalProject) * 100);

  const handleRelease = async (phaseNum) => {
    setReleasing(phaseNum);
    await new Promise(r => setTimeout(r, 1200));
    setReleased(prev => [...prev, phaseNum]);
    setReleasing(null);
  };

  return (
    <div>
      {/* Escrow summary */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-5 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">🔒 Kemedar Escrow™</p>
            <p className="text-2xl font-black mt-1">{fmt(totalProject)} EGP</p>
            <p className="text-xs text-gray-400">Total Project Value</p>
          </div>
          <Link to="/dashboard/escrow" className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors">
            <ExternalLink size={11} /> Escrow Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { label: "Released", val: fmt(totalReleased) + " EGP", color: "text-green-400" },
            { label: "In Escrow", val: fmt(totalInEscrow) + " EGP", color: "text-orange-400" },
            { label: "Paid Out", val: pct + "%", color: "text-blue-400" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-lg font-black ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{pct}% of project value released to professionals</p>
      </div>

      {/* FO inspection note */}
      {project.requiresFOSupervision && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
          <Lock size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-blue-800 text-sm">FO Inspection Gates All Payments</p>
            <p className="text-xs text-blue-600 mt-0.5">Each phase payment requires Franchise Owner site inspection sign-off before funds are released from escrow. This protects you against substandard work.</p>
          </div>
        </div>
      )}

      {/* Phase payments */}
      <p className="font-black text-gray-900 mb-3">Phase Payment Schedule</p>
      <div className="space-y-3">
        {paymentData.map((ph, i) => {
          const isReleased = ph.status === "released" || released.includes(ph.phaseNumber);
          const effectiveStatus = isReleased ? "released" : ph.status;
          const ui = STATUS_ICONS[effectiveStatus] || STATUS_ICONS.not_due;
          return (
            <div key={i} className={`bg-white rounded-2xl border p-4 ${ui.bg}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                  effectiveStatus === "released" ? "bg-green-500 text-white" :
                  effectiveStatus === "due" ? "bg-orange-500 text-white" :
                  "bg-gray-200 text-gray-500"
                }`}>
                  {ph.phaseNumber}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{ph.phaseName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-black text-gray-700">{fmt(ph.amount)} EGP</span>
                    {ph.inspected && (
                      <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                        <CheckCircle size={9} /> Inspected {ph.inspectedBy && `by ${ph.inspectedBy}`}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-bold ${ui.color}`}>{ui.icon} {effectiveStatus.replace("_", " ").toUpperCase()}</span>
              </div>

              {effectiveStatus === "due" && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleRelease(ph.phaseNumber)}
                    disabled={releasing === ph.phaseNumber}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black py-2 rounded-xl text-xs transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
                  >
                    {releasing === ph.phaseNumber ? (
                      <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Releasing...</>
                    ) : (
                      <><CheckCircle size={12} /> Release {fmt(ph.amount)} EGP from Escrow</>
                    )}
                  </button>
                  <button className="px-3 py-2 border border-red-200 text-red-600 font-bold rounded-xl text-xs hover:bg-red-50 flex items-center gap-1">
                    <AlertTriangle size={11} /> Dispute
                  </button>
                </div>
              )}

              {isReleased && ph.releaseDate && (
                <p className="text-xs text-green-600 mt-2">Released on {ph.releaseDate}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Dispute option */}
      <div className="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4">
        <p className="font-bold text-red-800 text-sm mb-1">⚠️ Having a dispute with a professional?</p>
        <p className="text-xs text-red-600 mb-3">Kemedar Escrow™ provides structured dispute resolution with FO mediation and full audit trail.</p>
        <Link to="/dashboard/escrow" className="inline-flex items-center gap-1 text-xs bg-red-600 text-white font-bold px-3 py-2 rounded-xl hover:bg-red-700 transition-colors">
          Open Dispute Case <ExternalLink size={10} />
        </Link>
      </div>
    </div>
  );
}
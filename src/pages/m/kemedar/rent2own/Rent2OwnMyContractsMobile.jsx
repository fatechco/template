import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const fmt = n => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const STATUS_CFG = {
  active: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Active" },
  payment_overdue: { bg: "bg-red-100", text: "text-red-700", label: "Overdue" },
  purchase_in_progress: { bg: "bg-blue-100", text: "text-blue-700", label: "Purchasing" },
  completed_purchased: { bg: "bg-green-100", text: "text-green-700", label: "Owned! 🎉" },
  completed_exited: { bg: "bg-gray-100", text: "text-gray-600", label: "Exited" },
  terminated_breach: { bg: "bg-red-100", text: "text-red-700", label: "Terminated" },
  terminated_mutual: { bg: "bg-gray-100", text: "text-gray-600", label: "Terminated" },
};

function ContractCard({ contract }) {
  const navigate = useNavigate();
  const status = STATUS_CFG[contract.status] || STATUS_CFG.active;
  const totalTerm = contract.optionTermMonths || 60;
  const paidPct = totalTerm > 0 ? Math.round((contract.totalMonthsPaid / totalTerm) * 100) : 0;
  const equityPct = contract.purchaseOptionPrice > 0
    ? Math.round((contract.totalEquityAccumulated / contract.purchaseOptionPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-24 bg-gray-100 relative">
        {contract.propertyImages?.[0] ? (
          <img src={contract.propertyImages[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>{status.label}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="font-black text-gray-900 text-xs">{contract.propertyTitle || "Property"}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">📍 {contract.propertyCity || "Egypt"}</p>

        {/* Equity bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-[9px] text-gray-400">Equity Progress</p>
            <p className="text-[9px] font-black text-emerald-600">{equityPct}%</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(equityPct, 100)}%`, background: "#10B981" }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <div>
            <p className="text-[8px] text-gray-400">Equity Built</p>
            <p className="text-[10px] font-black text-emerald-600">{fmt(contract.totalEquityAccumulated)}</p>
          </div>
          <div>
            <p className="text-[8px] text-gray-400">Remaining</p>
            <p className="text-[10px] font-bold text-gray-700">{fmt(contract.remainingPurchasePrice)}</p>
          </div>
          <div>
            <p className="text-[8px] text-gray-400">Months Paid</p>
            <p className="text-[10px] font-bold text-gray-700">{contract.totalMonthsPaid}/{totalTerm}</p>
          </div>
        </div>

        {contract.nextPaymentDue && (
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-2 text-center">
            <p className="text-[9px] text-amber-700">Next payment: <span className="font-black">{new Date(contract.nextPaymentDue).toLocaleDateString("en-EG", { month: "short", day: "numeric" })}</span> · {fmt(contract.totalMonthlyPayment)} EGP</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Rent2OwnMyContractsMobile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("contracts");

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      Promise.all([
        base44.entities.Rent2OwnContract.filter({ tenantId: u.id }, "-created_date", 20),
        base44.entities.Rent2OwnApplication.filter({ applicantId: u.id }, "-created_date", 20),
      ]).then(([c, a]) => {
        setContracts(c || []);
        setApplications(a || []);
        setLoading(false);
      });
    }).catch(() => setLoading(false));
  }, []);

  const APP_STATUS = {
    submitted: { color: "text-blue-600", label: "Submitted" },
    documents_pending: { color: "text-amber-600", label: "Docs Pending" },
    under_review: { color: "text-purple-600", label: "Under Review" },
    seller_review: { color: "text-indigo-600", label: "Seller Review" },
    approved: { color: "text-emerald-600", label: "Approved ✅" },
    rejected: { color: "text-red-600", label: "Rejected" },
    contracted: { color: "text-green-600", label: "Contracted 🎉" },
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "#0F172A", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">🔑 My Rent-to-Own</p>
        <div className="w-9" />
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex-shrink-0">
        <div className="flex gap-2">
          {[["contracts", `📋 Contracts (${contracts.length})`], ["applications", `📩 Applications (${applications.length})`]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: tab === k ? "#10B981" : "#f3f4f6", color: tab === k ? "#fff" : "#6b7280" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
        ) : tab === "contracts" ? (
          contracts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p className="font-bold text-sm">No active contracts</p>
              <p className="text-xs mt-1">Apply for a rent-to-own listing to get started</p>
              <button onClick={() => navigate("/m/kemedar/rent2own/browse")}
                className="mt-3 bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs">
                Browse Listings →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {contracts.map(c => <ContractCard key={c.id} contract={c} />)}
            </div>
          )
        ) : (
          applications.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">📩</p>
              <p className="font-bold text-sm">No applications</p>
              <p className="text-xs mt-1">Apply for listings to start your homeownership journey</p>
            </div>
          ) : (
            <div className="space-y-2">
              {applications.map(a => {
                const st = APP_STATUS[a.status] || { color: "text-gray-600", label: a.status };
                return (
                  <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900 text-xs">Application #{a.applicationNumber?.slice(0, 12)}</p>
                      <span className={`text-[9px] font-black ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Income: {fmt(a.monthlyIncome)} EGP · {a.requestedPurchaseTimeline?.replace("_", " ")}</p>
                    {a.submittedAt && <p className="text-[9px] text-gray-400 mt-0.5">Submitted {new Date(a.submittedAt).toLocaleDateString("en-EG")}</p>}
                  </div>
                );
              })}
            </div>
          )
        )}
        <div className="h-20" />
      </div>
      <MobileBottomNav />
    </div>
  );
}
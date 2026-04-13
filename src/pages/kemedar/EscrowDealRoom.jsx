import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock, Upload, Check, AlertTriangle, MessageCircle, FileText,
  ChevronDown, ChevronUp, Clock, Send, Loader2, X, Shield,
  PenLine, Eye, Banknote, Key, Scale
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600", bar: "bg-gray-400" },
  awaiting_deposit: { label: "Awaiting Deposit", color: "bg-blue-100 text-blue-700", bar: "bg-blue-400" },
  deposit_received: { label: "Deposit Received", color: "bg-teal-100 text-teal-700", bar: "bg-teal-400" },
  in_progress: { label: "In Progress", color: "bg-orange-100 text-orange-700", bar: "bg-orange-500" },
  awaiting_completion: { label: "Awaiting Completion", color: "bg-purple-100 text-purple-700", bar: "bg-purple-500" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", bar: "bg-green-500" },
  disputed: { label: "DISPUTED", color: "bg-red-100 text-red-700", bar: "bg-red-500" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500", bar: "bg-gray-400" },
};

// The 5 canonical milestones with their specific behaviors
const MILESTONE_META = {
  earnest_deposit: {
    icon: "💰", color: "orange",
    nextStep: "Sign the Memorandum of Understanding (MOU)",
    requiresDocs: ["National ID", "MOU"],
    buyerAction: "Deposit Funds",
    sellerAction: "Confirm Receipt",
    description: "Buyer deposits earnest money into escrow. Funds are locked until MOU is signed by both parties."
  },
  contract_signing: {
    icon: "📝", color: "blue",
    nextStep: "Upload title deed for legal due diligence",
    requiresDocs: ["Sale Contract", "Power of Attorney (if applicable)"],
    buyerAction: "Sign Contract",
    sellerAction: "Sign Contract",
    description: "Both parties review and digitally sign the sale contract. Lawyer review optional."
  },
  legal_verification: {
    icon: "⚖️", color: "purple",
    nextStep: "Schedule final inspection and balance payment",
    requiresDocs: ["Title Deed", "Inspection Report", "NOC"],
    buyerAction: "Confirm Due Diligence Complete",
    sellerAction: "Confirm Title Deed Verified",
    description: "Seller uploads title deed. FO inspection conducted. AI checklist completed. Both parties confirm."
  },
  balance_payment: {
    icon: "💵", color: "teal",
    nextStep: "Schedule keys handover",
    requiresDocs: ["Final Payment Receipt"],
    buyerAction: "Confirm Balance Paid",
    sellerAction: "Confirm Balance Received",
    description: "Buyer pays remaining balance. Funds locked for handover. Final inspection scheduled."
  },
  keys_handover: {
    icon: "🔑", color: "green",
    nextStep: "Deal complete — Certificate generated",
    requiresDocs: ["Handover Certificate", "Utility Transfer"],
    buyerAction: "Confirm Keys Received ✅",
    sellerAction: "Confirm Keys Handed Over ✅",
    description: "Physical handover confirmed. 24-hour grace period. Full balance released to seller. Certificate generated."
  },
};

function fmt(n) { return n ? Number(n).toLocaleString() : "0"; }

// ---- MILESTONE CARD ----
function MilestoneCard({ milestone, deal, role, onConfirm, onUpload, isActive }) {
  const [expanded, setExpanded] = useState(isActive);
  const isCompleted = milestone.status === "completed";
  const isPending = milestone.status === "pending";
  const meta = MILESTONE_META[milestone.milestoneType] || {};

  const borderColor = isCompleted ? "border-green-400" : isActive ? "border-orange-400" : "border-gray-200";
  const bg = isCompleted ? "bg-green-50/30" : isActive ? "bg-orange-50/20" : "bg-white";
  const dueDate = milestone.dueDate ? new Date(milestone.dueDate) : null;
  const daysLeft = dueDate ? Math.ceil((dueDate - Date.now()) / 86400000) : null;

  const buyerDone = milestone.buyerConfirmed;
  const sellerDone = milestone.sellerConfirmed;
  const myConfirmed = role === "buyer" ? buyerDone : sellerDone;
  const otherConfirmed = role === "buyer" ? sellerDone : buyerDone;

  return (
    <div className={`rounded-2xl border-l-4 border ${borderColor} ${bg} shadow-sm mb-4 overflow-hidden`}>
      <div className="p-5 cursor-pointer select-none" onClick={() => !isPending && setExpanded(!expanded)}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
              isCompleted ? "bg-green-100" : isActive ? "bg-orange-100" : "bg-gray-100"
            }`}>
              {isCompleted ? "✅" : (meta.icon || "📌")}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`font-black text-base ${isCompleted ? "text-green-700" : isActive ? "text-orange-700" : "text-gray-500"}`}>
                  Step {milestone.milestoneOrder}: {milestone.milestoneName}
                </p>
                {isCompleted && <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">✅ Completed</span>}
                {isActive && <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">🔶 ACTIVE</span>}
                {isPending && <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">Locked</span>}
              </div>
              {isCompleted && milestone.completedAt && (
                <p className="text-xs text-gray-400 mt-0.5">Completed {new Date(milestone.completedAt).toLocaleDateString()}</p>
              )}
              {isActive && daysLeft !== null && (
                <p className={`text-xs mt-0.5 ${daysLeft < 3 ? "text-red-600 font-bold" : "text-gray-500"}`}>
                  ⏰ {daysLeft > 0 ? `${daysLeft} days remaining` : "Due today!"}
                </p>
              )}
              {milestone.paymentAmount > 0 && (
                <p className={`text-sm font-black mt-1 ${isCompleted ? "text-green-600" : "text-orange-600"}`}>
                  💰 {isCompleted ? "Released: " : "Will release: "}{fmt(milestone.paymentAmount)} EGP
                </p>
              )}
            </div>
          </div>
          {!isPending && (expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />)}
        </div>
      </div>

      {expanded && !isPending && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600 mb-4">{milestone.description || meta.description}</p>

          {/* Confirmation status */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`rounded-xl p-3 text-center border ${buyerDone ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
              <p className="text-lg mb-1">🧑</p>
              <p className="text-xs font-bold text-gray-600">Buyer</p>
              <p className={`text-xs mt-0.5 ${buyerDone ? "text-green-600 font-bold" : "text-gray-400"}`}>
                {buyerDone ? "✅ Confirmed" : "⏳ Pending"}
              </p>
            </div>
            <div className={`rounded-xl p-3 text-center border ${sellerDone ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
              <p className="text-lg mb-1">🏠</p>
              <p className="text-xs font-bold text-gray-600">Seller</p>
              <p className={`text-xs mt-0.5 ${sellerDone ? "text-green-600 font-bold" : "text-gray-400"}`}>
                {sellerDone ? "✅ Confirmed" : "⏳ Pending"}
              </p>
            </div>
          </div>

          {/* Required documents for this step */}
          {meta.requiresDocs && meta.requiresDocs.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs font-black text-gray-600 mb-2">📄 Required for this step:</p>
              {meta.requiresDocs.map((doc, i) => (
                <p key={i} className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                  <span className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0 inline-block" />
                  {doc}
                </p>
              ))}
            </div>
          )}

          {/* Payment info */}
          {milestone.paymentAmount > 0 && isActive && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
              <p className="text-sm font-black text-orange-800">
                💰 {fmt(milestone.paymentAmount)} EGP will release when both parties confirm
              </p>
              {milestone.milestoneType === "keys_handover" && (
                <p className="text-xs text-orange-600 mt-0.5">⏰ 24-hour grace period for disputes after confirmation</p>
              )}
            </div>
          )}

          {/* Milestone-specific action callout */}
          {milestone.milestoneType === "earnest_deposit" && isActive && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <p className="text-sm font-bold text-blue-800">➡️ Next after this:</p>
              <p className="text-sm text-blue-700">MOU will be auto-generated for both parties to sign digitally</p>
            </div>
          )}
          {milestone.milestoneType === "keys_handover" && isActive && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-4">
              <p className="text-sm font-bold text-purple-800">🎉 Final step!</p>
              <p className="text-sm text-purple-700">After both confirm: full balance auto-releases + deal certificate generated</p>
            </div>
          )}

          {/* Actions */}
          {isActive && !myConfirmed && role !== "viewer" && (
            <button onClick={() => onConfirm(milestone.id, role)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm mb-2 transition-colors">
              ✅ {meta[role === "buyer" ? "buyerAction" : "sellerAction"] || "Confirm Milestone Complete"}
            </button>
          )}
          {isActive && myConfirmed && !otherConfirmed && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center mb-2">
              <p className="text-sm text-blue-700 font-bold">✅ You confirmed — awaiting {role === "buyer" ? "seller" : "buyer"}</p>
            </div>
          )}
          {isActive && (
            <button onClick={() => onUpload(milestone.id)}
              className="w-full border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> Upload Document / Evidence
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---- WORKFLOW TIMELINE ----
function WorkflowTimeline({ milestones, currentOrder }) {
  const steps = [
    { order: 1, label: "Earnest Deposit", icon: "💰" },
    { order: 2, label: "Contract Signing", icon: "📝" },
    { order: 3, label: "Legal Due Diligence", icon: "⚖️" },
    { order: 4, label: "Balance Payment", icon: "💵" },
    { order: 5, label: "Keys Handover", icon: "🔑" },
  ];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      <p className="text-xs font-black text-gray-400 uppercase mb-3">Deal Progress</p>
      <div className="flex items-center">
        {steps.map((s, i) => {
          const milestone = milestones.find(m => m.milestoneOrder === s.order);
          const done = milestone?.status === "completed";
          const active = milestone?.status === "in_progress" || milestone?.status?.includes("confirm");
          return (
            <div key={s.order} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-bold transition-all ${
                  done ? "bg-green-500 text-white" : active ? "bg-orange-500 text-white ring-4 ring-orange-100" : "bg-gray-100 text-gray-400"
                }`}>
                  {done ? "✓" : s.icon}
                </div>
                <p className="text-[9px] text-gray-400 mt-1 text-center max-w-[50px] leading-tight">{s.label}</p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 -mt-5 ${done ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- BALANCE PAYMENT MODAL ----
function BalancePaymentModal({ deal, onClose, onSuccess }) {
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const remaining = (deal.agreedPrice || 0) - (deal.totalDeposited || 0);

  const handlePay = async () => {
    if (!confirmed) return;
    setProcessing(true);
    await base44.entities.EscrowTransaction.create({
      transactionNumber: "KET-" + Date.now(),
      dealId: deal.id,
      transactionType: "milestone_release",
      direction: "in",
      amount: remaining,
      currency: "EGP",
      fromUserId: deal.buyerId,
      paymentMethod: "xeed_wallet",
      status: "completed",
      description: "Balance payment for Deal " + deal.dealNumber,
      processedAt: new Date().toISOString(),
    });
    await base44.entities.EscrowDeal.update(deal.id, {
      totalDeposited: deal.agreedPrice,
    });
    setProcessing(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-xl text-gray-900">💵 Balance Payment</h2>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center mb-4">
          <p className="text-sm text-gray-500 mb-1">Remaining Balance</p>
          <p className="text-4xl font-black text-teal-600">{remaining.toLocaleString()} EGP</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Total Price</span><span className="font-bold">{fmt(deal.agreedPrice)} EGP</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Already Paid (Earnest)</span><span className="font-bold text-green-600">-{fmt(deal.totalDeposited || 0)} EGP</span></div>
          <div className="flex justify-between border-t pt-1.5"><span className="font-black">Balance Due</span><span className="font-black text-teal-600">{fmt(remaining)} EGP</span></div>
        </div>
        <label className="flex items-start gap-3 mb-4 cursor-pointer">
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1 w-4 h-4 accent-orange-500" />
          <span className="text-sm text-gray-700">I confirm payment of {fmt(remaining)} EGP as final balance for this deal</span>
        </label>
        <button onClick={handlePay} disabled={!confirmed || processing}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
          {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Banknote className="w-5 h-5" />}
          {processing ? "Processing..." : "Pay Balance Now"}
        </button>
      </div>
    </div>
  );
}

// ---- DEPOSIT MODAL ----
function DepositModal({ deal, onClose, onSuccess }) {
  const [method, setMethod] = useState("xeed_wallet");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const amount = deal.earnestMoneyAmount || deal.totalEscrowAmount || 0;

  const handleOtp = (i, v) => {
    const next = [...otp];
    next[i] = v.slice(-1);
    setOtp(next);
    if (v && i < 5) document.getElementById("otp-" + (i + 1))?.focus();
  };
  const otpFilled = otp.every(d => d !== "");

  const handleDeposit = async () => {
    if (!confirmed || !otpFilled) return;
    setProcessing(true);
    await base44.entities.EscrowTransaction.create({
      transactionNumber: "KET-" + Date.now(),
      dealId: deal.id,
      transactionType: "deposit",
      direction: "in",
      amount,
      currency: "EGP",
      fromUserId: deal.buyerId,
      paymentMethod: method,
      status: "completed",
      description: "Earnest money deposit for Deal " + deal.dealNumber,
      processedAt: new Date().toISOString(),
      balanceBefore: 0,
      balanceAfter: amount
    });
    // Update deal status + mark milestone 1 as buyer confirmed (payment action)
    await base44.entities.EscrowDeal.update(deal.id, {
      status: "deposit_received",
      totalDeposited: amount,
      dealStartedAt: new Date().toISOString()
    });
    // Auto-confirm buyer side of milestone 1 (earnest deposit)
    const mils = await base44.entities.EscrowMilestone.filter({ dealId: deal.id }).catch(() => []);
    const m1 = mils.find(m => m.milestoneOrder === 1);
    if (m1) {
      await base44.entities.EscrowMilestone.update(m1.id, {
        buyerConfirmed: true,
        buyerConfirmedAt: new Date().toISOString(),
        status: "awaiting_seller_confirm"
      });
    }
    setProcessing(false);
    setSuccess(true);
  };

  if (success) return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Deposit Successful!</h2>
        <p className="text-gray-500 text-sm mb-5">Seller has been notified of your deposit</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-black text-green-600">{amount.toLocaleString()} EGP</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Method</span><span className="font-semibold">{method === "xeed_wallet" ? "XeedWallet" : "Bank Transfer"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><span className="font-semibold text-green-600">Locked in Escrow ✅</span></div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-5 text-left">
          <p className="text-sm font-bold text-orange-800">➡️ Next Step</p>
          <p className="text-sm text-orange-700 mt-0.5">Seller confirms receipt → MOU auto-generated for digital signing</p>
        </div>
        <button onClick={onSuccess} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-colors">
          📋 View Deal Room
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-xl text-gray-900">💰 Deposit Earnest Money</h2>
            <p className="text-gray-400 text-xs">{deal.dealNumber}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Earnest Amount ({deal.earnestMoneyPercent || 10}%)</p>
          <p className="text-4xl font-black text-orange-600">{amount.toLocaleString()} EGP</p>
        </div>
        <div className="mb-4">
          <p className="text-sm font-bold text-gray-700 mb-2">Pay with:</p>
          <div className="space-y-2">
            {[
              { id: "xeed_wallet", icon: "🔶", label: "XeedWallet", sub: "Instant · No fee", badge: "✅ RECOMMENDED" },
              { id: "bank_transfer", icon: "🏦", label: "Bank Transfer", sub: "1-3 business days" },
              { id: "card", icon: "💳", label: "Card", sub: "Instant · 1.5% processing fee" }
            ].map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={"w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all " + (method === m.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200")}>
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">{m.label}</p>
                  <p className="text-xs text-gray-500">{m.sub}</p>
                </div>
                {m.badge && <span className="text-[9px] bg-green-100 text-green-700 font-black px-1.5 py-0.5 rounded-full">{m.badge}</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-bold text-blue-800 mb-2">🔒 Your deposit is protected:</p>
          {["Held in segregated escrow account", "100% refundable if deal fails through seller's fault", "Released only on your confirmation"].map((t, i) => (
            <p key={i} className="text-xs text-blue-700 flex items-center gap-1.5 mb-1"><Check className="w-3 h-3" /> {t}</p>
          ))}
        </div>
        <label className="flex items-start gap-3 mb-4 cursor-pointer">
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1 w-4 h-4 accent-orange-500" />
          <span className="text-sm text-gray-700">I confirm this deposit of {amount.toLocaleString()} EGP for Deal {deal.dealNumber}</span>
        </label>
        <div className="mb-5">
          <p className="text-sm font-bold text-gray-700 mb-2">Enter OTP (demo: any 6 digits):</p>
          <div className="flex gap-2 justify-center">
            {otp.map((d, i) => (
              <input key={i} id={"otp-" + i} type="text" value={d} onChange={e => handleOtp(i, e.target.value)}
                className="w-11 h-11 border-2 border-gray-200 rounded-xl text-center font-black text-lg focus:border-orange-400 outline-none" maxLength={1} />
            ))}
          </div>
        </div>
        <button onClick={handleDeposit} disabled={!confirmed || !otpFilled || processing}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
          {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
          {processing ? "Processing..." : "Confirm Deposit"}
        </button>
      </div>
    </div>
  );
}

// ---- MAIN COMPONENT ----
export default function EscrowDealRoom() {
  const { dealId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = searchParams.get("new") === "1";

  const [deal, setDeal] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rightTab, setRightTab] = useState("chat");
  const [chatInput, setChatInput] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const messagesEndRef = useRef(null);

  const addSystemMessage = (content) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "System",
      role: "system",
      content,
      time: new Date().toLocaleTimeString()
    }]);
  };

  const loadData = async () => {
    try {
      const me = await base44.auth.me();
      setUser(me);
      const deals = await base44.entities.EscrowDeal.filter({ id: dealId });
      if (!deals.length) { navigate("/dashboard/escrow"); return; }
      const d = deals[0];
      setDeal(d);
      setRole(me.id === d.buyerId ? "buyer" : me.id === d.sellerId ? "seller" : "viewer");
      const [mils, docs] = await Promise.all([
        base44.entities.EscrowMilestone.filter({ dealId }).catch(() => []),
        base44.entities.EscrowDocument.filter({ dealId }).catch(() => [])
      ]);
      setMilestones(mils.sort((a, b) => a.milestoneOrder - b.milestoneOrder));
      setDocuments(docs);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    if (isNew) {
      addSystemMessage("🎉 Escrow deal created! Buyer must deposit earnest money within the deadline to begin.");
    }
  }, [dealId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Automatically show deposit modal if deal is awaiting deposit and user is buyer
  useEffect(() => {
    if (deal && role === "buyer" && deal.status === "awaiting_deposit" && isNew) {
      setTimeout(() => setShowDepositModal(true), 800);
    }
  }, [deal, role]);

  const handleConfirmMilestone = async (milestoneId, party) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    const alreadyConfirmedByOther = party === "buyer" ? milestone.sellerConfirmed : milestone.buyerConfirmed;
    const update = party === "buyer"
      ? { buyerConfirmed: true, buyerConfirmedAt: new Date().toISOString() }
      : { sellerConfirmed: true, sellerConfirmedAt: new Date().toISOString() };

    if (alreadyConfirmedByOther) {
      // Both confirmed → complete this milestone
      update.status = "completed";
      update.completedAt = new Date().toISOString();
      if ((milestone.paymentAmount || 0) > 0) {
        update.paymentReleased = true;
        update.paymentReleasedAt = new Date().toISOString();
      }

      // Activate next milestone
      const nextMilestone = milestones.find(m => m.milestoneOrder === milestone.milestoneOrder + 1);
      if (nextMilestone) {
        await base44.entities.EscrowMilestone.update(nextMilestone.id, { status: "in_progress" });
      }

      // If all milestones complete → deal completed
      const remaining = milestones.filter(m => m.id !== milestoneId && m.status !== "completed");
      if (remaining.length === 0) {
        await base44.entities.EscrowDeal.update(dealId, {
          status: "completed",
          completionPercent: 100,
          dealCompletedAt: new Date().toISOString(),
          totalReleased: deal.agreedPrice,
          buyerConfirmedCompletion: true,
          sellerConfirmedCompletion: true,
        });
      } else {
        // Update deal progress
        const completedAfter = milestones.filter(m => m.status === "completed").length + 1;
        const pct = Math.round((completedAfter / milestones.length) * 100);
        await base44.entities.EscrowDeal.update(dealId, {
          status: "in_progress",
          completionPercent: pct,
          currentMilestone: nextMilestone?.milestoneName
        });
      }

      addSystemMessage(
        "✅ Milestone \"" + milestone.milestoneName + "\" completed!" +
        (milestone.paymentAmount > 0 ? " " + fmt(milestone.paymentAmount) + " EGP released." : "") +
        (nextMilestone ? " → Now: " + nextMilestone.milestoneName : " 🎉 All milestones done!")
      );
    } else {
      update.status = party === "buyer" ? "awaiting_seller_confirm" : "awaiting_buyer_confirm";
      addSystemMessage(
        "⏳ " + (party === "buyer" ? "Buyer" : "Seller") + " confirmed \"" + milestone.milestoneName + "\" — waiting for " + (party === "buyer" ? "seller" : "buyer")
      );
    }

    await base44.entities.EscrowMilestone.update(milestoneId, update);
    loadData();
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), sender: user?.full_name || "You",
      role, content: chatInput, time: new Date().toLocaleTimeString()
    }]);
    setChatInput("");
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );
  if (!deal) return null;

  const statusCfg = STATUS_CONFIG[deal.status] || STATUS_CONFIG.in_progress;
  const activeMilestone = milestones.find(m => m.status === "in_progress" || m.status.includes("confirm"));
  const completedCount = milestones.filter(m => m.status === "completed").length;
  const progressPct = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;
  const isM4Active = activeMilestone?.milestoneOrder === 4; // balance payment step

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Status bar */}
      <div className={"text-white py-2 px-4 text-center text-sm font-bold flex items-center justify-center gap-3 " + statusCfg.bar}>
        <Lock className="w-4 h-4" />
        {deal.isDisputed ? "⚠️ DEAL DISPUTED — Funds Frozen" : ("🔒 " + statusCfg.label.toUpperCase() + " — " + (activeMilestone ? "Step " + activeMilestone.milestoneOrder + " of " + milestones.length + " active" : deal.status === "completed" ? "🎉 Deal Complete!" : "Awaiting action"))}
        {deal.status === "awaiting_deposit" && role === "buyer" && (
          <button onClick={() => setShowDepositModal(true)} className="bg-white/20 hover:bg-white/30 px-3 py-0.5 rounded-full text-xs font-black transition-colors">
            💰 Deposit Now
          </button>
        )}
        {isM4Active && role === "buyer" && (
          <button onClick={() => setShowBalanceModal(true)} className="bg-white/20 hover:bg-white/30 px-3 py-0.5 rounded-full text-xs font-black transition-colors">
            💵 Pay Balance
          </button>
        )}
      </div>

      <div className="flex flex-1 min-h-0 max-w-[1400px] mx-auto w-full">
        {/* LEFT PANEL */}
        <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 p-4 overflow-y-auto hidden lg:block">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 mb-4 text-white">
            <p className="text-[10px] font-black text-white/50 mb-1">DEAL #</p>
            <p className="font-mono text-sm font-bold text-white/80">{deal.dealNumber}</p>
            <div className="mt-2">
              <span className={"text-[10px] font-black px-2 py-1 rounded-full " + statusCfg.color}>{statusCfg.label}</span>
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Agreed Price</span>
                <span className="font-black text-white">{fmt(deal.agreedPrice)} EGP</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Deposited</span>
                <span className="font-bold text-orange-400">{fmt(deal.totalDeposited || 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Released</span>
                <span className="font-bold text-green-400">{fmt(deal.totalReleased || 0)}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: progressPct + "%" }} />
              </div>
              <p className="text-[10px] text-white/40 mt-1">{progressPct}% complete</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1.5 mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase px-1">Quick Actions</p>
            {role === "buyer" && deal.status === "awaiting_deposit" && (
              <button onClick={() => setShowDepositModal(true)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors flex items-center gap-2">
                <span>💰</span> Deposit Earnest Money
              </button>
            )}
            {role === "buyer" && isM4Active && (
              <button onClick={() => setShowBalanceModal(true)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 transition-colors flex items-center gap-2">
                <span>💵</span> Pay Balance
              </button>
            )}
            <button onClick={() => {}}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <span>📄</span> Upload Document
            </button>
            <button onClick={() => navigate("/kemedar/escrow/" + dealId + "/dispute")}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
              <span>⚠️</span> Raise Dispute
            </button>
          </div>

          {/* Parties */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Parties</p>
            {[
              { label: "Buyer", icon: "🧑", active: true },
              { label: "Seller", icon: "🏠", active: false },
              { label: "Franchise Owner", icon: "🗺", optional: true, active: false },
              { label: "Lawyer", icon: "⚖️", optional: true, active: false },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">{p.icon}</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-700">{p.label}</p>
                  <p className="text-[10px] text-gray-400">{p.optional ? "Optional" : "Required"}</p>
                </div>
                <div className={"w-2 h-2 rounded-full " + (p.active ? "bg-green-400" : "bg-gray-200")} />
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — MILESTONES */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" /> Kemedar Escrow™
            </h1>
            <p className="text-gray-400 text-sm">{deal.dealNumber} · {role && <span className="font-bold text-orange-500 capitalize">{role}</span>}</p>
          </div>

          {/* Workflow Timeline */}
          <WorkflowTimeline milestones={milestones} currentOrder={activeMilestone?.milestoneOrder} />

          {/* Milestones */}
          {milestones.map((m) => (
            <MilestoneCard
              key={m.id}
              milestone={m}
              deal={deal}
              role={role}
              isActive={m.status === "in_progress" || m.status.includes("confirm")}
              onConfirm={handleConfirmMilestone}
              onUpload={() => {}}
            />
          ))}

          {milestones.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Lock className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No milestones found</p>
            </div>
          )}

          {deal.status === "completed" && (
            <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-8 text-center mt-4">
              <p className="text-6xl mb-4">🎉</p>
              <p className="text-3xl font-black text-green-700 mb-2">Deal Complete!</p>
              <p className="text-green-600 text-sm mb-2">Congratulations to both parties</p>
              <p className="text-gray-500 text-xs mb-6">
                Completed on {deal.dealCompletedAt ? new Date(deal.dealCompletedAt).toLocaleDateString() : "today"} · {fmt(deal.agreedPrice)} EGP transferred
              </p>
              <div className="flex gap-3 justify-center">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                  📜 Download Certificate
                </button>
                <button onClick={() => navigate("/dashboard/escrow")} className="border border-gray-300 text-gray-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  View All Deals
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Chat & Docs */}
        <div className="w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col hidden lg:flex">
          <div className="grid grid-cols-2 border-b border-gray-200">
            {[{ id: "docs", label: "📄 Documents" }, { id: "chat", label: "💬 Chat" }].map(t => (
              <button key={t.id} onClick={() => setRightTab(t.id)}
                className={"py-3 text-xs font-bold transition-colors border-b-2 " + (rightTab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700")}>
                {t.label}
              </button>
            ))}
          </div>

          {rightTab === "docs" && (
            <div className="flex-1 overflow-y-auto p-4">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm mb-4 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Upload Document
              </button>
              {/* Per-milestone doc requirements */}
              {activeMilestone && MILESTONE_META[activeMilestone.milestoneType]?.requiresDocs && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
                  <p className="text-xs font-black text-orange-700 mb-2">📋 Required for Step {activeMilestone.milestoneOrder}:</p>
                  {MILESTONE_META[activeMilestone.milestoneType].requiresDocs.map((doc, i) => (
                    <p key={i} className="text-xs text-orange-600 flex items-center gap-1.5 mb-1">
                      <span className="w-3 h-3 rounded-full border border-orange-300 flex-shrink-0" />
                      {doc}
                    </p>
                  ))}
                </div>
              )}
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No documents yet</p>
                </div>
              ) : documents.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl mb-2 hover:bg-gray-50">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center text-base">📄</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{doc.documentName}</p>
                    <p className="text-[10px] text-gray-400">{doc.documentType}</p>
                  </div>
                  <span className={"text-[9px] font-bold px-1.5 py-0.5 rounded-full " + (doc.isVerified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600")}>
                    {doc.isVerified ? "✅" : "⏳"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {rightTab === "chat" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Deal activity will appear here</p>
                  </div>
                )}
                {messages.map(msg => {
                  if (msg.role === "system") return (
                    <div key={msg.id} className="text-center">
                      <span className="bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-semibold px-3 py-1 rounded-full inline-block">{msg.content}</span>
                    </div>
                  );
                  const isMe = msg.sender === user?.full_name || msg.sender === "You";
                  return (
                    <div key={msg.id} className={"flex " + (isMe ? "justify-end" : "justify-start")}>
                      <div className={"max-w-[80%] rounded-2xl px-3 py-2 text-sm " + (isMe ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-800")}>
                        {!isMe && <p className="text-[10px] font-bold text-gray-400 mb-0.5">{msg.sender}</p>}
                        <p>{msg.content}</p>
                        <p className={"text-[9px] mt-0.5 " + (isMe ? "text-orange-200" : "text-gray-400")}>{msg.time}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-gray-100 p-3 flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                <button onClick={handleSendMessage} className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDepositModal && (
        <DepositModal deal={deal} onClose={() => setShowDepositModal(false)} onSuccess={() => { setShowDepositModal(false); loadData(); }} />
      )}
      {showBalanceModal && (
        <BalancePaymentModal deal={deal} onClose={() => setShowBalanceModal(false)} onSuccess={() => { setShowBalanceModal(false); loadData(); addSystemMessage("💵 Balance payment received! Both parties must confirm to release funds."); }} />
      )}
    </div>
  );
}
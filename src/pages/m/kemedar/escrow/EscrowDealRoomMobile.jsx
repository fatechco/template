import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Lock, Send, Upload, Loader2, X, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const STATUS_CONFIG = {
  awaiting_deposit: { label: "Awaiting Deposit", color: "bg-blue-100 text-blue-700", bar: "bg-blue-500" },
  deposit_received: { label: "Deposit Received", color: "bg-teal-100 text-teal-700", bar: "bg-teal-500" },
  in_progress: { label: "In Progress", color: "bg-orange-100 text-orange-700", bar: "bg-orange-500" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", bar: "bg-green-500" },
  disputed: { label: "DISPUTED", color: "bg-red-100 text-red-700", bar: "bg-red-500" },
};

const MILESTONE_ICONS = { earnest_deposit: "💰", contract_signing: "📝", legal_verification: "⚖️", balance_payment: "💵", keys_handover: "🔑" };
const MILESTONE_ACTIONS = {
  buyer: { earnest_deposit: "Deposit Funds", contract_signing: "Sign Contract", legal_verification: "Confirm Due Diligence", balance_payment: "Confirm Balance Paid", keys_handover: "Confirm Keys Received ✅" },
  seller: { earnest_deposit: "Confirm Receipt", contract_signing: "Sign Contract", legal_verification: "Confirm Title Verified", balance_payment: "Confirm Balance Received", keys_handover: "Confirm Keys Handed Over ✅" },
};
const fmt = n => n ? Number(n).toLocaleString() : "0";

export default function EscrowDealRoomMobile() {
  const { dealId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = searchParams.get("new") === "1";

  const [deal, setDeal] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("milestones");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const messagesEndRef = useRef(null);

  const loadData = async () => {
    const me = await base44.auth.me().catch(() => null);
    setUser(me);
    const deals = await base44.entities.EscrowDeal.filter({ id: dealId }).catch(() => []);
    if (!deals.length) { navigate("/m/kemedar/escrow/wallet"); return; }
    const d = deals[0];
    setDeal(d);
    setRole(me?.id === d.buyerId ? "buyer" : me?.id === d.sellerId ? "seller" : "viewer");
    const mils = await base44.entities.EscrowMilestone.filter({ dealId }).catch(() => []);
    setMilestones(mils.sort((a, b) => a.milestoneOrder - b.milestoneOrder));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    if (isNew) setMessages([{ id: 1, role: "system", content: "🎉 Escrow deal created! Buyer must deposit earnest money to begin." }]);
  }, [dealId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleConfirm = async (milestoneId) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    if (!milestone) return;
    const alreadyConfirmedByOther = role === "buyer" ? milestone.sellerConfirmed : milestone.buyerConfirmed;
    const update = role === "buyer"
      ? { buyerConfirmed: true, buyerConfirmedAt: new Date().toISOString() }
      : { sellerConfirmed: true, sellerConfirmedAt: new Date().toISOString() };
    if (alreadyConfirmedByOther) {
      update.status = "completed";
      update.completedAt = new Date().toISOString();
      if ((milestone.paymentAmount || 0) > 0) { update.paymentReleased = true; update.paymentReleasedAt = new Date().toISOString(); }
      const next = milestones.find(m => m.milestoneOrder === milestone.milestoneOrder + 1);
      if (next) await base44.entities.EscrowMilestone.update(next.id, { status: "in_progress" });
      setMessages(prev => [...prev, { id: Date.now(), role: "system", content: `✅ "${milestone.milestoneName}" completed!${milestone.paymentAmount > 0 ? ` ${fmt(milestone.paymentAmount)} EGP released.` : ""}` }]);
    } else {
      update.status = role === "buyer" ? "awaiting_seller_confirm" : "awaiting_buyer_confirm";
      setMessages(prev => [...prev, { id: Date.now(), role: "system", content: `⏳ ${role === "buyer" ? "Buyer" : "Seller"} confirmed "${milestone.milestoneName}" — waiting for other party.` }]);
    }
    await base44.entities.EscrowMilestone.update(milestoneId, update);
    loadData();
  };

  const handleDeposit = async () => {
    const amount = deal.earnestMoneyAmount || 0;
    await base44.entities.EscrowTransaction.create({
      transactionNumber: "KET-" + Date.now(), dealId: deal.id, transactionType: "deposit",
      direction: "in", amount, currency: "EGP", fromUserId: deal.buyerId,
      paymentMethod: "xeed_wallet", status: "completed",
      description: "Earnest money deposit for Deal " + deal.dealNumber,
      processedAt: new Date().toISOString(),
    });
    await base44.entities.EscrowDeal.update(deal.id, { status: "deposit_received", totalDeposited: amount, dealStartedAt: new Date().toISOString() });
    const m1 = milestones.find(m => m.milestoneOrder === 1);
    if (m1) await base44.entities.EscrowMilestone.update(m1.id, { buyerConfirmed: true, buyerConfirmedAt: new Date().toISOString(), status: "awaiting_seller_confirm" });
    setShowDepositModal(false);
    setMessages(prev => [...prev, { id: Date.now(), role: "system", content: "💰 Deposit received! Seller has been notified." }]);
    loadData();
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), role, sender: user?.full_name || "You", content: chatInput }]);
    setChatInput("");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  if (!deal) return null;

  const statusCfg = STATUS_CONFIG[deal.status] || STATUS_CONFIG.in_progress;
  const activeMilestone = milestones.find(m => m.status === "in_progress" || m.status?.includes("confirm"));
  const completedCount = milestones.filter(m => m.status === "completed").length;
  const progressPct = milestones.length ? Math.round(completedCount / milestones.length * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-sm flex items-center gap-1.5"><Lock size={13} className="text-orange-500" /> Kemedar Escrow™</p>
          <p className="text-xs text-gray-400 truncate">{deal.dealNumber} · <span className="capitalize text-orange-500 font-bold">{role}</span></p>
        </div>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${statusCfg.color}`}>{statusCfg.label}</span>
      </div>

      {/* Status bar */}
      <div className={`${statusCfg.bar} text-white py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2`}>
        <Lock size={12} />
        {deal.status === "completed" ? "🎉 Deal Complete!" : activeMilestone ? `Step ${activeMilestone.milestoneOrder}/5 — ${activeMilestone.milestoneName}` : statusCfg.label}
        {deal.status === "awaiting_deposit" && role === "buyer" && (
          <button onClick={() => setShowDepositModal(true)} className="bg-white/20 px-2 py-0.5 rounded-full font-black ml-2">💰 Deposit</button>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center mb-1.5">
          {milestones.map((m, i) => (
            <div key={m.id} className="flex items-center flex-1 last:flex-none">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${m.status === "completed" ? "bg-green-500 text-white" : m.status?.includes("progress") || m.status?.includes("confirm") ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                {m.status === "completed" ? "✓" : (MILESTONE_ICONS[m.milestoneType] || i + 1)}
              </div>
              {i < milestones.length - 1 && <div className={`flex-1 h-0.5 mx-0.5 ${m.status === "completed" ? "bg-green-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{completedCount}/{milestones.length} milestones · {progressPct}%</p>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>💰 {fmt(deal.totalDeposited || 0)} EGP held</span>
            <span>✅ {fmt(deal.totalReleased || 0)} EGP released</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100">
        {[{ id: "milestones", label: "📅 Milestones" }, { id: "chat", label: "💬 Chat" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Milestones Tab */}
      {activeTab === "milestones" && (
        <div className="px-4 py-4 space-y-3">
          {milestones.map(m => {
            const isActive = m.status?.includes("progress") || m.status?.includes("confirm");
            const isCompleted = m.status === "completed";
            const isPending = m.status === "pending";
            const myConfirmed = role === "buyer" ? m.buyerConfirmed : m.sellerConfirmed;
            const otherConfirmed = role === "buyer" ? m.sellerConfirmed : m.buyerConfirmed;
            return (
              <div key={m.id} className={`rounded-2xl border ${isCompleted ? "border-green-300 bg-green-50/50" : isActive ? "border-orange-300 bg-orange-50/30" : "border-gray-100 bg-white"} shadow-sm overflow-hidden`}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 ${isCompleted ? "bg-green-500 text-white" : isActive ? "bg-orange-500 text-white" : "bg-gray-100"}`}>
                      {isCompleted ? "✓" : (MILESTONE_ICONS[m.milestoneType] || m.milestoneOrder)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-black text-sm ${isCompleted ? "text-green-700" : isActive ? "text-orange-700" : "text-gray-500"}`}>
                          Step {m.milestoneOrder}: {m.milestoneName}
                        </p>
                        {isActive && <span className="bg-orange-100 text-orange-700 text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">ACTIVE</span>}
                        {isPending && <span className="bg-gray-100 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">Locked</span>}
                      </div>
                      {m.paymentAmount > 0 && (
                        <p className={`text-xs font-black mt-0.5 ${isCompleted ? "text-green-600" : "text-orange-600"}`}>
                          💰 {isCompleted ? "Released: " : "Will release: "}{fmt(m.paymentAmount)} EGP
                        </p>
                      )}
                    </div>
                  </div>

                  {isActive && (
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`rounded-xl p-2 text-center text-xs border ${m.buyerConfirmed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                          <p className="font-bold text-gray-600">Buyer</p>
                          <p className={m.buyerConfirmed ? "text-green-600 font-bold" : "text-gray-400"}>{m.buyerConfirmed ? "✅" : "⏳"}</p>
                        </div>
                        <div className={`rounded-xl p-2 text-center text-xs border ${m.sellerConfirmed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                          <p className="font-bold text-gray-600">Seller</p>
                          <p className={m.sellerConfirmed ? "text-green-600 font-bold" : "text-gray-400"}>{m.sellerConfirmed ? "✅" : "⏳"}</p>
                        </div>
                      </div>
                      {!myConfirmed && role !== "viewer" && (
                        <button onClick={() => handleConfirm(m.id)}
                          className="w-full bg-orange-500 text-white font-black py-2.5 rounded-xl text-sm">
                          ✅ {MILESTONE_ACTIONS[role]?.[m.milestoneType] || "Confirm Milestone"}
                        </button>
                      )}
                      {myConfirmed && !otherConfirmed && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 text-center text-xs text-blue-700 font-bold">
                          ✅ You confirmed — awaiting {role === "buyer" ? "seller" : "buyer"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {deal.status === "completed" && (
            <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-xl font-black text-green-700">Deal Complete!</p>
              <p className="text-sm text-green-600 mt-1">{fmt(deal.agreedPrice)} EGP transferred</p>
              <button className="mt-4 bg-green-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
                📜 Download Certificate
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 mt-2">
            <button onClick={() => navigate(`/kemedar/escrow/${dealId}/dispute`)}
              className="flex-1 border-2 border-red-200 text-red-600 font-bold py-2.5 rounded-xl text-xs">
              ⚠️ Raise Dispute
            </button>
            <button className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1">
              <Upload size={12} /> Documents
            </button>
          </div>
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <div className="flex flex-col" style={{ height: "calc(100vh - 220px)" }}>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-2xl mb-2">💬</p>
                <p className="text-sm">Deal activity appears here</p>
              </div>
            )}
            {messages.map(msg => {
              if (msg.role === "system") return (
                <div key={msg.id} className="text-center">
                  <span className="bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full inline-block">{msg.content}</span>
                </div>
              );
              const isMe = msg.sender === user?.full_name;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${isMe ? "bg-orange-500 text-white" : "bg-white border border-gray-100"}`}>
                    {!isMe && <p className="text-[10px] font-bold text-gray-400 mb-0.5">{msg.sender}</p>}
                    <p>{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-100 px-4 py-3 flex gap-2 bg-white">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
            <button onClick={sendMessage} className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg text-gray-900">💰 Deposit Earnest Money</h2>
              <button onClick={() => setShowDepositModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center mb-4">
              <p className="text-sm text-gray-500">Earnest Amount ({deal.earnestMoneyPercent || 10}%)</p>
              <p className="text-3xl font-black text-orange-600">{fmt(deal.earnestMoneyAmount || 0)} EGP</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <p className="text-xs font-bold text-blue-800 mb-1">🔒 Your deposit is protected:</p>
              {["Held in segregated escrow account", "100% refundable if deal fails through seller's fault", "Released only on your confirmation"].map((t, i) => (
                <p key={i} className="text-xs text-blue-700 flex items-center gap-1.5 mb-1"><Check size={10} /> {t}</p>
              ))}
            </div>
            <button onClick={handleDeposit} className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2">
              <Lock size={16} /> Confirm Deposit via XeedWallet
            </button>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}
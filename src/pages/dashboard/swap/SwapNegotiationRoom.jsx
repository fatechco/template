import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import NegotiationRoomHeader from "@/components/swap/room/NegotiationRoomHeader";
import FinancialLedger from "@/components/swap/room/FinancialLedger";
import PropertyComparisonCard from "@/components/swap/room/PropertyComparisonCard";
import SwapConciergeSection from "@/components/swap/room/SwapConciergeSection";
import NegotiationChat from "@/components/swap/room/NegotiationChat";

export default function SwapNegotiationRoom() {
  const { matchId } = useParams();
  const [user, setUser] = useState(null);
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      loadRoom(u, matchId);
    }).catch(() => setLoading(false));
  }, [matchId, refreshKey]);

  const loadRoom = async (u, mid) => {
    setLoading(true);
    try {
      const [matchData, msgs, gapOffers, settingsData] = await Promise.all([
        base44.entities.SwapMatch.filter({ id: mid }, "-created_date", 1),
        base44.entities.SwapNegotiationMessage.filter({ matchId: mid }, "created_date", 100),
        base44.entities.SwapGapOffer.filter({ matchId: mid }, "-created_date", 20),
        base44.entities.SwapSettings.list("-created_date", 1),
      ]);
      setMatch(matchData?.[0] || null);
      setMessages(msgs || []);
      setOffers(gapOffers || []);
      setSettings(settingsData?.[0] || null);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const refresh = () => setRefreshKey(k => k + 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#F8FAFC" }}>
        <div className="text-center">
          <div className="text-4xl mb-3" style={{ animation: "spin 2s linear infinite", display: "inline-block" }}>🔄</div>
          <p className="text-gray-500 font-medium">Loading negotiation room...</p>
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#F8FAFC" }}>
        <div className="text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-bold text-gray-800">Negotiation room not found</p>
          <Link to="/dashboard/swap" className="text-[#7C3AED] text-sm mt-3 block hover:underline">← Back to Swap Hub</Link>
        </div>
      </div>
    );
  }

  const isUserA = match.userAId === user?.id;
  const pendingOfferFromOther = offers.find(o => o.status === "pending" && o.offeredByUserId !== user?.id);
  const myLatestOffer = offers.find(o => o.offeredByUserId === user?.id && o.status === "pending");
  const agreedOffer = offers.find(o => o.status === "accepted");

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <NegotiationRoomHeader match={match} isUserA={isUserA} />

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-5 items-start">
        {/* LEFT COLUMN */}
        <div className="flex-[1.5] flex flex-col gap-5 min-w-0">
          <FinancialLedger
            match={match}
            isUserA={isUserA}
            userId={user?.id}
            pendingOfferFromOther={pendingOfferFromOther}
            myLatestOffer={myLatestOffer}
            agreedOffer={agreedOffer}
            onOpenCounter={() => setCounterModalOpen(true)}
            onRefresh={refresh}
          />

          <PropertyComparisonCard match={match} isUserA={isUserA} />

          {match.status === "terms_agreed" && (
            <SwapConciergeSection
              match={match}
              isUserA={isUserA}
              userId={user?.id}
              settings={settings}
              onRefresh={refresh}
            />
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-[380px] flex-shrink-0 sticky top-4" style={{ height: "calc(100vh - 180px)" }}>
          <NegotiationChat
            matchId={matchId}
            userId={user?.id}
            isUserA={isUserA}
            messages={messages}
            offers={offers}
            onRefresh={refresh}
            onOpenCounter={() => setCounterModalOpen(true)}
            pendingOfferFromOther={pendingOfferFromOther}
          />
        </div>
      </div>

      {/* Counter-offer modal */}
      {counterModalOpen && (
        <CounterOfferModal
          match={match}
          isUserA={isUserA}
          userId={user?.id}
          onClose={() => setCounterModalOpen(false)}
          onSent={() => { setCounterModalOpen(false); refresh(); }}
        />
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function CounterOfferModal({ match, isUserA, userId, onClose, onSent }) {
  const [amount, setAmount] = useState(match.valuationGapEGP || "");
  const [direction, setDirection] = useState(
    match.gapPayerUserId === userId ? "a_pays_b" : "b_pays_a"
  );
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!amount) return;
    setSending(true);
    await base44.functions.invoke("submitCounterOffer", {
      matchId: match.id,
      proposedGapEGP: parseFloat(amount),
      proposedGapDirection: direction,
      note: note || undefined,
    });
    onSent();
  };

  const DIRECTIONS = [
    { value: "a_pays_b", label: `Party A pays Party B` },
    { value: "b_pays_a", label: `Party B pays Party A` },
    { value: "equal", label: "Equal — no payment" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-gray-900 text-lg">Make a Counter-Offer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          AI-calculated gap reference: <span className="font-bold text-gray-700">{match.valuationGapEGP ? `${Number(match.valuationGapEGP).toLocaleString()} EGP` : "Not available"}</span>
        </p>

        <div className="mb-4">
          <label className="text-xs font-bold text-gray-700 block mb-2">I propose the gap should be:</label>
          <div className="flex gap-2 items-center">
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2.5 rounded-xl">EGP</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 500000"
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-xl font-black text-center focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-gray-700 block mb-2">Direction:</label>
          <div className="space-y-2">
            {DIRECTIONS.map(d => (
              <label key={d.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${direction === d.value ? "border-[#7C3AED] bg-purple-50" : "border-gray-200"}`}>
                <input type="radio" name="direction" value={d.value} checked={direction === d.value} onChange={() => setDirection(d.value)} className="accent-[#7C3AED]" />
                <span className="text-sm font-medium text-gray-800">{d.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="text-xs font-bold text-gray-700 block mb-2">Note (optional):</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Based on the actual condition of the property..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!amount || sending}
          className="w-full bg-[#7C3AED] hover:bg-purple-700 disabled:opacity-50 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {sending ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</> : "📤 Send Counter-Offer"}
        </button>
      </div>
    </div>
  );
}
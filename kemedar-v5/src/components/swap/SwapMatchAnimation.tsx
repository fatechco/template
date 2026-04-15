"use client";
// @ts-nocheck
import { useEffect, useState } from "react";
import Link from "next/link";

function Particle({ style }) {
  return <div style={style} />;
}

export default function SwapMatchAnimation({ match, userId, onClose }) {
  const [visible, setVisible] = useState(false);
  const isUserA = match.userAId === userId;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Simple confetti particles
  const particles = Array.from({ length: 28 }, (_, i) => ({
    key: i,
    style: {
      position: "fixed",
      top: `${Math.random() * 70}%`,
      left: `${Math.random() * 100}%`,
      width: 10,
      height: 10,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      background: ["#7C3AED", "#F59E0B", "#EC4899", "#10B981", "#3B82F6"][i % 5],
      animation: `fall-${i % 3} ${1.5 + Math.random()}s ease-in forwards`,
      animationDelay: `${Math.random() * 0.6}s`,
      opacity: 0,
    }
  }));

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(45,27,105,0.97) 100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Confetti */}
      {particles.map(p => <Particle key={p.key} style={p.style} />)}

      {/* Card */}
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 text-center w-full max-w-[500px]"
        style={{
          transform: visible ? "scale(1) translateY(0)" : "scale(0.85) translateY(40px)",
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Property thumbnails */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="w-20 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-3xl">🏠</div>
          <div className="text-3xl font-black text-[#7C3AED]" style={{ animation: "spin 1.5s linear infinite" }}>🔄</div>
          <div className="w-20 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">🏠</div>
        </div>

        <h2 className="text-3xl font-black text-[#7C3AED] mb-2">🎉 IT'S A SWAP MATCH!</h2>
        <p className="text-gray-700 font-semibold mb-1">
          {isUserA ? "Party B" : "Party A"} and you both want to swap!
        </p>
        <p className="text-gray-500 text-sm mb-8">
          You're now connected in a private Negotiation Room.
        </p>

        <Link
          href={`/dashboard/swap/negotiation/${match.id}`}
          className="flex items-center justify-center gap-2 w-full bg-[#7C3AED] hover:bg-purple-700 text-white font-black py-4 rounded-xl text-base transition-colors mb-3 shadow-lg"
          onClick={onClose}
        >
          💬 Enter Negotiation Room →
        </Link>
        <button onClick={onClose} className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
          View Later
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fall-0 { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(120px) rotate(360deg); } }
        @keyframes fall-1 { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(150px) rotate(-180deg); } }
        @keyframes fall-2 { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(100px) rotate(270deg); } }
      `}</style>
    </div>
  );
}
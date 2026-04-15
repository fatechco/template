"use client";
// @ts-nocheck
import { useRouter } from "next/navigation";

export default function SuccessScreen({ emoji = "✅", title, subtitle, actionLabel, actionPath }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center">
      <div className="text-6xl mb-6">{emoji}</div>
      <h2 className="text-2xl font-black text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-8">{subtitle}</p>
      {actionLabel && (
        <button
          onClick={() => router.push(actionPath || "/m/account")}
          className="bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm"
        >
          {actionLabel}
        </button>
      )}
      <button onClick={() => router.push("/m/home")} className="mt-4 text-sm text-gray-400 font-medium">
        Back to Home
      </button>
    </div>
  );
}
import { useOutletContext } from "react-router-dom";

export default function MobilePlaceholder({ title = "Coming Soon" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-lg font-black text-[#1F2937] mb-2">{title}</h2>
      <p className="text-sm text-[#6B7280]">This screen is under construction.</p>
    </div>
  );
}
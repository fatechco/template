import { Construction } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function AdminPlaceholder() {
  const { pathname } = useLocation();
  const page = pathname.split("/").pop().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
        <Construction size={28} className="text-orange-400" />
      </div>
      <h2 className="text-xl font-black text-gray-800 mb-2">{page}</h2>
      <p className="text-gray-400 text-sm">This admin page is being built.</p>
      <p className="text-gray-300 text-xs mt-1">{pathname}</p>
    </div>
  );
}
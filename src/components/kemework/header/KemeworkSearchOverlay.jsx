import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KemeworkSearchOverlay({ onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/kemework/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{ background: "rgba(26,26,46,0.85)" }} onClick={onClose}>
      <div className="bg-white w-full px-4 py-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="max-w-[900px] mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Search size={22} style={{ color: "#C41230" }} className="flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tasks, services, professionals..."
              className="flex-1 text-lg outline-none text-gray-900 placeholder-gray-400"
            />
            <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={22} className="text-gray-500" />
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2 ml-8">Press Enter to search · Esc to close</p>
        </div>
      </div>
    </div>
  );
}
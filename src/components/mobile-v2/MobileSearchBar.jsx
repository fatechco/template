import { Search, X, Mic } from "lucide-react";
import { useState } from "react";

export default function MobileSearchBar({ placeholder = "Search...", value, onChange, onSubmit }) {
  const [internal, setInternal] = useState(value || "");

  const val = value !== undefined ? value : internal;
  const setVal = onChange || setInternal;

  const handleChange = (e) => setVal(e.target.value);
  const handleClear = () => setVal("");
  const handleKeyDown = (e) => { if (e.key === "Enter") onSubmit?.(val); };

  return (
    <div
      className="flex items-center gap-2 px-3"
      style={{
        height: 48,
        background: "#F3F4F6",
        borderRadius: 12,
      }}
    >
      <Search size={18} className="text-gray-400 flex-shrink-0" />
      <input
        type="text"
        value={val}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
      />
      {val ? (
        <button onClick={handleClear} className="flex-shrink-0">
          <X size={18} className="text-gray-400" />
        </button>
      ) : (
        <button className="flex-shrink-0">
          <Mic size={18} className="text-gray-400" />
        </button>
      )}
    </div>
  );
}
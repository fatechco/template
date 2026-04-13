import { useState } from "react";
import { X } from "lucide-react";

export default function TagsInput({ tags, onChange }) {
  const [input, setInput] = useState("");

  const addTag = (val) => {
    const tag = val.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag) => onChange(tags.filter(t => t !== tag));

  return (
    <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl min-h-[48px] focus-within:border-orange-400 bg-white">
      {tags.map(tag => (
        <span key={tag} className="flex items-center gap-1 bg-orange-100 text-[#FF6B00] text-xs font-bold px-3 py-1.5 rounded-full">
          #{tag}
          <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value.replace(",", ""))}
        onKeyDown={handleKeyDown}
        onBlur={() => input.trim() && addTag(input)}
        placeholder={tags.length === 0 ? "e.g. sea view, corner unit, ready to move..." : "Add more tags..."}
        className="flex-1 min-w-[140px] text-sm outline-none bg-transparent placeholder-gray-400"
      />
    </div>
  );
}
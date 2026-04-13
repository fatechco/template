export function OptionCard({ icon, label, sublabel, selected, onClick, className = "" }) {
  return (
    <button onClick={onClick}
      className={`relative w-full text-left border-2 rounded-2xl p-4 transition-all duration-200 hover:border-orange-400 hover:bg-orange-50 ${selected ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white"} ${className}`}>
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</span>
      )}
      <div className="flex items-start gap-3">
        {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
        <div>
          <p className={`font-bold text-sm ${selected ? "text-orange-700" : "text-gray-800"}`}>{label}</p>
          {sublabel && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{sublabel}</p>}
        </div>
      </div>
    </button>
  );
}

export function PillOption({ label, selected, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${selected ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"}`}>
      {label}
    </button>
  );
}

export function Stepper({ value, onChange, min = 0, max = 20, label }) {
  return (
    <div className="flex items-center gap-4">
      <button onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 font-black text-xl hover:bg-orange-50 flex items-center justify-center">−</button>
      <div className="text-center min-w-[40px]">
        <p className="text-3xl font-black text-gray-900">{value}</p>
        {label && <p className="text-xs text-gray-400">{label}</p>}
      </div>
      <button onClick={() => onChange(Math.min(max, value + 1))}
        className="w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 font-black text-xl hover:bg-orange-50 flex items-center justify-center">+</button>
    </div>
  );
}

export function QuestionCard({ number, question, subtitle, children, optional = false }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 bg-orange-500 rounded-full text-white font-black text-xs flex items-center justify-center flex-shrink-0">{number}</span>
          <h3 className="font-black text-gray-900 text-lg md:text-xl leading-tight">{question}</h3>
        </div>
        {optional && <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 flex-shrink-0 ml-2">Optional</span>}
      </div>
      {subtitle && <p className="text-sm text-gray-500 ml-10 mb-5">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}
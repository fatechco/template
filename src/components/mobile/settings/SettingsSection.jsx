export default function SettingsSection({ label, children }) {
  return (
    <div>
      <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 px-1">
        {label}
      </p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}
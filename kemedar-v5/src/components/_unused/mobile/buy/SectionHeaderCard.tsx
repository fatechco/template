// @ts-nocheck
export default function SectionHeaderCard({ icon, emoji, title, subtitle, bgColor }) {
  return (
    <div
      className="rounded-2xl px-5 py-5 flex items-start gap-3 mx-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-3xl leading-tight flex-shrink-0">{emoji}</div>
      <div>
        <p className="text-white font-black text-lg leading-tight">{title}</p>
        <p className="text-white/80 text-sm mt-0.5 leading-tight">{subtitle}</p>
      </div>
    </div>
  );
}
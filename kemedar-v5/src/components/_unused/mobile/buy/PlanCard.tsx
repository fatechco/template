// @ts-nocheck
export default function PlanCard({ tag, tagColor, title, feature, price, buttonText, buttonColor, buttonAction }) {
  return (
    <div
      className="rounded-2xl border-2 p-4 w-40 flex-shrink-0"
      style={{ borderColor: tagColor }}
    >
      {tag && (
        <div
          className="text-xs font-black px-2 py-1 rounded-full w-fit mb-2"
          style={{ backgroundColor: tagColor + "22", color: tagColor }}
        >
          {tag}
        </div>
      )}
      <p className="text-sm font-black text-[#1F2937] mb-1">{title}</p>
      <p className="text-xs text-[#6B7280] mb-3 leading-tight">{feature}</p>
      <p className="text-base font-black text-[#1F2937] mb-3">{price}</p>
      <button
        onClick={buttonAction}
        className="w-full text-white font-bold py-2 rounded-lg text-xs transition-opacity active:opacity-80"
        style={{ backgroundColor: buttonColor }}
      >
        {buttonText}
      </button>
    </div>
  );
}
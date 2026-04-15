// @ts-nocheck
export default function MobileEmptyState({
  icon = "🔍",
  title = "Nothing here yet",
  subtitle = "",
  ctaText,
  ctaAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center min-h-[40vh]">
      <div className="text-6xl mb-4 select-none">{icon}</div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
      {subtitle && (
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{subtitle}</p>
      )}
      {ctaText && ctaAction && (
        <button
          onClick={ctaAction}
          className="mt-6 bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm active:bg-orange-700 transition-colors"
        >
          {ctaText}
        </button>
      )}
    </div>
  );
}
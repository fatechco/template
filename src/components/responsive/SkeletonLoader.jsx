export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 animate-pulse">
      <div className="h-48 bg-[#E5E7EB] rounded-xl mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-[#E5E7EB] rounded w-3/4"></div>
        <div className="h-3 bg-[#E5E7EB] rounded w-1/2"></div>
        <div className="h-4 bg-[#E5E7EB] rounded w-2/3 mt-4"></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, columns = 2 }) {
  return (
    <div className={`grid gap-4 md:gap-6 ${columns === 1 ? 'grid-cols-1' : `grid-cols-1 md:grid-cols-${columns}`}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonPropertyDetail() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-[#E5E7EB] rounded-lg mb-4"></div>
      <div className="space-y-4 px-4">
        <div className="h-6 bg-[#E5E7EB] rounded w-3/4"></div>
        <div className="h-4 bg-[#E5E7EB] rounded w-1/2"></div>
        <div className="space-y-2 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-[#E5E7EB] rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
          <div className="h-8 bg-[#E5E7EB] rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-[#E5E7EB] rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}
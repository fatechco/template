function Shimmer({ className }) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
    />
  );
}

export default function MobilePageLoader({ type = "list" }) {
  if (type === "grid") {
    return (
      <div className="p-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
            <Shimmer className="w-full h-44" />
            <div className="p-3 space-y-2">
              <Shimmer className="h-5 w-3/4" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-3 w-1/2" />
              <Shimmer className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm flex h-[100px]">
            <Shimmer className="w-[120px] h-full flex-shrink-0 rounded-none" />
            <div className="flex-1 p-3 space-y-2">
              <Shimmer className="h-4 w-1/2" />
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
              <Shimmer className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "detail") {
    return (
      <div className="space-y-4">
        <Shimmer className="w-full h-64" />
        <div className="px-4 space-y-3">
          <Shimmer className="h-6 w-2/3" />
          <Shimmer className="h-5 w-full" />
          <Shimmer className="h-5 w-full" />
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  // default / full-screen
  return (
    <div className="p-4 space-y-4">
      <Shimmer className="h-12 w-full rounded-xl" />
      <Shimmer className="h-48 w-full rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
export function ResponsivePropertyGrid({ children, columns = { mobile: 1, tablet: 2, desktop: 3 } }) {
  return (
    <div
      className={`grid gap-4 md:gap-6 grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`}
    >
      {children}
    </div>
  );
}

export function ResponsiveCategoryGrid({ children, columns = { mobile: 4, tablet: 6, desktop: 8 } }) {
  return (
    <div className="grid gap-3 md:gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {children}
    </div>
  );
}

export function ResponsiveStatsGrid({ children }) {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
      {children}
    </div>
  );
}
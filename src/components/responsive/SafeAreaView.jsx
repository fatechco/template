export default function SafeAreaView({ children, className = '', padding = true }) {
  return (
    <div
      className={`w-full ${className} ${padding ? 'px-4 md:px-8' : ''}`}
      style={{
        paddingTop: padding ? 'max(1rem, env(safe-area-inset-top))' : undefined,
        paddingBottom: padding ? 'max(1rem, env(safe-area-inset-bottom))' : undefined,
        paddingLeft: padding ? 'max(1rem, env(safe-area-inset-left))' : undefined,
        paddingRight: padding ? 'max(1rem, env(safe-area-inset-right))' : undefined,
      }}
    >
      {children}
    </div>
  );
}
import { useEffect, useRef } from "react";

export default function MobileFilterBottomSheet({ open, onClose, onApply, onReset, children }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end items-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 pointer-events-auto"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative bg-white rounded-t-3xl flex flex-col pointer-events-auto w-full max-w-lg"
        style={{ maxHeight: "85vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="font-bold text-gray-900 text-base">Filters</span>
          <button
            onClick={onReset}
            className="text-sm font-semibold text-orange-600"
          >
            Reset
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {/* Sticky Apply button */}
        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={() => { onApply?.(); onClose(); }}
            className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm active:bg-orange-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
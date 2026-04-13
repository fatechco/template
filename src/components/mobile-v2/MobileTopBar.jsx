import { ArrowLeft, Search, SlidersHorizontal, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileTopBar({
  title,
  showBack = false,
  showSearch = false,
  showFilter = false,
  showMenu = false,
  rightAction = null,
  onSearchClick,
  onFilterClick,
  onMenuClick,
}) {
  const navigate = useNavigate();

  return (
    <div
      className="sticky top-0 z-40 bg-white flex items-center px-4 gap-3"
      style={{ height: 56, boxShadow: "0 1px 0 #E5E7EB" }}
    >
      {/* Left */}
      <div className="flex-shrink-0 w-8 flex items-center justify-start">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
        ) : showMenu ? (
          <button onClick={onMenuClick} className="p-1 -ml-1 hover:bg-gray-100 rounded">
            <Menu size={24} className="text-gray-900" />
          </button>
        ) : (
          <span className="font-black text-orange-600 text-lg leading-none">K</span>
        )}
      </div>

      {/* Center */}
      <div className="flex-1 text-center">
        <span className="font-bold text-gray-900 text-base truncate">{title}</span>
      </div>

      {/* Right */}
      <div className="flex-shrink-0 w-8 flex items-center justify-end gap-2">
        {showSearch && (
          <button onClick={onSearchClick} className="p-1">
            <Search size={22} className="text-gray-700" />
          </button>
        )}
        {showFilter && (
          <button onClick={onFilterClick} className="p-1">
            <SlidersHorizontal size={22} className="text-gray-700" />
          </button>
        )}
        {rightAction && rightAction}
      </div>
    </div>
  );
}
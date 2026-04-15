"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Sparkles, Star } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const CATEGORY_ICONS = {
  "Construction": "🏗️",
  "Masonry Materials": "🧱",
  "Architectural": "🏛️",
  "Natural Stone": "🪨",
  "Electrical": "⚡",
  "Plumbing": "🔧",
  "Mechanical": "⚙️",
  "Appliances": "📺",
  "Furniture": "🛋️",
  "Landscaping and Garden": "🌿",
  "Decorative Products": "🎨",
  "Security & Communication": "🔐",
  "Kemedar Services": "🛎️",
};

const CATEGORY_BANNERS = {
  "Construction": { img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80", text: "Build with confidence" },
  "Masonry Materials": { img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80", text: "Premium masonry supplies" },
  "Architectural": { img: "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?w=400&q=80", text: "Architectural excellence" },
  "Natural Stone": { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", text: "Natural beauty, lasting quality" },
  "Electrical": { img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", text: "Power your project" },
  "Plumbing": { img: "https://images.unsplash.com/photo-1558618047-f4e90f6b3b44?w=400&q=80", text: "Complete plumbing solutions" },
  "Mechanical": { img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80", text: "Mechanical systems & more" },
  "Appliances": { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", text: "Shop Appliances — Up to 25% Off" },
  "Furniture": { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", text: "Shop Furniture — Up to 30% Off" },
  "Landscaping and Garden": { img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", text: "Transform your outdoor space" },
  "Decorative Products": { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", text: "Elevate your interiors" },
  "Security & Communication": { img: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80", text: "Secure your property" },
  "Kemedar Services": { img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80", text: "Professional services for you" },
};

function MegaDropdown({ category, subcategories }) {
  const banner = CATEGORY_BANNERS[category.name] || { img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80", text: "Explore " + category.name };

  return (
    <div className="absolute top-full left-0 mt-0 bg-white rounded-b-xl shadow-2xl border border-gray-100 z-[200] w-[520px]">
      <div className="flex">
        {/* Subcategories */}
        <div className="flex-1 p-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{category.name}</p>
          <div className="grid grid-cols-2 gap-0.5">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/kemetro/category/${sub.slug}`}
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 hover:text-[#0077B6] hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span className="text-xs">›</span>
                {sub.name}
              </Link>
            ))}
          </div>
          <Link
            href={`/kemetro/category/${category.slug}`}
            className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-[#0077B6] hover:underline"
          >
            View All {category.name} →
          </Link>
        </div>

        {/* Banner */}
        <div className="w-44 flex-shrink-0 relative overflow-hidden rounded-br-xl">
          <img src={banner.img} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0077B6]/80 via-transparent to-transparent" />
          <p className="absolute bottom-3 left-2 right-2 text-white text-xs font-bold leading-tight">{banner.text}</p>
        </div>
      </div>
    </div>
  );
}

function CategoryItem({ category, subcategories, active }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative flex-shrink-0"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={`/kemetro/category/${category.slug}`}
        className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
          active
            ? "text-[#0077B6] border-[#0077B6]"
            : "text-gray-600 border-transparent hover:text-[#0077B6] hover:border-[#0077B6]"
        }`}
      >
        <span className="text-base leading-none">{CATEGORY_ICONS[category.name] || "📦"}</span>
        <span>{category.name}</span>
      </Link>
      {open && subcategories.length > 0 && (
        <MegaDropdown category={category} subcategories={subcategories} />
      )}
    </div>
  );
}

export default function KemetroCategoryNav() {
  const [categories, setCategories] = useState([]);
  const [subcategoryMap, setSubcategoryMap] = useState({});
  const pathname = usePathname();

  useEffect(() => {
    apiClient.list("/api/v1/kemetrocategory", { isActive: true })
      .then((data) => {
        const top = data.filter((c) => !c.parentId).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        const subs = {};
        data.filter((c) => c.parentId).forEach((c) => {
          if (!subs[c.parentId]) subs[c.parentId] = [];
          subs[c.parentId].push(c);
        });
        setCategories(top);
        setSubcategoryMap(subs);
      })
      .catch(() => {});
  }, []);

  const activeSlug = pathname.split("/kemetro/category/")[1];

  return (
    <div className="w-full bg-[#F3F4F6] border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center">
          {/* Scrollable categories */}
          <div className="flex items-center overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                subcategories={subcategoryMap[cat.id] || []}
                active={activeSlug === cat.slug}
              />
            ))}
          </div>

          {/* Right quick links */}
          <div className="flex items-center gap-1 flex-shrink-0 border-l border-gray-300 pl-3 ml-2">
            <Link href="/kemetro/flash-deals" className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded transition-colors whitespace-nowrap">
              <Flame size={14} /> Flash Deals
            </Link>
            <Link href="/kemetro/new-arrivals" className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold text-[#0077B6] hover:bg-blue-50 rounded transition-colors whitespace-nowrap">
              <Sparkles size={14} /> New Arrivals
            </Link>
            <Link href="/kemetro/top-rated" className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold text-yellow-600 hover:bg-yellow-50 rounded transition-colors whitespace-nowrap">
              <Star size={14} /> Top Rated
            </Link>
            <Link
              href="/kemetro/surplus"
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold hover:bg-green-50 rounded transition-colors whitespace-nowrap border-b-2 ${
                pathname.startsWith("/kemetro/surplus")
                  ? "text-[#15803D] border-[#15803D]"
                  : "text-[#15803D] border-transparent hover:border-[#15803D]"
              }`}
            >
              🌿 Surplus & Salvage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
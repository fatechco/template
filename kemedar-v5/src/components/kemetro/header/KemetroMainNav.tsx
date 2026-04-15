"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingCart, User, ChevronDown, Store, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import InnovativeMenu from "@/components/header/InnovativeMenu";

function KemetroLogo() {
  return (
    <Link href="/kemetro" className="select-none flex-shrink-0">
      <img
        src="https://media.base44.com/images/public/69b5eafc884b1597fb3ea66e/54d638672_kemetro-final.png"
        alt="Kemetro"
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
}

function AccountDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
        <User size={18} />
        <span className="text-sm font-medium hidden lg:block">My Account</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-0 bg-white rounded-xl shadow-2xl border border-gray-100 z-[200] w-48 py-2">
          {[
            { label: "My Orders", to: "/kemetro/orders" },
            { label: "My Profile", to: "/kemetro/profile" },
            { label: "Saved Items", to: "/kemetro/wishlist" },
            { label: "Logout", to: "/" },
          ].map((item) => (
            <Link key={item.label} href={item.to || "#"} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0077B6] transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function InnovativeDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#0077B6] rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
        🧠 ThinkDar™ AI <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <InnovativeMenu />}
    </div>
  );
}

export default function KemetroMainNav({ cartCount = 0, wishlistCount = 0 }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    apiClient.list("/api/v1/kemetrocategory", { isActive: true })
      .then((data) => setCategories(data.filter((c) => !c.parentId)))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/kemetro/search?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white shadow-md border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <KemetroLogo />

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center h-11 bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0077B6] transition-colors">
          {/* Category dropdown */}
          <div className="relative flex-shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none h-11 bg-transparent border-r border-gray-200 px-3 pr-7 text-sm text-gray-600 font-medium focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors min-w-[130px]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for building materials, furniture, appliances..."
            className="flex-1 h-11 px-4 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          />

          {/* Clear */}
          {query && (
            <button type="button" onClick={() => setQuery("")} className="px-2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}

          {/* Search button */}
          <button type="submit" className="h-11 px-5 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold flex items-center gap-2 transition-colors flex-shrink-0">
            <Search size={16} />
            <span className="hidden sm:block text-sm">Search</span>
          </button>
        </form>

        {/* Innovative dropdown */}
        <div className="hidden lg:block flex-shrink-0">
          <InnovativeDropdown />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Wishlist */}
          <Link href="/kemetro/wishlist" className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
            <span className="text-sm font-medium hidden lg:block">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link href="/kemetro/cart" className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-[#FF6B00] font-semibold">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF6B00] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-sm font-medium hidden lg:block">Cart</span>
          </Link>

          {/* Account */}
          <AccountDropdown />

          {/* Flash™ */}
          <Link
            href="/kemetro/flash"
            className="relative flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            ⚡ <span className="hidden lg:block">Flash™</span>
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 text-red-900 text-[8px] font-black rounded-full flex items-center justify-center">4</span>
          </Link>

          {/* Build™ BOQ */}
          <Link
            href="/kemetro/build"
            className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white font-bold px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            🏗️ <span className="hidden lg:block">Build™</span>
          </Link>

          {/* Start Selling */}
          <Link
            href="/kemetro/sell"
            className="flex items-center gap-2 bg-[#0077B6] hover:bg-[#005f8f] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap shadow-sm"
          >
            <Store size={15} />
            Start Selling
          </Link>
        </div>
      </div>
    </div>
  );
}
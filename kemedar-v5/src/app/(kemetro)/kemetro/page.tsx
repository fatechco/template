"use client";
import Link from "next/link";
import { useMarketplaceProducts, useFlashDeals } from "@/hooks/use-marketplace";
import { ShoppingBag, Zap, Package, Tag, Palette, Calculator, Truck, Search } from "lucide-react";

const CATEGORIES = [
  { name: "Tiles & Flooring", icon: "🪨", href: "/kemetro/search?category=tiles" },
  { name: "Paints", icon: "🎨", href: "/kemetro/search?category=paints" },
  { name: "Plumbing", icon: "🚰", href: "/kemetro/search?category=plumbing" },
  { name: "Electrical", icon: "💡", href: "/kemetro/search?category=electrical" },
  { name: "Kitchen", icon: "🍳", href: "/kemetro/search?category=kitchen" },
  { name: "Bathroom", icon: "🚿", href: "/kemetro/search?category=bathroom" },
  { name: "Doors & Windows", icon: "🚪", href: "/kemetro/search?category=doors" },
  { name: "Furniture", icon: "🪑", href: "/kemetro/search?category=furniture" },
];

export default function KemetroHomePage() {
  const { data: products } = useMarketplaceProducts({ pageSize: 8 });
  const { data: flashDeals } = useFlashDeals();
  return (<div>
    {/* Hero */}
    <section className="bg-gradient-to-br from-green-600 to-emerald-800 text-white py-16 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Building Materials Marketplace</h1>
        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">Buy building materials, flash deals, KemeKits, and surplus items — all in one place</p>
        <div className="max-w-xl mx-auto relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/><input type="text" placeholder="Search products..." className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-800 text-lg"/></div>
      </div>
    </section>

    {/* Categories */}
    <section className="py-10 px-4"><div className="container mx-auto max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">{CATEGORIES.map(c=>(<Link key={c.name} href={c.href} className="bg-white border rounded-xl p-3 text-center hover:shadow-md transition"><div className="text-2xl mb-1">{c.icon}</div><div className="text-xs font-medium truncate">{c.name}</div></Link>))}</div>
    </div></section>

    {/* Flash Deals */}
    {flashDeals?.data?.length>0 && <section className="py-10 px-4 bg-orange-50"><div className="container mx-auto max-w-6xl">
      <div className="flex items-center gap-2 mb-6"><Zap className="w-6 h-6 text-orange-600"/><h2 className="text-2xl font-bold">Flash Deals</h2></div>
      <div className="grid md:grid-cols-4 gap-4">{flashDeals.data.slice(0,4).map((d:any)=>(<Link key={d.id} href={`/kemetro/flash/${d.id}`} className="bg-white rounded-xl border p-4 hover:shadow-md transition"><div className="text-sm font-bold text-orange-600 mb-1">{d.discountPercent}% OFF</div><h3 className="font-medium text-sm truncate">{d.title}</h3><div className="mt-2"><span className="text-lg font-bold">{d.flashPriceEGP} EGP</span>{d.originalPriceEGP&&<span className="text-sm text-slate-400 line-through ml-2">{d.originalPriceEGP}</span>}</div></Link>))}</div>
    </div></section>}

    {/* Quick Links */}
    <section className="py-10 px-4"><div className="container mx-auto max-w-6xl">
      <div className="grid md:grid-cols-4 gap-4">
        {[{icon:Package,title:"KemeKits",desc:"Pre-designed room packages",href:"/kemetro/kemekits",color:"bg-blue-50 text-blue-600"},{icon:Tag,title:"Surplus Market",desc:"Discounted leftover materials",href:"/kemetro/surplus",color:"bg-green-50 text-green-600"},{icon:Palette,title:"Shop the Look",desc:"Buy what you see in photos",href:"/kemetro/shop-the-look",color:"bg-purple-50 text-purple-600"},{icon:Calculator,title:"Build BOQ",desc:"AI material calculator",href:"/kemetro/build",color:"bg-amber-50 text-amber-600"}].map(f=>(<Link key={f.title} href={f.href} className={`rounded-xl border p-5 hover:shadow-md transition ${f.color}`}><f.icon className="w-8 h-8 mb-3"/><h3 className="font-bold">{f.title}</h3><p className="text-sm opacity-70 mt-1">{f.desc}</p></Link>))}
      </div>
    </div></section>

    {/* Featured Products */}
    <section className="py-10 px-4 bg-slate-50"><div className="container mx-auto max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
      <div className="grid md:grid-cols-4 gap-4">{(products?.data||[]).slice(0,8).map((p:any)=>(<Link key={p.id} href={`/kemetro/product/${p.id}`} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition">{p.imageUrls?.[0]&&<img src={p.imageUrls[0]} alt="" className="w-full h-40 object-cover"/>}<div className="p-3"><h3 className="font-medium text-sm truncate">{p.title}</h3><div className="font-bold text-green-600 mt-1">{p.priceEGP?.toLocaleString()} EGP</div></div></Link>))}</div>
    </div></section>

    {/* Become a Seller CTA */}
    <section className="py-16 px-4"><div className="container mx-auto max-w-4xl">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Start Selling on Kemetro</h2>
        <p className="text-green-100 mb-6">Reach thousands of property owners and contractors</p>
        <div className="flex gap-3 justify-center"><Link href="/kemetro/seller/register" className="bg-white text-green-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-green-50">Register as Seller</Link><Link href="/kemetro/shipper/register" className="border-2 border-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10">Become a Shipper</Link></div>
      </div>
    </div></section>
  </div>);
}

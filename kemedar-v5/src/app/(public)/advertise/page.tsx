import { Megaphone } from "lucide-react";
import Link from "next/link";

export default function AdvertisePage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 text-center">
      <Megaphone className="w-12 h-12 text-orange-600 mx-auto mb-3" />
      <h1 className="text-4xl font-bold mb-4">Advertise on Kemedar</h1>
      <p className="text-slate-500 max-w-xl mx-auto mb-8">
        Reach thousands of property buyers, sellers, and professionals
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: "Featured Listing", price: "500 EGP/mo", desc: "Highlight your property" },
          { title: "Banner Ads", price: "2,000 EGP/mo", desc: "Homepage visibility" },
          { title: "Sponsored Content", price: "Custom", desc: "Custom campaigns" },
        ].map((p) => (
          <div key={p.title} className="bg-white border rounded-xl p-6">
            <h3 className="font-bold text-lg">{p.title}</h3>
            <div className="text-2xl font-bold text-blue-600 my-2">{p.price}</div>
            <p className="text-sm text-slate-500">{p.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/contact" className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700">
          Contact Sales
        </Link>
      </div>
    </div>
  );
}

import { Building2, Users, Globe, Award } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">About Kemedar</h1>
        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
          Egypt&apos;s leading real estate super-app for buying, selling, finishing, and investing in properties
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            Kemedar aims to revolutionize the Egyptian real estate market through technology, transparency, and trust. We combine AI-powered tools with a comprehensive marketplace to make property transactions safer and smarter.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Platform</h2>
          <p className="text-slate-600 leading-relaxed">
            With three integrated modules — Kemedar (real estate), Kemetro (building materials), and Kemework (home services) — we provide an end-to-end solution for all property needs.
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: Building2, value: "10,000+", label: "Properties" },
          { icon: Users, value: "50,000+", label: "Users" },
          { icon: Globe, value: "15+", label: "Cities" },
          { icon: Award, value: "12", label: "AI Tools" },
        ].map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-6 text-center">
            <s.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

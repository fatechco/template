import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck, BarChart3, Globe, Headphones, Building2, Users, Star, Award } from "lucide-react";
import VideoLibrary from "@/components/about/VideoLibrary";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";

const STATS = [
  { value: 500000, label: "Properties Listed", suffix: "+" },
  { value: 15, label: "Countries", suffix: "+" },
  { value: 12000, label: "Active Agents", suffix: "+" },
  { value: 2000000, label: "Monthly Users", suffix: "+" },
];

const SERVICES = [
  { icon: Search, title: "Property Search", desc: "Advanced search with filters across all property types, locations, and price ranges.", color: "text-blue-600 bg-blue-50" },
  { icon: Building2, title: "Project Listings", desc: "Discover new off-plan projects from top developers with full media and specs.", color: "text-purple-600 bg-purple-50" },
  { icon: ShieldCheck, title: "VERI Verification", desc: "Official property verification service for maximum buyer trust and visibility.", color: "text-green-600 bg-green-50" },
  { icon: Users, title: "Agent Network", desc: "Connect with 12,000+ certified real estate professionals across the MENA region.", color: "text-orange-600 bg-orange-50" },
  { icon: BarChart3, title: "Market Analytics", desc: "Real-time pricing data, market trends, and investment insights.", color: "text-red-600 bg-red-50" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated support team available around the clock for buyers, sellers, and agents.", color: "text-teal-600 bg-teal-50" },
];

const TEAM = [
  { name: "Karim El-Sayed", role: "CEO & Co-Founder", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name: "Sara Ahmed", role: "CTO & Co-Founder", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
  { name: "Omar Farouk", role: "Chief Product Officer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
  { name: "Layla Hassan", role: "VP of Marketing", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80" },
  { name: "Ahmed Mostafa", role: "Head of Engineering", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" },
  { name: "Nour Kamel", role: "Head of Operations", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
];

const PARTNERS = [
  "Coldwell Banker", "RE/MAX", "JLL", "Savills", "CBRE", "Knight Frank", "Engel & Völkers", "Century 21",
];

function AnimatedCounter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const step = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {count >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count}{suffix}
    </span>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <div className="relative bg-[#1a1a2e] overflow-hidden py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-[1000px] mx-auto px-4 text-center">
          <span className="inline-block bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-black px-4 py-1.5 rounded-full mb-4 tracking-wider">OUR STORY</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            Building the Future of<br /><span className="text-[#FF6B00]">Real Estate Technology</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Kemedar was founded with a simple but powerful mission: to make real estate accessible, transparent, and efficient for everyone — buyers, sellers, investors, and professionals alike. Today, we are the region's leading proptech super-platform.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-[1200px] mx-auto px-4 py-16 w-full">
        <div className="bg-gradient-to-r from-[#FF6B00] to-orange-500 rounded-3xl p-8 sm:p-12 text-white text-center">
          <p className="text-xs font-black uppercase tracking-widest text-orange-100 mb-3">Our Mission</p>
          <h2 className="text-2xl sm:text-3xl font-black leading-relaxed max-w-3xl mx-auto">
            "To democratize access to real estate information and services, empowering millions of people to make smarter property decisions."
          </h2>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#1a1a2e] py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-black text-[#FF6B00]">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-gray-400 text-sm font-medium mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-[1200px] mx-auto px-4 py-16 w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">What We Offer</h2>
          <p className="text-gray-500">A complete ecosystem for every real estate need</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(s => (
            <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                <s.icon size={22} />
              </div>
              <h3 className="font-black text-gray-900 text-base mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Meet the Team</h2>
            <p className="text-gray-500">The people building the future of proptech</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {TEAM.map(m => (
              <div key={m.name} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md mb-3 group-hover:scale-105 transition-transform">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-black text-gray-900 text-xs">{m.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="max-w-[1200px] mx-auto px-4 py-16 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Our Partners</h2>
          <p className="text-gray-500 text-sm">Trusted by leading real estate brands worldwide</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {PARTNERS.map(p => (
              <div key={p} className="flex items-center justify-center h-12 px-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer">
                <span className="text-sm font-black text-gray-500 hover:text-[#FF6B00] transition-colors">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
          {[
            { icon: "🎯", title: "Our Vision", text: "To be the #1 real estate super-platform in the MENA region by 2030, connecting 10 million users with their dream properties." },
            { icon: "💡", title: "Our Values", text: "Transparency, Innovation, Trust. We build products that empower users with accurate information and tools to make confident decisions." },
            { icon: "🤝", title: "Our Commitment", text: "We are committed to fair, accessible real estate services for everyone — regardless of budget, location, or background." },
          ].map(v => (
            <div key={v.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <span className="text-4xl block mb-3">{v.icon}</span>
              <h3 className="font-black text-gray-900 text-base mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Library */}
      <div className="bg-[#1a1a2e] py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-black px-4 py-1.5 rounded-full mb-4 tracking-wider">VIDEO LIBRARY</span>
            <h2 className="text-3xl font-black text-white mb-2">Learn How Kemedar Works</h2>
            <p className="text-gray-400 text-sm">Watch our educational videos and get the most out of the platform</p>
          </div>
          <VideoLibrary />
        </div>
      </div>

      {/* Accreditation CTA */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] py-16">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/20 flex items-center justify-center mx-auto mb-5">
            <Award size={32} className="text-[#FF6B00]" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Are You a Professional?</h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Get officially accredited on Kemedar and unlock premium visibility, verified badges, and more client opportunities across Kemework and the entire platform.
          </p>
          <Link
            to="/cp/pro/accreditation"
            className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl text-base transition-colors shadow-lg"
          >
            <Award size={20} />
            Ask for Accreditation
          </Link>
        </div>
      </div>

      <SuperFooter />
    </div>
  );
}
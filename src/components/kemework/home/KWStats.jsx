import { useEffect, useRef, useState } from "react";

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const STATS = [
  { icon: "🔧", value: 10000, suffix: "+", label: "Professionals" },
  { icon: "📋", value: 50000, suffix: "+", label: "Tasks Completed" },
  { icon: "⭐", value: 4.8, suffix: "/5", label: "Average Rating", isFloat: true },
  { icon: "🌍", value: 30, suffix: "+", label: "Countries" },
];

function StatItem({ stat, started }) {
  const count = useCountUp(stat.isFloat ? stat.value * 10 : stat.value, 2000, started);
  const display = stat.isFloat ? (count / 10).toFixed(1) : count.toLocaleString();
  return (
    <div className="flex flex-col items-center text-center text-white">
      <span className="text-4xl mb-2">{stat.icon}</span>
      <p className="text-4xl font-black mb-1">{display}{stat.suffix}</p>
      <p className="text-white/70 text-sm font-medium">{stat.label}</p>
    </div>
  );
}

export default function KWStats() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full py-16 px-4"
      style={{ background: "linear-gradient(135deg, #C41230 0%, #8B0000 100%)" }}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(s => <StatItem key={s.label} stat={s} started={started} />)}
      </div>
    </div>
  );
}
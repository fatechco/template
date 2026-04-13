import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { useModules } from '@/lib/ModuleContext';

const MODULE_META = {
  kemework: { icon: '🔧', color: '#2D6A4F', gradient: 'from-emerald-50 to-teal-100', accent: 'bg-emerald-600', ring: 'ring-emerald-200' },
  kemetro: { icon: '🛒', color: '#0077B6', gradient: 'from-blue-50 to-sky-100', accent: 'bg-blue-600', ring: 'ring-blue-200' },
  kemedar: { icon: '🏠', color: '#FF6B00', gradient: 'from-orange-50 to-amber-100', accent: 'bg-orange-500', ring: 'ring-orange-200' },
};

export default function ComingSoon() {
  const { module } = useParams();
  const { moduleConfigs } = useModules();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const config = moduleConfigs.find(m => m.moduleName === module);
  const meta = MODULE_META[module] || MODULE_META.kemedar;
  const displayName = config?.displayName || module;
  const description = config?.comingSoonText || `${displayName} is launching soon!`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${meta.gradient} flex items-center justify-center p-6`}>
      <div className="max-w-lg w-full">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-10 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
          {/* Icon */}
          <div
            className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-lg mb-8 ring-4 ${meta.ring}`}
            style={{ background: `${meta.color}15` }}
          >
            {config?.icon || meta.icon}
          </div>

          {/* Badge */}
          <span className="inline-block text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white mb-5"
            style={{ background: meta.color }}>
            Coming Soon
          </span>

          {/* Title */}
          <h1 className="text-4xl font-black text-gray-900 mb-3">
            {displayName}
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-10">
            {description}
          </p>

          {/* Email Capture */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 text-left">
                <Bell size={14} className="inline mr-1.5 text-gray-400" />
                Get notified when we launch:
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
                  style={{ '--tw-ring-color': meta.color }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-white font-bold text-sm transition hover:opacity-90 active:scale-95"
                  style={{ background: meta.color }}
                >
                  Notify Me
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 text-green-700 font-semibold text-sm">
              ✅ You're on the list! We'll notify you at launch.
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 my-8" />

          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Kemedar
          </Link>
        </div>
      </div>
    </div>
  );
}
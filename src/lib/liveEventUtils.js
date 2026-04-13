export const EVENT_TYPE_META = {
  property_launch: { icon: '🏗️', label: 'Property Launch', color: 'bg-orange-100 text-orange-700', badge: 'bg-orange-500' },
  open_house: { icon: '🏠', label: 'Open House', color: 'bg-blue-100 text-blue-700', badge: 'bg-blue-500' },
  market_briefing: { icon: '📊', label: 'Market Briefing', color: 'bg-purple-100 text-purple-700', badge: 'bg-purple-500' },
  investment_seminar: { icon: '💰', label: 'Investment Seminar', color: 'bg-green-100 text-green-700', badge: 'bg-green-500' },
  developer_presentation: { icon: '🤝', label: 'Developer Presentation', color: 'bg-teal-100 text-teal-700', badge: 'bg-teal-500' },
  educational_webinar: { icon: '🎓', label: 'Educational Webinar', color: 'bg-indigo-100 text-indigo-700', badge: 'bg-indigo-500' },
  panel_discussion: { icon: '🎙️', label: 'Panel Discussion', color: 'bg-pink-100 text-pink-700', badge: 'bg-pink-500' },
  q_and_a_session: { icon: '❓', label: 'Q&A Session', color: 'bg-yellow-100 text-yellow-700', badge: 'bg-yellow-500' },
};

export const LANGUAGE_FLAGS = {
  arabic: '🇸🇦',
  english: '🇬🇧',
  bilingual: '🇸🇦🇬🇧',
  multilingual: '🌍',
};

export const STREAM_STATUS = {
  scheduled: { label: 'Scheduled', color: 'bg-gray-100 text-gray-600' },
  rehearsal: { label: 'Rehearsal', color: 'bg-yellow-100 text-yellow-700' },
  live: { label: 'LIVE', color: 'bg-red-500 text-white' },
  paused: { label: 'Paused', color: 'bg-orange-100 text-orange-700' },
  ended: { label: 'Ended', color: 'bg-gray-100 text-gray-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600' },
  replay_available: { label: 'Replay', color: 'bg-blue-100 text-blue-700' },
};

export function formatCountdown(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, total: 0 };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, total: diff };
}

export function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function fmtViewers(n) {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function getEventGradient(type) {
  const gradients = {
    property_launch: 'from-orange-500 to-red-600',
    open_house: 'from-blue-500 to-cyan-600',
    market_briefing: 'from-purple-600 to-indigo-700',
    investment_seminar: 'from-green-500 to-teal-600',
    developer_presentation: 'from-teal-500 to-cyan-600',
    educational_webinar: 'from-indigo-500 to-purple-600',
    panel_discussion: 'from-pink-500 to-rose-600',
    q_and_a_session: 'from-yellow-500 to-orange-500',
  };
  return gradients[type] || 'from-gray-600 to-gray-800';
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const MOCK_EVENTS = [
  { icon: '🔴', text: 'Auction live — Palm Hills Villa, Sheikh Zayed' },
  { icon: '🔨', text: 'New bid — 3,500,000 EGP, KBA-A1B2C3' },
  { icon: '🏆', text: 'Auction won — 4,200,000 EGP, KBA-X9Y8Z7' },
  { icon: '✅', text: 'Payment confirmed — transfer started, KBA-D4E5F6' },
  { icon: '⚡', text: 'Auction extended — KBA-G7H8I9' },
];

export default function AdminAuctionWidget() {
  const [stats, setStats] = useState({ live: 0, bids: 0, gmv: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.PropertyAuction.filter({ status: 'live' }).catch(() => []),
      base44.entities.AuctionBid.list('-bidPlacedAt', 200).catch(() => []),
    ]).then(([liveAuctions, bids]) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayBids = bids.filter(b => new Date(b.bidPlacedAt) >= today);
      const gmv = todayBids.reduce((s, b) => s + (b.bidAmountEGP || 0), 0);
      setStats({ live: liveAuctions.length, bids: todayBids.length, gmv });
      setLoading(false);
    });
  }, []);

  const fmt = (n) => new Intl.NumberFormat('en-EG').format(Math.round(n));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center text-base">🔨</div>
          <h2 className="text-base font-black text-gray-900">KemedarBid™ Today</h2>
        </div>
        <Link to="/admin/kemedar/auctions" className="text-xs text-orange-500 font-bold hover:underline">
          View Full Dashboard →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-red-600">{loading ? '—' : stats.live}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Live Now</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-orange-600">{loading ? '—' : stats.bids}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Bids Today</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-green-600">{loading ? '—' : fmt(stats.gmv)}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">GMV EGP</p>
        </div>
      </div>

      {/* Recent Events */}
      <div className="space-y-2 mb-5">
        {MOCK_EVENTS.map((ev, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-sm flex-shrink-0">{ev.icon}</span>
            <span className="text-xs text-gray-700">{ev.text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        to="/admin/kemedar/auctions"
        className="block w-full text-center border-2 border-red-500 text-red-600 font-black py-2.5 rounded-xl text-sm hover:bg-red-50 transition-all"
      >
        🔨 Go to KemedarBid™ Dashboard →
      </Link>
    </div>
  );
}
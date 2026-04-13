import { useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";

const fmt = n => `${(n / 1_000_000).toFixed(2)}M`;
const fmtSmall = n => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : `${(n/1000).toFixed(0)}K`;

export default function AuctionAnalyticsCharts({ auction, bids }) {
  const bidTimeline = useMemo(() => {
    if (!bids?.length) return [];
    return bids
      .slice()
      .sort((a, b) => new Date(a.bidPlacedAt) - new Date(b.bidPlacedAt))
      .map((b, i) => ({
        seq: i + 1,
        amount: b.bidAmountEGP,
        time: new Date(b.bidPlacedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
  }, [bids]);

  const bidsByHour = useMemo(() => {
    if (!bids?.length) return [];
    const hourMap = {};
    bids.forEach(b => {
      const h = new Date(b.bidPlacedAt).getHours();
      hourMap[h] = (hourMap[h] || 0) + 1;
    });
    return Array.from({ length: 24 }, (_, h) => ({
      hour: `${String(h).padStart(2, "0")}:00`,
      bids: hourMap[h] || 0,
    })).filter(h => h.bids > 0);
  }, [bids]);

  if (!bids?.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bids Over Time */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-black text-base text-gray-900 mb-2">📈 Bids Over Time</h3>
        <p className="text-xs text-gray-400 mb-4">Price climb visualization</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={bidTimeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tickFormatter={fmtSmall} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(v) => [`${Number(v).toLocaleString()} EGP`, "Bid Amount"]}
              labelFormatter={(l) => `Time: ${l}`}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#ef4444" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bidder Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-black text-base text-gray-900 mb-2">🔥 Bidder Activity</h3>
        <p className="text-xs text-gray-400 mb-4">Bids per hour during auction</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={bidsByHour}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip formatter={(v) => [v, "Bids"]} />
            <Bar dataKey="bids" radius={[4, 4, 0, 0]}>
              {bidsByHour.map((_, i) => (
                <Cell key={i} fill={_.bids === Math.max(...bidsByHour.map(h => h.bids)) ? "#ef4444" : "#fca5a5"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
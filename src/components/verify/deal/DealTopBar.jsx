const STATUS_STYLES = {
  draft:          "bg-gray-100 text-gray-600",
  offer_sent:     "bg-blue-100 text-blue-700",
  counter_offered:"bg-blue-100 text-blue-700",
  negotiating:    "bg-blue-100 text-blue-700",
  accepted:       "bg-teal-100 text-teal-700",
  deal_closed:    "bg-green-100 text-green-800",
  rejected:       "bg-gray-100 text-gray-500",
  withdrawn:      "bg-gray-100 text-gray-500",
  expired:        "bg-gray-100 text-gray-500",
};

const STATUS_LABELS = {
  draft: "Draft",
  offer_sent: "Proposed",
  counter_offered: "Counter Offered",
  negotiating: "Negotiating",
  accepted: "Accepted",
  deal_closed: "Completed",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  expired: "Expired",
};

export default function DealTopBar({ dealId, deal }) {
  const statusClass = STATUS_STYLES[deal?.status] || "bg-gray-100 text-gray-600";
  const statusLabel = STATUS_LABELS[deal?.status] || deal?.status;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-gray-400 mb-0.5">Smart Contract Deal</p>
        <p className="font-mono font-black text-gray-900 text-base">{dealId}</p>
      </div>
      <span className={`text-xs font-black px-3 py-1.5 rounded-full ${statusClass}`}>
        {statusLabel}
      </span>
    </div>
  );
}
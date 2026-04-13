const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function BuildShareModal({ project, boq, totals, onClose }) {
  const shareUrl = `${window.location.origin}/kemetro/build/${project.id}/boq`;
  const grandTotal = totals?.standard?.grandTotal || project.grandTotal || 0;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="font-black text-gray-900 text-lg mb-4">📤 Share Your BOQ</h3>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="font-bold text-gray-800 text-sm mb-1">{project.projectName}</p>
            <p className="text-gray-500 text-xs">{project.totalAreaSqm}m² · {project.finishingLevel} finish · {fmt(grandTotal)} EGP</p>
          </div>
          <div className="flex gap-2 mb-4">
            <input readOnly value={shareUrl} className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-600 bg-gray-50" />
            <button onClick={handleCopy} className="bg-teal-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-teal-400">Copy</button>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "WhatsApp", emoji: "💬", action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my BOQ: ${shareUrl}`)}`) },
              { label: "Email", emoji: "📧", action: () => window.open(`mailto:?subject=My BOQ&body=${shareUrl}`) },
              { label: "Download PDF", emoji: "⬇️", action: () => alert("PDF export coming soon") },
            ].map(btn => (
              <button key={btn.label} onClick={btn.action} className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-600">
                <span className="text-xl">{btn.emoji}</span>
                {btn.label}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="w-full border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}
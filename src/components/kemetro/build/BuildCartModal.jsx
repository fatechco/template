const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function BuildCartModal({ project, items, scenario, totals, onClose }) {
  const grandTotal = totals?.[scenario]?.grandTotal || project.grandTotal || 0;
  const matchedItems = items.filter(i => i.searchKeyword);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-lg">🛒 Add to Kemetro Cart</h3>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} items · {fmt(grandTotal)} EGP total</p>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-700">
            <p className="font-bold mb-1">📦 How it works</p>
            <p>We'll search Kemetro for each material. You'll be taken to search results where you can add items to your cart and checkout.</p>
          </div>
          {matchedItems.slice(0, 8).map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{item.itemName}</p>
                <p className="text-xs text-gray-400">{item.orderQuantity || item.netQuantity} {item.unit}</p>
              </div>
              <a href={`/kemetro/search?q=${encodeURIComponent(item.searchKeyword)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 font-bold hover:underline ml-3 flex-shrink-0">
                Search →
              </a>
            </div>
          ))}
          {matchedItems.length > 8 && <p className="text-xs text-center text-gray-400">+{matchedItems.length - 8} more items</p>}
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm">Cancel</button>
          <a href="/kemetro/search" className="flex-1 bg-teal-500 hover:bg-teal-400 text-white font-black py-2.5 rounded-xl text-sm text-center">Browse Kemetro →</a>
        </div>
      </div>
    </div>
  );
}
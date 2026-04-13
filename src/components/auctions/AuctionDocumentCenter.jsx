import { Download, FileText, Lock } from "lucide-react";

const DOCS = [
  {
    id: "certificate",
    icon: "📄",
    title: "Auction Certificate",
    desc: "Official KemedarBid™ auction result certificate. Includes auction code, property details, winning bid, bidder/seller names, full bid summary and timestamp.",
    availableWhen: (auction) => ["ended", "awaiting_payment", "payment_received", "legal_transfer", "completed", "reserve_not_met"].includes(auction.status),
    buttonLabel: "Download Certificate",
  },
  {
    id: "escrow",
    icon: "📄",
    title: "Escrow Receipt",
    desc: "XeedWallet escrow reference and amounts held for this auction.",
    availableWhen: (auction) => ["payment_received", "legal_transfer", "completed"].includes(auction.status) && !!auction.xeedWalletEscrowReference,
    buttonLabel: "Download Receipt",
  },
  {
    id: "contract",
    icon: "📄",
    title: "Transfer Contract",
    desc: "Legal dual transfer document — sign here once drafted by the assigned Kemework lawyer.",
    availableWhen: (auction) => ["legal_transfer", "completed"].includes(auction.status),
    buttonLabel: "View & Sign Contract",
    isActionable: true,
  },
  {
    id: "settlement",
    icon: "📄",
    title: "Final Settlement Statement",
    desc: "Complete financial breakdown including winning bid, commission, escrow fees, and final net proceeds.",
    availableWhen: (auction) => auction.status === "completed",
    buttonLabel: "Download Statement",
  },
];

export default function AuctionDocumentCenter({ auction, user }) {
  const handleDownload = (docId) => {
    // In production this would call a backend function to generate PDFs
    alert(`Generating ${docId} document for auction ${auction.auctionCode}... (PDF generation backend needed)`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-black text-lg text-gray-900 mb-5 flex items-center gap-2">
        <FileText size={20} />
        📁 Auction Documents
      </h3>

      <div className="space-y-4">
        {DOCS.map((doc) => {
          const isAvailable = doc.availableWhen(auction);
          return (
            <div
              key={doc.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                isAvailable
                  ? "border-gray-200 bg-gray-50 hover:border-gray-300"
                  : "border-dashed border-gray-200 bg-gray-50/50 opacity-60"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                isAvailable ? "bg-white shadow-sm" : "bg-gray-100"
              }`}>
                {doc.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm ${isAvailable ? "text-gray-900" : "text-gray-400"}`}>
                  {doc.title}
                </h4>
                <p className={`text-xs leading-relaxed mt-0.5 ${isAvailable ? "text-gray-500" : "text-gray-400"}`}>
                  {doc.desc}
                </p>
              </div>

              <div className="flex-shrink-0">
                {isAvailable ? (
                  <button
                    onClick={() => handleDownload(doc.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      doc.isActionable
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-900 text-white hover:bg-gray-700"
                    }`}
                  >
                    <Download size={13} />
                    {doc.buttonLabel}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gray-100 text-gray-400">
                    <Lock size={12} />
                    Not available yet
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-5 text-center">
        All documents are legally binding and securely stored by Kemedar. Contact support for any disputes.
      </p>
    </div>
  );
}
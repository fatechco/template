import { useState } from "react";
import { Plus, Trash2, Star, Shield } from "lucide-react";

const INIT_CARDS = [
  { id: 1, last4: "1234", expiry: "08/27", name: "Ahmed Mohamed", network: "Visa", gradient: "from-blue-700 to-blue-900", default: true },
  { id: 2, last4: "5678", expiry: "12/25", name: "Ahmed Mohamed", network: "Mastercard", gradient: "from-gray-700 to-gray-900", default: false },
];
const INIT_BANKS = [
  { id: 1, bank: "National Bank of Egypt", account: "••••9012", name: "Ahmed Mohamed", default: true },
];

export default function PaymentMethodsDesktop() {
  const [cards, setCards] = useState(INIT_CARDS);
  const [banks, setBanks] = useState(INIT_BANKS);
  const [showAddCard, setShowAddCard] = useState(false);
  const walletBalance = 124.50;

  const setDefaultCard = (id) => setCards(prev => prev.map(c => ({ ...c, default: c.id === id })));
  const removeCard = (id) => setCards(prev => prev.filter(c => c.id !== id));
  const setDefaultBank = (id) => setBanks(prev => prev.map(b => ({ ...b, default: b.id === id })));
  const removeBank = (id) => setBanks(prev => prev.filter(b => b.id !== id));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">💳 Payment Methods</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your saved cards, bank accounts and digital wallets</p>
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-5 py-3">
        <Shield size={18} className="text-green-600 flex-shrink-0" />
        <p className="text-sm text-green-700 font-semibold">Your payment information is encrypted and stored securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Cards */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">Saved Cards</h2>
            <button onClick={() => setShowAddCard(true)}
              className="flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700">
              <Plus size={15} /> Add Card
            </button>
          </div>
          <div className="space-y-4">
            {cards.map(card => (
              <div key={card.id} className={`w-full h-36 rounded-2xl bg-gradient-to-br ${card.gradient} p-4 relative shadow-md`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-7 h-5 bg-yellow-400 rounded opacity-90" />
                  <span className="text-white font-black text-xs opacity-90">{card.network}</span>
                </div>
                <p className="text-white font-mono text-sm tracking-widest mb-3">•••• •••• •••• {card.last4}</p>
                <div className="flex justify-between items-end">
                  <p className="text-white font-bold text-xs">{card.name}</p>
                  <p className="text-white font-bold text-xs">{card.expiry}</p>
                </div>
                {card.default && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">✅ Default</span>
                )}
                <div className="absolute bottom-3 left-4 flex gap-3">
                  <button onClick={() => removeCard(card.id)} className="text-white/70 hover:text-white text-xs flex items-center gap-1 font-bold">
                    <Trash2 size={11} /> Remove
                  </button>
                  {!card.default && (
                    <button onClick={() => setDefaultCard(card.id)} className="text-white/70 hover:text-white text-xs flex items-center gap-1 font-bold">
                      <Star size={11} /> Set Default
                    </button>
                  )}
                </div>
              </div>
            ))}
            {cards.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No cards saved</p>}
          </div>
        </div>

        <div className="space-y-6">
          {/* Bank Accounts */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900">Bank Accounts</h2>
              <button className="flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700">
                <Plus size={15} /> Add Bank
              </button>
            </div>
            {banks.map(bank => (
              <div key={bank.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
                <span className="text-2xl">🏦</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900">{bank.bank}</p>
                  <p className="text-xs text-gray-400">{bank.account} · {bank.name}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {bank.default && <span className="text-[10px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Default</span>}
                  <button onClick={() => removeBank(bank.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                  {!bank.default && <button onClick={() => setDefaultBank(bank.id)} className="text-gray-400 hover:text-orange-500"><Star size={13} /></button>}
                </div>
              </div>
            ))}
            {banks.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No bank accounts saved</p>}
          </div>

          {/* Digital Wallet */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-4">Digital Wallets</h2>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-2xl">👛</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-900">XeedWallet</p>
                <p className="text-sm font-black text-green-600">Balance: ${walletBalance.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Connected ✅</p>
              </div>
              <button className="text-xs font-bold text-orange-600 border border-orange-200 px-3 py-2 rounded-lg">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
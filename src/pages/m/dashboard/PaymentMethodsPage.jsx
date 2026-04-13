import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Star } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const INIT_CARDS = [
  { id: 1, last4: "1234", expiry: "08/27", name: "Ahmed Mohamed", network: "Visa", gradient: "from-blue-700 to-blue-900", default: true },
  { id: 2, last4: "5678", expiry: "12/25", name: "Ahmed Mohamed", network: "Mastercard", gradient: "from-gray-700 to-gray-900", default: false },
];
const INIT_BANKS = [
  { id: 1, bank: "National Bank of Egypt", account: "••••9012", name: "Ahmed Mohamed", default: true },
];

function MiniCard({ card, onRemove, onDefault }) {
  return (
    <div className="mb-4">
      <div className={`w-full h-44 rounded-2xl bg-gradient-to-br ${card.gradient} p-5 relative shadow-md`}>
        <div className="flex justify-between items-start mb-8">
          <div className="w-8 h-6 bg-yellow-400 rounded opacity-90" />
          <span className="text-white font-black text-sm opacity-90">{card.network}</span>
        </div>
        <p className="text-white font-mono text-base tracking-widest mb-4">•••• •••• •••• {card.last4}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white/60 text-[10px] uppercase">Cardholder</p>
            <p className="text-white font-bold text-sm">{card.name}</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-[10px] uppercase">Expires</p>
            <p className="text-white font-bold text-sm">{card.expiry}</p>
          </div>
        </div>
        {card.default && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">✅ Default</span>
        )}
      </div>
      <div className="flex justify-between items-center mt-2 px-1">
        <button onClick={onRemove} className="flex items-center gap-1 text-xs text-gray-500 font-bold">
          <Trash2 size={13} /> Remove
        </button>
        {!card.default && (
          <button onClick={onDefault} className="flex items-center gap-1 text-xs text-orange-600 font-bold">
            <Star size={13} /> Set as Default
          </button>
        )}
      </div>
    </div>
  );
}

function AddMethodSheet({ onClose, onAdd }) {
  const [view, setView] = useState("menu"); // menu | card | bank | wallet | cod
  const [form, setForm] = useState({ number: "", expiry: "", cvv: "", name: "", isDefault: false });

  const METHODS = [
    { key: "card", icon: "💳", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex" },
    { key: "bank", icon: "🏦", label: "Bank Account", desc: "Direct bank transfer" },
    { key: "wallet", icon: "👛", label: "XeedWallet", desc: "Connect digital wallet" },
    { key: "cod", icon: "💵", label: "Cash on Delivery", desc: "Pay when you receive" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[480px] mx-auto p-5" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        {view === "menu" && (
          <>
            <p className="font-black text-gray-900 text-base mb-4">Add Payment Method</p>
            <div className="space-y-3">
              {METHODS.map(m => (
                <button key={m.key} onClick={() => setView(m.key)}
                  className="w-full flex items-center gap-4 bg-gray-50 rounded-2xl p-4 text-left hover:bg-orange-50 transition-colors">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{m.label}</p>
                    <p className="text-xs text-gray-400">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {view === "card" && (
          <>
            <button onClick={() => setView("menu")} className="text-xs text-gray-500 font-bold mb-3">← Back</button>
            <p className="font-black text-gray-900 text-base mb-4">Add Card</p>
            <div className="space-y-3">
              <input placeholder="Card Number" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
              <div className="flex gap-3">
                <input placeholder="MM/YY" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
                <input placeholder="CVV" value={form.cvv} onChange={e => setForm(f => ({ ...f, cvv: e.target.value }))}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <input placeholder="Cardholder Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="w-4 h-4 accent-orange-600" />
                <span className="text-sm text-gray-700">Set as default card</span>
              </label>
              <button onClick={() => { onAdd("card", form); onClose(); }}
                className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-sm">
                Add Card
              </button>
            </div>
          </>
        )}

        {view === "bank" && (
          <>
            <button onClick={() => setView("menu")} className="text-xs text-gray-500 font-bold mb-3">← Back</button>
            <p className="font-black text-gray-900 text-base mb-4">Add Bank Account</p>
            <div className="space-y-3">
              {["Bank Name", "Account Number", "IBAN", "Account Holder Name"].map(p => (
                <input key={p} placeholder={p} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
              ))}
              <button onClick={onClose} className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-sm">Add Bank Account</button>
            </div>
          </>
        )}

        {view === "wallet" && (
          <>
            <button onClick={() => setView("menu")} className="text-xs text-gray-500 font-bold mb-3">← Back</button>
            <div className="text-center py-8">
              <p className="text-5xl mb-3">👛</p>
              <p className="font-black text-gray-900 text-lg mb-2">Connect XeedWallet</p>
              <p className="text-sm text-gray-500 mb-6">Link your XeedWallet account to pay instantly</p>
              <button onClick={onClose} className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-sm">Connect XeedWallet</button>
            </div>
          </>
        )}

        {view === "cod" && (
          <>
            <button onClick={() => setView("menu")} className="text-xs text-gray-500 font-bold mb-3">← Back</button>
            <div className="text-center py-8">
              <p className="text-5xl mb-3">💵</p>
              <p className="font-black text-gray-900 text-lg mb-2">Cash on Delivery</p>
              <p className="text-sm text-gray-500 mb-6">Pay in cash when your order is delivered. Available in select areas.</p>
              <button onClick={onClose} className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-sm">Enable Cash on Delivery</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState(INIT_CARDS);
  const [banks, setBanks] = useState(INIT_BANKS);
  const [showAdd, setShowAdd] = useState(false);
  const walletBalance = 124.50;

  const setDefaultCard = (id) => setCards(prev => prev.map(c => ({ ...c, default: c.id === id })));
  const removeCard = (id) => setCards(prev => prev.filter(c => c.id !== id));
  const setDefaultBank = (id) => setBanks(prev => prev.map(b => ({ ...b, default: b.id === id })));
  const removeBank = (id) => setBanks(prev => prev.filter(b => b.id !== id));

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="Payment Methods" showBack
        rightAction={
          <button onClick={() => setShowAdd(true)} className="p-1"><Plus size={22} className="text-orange-600" /></button>
        } />

      {/* Security strip */}
      <div className="mx-4 mt-3 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
        <span className="text-lg">🔒</span>
        <p className="text-xs text-green-700 font-semibold">Your payment info is encrypted and secure</p>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Saved Cards */}
        <div>
          <p className="text-base font-black text-gray-900 mb-3">Saved Cards</p>
          {cards.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No cards saved</p>
          ) : cards.map(card => (
            <MiniCard key={card.id} card={card}
              onRemove={() => removeCard(card.id)}
              onDefault={() => setDefaultCard(card.id)} />
          ))}
        </div>

        {/* Bank Accounts */}
        <div>
          <p className="text-base font-black text-gray-900 mb-3">Bank Accounts</p>
          {banks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No bank accounts saved</p>
          ) : banks.map(bank => (
            <div key={bank.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏦</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">{bank.bank}</p>
                  <p className="text-xs text-gray-400">{bank.account} · {bank.name}</p>
                </div>
                {bank.default && <span className="text-[10px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Default</span>}
              </div>
              <div className="flex justify-between">
                <button onClick={() => removeBank(bank.id)} className="text-xs text-gray-500 font-bold flex items-center gap-1"><Trash2 size={12} /> Remove</button>
                {!bank.default && <button onClick={() => setDefaultBank(bank.id)} className="text-xs text-orange-600 font-bold flex items-center gap-1"><Star size={12} /> Set Default</button>}
              </div>
            </div>
          ))}
        </div>

        {/* Digital Wallets */}
        <div>
          <p className="text-base font-black text-gray-900 mb-3">Digital Wallets</p>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <span className="text-2xl">👛</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">XeedWallet</p>
              <p className="text-sm font-black text-green-600">Balance: ${walletBalance.toFixed(2)}</p>
              <p className="text-xs text-gray-400">Connected ✅</p>
            </div>
            <button className="text-xs font-bold text-orange-600 border border-orange-200 px-3 py-2 rounded-xl">View Wallet</button>
          </div>
        </div>

        {/* Add button */}
        <button onClick={() => setShowAdd(true)}
          className="w-full border-2 border-orange-600 text-orange-600 font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2">
          <Plus size={16} /> Add Payment Method
        </button>
      </div>

      {showAdd && <AddMethodSheet onClose={() => setShowAdd(false)} onAdd={() => setShowAdd(false)} />}
    </div>
  );
}
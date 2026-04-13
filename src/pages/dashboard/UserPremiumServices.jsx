import { useState, useEffect } from "react";
import { CheckCircle, X, Loader, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MODULE_META = {
  kemedar:  { icon: "🏠", label: "Kemedar",  accent: "#f97316", slug: "kemedar" },
  kemework: { icon: "🔧", label: "Kemework", accent: "#14b8a6", slug: "kemework" },
  kemetro:  { icon: "🛒", label: "Kemetro",  accent: "#3b82f6", slug: "kemetro" },
};

// ── BUY FLOW MODAL ────────────────────────────────────────────────────────────
function BuyModal({ service, module, me, onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState(null);
  const [customPrice, setCustomPrice] = useState(service.basePrice || 0);
  const [qty, setQty] = useState(1);
  const [relatedEntity, setRelatedEntity] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const isQuote = service.serviceType === "custom_quote";
  const tiers = service.pricingTiers || [];
  const hasTiers = tiers.length > 0;

  const unitPrice = hasTiers
    ? (selectedTier?.price || 0)
    : (service.basePrice || customPrice);
  const total = unitPrice * qty;

  const generateCode = () => "SVO-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const generateInvNum = () => `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;

  const handleSubmit = async () => {
    setLoading(true);
    const order = await base44.entities.ServiceOrder.create({
      orderCode: generateCode(),
      buyerId: me?.id,
      serviceId: service.id,
      moduleId: module.id,
      pricingTierLabel: selectedTier?.label || "",
      quantity: qty,
      unitPrice,
      totalPrice: total,
      currency: "USD",
      status: "pending",
      buyerNotes: notes,
      relatedEntityType: relatedEntity ? "entity" : "",
      relatedEntityId: relatedEntity,
    });
    await base44.entities.Invoice.create({
      invoiceNumber: generateInvNum(),
      userId: me?.id,
      invoiceType: "service_order",
      serviceOrderId: order.id,
      subtotal: total,
      totalAmount: total,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      status: "sent",
    });
    await base44.entities.ServiceOrderActivity.create({
      serviceOrderId: order.id,
      actorId: me?.id,
      actorRole: "buyer",
      action: "created",
      description: `Order placed for ${service.name}`,
    });
    setLoading(false);
    onCreated();
  };

  const meta = MODULE_META[module?.slug] || MODULE_META.kemedar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-900">{isQuote ? "Request Quote" : "Buy Service"}</h2>
            <p className="text-xs text-gray-500">{service.name}</p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        {/* Step indicator */}
        {!isQuote && (
          <div className="px-5 pt-4 flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? "opacity-100" : "opacity-20"}`}
                style={{ backgroundColor: meta.accent }} />
            ))}
          </div>
        )}

        <div className="p-5 space-y-4">
          {isQuote ? (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Describe what you need</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Describe your requirements in detail…"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Related Entity (optional)</label>
                <input value={relatedEntity} onChange={e => setRelatedEntity(e.target.value)} placeholder="e.g. Property ID or name"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-400" />
              </div>
              <button onClick={handleSubmit} disabled={loading || !notes.trim()}
                className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ backgroundColor: meta.accent }}>
                {loading ? <Loader size={14} className="animate-spin" /> : "📤"} Submit Request
              </button>
            </>
          ) : (
            <>
              {/* Step 1: Select tier */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-sm font-black text-gray-700">Select Pricing Option</p>
                  {hasTiers ? tiers.map((tier, i) => (
                    <div key={i} onClick={() => setSelectedTier(tier)}
                      className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${selectedTier?.label === tier.label ? "border-orange-500 bg-orange-50" : "border-gray-100 hover:border-orange-200"}`}>
                      <div className="flex justify-between">
                        <p className="font-bold text-gray-900 text-sm">{tier.label}</p>
                        <p className="font-black text-orange-600">${tier.price}</p>
                      </div>
                      {tier.description && <p className="text-xs text-gray-500 mt-0.5">{tier.description}</p>}
                    </div>
                  )) : (
                    <div className="border-2 border-orange-500 bg-orange-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900">{service.name}</p>
                        <p className="font-black text-orange-600">${service.basePrice} <span className="text-xs text-gray-400">{service.priceUnit}</span></p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-600">Quantity</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-7 h-7 bg-gray-100 rounded-lg font-black text-gray-700 hover:bg-gray-200">−</button>
                      <span className="w-8 text-center font-black text-gray-900">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} className="w-7 h-7 bg-gray-100 rounded-lg font-black text-gray-700 hover:bg-gray-200">+</button>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} disabled={hasTiers && !selectedTier}
                    className="w-full py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40"
                    style={{ backgroundColor: meta.accent }}>Next →</button>
                </div>
              )}

              {/* Step 2: Related entity */}
              {step === 2 && (
                <div className="space-y-3">
                  <p className="text-sm font-black text-gray-700">Related Entity (optional)</p>
                  <input value={relatedEntity} onChange={e => setRelatedEntity(e.target.value)}
                    placeholder="e.g. Property ID, product name…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                  <p className="text-[10px] text-gray-400">Link this service to a specific property, project or product.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 font-bold py-2.5 rounded-xl text-sm text-gray-700">← Back</button>
                    <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white" style={{ backgroundColor: meta.accent }}>Next →</button>
                  </div>
                </div>
              )}

              {/* Step 3: Notes */}
              {step === 3 && (
                <div className="space-y-3">
                  <p className="text-sm font-black text-gray-700">Notes for the Service Team</p>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                    placeholder="Any special requirements or instructions…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 font-bold py-2.5 rounded-xl text-sm text-gray-700">← Back</button>
                    <button onClick={() => setStep(4)} className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white" style={{ backgroundColor: meta.accent }}>Next →</button>
                  </div>
                </div>
              )}

              {/* Step 4: Summary + Confirm */}
              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-sm font-black text-gray-700">Payment Summary</p>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Service</span><span className="font-bold">{service.name}</span></div>
                    {selectedTier && <div className="flex justify-between"><span className="text-gray-600">Tier</span><span className="font-bold">{selectedTier.label}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-600">Qty</span><span className="font-bold">{qty}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Unit Price</span><span className="font-bold">${unitPrice}</span></div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="font-black text-gray-900">Total</span>
                      <span className="font-black text-orange-600 text-lg">${total}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setStep(3)} className="flex-1 border border-gray-200 font-bold py-2.5 rounded-xl text-sm text-gray-700">← Back</button>
                    <button onClick={handleSubmit} disabled={loading}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40 flex items-center justify-center gap-2"
                      style={{ backgroundColor: meta.accent }}>
                      {loading ? <Loader size={14} className="animate-spin" /> : "✅"} Confirm & Pay
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SUCCESS SCREEN ────────────────────────────────────────────────────────────
function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-gray-500 text-sm mb-6">Your order has been submitted. Our team will review and assign a franchise owner to handle your request.</p>
        <div className="flex gap-2">
          <a href="/dashboard/kemedar-orders" className="flex-1 border border-gray-200 font-bold py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 text-center">My Orders</a>
          <button onClick={onClose} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm">Continue</button>
        </div>
      </div>
    </div>
  );
}

// ── SERVICE CARD ─────────────────────────────────────────────────────────────
function ServiceCard({ svc, module, onBuy }) {
  const meta = MODULE_META[module?.slug] || MODULE_META.kemedar;
  const isQuote = svc.serviceType === "custom_quote";
  const price = isQuote ? "Custom Quote" : svc.basePrice != null ? `$${svc.basePrice} ${svc.priceUnit || ""}` : svc.pricingTiers?.length ? "Tiered Pricing" : "—";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-all">
      <div className="text-3xl mb-3">{svc.icon || "🛍"}</div>
      <p className="font-black text-gray-900 mb-1">{svc.name}</p>
      <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{svc.shortDescription}</p>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <span className="font-black text-sm" style={{ color: meta.accent }}>{price}</span>
        <button onClick={() => onBuy(svc)} className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90" style={{ backgroundColor: meta.accent }}>
          {isQuote ? "Request Quote" : "Buy Now"}
        </button>
      </div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function UserPremiumServices() {
  const [activeModuleTab, setActiveModuleTab] = useState("kemedar");
  const [services, setServices] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyModal, setBuyModal] = useState(null); // { svc, module }
  const [success, setSuccess] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setMe).catch(() => {});
    Promise.all([
      base44.entities.PaidService.filter({ isActive: true }),
      base44.entities.SystemModule.list(),
    ]).then(([svcs, mods]) => {
      setServices(svcs);
      setModules(mods);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const moduleBySlug = Object.fromEntries(modules.map(m => [m.slug, m]));
  const moduleTabs = Object.entries(MODULE_META).map(([slug, meta]) => ({ slug, ...meta }));

  const activeModule = moduleBySlug[activeModuleTab];
  const filteredServices = services.filter(s => {
    const mod = modules.find(m => m.id === s.moduleId);
    return mod?.slug === activeModuleTab;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Premium Services</h1>
        <p className="text-gray-500 text-sm">Browse and buy paid services across all Kemedar platforms</p>
      </div>

      {/* Module Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {moduleTabs.map(tab => (
          <button key={tab.slug} onClick={() => setActiveModuleTab(tab.slug)}
            className={`flex items-center gap-1.5 px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeModuleTab === tab.slug ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-6 h-6 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
          <p className="text-3xl mb-3">🛍</p>
          <p className="font-semibold">No services available for this module yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map(svc => (
            <ServiceCard
              key={svc.id}
              svc={svc}
              module={activeModule}
              onBuy={(s) => setBuyModal({ svc: s, module: activeModule })}
            />
          ))}
        </div>
      )}

      {buyModal && (
        <BuyModal
          service={buyModal.svc}
          module={buyModal.module}
          me={me}
          onClose={() => setBuyModal(null)}
          onCreated={() => { setBuyModal(null); setSuccess(true); }}
        />
      )}

      {success && <SuccessModal onClose={() => setSuccess(false)} />}
    </div>
  );
}
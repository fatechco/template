import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, Loader } from "lucide-react";

const generateCode = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function SOStepReview({ buyer, service, details, assignment, totalPrice, onCreated, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const commissionAmount = (!assignment.skipAssignment && assignment.franchiseOwnerId)
    ? (totalPrice * ((assignment.commissionPercent || 0) / 100))
    : 0;

  const today = new Date().toISOString().slice(0, 10);

  const rows = [
    { label: "Buyer", value: `${buyer.full_name} (${buyer.email})` },
    { label: "Service", value: service.name },
    { label: "Service Type", value: service.serviceType?.replace("_", " ") },
    ...(details.pricingTierLabel ? [{ label: "Tier", value: details.pricingTierLabel }] : []),
    { label: "Unit Price", value: `$${(details.unitPrice || 0).toFixed(2)}` },
    { label: "Quantity", value: details.quantity },
    { label: "Total Price", value: <span className="font-black text-orange-600">${totalPrice.toFixed(2)} USD</span> },
    ...(details.relatedEntityType ? [{ label: "Related Entity", value: `${details.relatedEntityType}: ${details.relatedEntityId || "—"}` }] : []),
    ...(details.buyerNotes ? [{ label: "Buyer Notes", value: details.buyerNotes }] : []),
    assignment.skipAssignment
      ? { label: "Assignment", value: <span className="text-gray-400 italic">Unassigned — to be assigned later</span> }
      : assignment.franchiseOwnerId
        ? { label: "Franchise Owner", value: assignment.franchiseOwnerId }
        : { label: "Assignment", value: <span className="text-gray-400 italic">No assignment</span> },
    ...(commissionAmount > 0 ? [
      { label: "Commission %", value: `${assignment.commissionPercent}%` },
      { label: "Commission Amount", value: <span className="font-bold text-purple-600">${commissionAmount.toFixed(2)}</span> },
    ] : []),
  ];

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    const orderCode = generateCode("SVO");
    const invoiceNum = generateCode("INV");

    // 1. Create Service Order
    const order = await base44.entities.ServiceOrder.create({
      orderCode,
      buyerId: buyer.id,
      serviceId: service.id,
      moduleId: service.moduleId,
      pricingTierLabel: details.pricingTierLabel || null,
      quantity: details.quantity,
      unitPrice: details.unitPrice,
      totalPrice,
      currency: "USD",
      status: assignment.skipAssignment || !assignment.franchiseOwnerId ? "pending" : "assigned",
      franchiseOwnerId: (!assignment.skipAssignment && assignment.franchiseOwnerId) ? assignment.franchiseOwnerId : null,
      assignedDate: (!assignment.skipAssignment && assignment.franchiseOwnerId) ? today : null,
      relatedEntityType: details.relatedEntityType || null,
      relatedEntityId: details.relatedEntityId || null,
      buyerNotes: details.buyerNotes || null,
    });

    // 2. Create Invoice
    await base44.entities.Invoice.create({
      invoiceNumber: invoiceNum,
      userId: buyer.id,
      invoiceType: "service_order",
      serviceOrderId: order.id,
      subtotal: totalPrice,
      tax: 0,
      discount: 0,
      totalAmount: totalPrice,
      currency: "USD",
      status: "sent",
      dueDate: today,
    });

    // 3. Activity log
    await base44.entities.ServiceOrderActivity.create({
      serviceOrderId: order.id,
      actorId: buyer.id,
      actorRole: "admin",
      action: "created",
      description: `Order created by admin. Service: ${service.name}. Total: $${totalPrice.toFixed(2)}.`,
    });

    // 4. Franchise Commission
    if (commissionAmount > 0 && assignment.franchiseOwnerId) {
      await base44.entities.FranchiseCommission.create({
        franchiseOwnerId: assignment.franchiseOwnerId,
        sourceType: "service_order",
        serviceOrderId: order.id,
        grossAmount: totalPrice,
        commissionPercent: assignment.commissionPercent,
        commissionAmount,
        status: "pending",
      });
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => { onCreated(); onClose(); }, 1500);
  };

  if (success) {
    return (
      <div className="py-12 text-center space-y-3">
        <CheckCircle size={48} className="text-green-500 mx-auto" />
        <h3 className="text-xl font-black text-gray-900">Service Order Created!</h3>
        <p className="text-sm text-gray-500">Invoice and activity log created automatically.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-start px-4 py-2.5 text-xs">
            <span className="text-gray-500 font-semibold flex-shrink-0">{label}</span>
            <span className="font-bold text-gray-800 text-right ml-4 max-w-[60%]">{value}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600 font-semibold">{error}</div>
      )}

      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={handleCreate} disabled={loading}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2">
          {loading ? <><Loader size={14} className="animate-spin" /> Creating…</> : "✅ Create Service Order"}
        </button>
      </div>
    </div>
  );
}
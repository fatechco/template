import { useParams } from "react-router-dom";
import { Download, Phone, RotateCcw, Truck, MapPin, CreditCard } from "lucide-react";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const MOCK_ORDER = {
  id: "1",
  orderNumber: "ORD-2025-001",
  date: "2025-03-10",
  status: "Delivered",
  items: [
    { id: "1", name: "Premium Cement 50kg", quantity: 2, price: 7.5, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80" },
    { id: "2", name: "Steel Rods 10mm", quantity: 1, price: 420, image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&q=80" },
  ],
  shippingAddress: { fullName: "Ahmed Hassan", phone: "+20 123456789", address: "123 Nile Street, Cairo, Egypt" },
  tracking: { number: "TRK-2025-001", company: "Kemetro Logistics" },
  payment: { method: "Credit Card", amount: 450.5 },
  timeline: [
    { status: "Confirmed", date: "2025-03-10", time: "10:30 AM" },
    { status: "Processing", date: "2025-03-11", time: "02:45 PM" },
    { status: "Shipped", date: "2025-03-12", time: "09:15 AM" },
    { status: "Delivered", date: "2025-03-13", time: "04:20 PM" },
  ],
};

export default function KemetroOrderDetail() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Order {MOCK_ORDER.orderNumber}</h1>
            <p className="text-gray-600 mt-1">Placed on {new Date(MOCK_ORDER.date).toLocaleDateString()}</p>
          </div>
          <span className="text-sm font-bold px-4 py-2 rounded-full bg-green-100 text-green-700">{MOCK_ORDER.status}</span>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-6">Order Status Timeline</h3>
              <div className="space-y-4">
                {MOCK_ORDER.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mt-1" />
                      {idx < MOCK_ORDER.timeline.length - 1 && <div className="w-0.5 h-12 bg-green-200 my-2" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Items</h3>
              <div className="space-y-4">
                {MOCK_ORDER.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={20} /> Shipping Address</h3>
              <p className="font-semibold text-gray-900">{MOCK_ORDER.shippingAddress.fullName}</p>
              <p className="text-gray-600">{MOCK_ORDER.shippingAddress.phone}</p>
              <p className="text-gray-600">{MOCK_ORDER.shippingAddress.address}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Truck size={20} /> Tracking Info</h3>
              <p className="text-gray-600 text-sm mb-1">Tracking Number</p>
              <p className="font-semibold text-gray-900 font-mono">{MOCK_ORDER.tracking.number}</p>
              <p className="text-gray-600 text-sm mt-3 mb-1">Shipping Company</p>
              <p className="font-semibold text-gray-900">{MOCK_ORDER.tracking.company}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><CreditCard size={20} /> Payment Details</h3>
              <p className="text-gray-600 text-sm mb-1">Payment Method</p>
              <p className="font-semibold text-gray-900">{MOCK_ORDER.payment.method}</p>
              <p className="text-gray-600 text-sm mt-3 mb-1">Amount Paid</p>
              <p className="text-2xl font-black text-[#FF6B00]">${MOCK_ORDER.payment.amount.toFixed(2)}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-semibold">$430.50</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping:</span><span className="font-semibold">$20.00</span></div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total:</span><span className="text-[#FF6B00]">${MOCK_ORDER.payment.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-colors text-sm">
                <Download size={16} />Download Invoice
              </button>
              <button className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition-colors text-sm">
                <Phone size={16} />Contact Seller
              </button>
              {MOCK_ORDER.status === "Delivered" && (
                <button className="w-full flex items-center justify-center gap-2 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-bold py-3 rounded-lg transition-colors text-sm">
                  <RotateCcw size={16} />Request Return
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <KemetroFooter />
    </div>
  );
}
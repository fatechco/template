import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const FEE_ROWS = [
  { type: "Listing Fee", amount: "$0", desc: "Free to list products", when: "Always" },
  { type: "Sale Fee", amount: "1.7%", desc: "On sale price (excl. shipping)", when: "After $12,000 in sales" },
  { type: "Payment Processing", amount: "1%", desc: "Banking transaction fee", when: "Per transaction" },
  { type: "Export Fee", amount: "5.5%", desc: "Cross-border orders", when: "Export orders only" },
  { type: "Total Export", amount: "~7%", desc: "All fees combined", when: "Export + payment" },
];

const FAQS = [
  { q: "When do I start paying the sale fee?", a: "The sale fee of 1.7% only applies once your cumulative sales on Kemetro reach $12,000. Before that threshold, you sell completely free of charge." },
  { q: "Are there any monthly subscription fees?", a: "No. Kemetro does not charge any mandatory monthly fees. Our optional Premium plans offer additional marketing and features, but are not required to sell." },
  { q: "How is the export fee calculated?", a: "The export fee of 5.5% is applied to the sale price of the item (excluding shipping) for cross-border orders. Combined with the 1% payment processing fee, the total is approximately 7%." },
  { q: "What payment methods can I accept?", a: "You can accept XeedWallet, PayPal, bank transfers, Visa, Mastercard, and Cash on Delivery. All payment processing is handled securely by Kemetro." },
  { q: "How do I receive my payouts?", a: "Payouts are processed 3–5 business days after order delivery confirmation and transferred directly to your registered XeedWallet or bank account." },
];

export default function KemetroFees() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0077B6 0%, #005f8e 100%)" }} className="py-16 px-4 text-center">
        <h1 className="text-4xl font-black text-white mb-3">Kemetro Fee Structure</h1>
        <p className="text-blue-100 text-lg">Transparent and simple — no hidden charges, ever.</p>
      </section>

      <div className="max-w-[800px] mx-auto px-4 py-16 space-y-14">

        {/* FREE SETUP */}
        <div className="text-center bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-2xl font-black text-gray-900 leading-snug">Setting up your shop on Kemetro is completely <span className="text-green-600">FREE</span></p>
          <p className="text-gray-500 mt-3">No setup cost, no listing fees, no monthly charges to get started.</p>
        </div>

        {/* FEE TABLE */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Fee Breakdown</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Fee Type", "Amount", "Description", "When Applied"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-bold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEE_ROWS.map((row, i) => (
                  <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                    <td className="px-5 py-4 font-bold text-gray-900">{row.type}</td>
                    <td className="px-5 py-4 font-black text-[#0077B6] text-lg">{row.amount}</td>
                    <td className="px-5 py-4 text-gray-600">{row.desc}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-gray-500 bg-gray-50 rounded">{row.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/kemetro/seller/register" className="inline-block bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-8 py-4 rounded-xl text-lg transition-colors">Open Your Free Store →</Link>
        </div>
      </div>

      <KemetroFooter />
    </div>
  );
}
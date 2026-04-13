import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SiteHeader from '@/components/header/SiteHeader';
import SiteFooter from '@/components/home/SiteFooter';

export default function HowAuctionsWork() {
  const [activeTab, setActiveTab] = useState('sellers');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const sellerSteps = [
    {
      num: 1,
      icon: '📋',
      title: 'List Your Property for Auction',
      body: 'Mark your property "For Auction" when listing. Set your starting price, reserve price (kept hidden), bidding duration, and buyer requirements.'
    },
    {
      num: 2,
      icon: '✅',
      title: 'Admin Reviews Your Auction',
      body: 'Our team reviews your listing within 24–48 hours to ensure it meets platform quality standards.'
    },
    {
      num: 3,
      icon: '🔐',
      title: 'Pay Seller Deposit to Activate',
      body: 'Pay a small refundable deposit (0.5% of starting price) to confirm your commitment. Fully returned on successful sale. Forfeited only if you withdraw.'
    },
    {
      num: 4,
      icon: '🔴',
      title: 'Watch the Live Bidding',
      body: 'Monitor your auction dashboard in real-time. Watch bids climb, track your reserve status, and see the competition heat up.'
    },
    {
      num: 5,
      icon: '🏆',
      title: 'Receive Your Winner',
      body: 'When the auction ends, the winner has 48 hours to complete payment. If they fail, you keep 50% of their deposit.'
    },
    {
      num: 6,
      icon: '💰',
      title: 'Get Paid via Escrow',
      body: 'Once the winner pays, funds go into XeedWallet Escrow. Released to you when the title deed is officially transferred. 100% protected.'
    }
  ];

  const buyerSteps = [
    {
      num: 1,
      icon: '👁️',
      title: 'Browse Auctions',
      body: 'Find live and upcoming property auctions. Filter by city, property type, and budget.'
    },
    {
      num: 2,
      icon: '📋',
      title: 'Register + Pay Deposit',
      body: 'Register to bid by paying a refundable deposit. Complete KYC identity verification first. Your deposit is 100% returned if you don\'t win.'
    },
    {
      num: 3,
      icon: '🔨',
      title: 'Place Your Bids',
      body: 'Bid manually or set an automatic maximum bid. The system outbids competitors on your behalf, up to your limit.'
    },
    {
      num: 4,
      icon: '⏰',
      title: 'Stay Alert to Extensions',
      body: 'A bid placed in the final minutes may extend the auction. Last-minute excitement is part of the process — keep watching!'
    },
    {
      num: 5,
      icon: '🏆',
      title: 'Win — Then Pay Within 48 Hours',
      body: 'If you win, complete full payment within 48 hours. Your deposit counts toward your total. Failure to pay forfeits your deposit.'
    },
    {
      num: 6,
      icon: '⚖️',
      title: 'Legal Transfer — Keys Are Yours',
      body: 'A Kemework lawyer handles the title transfer. Funds sit safely in escrow until the deed is in your name. Then keys are handed over.'
    }
  ];

  const faqs = [
    {
      q: 'Can I cancel a bid after placing it?',
      a: 'No. All bids are legally binding. Bid carefully.'
    },
    {
      q: 'What happens if the reserve price is not met?',
      a: 'Seller can accept the highest offer or re-list.'
    },
    {
      q: 'Is the reserve price ever revealed?',
      a: 'Never. Only whether it has been met or not.'
    },
    {
      q: 'What if I win but cannot complete payment?',
      a: 'Your deposit is forfeited. Seller receives 50%.'
    },
    {
      q: 'Is my deposit safe?',
      a: 'Yes — held in XeedWallet Escrow at all times.'
    },
    {
      q: 'Are there bidding fees?',
      a: 'No fees to register or bid. Platform commission is 2% on the final sale price, paid by seller.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-[#1C1917] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-5xl mb-4">🔨</p>
          <h1 className="text-4xl font-black mb-4">How KemedarBid™ Works</h1>
          <p className="text-xl text-gray-300">Transparent, fair, and legally secure property auctions on Kemedar.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 sticky top-16 bg-white z-10">
        <div className="max-w-5xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-6 py-4 font-bold text-sm transition-colors ${
              activeTab === 'sellers'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            For Sellers
          </button>
          <button
            onClick={() => setActiveTab('buyers')}
            className={`px-6 py-4 font-bold text-sm transition-colors ${
              activeTab === 'buyers'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            For Buyers
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(activeTab === 'sellers' ? sellerSteps : buyerSteps).map((step) => (
            <div key={step.num} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{step.icon}</div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                      Step {step.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <button
                key={i}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-bold text-gray-900 text-sm">{faq.q}</p>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-gray-400 transition-transform ${
                      expandedFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {expandedFaq === i && (
                  <p className="text-gray-600 text-sm mt-3">{faq.a}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 p-8 text-center">
          <h3 className="text-xl font-black text-gray-900 mb-2">Ready to get started?</h3>
          <p className="text-gray-600 mb-6">Start buying or selling properties with KemedarBid™ today.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/auctions" className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors">
              Browse Auctions
            </a>
            <a href="/create/property" className="px-6 py-3 border-2 border-orange-600 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-colors">
              List for Auction
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
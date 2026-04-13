import { useState, useRef } from "react";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";

const SECTIONS = [
  {
    id: "terms",
    label: "Terms of Use",
    icon: "📋",
    content: [
      { heading: "1. Acceptance of Terms", text: "By accessing or using the Kemedar platform ('Service'), you agree to be bound by these Terms of Use. If you do not agree to all of these terms, you may not use our Service. These terms apply to all visitors, users, and others who access or use the Service." },
      { heading: "2. Use License", text: "Kemedar grants you a limited, non-exclusive, non-transferable license to use the Service for personal, non-commercial purposes. This license does not include any right to resell or commercially use our Service, any collection and use of any product listings, descriptions, or prices, any derivative use of our Service or its contents, or any downloading or copying of account information for the benefit of another merchant." },
      { heading: "3. User Accounts", text: "When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device. You agree to accept responsibility for all activities that occur under your account." },
      { heading: "4. Prohibited Activities", text: "You may not use our Service for any illegal or unauthorized purpose. You must not transmit any worms, viruses, or any code of a destructive nature. You agree not to post false, inaccurate, misleading, deceptive, defamatory, or libelous content about properties, agents, or other users." },
      { heading: "5. Property Listings", text: "All property listings posted on Kemedar must be accurate and lawful. Kemedar reserves the right to remove any listing that violates our policies. Users are responsible for ensuring they have the legal right to list any property." },
    ],
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    icon: "🔒",
    content: [
      { heading: "1. Information We Collect", text: "We collect information you provide directly, such as your name, email address, phone number, and any property data you submit. We also automatically collect certain information when you use our platform, including log data, device information, and cookies." },
      { heading: "2. How We Use Your Information", text: "We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, to respond to your comments and questions, and to send you marketing communications (with your consent)." },
      { heading: "3. Information Sharing", text: "We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our platform, conducting our business, or servicing you, so long as those parties agree to keep this information confidential." },
      { heading: "4. Data Security", text: "We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error free." },
      { heading: "5. Your Rights", text: "You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving promotional communications from us. To exercise any of these rights, please contact our privacy team at privacy@kemedar.com." },
    ],
  },
  {
    id: "cookies",
    label: "Cookie Policy",
    icon: "🍪",
    content: [
      { heading: "1. What Are Cookies", text: "Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site." },
      { heading: "2. How We Use Cookies", text: "We use cookies to understand how you interact with our Service, to keep you logged in, to remember your preferences, and to personalize content. Some cookies are strictly necessary for the platform to function, while others are used for analytics and marketing." },
      { heading: "3. Types of Cookies We Use", text: "Essential Cookies: Required for the platform to function. Analytics Cookies: Help us understand how visitors use our site. Marketing Cookies: Used to deliver relevant advertisements. Preference Cookies: Remember your settings and preferences." },
      { heading: "4. Managing Cookies", text: "Most web browsers allow you to control cookies through browser settings. You can set your browser to refuse cookies or delete certain cookies. However, if you block or delete cookies, some features of our Service may not function properly." },
    ],
  },
  {
    id: "refund",
    label: "Refund Policy",
    icon: "💳",
    content: [
      { heading: "1. Subscription Cancellation", text: "You may cancel your subscription at any time. Upon cancellation, your subscription will remain active until the end of the current billing period. We do not offer prorated refunds for partial months." },
      { heading: "2. Refund Eligibility", text: "Refunds may be issued in cases where: the Service was unavailable for more than 72 consecutive hours due to issues on our end, you were charged incorrectly, or within 7 days of your first subscription for new users who have not used the platform." },
      { heading: "3. How to Request a Refund", text: "To request a refund, contact our billing team at billing@kemedar.com with your account email and a description of your issue. All refund requests are reviewed within 5 business days. Approved refunds are processed within 10 business days to your original payment method." },
      { heading: "4. Non-Refundable Items", text: "Advertising campaign fees once a campaign has launched, one-time verification service fees (VERI), and any promotional credits or free trial extensions are non-refundable." },
    ],
  },
];

export default function Terms() {
  const [active, setActive] = useState("terms");
  const refs = useRef({});

  const scrollTo = (id) => {
    setActive(id);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <div className="bg-[#1a1a2e] py-12 text-center">
        <h1 className="text-3xl font-black text-white mb-2">Legal & Policies</h1>
        <p className="text-gray-400 text-sm">Last updated: March 2026</p>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-12 w-full flex-1">
        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Sections</p>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map(s => (
                  <button key={s.id} onClick={() => scrollTo(s.id)}
                    className={`flex items-center gap-2 text-left px-3 py-2 rounded-xl text-sm font-bold transition-all ${active === s.id ? "bg-orange-50 text-[#FF6B00]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                    <span>{s.icon}</span> {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-10">
            {/* Mobile nav */}
            <div className="flex gap-2 flex-wrap lg:hidden">
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${active === s.id ? "bg-[#FF6B00] text-white border-[#FF6B00]" : "bg-white border-gray-200 text-gray-600"}`}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>

            {SECTIONS.map(s => (
              <div key={s.id} ref={el => refs.current[s.id] = el}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <span className="text-2xl">{s.icon}</span>
                  <h2 className="text-xl font-black text-gray-900">{s.label}</h2>
                </div>
                <div className="flex flex-col gap-6">
                  {s.content.map(item => (
                    <div key={item.heading}>
                      <h3 className="font-black text-gray-800 text-sm mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#FF6B00] rounded-full" />{item.heading}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed pl-3">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-700 font-medium">Have questions about our policies?</p>
              <a href="/contact" className="inline-block mt-2 bg-[#FF6B00] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#e55f00] transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </div>

      <SuperFooter />
    </div>
  );
}
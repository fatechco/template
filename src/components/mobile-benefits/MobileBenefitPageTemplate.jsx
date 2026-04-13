import { useState } from 'react';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import { Share2 } from 'lucide-react';

export default function MobileBenefitPageTemplate({ 
  role, 
  icon, 
  title, 
  heroColor,
  stats,
  intro,
  advantages,
  benefits,
  howItWorks,
  plans,
  paidServices,
  ctaText 
}) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join Kemedar as ${role}`,
          text: `Discover the exclusive benefits of ${role} on Kemedar Proptech Super App`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <MobileTopBar 
        title={`${role} Benefits`} 
        showBack 
        rightIcon={<button onClick={handleShare} className="text-lg">📤</button>}
      />

      {/* Hero Card */}
      <div className={`bg-gradient-to-b ${heroColor} text-white px-4 py-8`}>
        <div className="text-center space-y-4">
          <div className="text-5xl">{icon}</div>
          <h1 className="text-2xl font-black leading-tight">{title}</h1>
          <button className="bg-white text-gray-900 font-bold py-2.5 px-6 rounded-lg w-full hover:bg-gray-100 transition-colors">
            {ctaText || 'Register Now →'}
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats */}
        {stats && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex-shrink-0 px-3 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 whitespace-nowrap">
                {stat}
              </div>
            ))}
          </div>
        )}

        {/* Intro */}
        {intro && (
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed">{intro}</p>
          </div>
        )}

        {/* Key Advantages */}
        {advantages && (
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 font-bold text-sm text-gray-900">
              Key Advantages
            </div>
            <div className="divide-y divide-gray-200">
              {advantages.map((adv, idx) => (
                <div key={idx} className="px-4 py-3">
                  <p className="font-bold text-sm text-gray-900">{adv.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{adv.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits List */}
        {benefits && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Your Benefits</h3>
            <div className="space-y-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900">{benefit.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        {howItWorks && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">How It Works</h3>
            <div className="space-y-3">
              {howItWorks.map((step, idx) => (
                <div key={idx} className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    {idx < howItWorks.length - 1 && (
                      <div className="w-0.5 h-12 bg-orange-200 my-1"></div>
                    )}
                  </div>
                  <div className="pt-1 pb-3">
                    <p className="font-bold text-sm text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plans */}
        {plans && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Subscription Plans</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {plans.map((plan, idx) => (
                <div key={idx} className="flex-shrink-0 w-48 bg-white rounded-xl p-4 border border-gray-200">
                  <p className="font-bold text-gray-900 text-sm">{plan.name}</p>
                  <p className="text-lg font-black text-orange-600 mt-2">{plan.price}</p>
                  <div className="text-xs text-gray-600 mt-3 space-y-1">
                    {plan.features.map((feature, fidx) => (
                      <p key={fidx}>✓ {feature}</p>
                    ))}
                  </div>
                  <button className="w-full bg-orange-600 text-white font-bold py-2 rounded-lg mt-4 text-xs hover:bg-orange-700 transition-colors">
                    {plan.buttonText || 'Subscribe'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paid Services */}
        {paidServices && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Professional Services</h3>
            <div className="space-y-3">
              {paidServices.map((service, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="text-2xl flex-shrink-0">{service.icon}</div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{service.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <p className="font-bold text-sm text-orange-600">{service.price}</p>
                    <button className="text-xs font-bold text-orange-600 hover:underline">
                      {service.buttonText || 'Learn More →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
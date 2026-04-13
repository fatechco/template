import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPWAInstallManager } from '@/lib/pwa-install-manager';

const SLIDES = [
  {
    id: 1,
    background: 'from-[#FF6B00] to-[#FF9500]',
    emoji: '🏠',
    title: 'Find Your Perfect Property',
    description: 'Search millions of listings across 30+ countries',
    illustration: 'bg-gradient-to-b from-orange-100 to-transparent',
  },
  {
    id: 2,
    background: 'from-[#1a1a2e] to-[#16213e]',
    emoji: '📝',
    title: 'List in Minutes',
    description: 'Add your property for free and reach thousands of buyers',
    illustration: 'bg-gradient-to-b from-slate-100 to-transparent',
  },
  {
    id: 3,
    background: 'from-[#0D9488] to-[#0F766E]',
    emoji: '🌍',
    title: 'One App. Three Platforms.',
    description: 'Kemedar, Kemework & Kemetro — everything for your home journey',
    illustration: 'bg-gradient-to-b from-teal-100 to-transparent',
  },
];

export default function OnboardingSlides({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const manager = getPWAInstallManager();

  const slide = SLIDES[currentSlide];
  const isLastSlide = currentSlide === SLIDES.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      manager.completeOnboarding();
      onComplete();
      navigate('/');
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    manager.completeOnboarding();
    onComplete();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
      {/* Slide Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Illustration Area */}
        <div className={`absolute inset-0 bg-gradient-to-b ${slide.background}`}>
          {/* Gradient overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-8xl mb-4 animate-bounce">{slide.emoji}</div>
          </div>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end pb-20">
          <div className="text-center px-6 mb-8">
            <h1 className="text-3xl font-black text-white mb-3 leading-tight">
              {slide.title}
            </h1>
            <p className="text-base text-white/80 leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white px-6 py-6 border-t border-[#E5E7EB]">
        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide ? 'bg-[#FF6B00] w-8' : 'bg-[#E5E7EB]'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={handleNext}
          className="w-full bg-[#FF6B00] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 mb-3 active:bg-[#E55A00] transition-colors"
        >
          {isLastSlide ? 'Get Started' : 'Next'} <ChevronRight size={18} />
        </button>

        <button
          onClick={handleSkip}
          className="w-full text-[#6B7280] font-medium py-2 text-sm active:opacity-70"
        >
          {isLastSlide ? '' : 'Skip'}
        </button>
      </div>
    </div>
  );
}
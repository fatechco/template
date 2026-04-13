import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

export default function FloatingActionButton({ onClick, visible = true }) {
  const [isVisible, setIsVisible] = useState(visible);
  const [scrollDir, setScrollDir] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setScrollDir('down');
      } else {
        setScrollDir('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-[#FF6B00] text-white shadow-lg flex items-center justify-center active:scale-95 transition-all duration-300 ${
        scrollDir === 'down' || !visible ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Plus size={24} strokeWidth={3} />
    </button>
  );
}